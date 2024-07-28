import React from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { UserIcon, fetchWithAuth, postWithAuth } from './utils.js';
import { useAuth } from './AuthContext';
import '../../CSS/common.css';

const useTopBarController = (authToken, profileId) => {
    const navigate = useNavigate();
    const [allData, setAllData] = React.useState({
        userName: 'User',
        terms: [],
        currentTerm: null,
        showDropdown: false,
        activeMenu: 'main',
    });

    React.useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [userData, termsData] = await Promise.all([
                    fetchWithAuth(`http://localhost:3001/api/user/${profileId}`, authToken, navigate),
                    fetchWithAuth('http://localhost:3001/api/terms', authToken, navigate)
                ]);

                const termsOptions = termsData.terms
                    .sort((a, b) => b - a)
                    .map(term => ({
                        value: String(term),
                        label: getTermLabel(String(term)),
                    }));

                setAllData(prev => ({
                    ...prev,
                    userName: `${userData.firstName} ${userData.lastName}`,
                    terms: termsOptions,
                    currentTerm: {
                        value: String(termsData.currentTerm),
                        label: getTermLabel(String(termsData.currentTerm)),
                    },
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (profileId && authToken) {
            fetchAllData();
        }
    }, [profileId, authToken, navigate]);

    const toggleDropdown = () => setAllData(prev => ({
        ...prev,
        showDropdown: !prev.showDropdown,
        activeMenu: 'main'
    }));

    const setActiveMenu = (menu) => setAllData(prev => ({ ...prev, activeMenu: menu }));

    const setNewCurrentTerm = async (term) => {
        try {
            await postWithAuth(
                'http://localhost:3001/api/setCurrentTerm',
                authToken,
                navigate,
                { term: term.value }
            );
            setAllData(prev => ({ ...prev, currentTerm: term }));
            console.log('Term set successfully');
        } catch (error) {
            console.error('Error setting current term:', error);
        }
    };

    return { allData, toggleDropdown, setActiveMenu, setNewCurrentTerm };
};

const getTermLabel = (term) => {
    const year = term.slice(0, 4);
    const termCode = term.slice(4);
    const termMap = {
        '1': 'Winter Term 1',
        '2': 'Winter Term 2',
        '3': 'Summer Term 1',
        '4': 'Summer Term 2',
    };
    return `${year} ${termMap[termCode] || ''}`;
};

const getAccountTypeLabel = (type) => {
    const typeMap = {
        1: 'Department',
        2: 'Department',
        3: 'Instructor',
        4: 'Admin',
    };
    return typeMap[type] || '';
};

const getPlaceholderText = (searchListType) => {
    const placeholderMap = {
        'InsCourseList': 'Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I), Instructor (e.g. John Doe)',
        'DeptCourseList': 'Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I)',
        'DeptMemberList': 'Search by UBC ID (e.g. 78233419), Name (e.g. John Doe), Service Role (e.g. Advisor)',
        'DeptTeachingAssignmentDetail': 'Search by Instructor (e.g. John Doe), Course Code (e.g. COSC 222), Course Name (e.g. Data Structures)',
    };
    return placeholderMap[searchListType] || 'Search ...';
};

const handleLogOut = (navigate) => {
    ['token', 'profileId', 'accountType', 'accountLogInType'].forEach(item => localStorage.removeItem(item));
    alert('Log out successfully\n\nRedirecting to Home Page');
    navigate('/');
};

const handleSwitchAccount = (type, accountLogInType, setAccountLogInType, navigate) => {
    if (type === accountLogInType) return;
    setAccountLogInType(type);
    localStorage.setItem('accountLogInType', JSON.stringify(type));
    alert(`Switching to ${getAccountTypeLabel(type)} account`);
    navigate(type <= 2 ? '/DeptPerformancePage' : type === 3 ? '/InsPerformancePage' : '/AdminMemberList');
};

const AccountSwitcher = ({ allData, accountType, handleSwitchAccount, navigate, toggleDropdown, setActiveMenu, profileId }) => (
    <div className="account-switcher">
        <UserIcon 
            userName={allData.userName}
            profileId={profileId}
            size={40}
            onClick={toggleDropdown}
        />
        {allData.showDropdown && (
            <ul className="dropdown-menu">
                {allData.activeMenu === 'main' ? (
                    <>
                        <li onClick={() => navigate('/UserProfile')}>My profile</li>
                        <li onClick={() => setActiveMenu('account')}>My account</li>
                        {accountType.length > 1 && (
                            <li onClick={() => setActiveMenu('switch')}>Switch account</li>
                        )}
                    </>
                ) : allData.activeMenu === 'switch' ? (
                    <>
                        <li onClick={() => setActiveMenu('main')} style={{ fontWeight: 'bold' }}>← Back</li>
                        {accountType.map((type) => (
                            <li key={type} onClick={() => handleSwitchAccount(type)}>{getAccountTypeLabel(type)}</li>
                        ))}
                    </>
                ) : (
                    <>
                        <li onClick={() => setActiveMenu('main')} style={{ fontWeight: 'bold' }}>← Back</li>
                        <li onClick={() => navigate('/ChangePassword')}>Change password</li>
                    </>
                )}
            </ul>
        )}
    </div>
);

const TopBar = ({ searchListType, onSearch }) => {
    const navigate = useNavigate();
    const { authToken, accountType, accountLogInType, setAccountLogInType, profileId } = useAuth();
    const { allData, toggleDropdown, setActiveMenu, setNewCurrentTerm } = useTopBarController(authToken, profileId);

    const handleSwitchAccountWrapper = (type) => handleSwitchAccount(type, accountLogInType, setAccountLogInType, navigate);
    const handleLogOutWrapper = () => handleLogOut(navigate);

    return (
        <div className={searchListType && onSearch ? "topbar-search" : "topbar"}>
            {searchListType && onSearch ? (
                <input
                    type="text"
                    placeholder={getPlaceholderText(searchListType)}
                    onChange={(e) => onSearch(e.target.value)}
                />
            ) : (accountLogInType <= 2) ? (
                <Select className='term-select'
                    options={allData.terms}
                    value={allData.currentTerm}
                    onChange={setNewCurrentTerm}
                />
            ) : null}
            <AccountSwitcher 
                allData={allData}
                accountType={accountType}
                handleSwitchAccount={handleSwitchAccountWrapper}
                navigate={navigate}
                toggleDropdown={toggleDropdown}
                setActiveMenu={setActiveMenu}
                profileId={profileId}
            />
            <div className="account-type">{getAccountTypeLabel(accountLogInType)}</div>
            <div className="logout" onClick={handleLogOutWrapper}>Logout</div>
        </div>
    );
};

export default TopBar;