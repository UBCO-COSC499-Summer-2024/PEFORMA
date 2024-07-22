import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import '../../CSS/common.css';
import Select from 'react-select';
import axios from 'axios';

function TopBar({ searchListType, onSearch }) {
	const navigate = useNavigate();
	const [showDropdown, setShowDropdown] = useState(false);
	const [activeMenu, setActiveMenu] = useState('main'); // 'main' or 'switch'
	const { authToken, accountType, accountLogInType, setAccountLogInType, profileId } = useAuth();
	const [imageError, setImageError] = useState(false);
	const [initials, setInitials] = useState('');
	const [bgColor, setBgColor] = useState('');
	const [userName, setUserName] = useState('');
	const [terms, setTerms] = useState([]);
	const [currentTerm, setCurrentTerm] = useState(null);


	useEffect(() => {
		fetchUserName();
	}, [profileId]);

	useEffect(() => {
		if (userName) {
			generateInitialsAndColor();
		}
	}, [userName]);

	useEffect(() => {
    const fetchTerms = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/terms`, {
                headers: { Authorization: `Bearer ${authToken.token}` },
            });
            const data = response.data;
            const sortedTerms = data.terms.sort((a, b) => b - a);
            const termsOptions = sortedTerms.map(term => ({
							value: String(term), 
							label: getTermLabel(String(term)), 
					}));
            setTerms(termsOptions);
            setCurrentTerm({
							value: String(data.currentTerm), 
							label: getTermLabel(String(data.currentTerm)), 
					});
        } catch (error) {
            console.error('Error fetching terms:', error);
        }
    };

    fetchTerms();
}, [authToken]);

	const fetchUserName = async () => {
		try {
			const response = await fetch(`http://localhost:3001/api/user/${profileId}`);
			if (!response.ok) {
				throw new Error('Failed to fetch user data');
			}
			const userData = await response.json();
			setUserName(`${userData.firstName} ${userData.lastName}`);
		} catch (error) {
			console.error('Error fetching user name:', error);
			setUserName('User');  // Fallback name if fetch fails
		}
	};

	const generateInitialsAndColor = () => {
		const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
		setInitials(initials);

		const hue = Math.floor(Math.random() * 360);
		const pastelColor = `hsl(${hue}, 70%, 80%)`;
		setBgColor(pastelColor);
	};

	const handleImageError = () => {
		setImageError(true);
	};

	const renderProfileImage = () => {
		if (imageError) {
			return (
				<div
					className="profile-initials"
					style={{
						backgroundColor: bgColor,
						width: '40px',
						height: '40px',
						borderRadius: '50%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						fontWeight: 'bold',
						color: '#000',
						cursor: 'pointer'
					}}
					onClick={toggleDropdown}
				>
					{initials}
				</div>
			);
		} else {
			return (
				<img
					src={`http://localhost:3001/api/image/${profileId}`}
					alt="Profile"
					onClick={toggleDropdown}
					style={{ cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%' }}
					onError={handleImageError}
				/>
			);
		}
	};

	const handleLogOut = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('profileId');
		localStorage.removeItem('accountType');
		localStorage.removeItem('accountLogInType');
		alert('Log out successfully\n\nRedirecting to Home Page');
		navigate('/');
	};

	const handleSwitchAccount = (type) => {
		if (type === accountLogInType) return;

		setAccountLogInType(type);
		localStorage.setItem('accountLogInType', JSON.stringify(type));
		alert(`Switching to ${type === 1 || type === 2 ? 'Department' : type === 3 ? 'Instructor' : 'Admin'} account`);
		setShowDropdown(false);
		setActiveMenu('main');
		switch (type) {
			case 1:
			case 2:
				navigate('/DeptPerformancePage');
				break;
			case 3:
				navigate('/InsPerformancePage');
				break;
			case 4:
				navigate('/AdminMemberList');
				break;
			default:
				break;
		}
	};

	const getAccountTypeLabel = (type) => {
		switch (type) {
			case 1:
			case 2:
				return 'Department';
			case 3:
				return 'Instructor';
			case 4:
				return 'Admin';
			default:
				return '';
		}
	}
	
	const getTermLabel = (term) => {
    const year = term.slice(0, 4);
    const termCode = term.slice(4);
    switch (termCode) {
        case '1':
            return `${year} Winter Term 1`;
        case '2':
            return `${year} Winter Term 2`;
        case '3':
            return `${year} Summer Term 1`;
        case '4':
            return `${year} Summer Term 2`;
        default:
            return term;
    }
	}

	const renderAccountSwitcher = () => {
        return (
            <div className="account-switcher">
                {renderProfileImage()}
                {showDropdown && (
                    <ul className="dropdown-menu">
                        {activeMenu === 'main' ? (
                            <>
                                <li onClick={() => navigate('/UserProfile')}>My profile</li>
                                <li onClick={() => setActiveMenu('account')}>My account</li>
                                {accountType.length > 1 && (
                                    <li onClick={() => setActiveMenu('switch')}>Switch account</li>
                                )}
                            </>
                        ) : activeMenu === 'switch' ? (
                            <>
                                <li onClick={() => setActiveMenu('main')} style={{ fontWeight: 'bold' }}>
                                    ← Back
                                </li>
                                {accountType.map((type) => (
                                    <li key={type} onClick={() => handleSwitchAccount(type)}>
                                        {getAccountTypeLabel(type)}
                                    </li>
                                ))}
                            </>
                        ) : activeMenu === 'account' ? (
                            <>
                                <li onClick={() => setActiveMenu('main')} style={{ fontWeight: 'bold' }}>
                                    ← Back
                                </li>
                                <li onClick={() => navigate('/ChangePassword')}>Change password</li>
                            </>
                        ) : null}
                    </ul>
                )}
            </div>
        );
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        setActiveMenu('main');
    };

	let placeHolderText = '';
	switch (searchListType) {
		case 'InsCourseList':
			placeHolderText = 'Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I), Instructor (e.g. John Doe)';
			break;
		case 'DeptCourseList':
			placeHolderText = 'Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I)';
			break;
		case 'DeptMemberList':
			placeHolderText = 'Search by UBC ID (e.g. 78233419), Name (e.g. John Doe), Service Role (e.g. Advisor)';
			break;
		case 'DeptTeachingAssignmentDetail':
			placeHolderText = 'Search by Instructor (e.g. John Doe), Course Code (e.g. COSC 222), Course Name (e.g. Data Structures)';
			break;
		default:
			placeHolderText = 'Search ...';
	}

	const setNewCurTerm = async (term) => {
    console.log(term.value)
    try {
        const response = await axios.post(
            'http://localhost:3001/api/setCurrentTerm',
            { term: term.value },
            { headers: { Authorization: `Bearer ${authToken.token}` }}
        );
        if (response.status === 200) {
            console.log('Term set successfully');
        } else {
            console.error('Error setting current term:', response.statusText);
        }
    } catch (error) {
        console.error('Error setting current term:', error);
    }
};

	return (
    <div className={searchListType && onSearch ? "topbar-search" : "topbar"}>
			{searchListType && onSearch ? (
				<input
					type="text"
					placeholder={placeHolderText}
					onChange={(e) => onSearch(e.target.value)}
				/>
			) : (accountLogInType === 1 || accountLogInType === 2) ? (
				<Select className='term-select'
					options={terms}
					value={currentTerm}
					onChange={(selectedOption) => {
						setCurrentTerm(selectedOption);
						setNewCurTerm(selectedOption); 
					}}
				/>
			) : null}
			{renderAccountSwitcher()}
			<div className="account-type">
				{getAccountTypeLabel(accountLogInType)}
			</div>
			<div className="logout" onClick={handleLogOut}>
				Logout
			</div>
    </div>
	);
}

export default TopBar;