import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import '../../CSS/common.css';

function TopBar({ searchListType, onSearch }) {
	const navigate = useNavigate();
	const [showDropdown, setShowDropdown] = useState(false);
	const { accountType, accountLogInType, setAccountLogInType, profileId } = useAuth();
	const [imageError, setImageError] = useState(false);
	const [initials, setInitials] = useState('');
	const [bgColor, setBgColor] = useState('');
	const [userName, setUserName] = useState('');

	useEffect(() => {
		fetchUserName();
	}, [profileId]);

	useEffect(() => {
		if (userName) {
			generateInitialsAndColor();
		}
	}, [userName]);

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
				navigate('/AdminMemberList');
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
				{renderProfileImage()}
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

	return (
		<div className={searchListType && onSearch ? "topbar-search" : "topbar"}>
			{searchListType && onSearch && (
				<input
					type="text"
					placeholder={placeHolderText}
					onChange={(e) => onSearch(e.target.value)}
				/>
			)}
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