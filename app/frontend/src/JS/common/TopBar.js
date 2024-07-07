import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from './AuthContext';


function TopBar({ searchListType, onSearch }) {
	const navigate = useNavigate();
	const [showDropdown, setShowDropdown] = useState(false);
	const { accountType, setAccountType } = useAuth();
	const accountTypes = Array.isArray(accountType) ? accountType : [accountType];
	//const [testAccountTypes, setTestAccountTypes] = useState([]);

	console.log("Account type: ", accountType);
	
	const handleLogOut = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('profileId');
		localStorage.removeItem('accountType');
		alert('Log out successfully.\n\nRedirecting to Home Page.');
		navigate('/');
	};

	// useEffect(() => {
	// 	setTestAccountTypes([1, 3]);
	// }, []);


	const handleSwitchAccount = (type) => {
		setAccountType(type);
		localStorage.setItem('accountType', type);
		alert(`Switched to ${type === 1 || type === 2 ? 'Department' : type === 3 ? 'Instructor' : 'Admin'} account.`);
		setShowDropdown(false);
		switch (type) {
				case 1:
				case 2:
						navigate('/DeptPerformancePage');
						break;
				case 3:
						navigate('/InsPerformancePage');
						break;
				case 4:
						navigate('/AdminPage');
						break;
				default:
						break;
		}
};

	const renderAccountSwitcher = () => {
		return (
			<div className="account-switcher">
				<img
					src=""
					alt="Switch Account"
					onClick={toggleDropdown}
					style={{ cursor: 'pointer' }}
				/>
				{showDropdown && accountTypes.length > 1 && (
					<ul className="dropdown-menu">
						{accountTypes.map((type) => (
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
				<div className="logout" onClick={handleLogOut}>
					Logout
				</div>
			</div>
		);
	} else {
		return (
			<div className="topbar">
				{renderAccountSwitcher()}
				<div className="logout" onClick={handleLogOut}>
					Logout
				</div>
			</div>
		);
	}
}
export default TopBar;
