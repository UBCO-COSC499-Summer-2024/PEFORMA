import React from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { UserIcon, fetchWithAuth, postWithAuth, getTermString } from './utils.js';
import { useAuth } from './AuthContext';
import '../../CSS/common.css';

// Custom hook to manage TopBar state and side effects
function useTopBarController(authToken, profileId, onTermChange) {
    const navigate = useNavigate();
    const [allData, setAllData] = React.useState({
        userName: 'User',
        terms: [],
        currentTerm: null,
        showDropdown: false,
        activeMenu: 'main',
    });

    React.useEffect(function() {
        // Fetches user data and available terms from the server
        async function fetchAllData() {
            try {
                // Parallel API calls for efficiency
                const [userData, termsData] = await Promise.all([
                    fetchWithAuth(`http://localhost:3001/api/user/${profileId}`, authToken, navigate),
                    fetchWithAuth('http://localhost:3001/api/terms', authToken, navigate)
                ]);

                // Process and sort terms for the dropdown
                const termsOptions = termsData.terms
                    .sort(function(a, b) { return b - a; }) // Sort in descending order
                    .map(function(term) {
                        return {
                            value: String(term),
                            label: getTermString(String(term)),
                        };
                    });

                const currentTerm = {
                    value: String(termsData.currentTerm),
                    label: getTermString(String(termsData.currentTerm)),
                };

                // Update state with fetched data
                setAllData(function(prev) {
                    return {
                        ...prev,
                        userName: `${userData.firstName} ${userData.lastName}`,
                        terms: termsOptions,
                        currentTerm: currentTerm,
                    };
                });

                // Notify parent component of the current term only if onTermChange is provided
                if (typeof onTermChange === 'function') {
                    onTermChange(currentTerm.value);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        // Only fetch data if we have necessary authentication info
        if (profileId && authToken) {
            fetchAllData();
        }
    }, [profileId, authToken, navigate, onTermChange]);

    // Toggles the visibility of the user dropdown menu
    function toggleDropdown() {
        setAllData(function(prev) {
            return {
                ...prev,
                showDropdown: !prev.showDropdown,
                activeMenu: 'main'
            };
        });
    }

    // Changes the active menu in the dropdown
    function setActiveMenu(menu) {
        setAllData(function(prev) {
            return { ...prev, activeMenu: menu };
        });
    }

    // Updates the current term and notifies the server
    async function setNewCurrentTerm(term) {
        try {
            await postWithAuth(
                'http://localhost:3001/api/setCurrentTerm',
                authToken,
                navigate,
                { term: term.value }
            );
            setAllData(function(prev) {
                return { ...prev, currentTerm: term };
            });
			if (typeof onTermChange === 'function') {
                onTermChange(term.value);
            }
            console.log('Term set successfully');
        } catch (error) {
            console.error('Error setting current term:', error);
        }
    }

    return { allData, toggleDropdown, setActiveMenu, setNewCurrentTerm };
}

// Converts account type code to a readable label
function getAccountTypeLabel(type) {
    switch (type) {
        case 1:
            return 'Department Head'
        case 2:
            return 'Department Staff';
        case 3:
            return 'Instructor';
        case 4:
            return 'Admin';
        default:
            return '';
    }
}

// Returns appropriate placeholder text for search input based on the list type
function getPlaceholderText(searchListType) {
    const placeholderMap = {
        'InsCourseList': 'Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I), Instructor (e.g. John Doe)',
        'DeptCourseList': 'Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I)',
        'DeptMemberList': 'Search by UBC ID (e.g. 78233419), Name (e.g. John Doe), Service Role (e.g. Advisor)',
        'DeptTeachingAssignmentDetail': 'Search by Instructor (e.g. John Doe), Course Code (e.g. COSC 222), Course Name (e.g. Data Structures)',
    };
    return placeholderMap[searchListType] || 'Search ...';
}

// Handles user logout
function handleLogOut(navigate) {
    // Clear all authentication-related items from localStorage
    ['token', 'profileId', 'accountType', 'accountLogInType'].forEach(function(item) {
        localStorage.removeItem(item);
    });
    alert('Log out successfully\n\nRedirecting to Home Page');
    navigate('/');
}

// Handles switching between different account types
function handleSwitchAccount(type, accountLogInType, setAccountLogInType, navigate) {
    if (type === accountLogInType) return;
    setAccountLogInType(type);
    localStorage.setItem('accountLogInType', JSON.stringify(type));
    alert(`Switching to ${getAccountTypeLabel(type)} account`);
    // Navigate to appropriate page based on account type
    navigate(type <= 2 ? '/DeptPerformancePage' : type === 3 ? '/InsPerformancePage' : '/AdminMemberList');
}

// Component for the account switcher dropdown
function AccountSwitcher({ allData, accountType, handleSwitchAccount, navigate, toggleDropdown, setActiveMenu, profileId }) {
    return (
        <div className="account-switcher">
            <UserIcon 
                userName={allData.userName}
                profileId={profileId}
                size={40}
                onClick={toggleDropdown}
            />
            {allData.showDropdown && (
                <ul className="dropdown-menu">
                    {/* Conditional rendering based on active menu */}
                    {allData.activeMenu === 'main' ? (
                        <>
                            <li onClick={function() { navigate('/UserProfile'); }}>My profile</li>
                            <li onClick={function() { setActiveMenu('account'); }}>My account</li>
                            {accountType.length > 1 && (
                                <li onClick={function() { setActiveMenu('switch'); }}>Switch account</li>
                            )}
                        </>
                    ) : allData.activeMenu === 'switch' ? (
                        <>
                            <li onClick={function() { setActiveMenu('main'); }} style={{ fontWeight: 'bold' }}>← Back</li>
                            {accountType.map(function(type) {
                                return (
                                    <li key={type} onClick={function() { handleSwitchAccount(type); }}>{getAccountTypeLabel(type)}</li>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            <li onClick={function() { setActiveMenu('main'); }} style={{ fontWeight: 'bold' }}>← Back</li>
                            <li onClick={function() { navigate('/ChangePassword'); }}>Change password</li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
}

// Main TopBar component
function TopBar({ searchListType, onSearch, onTermChange }) {
    const navigate = useNavigate();
    const { authToken, accountType, accountLogInType, setAccountLogInType, profileId } = useAuth();
    const { allData, toggleDropdown, setActiveMenu, setNewCurrentTerm } = useTopBarController(authToken, profileId, onTermChange);

    // Wrapper functions to provide necessary context to handlers
    function handleSwitchAccountWrapper(type) {
        handleSwitchAccount(type, accountLogInType, setAccountLogInType, navigate);
    }
    
    function handleLogOutWrapper() {
        handleLogOut(navigate);
    }

    return (
        <div className={searchListType && onSearch ? "topbar-search" : "topbar"}>
            {/* Conditional rendering of search input or term selector */}
            {searchListType && onSearch ? (
                <input
                    type="text"
                    placeholder={getPlaceholderText(searchListType)}
                    onChange={function(e) { onSearch(e.target.value); }}
                />
            ) : (accountLogInType == 1) ? (
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
}

export default TopBar;