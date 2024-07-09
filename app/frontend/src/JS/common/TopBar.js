import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import '../../CSS/common.css';


function TopBar({ searchListType, onSearch }) {
	const navigate = useNavigate();
	const [showDropdown, setShowDropdown] = useState(false);
	const { accountType, accountLogInType, setAccountLogInType } = useAuth();

	const handleLogOut = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('profileId');
		localStorage.removeItem('accountType');
		localStorage.removeItem('accountLogInType');
		alert('Log out successfully\n\nRedirecting to Home Page');
		navigate('/');
	};

	const handleSwitchAccount = (type) => {
		// if same accountLogInType, dropdown switch button will not be clicked
		if (type === accountLogInType) return;

    setAccountLogInType(type);
    localStorage.setItem('accountLogInType', JSON.stringify(type)); 
		// set new accountLogInType with input, stringify in order to prevent parsing error for using json format
    alert(`Switching to ${type === 1 || type === 2 ? 'Department' : type === 3 ? 'Instructor' : 'Admin'} account`);
    setShowDropdown(false);
    switch (type) {
        case 1:
            navigate('/DeptPerformancePage');
            break;
        case 2:
            navigate('/DeptPerformancePage');
            break;
        case 3:
            navigate('/InsPerformancePage');
            break;
        case 4:
            navigate('/AdminPage'); // needs to be fixed with new admin file name
            break;
        default:
            break;
    }
};

	const getAccountTypeLabel = (type) => {
		switch (type) {
			case 1:
				return 'Department';
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

	const renderAccountSwitcher = () => {
		return (
			<div className="account-switcher">
				<img
					src=""
					alt="Switch Account"
					onClick={toggleDropdown}
					style={{ cursor: 'pointer' }}
				/>
				{showDropdown && accountType.length > 1 && (
					<ul className="dropdown-menu">
						{accountType.map((type) => (
							<li key={type} onClick={() => handleSwitchAccount(type)}>
								{type === 1 || type === 2 ? 'Department' : type === 3 ? 'Instructor' : 'Admin'}
							</li>
						))}
					</ul>
				)}
			</div>
		);
	};

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	let placeHolderText = '';
	switch (searchListType) {
		case 'InsCourseList':
			placeHolderText =
				'Search by Subject (e.g.  COSC 111), Title (e.g. Computer Programming I), Instructor (e.g. John Doe)';
			break;
		case 'DeptCourseList':
			placeHolderText = 'Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I)';
			break;
		case 'DeptMemberList':
			placeHolderText =
				'Search by UBC ID (e.g. 78233419), Name (e.g. John Doe), Service Role (e.g. Advisor)';
			break;
		default:
			placeHolderText = 'Search ...';
	}

	if (searchListType && onSearch) {
		return (
			<div className="topbar-search">
				<input
					type="text"
					placeholder={placeHolderText}
					onChange={(e) => onSearch(e.target.value)}
				/>
				{renderAccountSwitcher()}
				<div className="account-type">
					{getAccountTypeLabel(accountLogInType)}
				</div>
				<div className="logout" onClick={handleLogOut}>
					Logout
				</div>
			</div>
		);
	} else {
		return (
			<div className="topbar">
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
}
export default TopBar;
