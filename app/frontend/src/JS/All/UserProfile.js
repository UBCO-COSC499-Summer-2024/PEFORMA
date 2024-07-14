// ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/All/UserProfile.css';

const ProfilePage = () => {
	const { profileId, authToken } = useAuth();
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const [profileData, setProfileData] = useState({
		UBCId: 0,
		current_courses: [],
		current_service_roles: [],
		division: 0,
		email: "",
		name: "",
		office_location: "",
		performance_score: 0,
		phone_number: "",
		profileId: 1,
		working_hours: 0,
		benchmark: 0,
		image_type: "",
		image_data: ""
	});
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const [tempImage, setTempImage] = useState(null);

	useEffect(() => {
		fetchUserProfileData();
	}, [profileId, authToken]);

	const fetchUserProfileData = async () => {
		try {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			const res = await axios.get(`http://localhost:3001/api/profile/${profileId}`, {
				headers: { Authorization: `Bearer ${authToken.token}` },
			});
			const data = res.data;
			setProfileData({
				...data,
				image_data: data.image_data || '',
				image_type: data.image_type || 'jpeg'
			});
			setEditedData({
				...data,
				image_data: data.image_data || '',
				image_type: data.image_type || 'jpeg'
			});
		} catch (error) {
			if (error.response && error.response.status === 401) {
				localStorage.removeItem('authToken');
				navigate('/Login');
			} else {
				console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
			}
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
		setEditedData({ ...profileData });
		setTempImage(null);
	};

	const handleSave = async () => {
		try {
			const formData = new FormData();
			Object.keys(editedData).forEach(key => {
				formData.append(key, editedData[key]);
			});
			if (tempImage) {
				formData.append('image', tempImage);
			}
			const res = await axios.put(
				`http://localhost:3001/api/profile/${profileId}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${authToken.token}`,
						'Content-Type': 'multipart/form-data'
					},
				}
			);
			setProfileData({ ...res.data });
			setIsEditing(false);
			setTempImage(null);
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedData({ ...profileData });
		setTempImage(null);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedData({ ...editedData, [name]: value });
	};

	const handleImageClick = () => {
		if (isEditing) {
			fileInputRef.current.click();
		}
	};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setTempImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result;
				const base64Data = result.split(',')[1];
				setEditedData(prev => ({
					...prev,
					image_data: base64Data,
					image_type: file.type.split('/')[1]
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const renderNewlineSeparatedText = (text) => {
		if (typeof text === 'string') {
			return text.split('\n').map((item, index) => (
				<p key={index} className="text-item">{item}</p>
			));
		} else if (Array.isArray(text)) {
			return text.map((item, index) => (
				<p key={index} className="text-item">{item}</p>
			));
		} else {
			console.error('Expected string or array, received:', typeof text, text);
			return <p className="text-item">No data available</p>;
		}
	};

	if (!profileData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="dashboard">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />
				<div className="user-profilepage">
					<div className="user-profilecard">
						<div className="card-header">
							<h2>My Profile</h2>
							<div className="performance-score">
								<div>Performance Score</div>
								<div>{profileData.performance_score}</div>
							</div>
						</div>
						<div className="card-content">
							<div className="user-profileheader">
								<div className="user-profileheader-section">
									<div className="user-profileimage-container" onClick={handleImageClick}>
										{editedData.image_data ? (
											<img
												src={`data:image/${editedData.image_type};base64,${editedData.image_data}`}
												alt="Profile"
												className="user-profileimage"
											/>
										) : (
											<div className="no-image">
												<span>No Image</span>
											</div>
										)}
										{isEditing && (
											<div className="image-overlay">
												<span>Click to upload</span>
											</div>
										)}
										<input
											type="file"
											ref={fileInputRef}
											onChange={handleImageChange}
											className="hidden-input"
											accept="image/*"
										/>
									</div>
									<div className="user-profileinfo">
										{isEditing ? (
											<input
												name="name"
												value={editedData.name}
												onChange={handleInputChange}
												className="edit-input name-input"
											/>
										) : (
											<h3>{profileData.name}</h3>
										)}
										{isEditing ? (
											<input
												name="email"
												value={editedData.email}
												onChange={handleInputChange}
												className="edit-input email-input"
											/>
										) : (
											<p className="email">{profileData.email}</p>
										)}
										<p className="ubc-id">UBC ID: {profileData.UBCId}</p>
									</div>
								</div>
								{isEditing ? (
									<div className="edit-buttons">
										<button className="user-profile-save-button" onClick={handleSave}>
											Save
										</button>
										<button className="cancel-button" onClick={handleCancel}>
											Cancel
										</button>
									</div>
								) : (
									<button className="edit-button" onClick={handleEdit}>
										Edit
									</button>
								)}
							</div>

							<div className="user-profiledetails">
								<div className="personal-info">
									<h4>Personal Information</h4>
									<hr />
									<div className="info-grid">
										<div>
											<h4>Office Location</h4>
											{isEditing ? (
												<input
													name="office_location"
													value={editedData.office_location}
													onChange={handleInputChange}
													className="edit-input"
												/>
											) : (
												<p>{profileData.office_location}</p>
											)}
										</div>
										<div>
											<h4>Phone Number</h4>
											{isEditing ? (
												<input
													name="phone_number"
													value={editedData.phone_number}
													onChange={handleInputChange}
													className="edit-input"
												/>
											) : (
												<p>{profileData.phone_number}</p>
											)}
										</div>
										<div>
											<h4>Division</h4>
											<p>{profileData.division}</p>
										</div>
									</div>
								</div>
								<div className="teaching-service">
									<div className="teaching">
										<h4>Teaching</h4>
										<hr />
										<div className="info-grid">
											<div>
												<h4>Current Course(s)</h4>
												<div>{renderNewlineSeparatedText(profileData.current_courses)}</div>
											</div>
										</div>
									</div>
									<div className="service">
										<h4>Service</h4>
										<hr />
										<div className="info-grid">
											<div>
												<h4>Current Service Role(s)</h4>
												<div>{renderNewlineSeparatedText(profileData.current_service_roles)}</div>
											</div>
											<div>
												<h4>Hours Completed</h4>
												<p>{profileData.working_hours} / {profileData.benchmark} Hours</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;