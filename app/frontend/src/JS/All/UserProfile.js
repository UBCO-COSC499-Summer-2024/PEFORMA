import React, { useState, useEffect, useRef } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../../CSS/All/UserProfile.css';

const ProfilePage = () => {
    const { accountType, accountLogInType, profileId, authToken } = useAuth();
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

    const isInstructor = accountType.includes(3);
    const MAX_FILE_SIZE = 600 * 1024; // 600 KB

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

    const validateName = (name) => {
        if (!name.trim().includes(' ')) {
            alert("Please enter both first and last name separated by a space.");
            return false;
        }
        return true;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(phoneNumber)) {
            alert("Please enter a valid phone number in the format xxx-xxx-xxxx.");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
		if (!validateName(editedData.name) || 
			!validateEmail(editedData.email) || 
			!validatePhoneNumber(editedData.phone_number)) {
			return;
		}
	
		try {
			const formData = new FormData();
			Object.keys(editedData).forEach(key => {
				formData.append(key, editedData[key]);
			});
			if (tempImage) {
				formData.append('image', tempImage);
			}
			await axios.put(
				`http://localhost:3001/api/profile/${profileId}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${authToken.token}`,
						'Content-Type': 'multipart/form-data'
					},
				}
			);
			window.location.reload(); // Full page refresh
		} catch (error) {
			console.error('Error updating profile:', error);
			alert("An error occurred while updating the profile. Please try again.");
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

            if (file.size > MAX_FILE_SIZE) {
                alert(`Image file is too large. Please choose an image smaller than 600 KB.`);
                return;
            }

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
        if (typeof text === 'string' && text.trim() !== '') {
            return text.split('\n').map((item, index) => (
                <p key={index} className="text-item">{item}</p>
            ));
        } else if (Array.isArray(text) && text.length > 0) {
            return text.map((item, index) => (
                <p key={index} className="text-item">{item}</p>
            ));
        } else {
            return <p className="text-item">No data available</p>;
        }
    };

    const renderFieldContent = (content) => {
        if (content === null || content === undefined || content === '' || content === 0) {
            return <p>No data available</p>;
        }
        return <p>{content}</p>;
    };

	// Function to determine sideBarType based on accountLogInType
    const getSideBarType = () => {
        if (accountLogInType === 1 || accountLogInType === 2) {
            return "Department";
        } else if (accountLogInType === 3) {
            return "Instructor";
        } else if (accountLogInType === 4) {
            return "Admin";
        }
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType={getSideBarType()} />
            <div className="container">
                <CreateTopBar />
                <div className="user-profilepage">
                    <div className="user-profilecard">
                        <div className="card-header">
                            <h2>My Profile</h2>
                            {isInstructor && (
                                <div className="performance-score">
                                    <div>Performance Score</div>
                                    <div>{profileData.performance_score || 'No data available'}</div>
                                </div>
                            )}
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
                                                placeholder="First Last"
                                            />
                                        ) : (
                                            <h3>{profileData.name || 'No data available'}</h3>
                                        )}
                                        {isEditing ? (
                                            <input
                                                name="email"
                                                value={editedData.email}
                                                onChange={handleInputChange}
                                                className="edit-input email-input"
                                                placeholder="email@example.com"
                                            />
                                        ) : (
                                            <p className="email">{profileData.email || 'No data available'}</p>
                                        )}
                                        {profileData.UBCId !== 0 && profileData.UBCId !== null && (
                                            <p className="ubc-id">UBC ID: {profileData.UBCId}</p>
                                        )}
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
                                    <button className="user-profile-edit-button" onClick={handleEdit}>
                                        Edit
                                    </button>
                                )}
                            </div>

                            <div className={isInstructor ? "user-profiledetails-grid" : ""}>
                                <div className="personal-info">
                                    <h4>Personal Information</h4>
                                    <hr />
                                    <div className={isInstructor ? "info-grid" : "info-row"}>
                                        <div>
                                            <h4>Office Location</h4>
                                            {isEditing ? (
                                                <input
                                                    name="office_location"
                                                    value={editedData.office_location}
                                                    onChange={handleInputChange}
                                                    className="edit-input"
                                                />
                                            ) : renderFieldContent(profileData.office_location)}
                                        </div>
                                        <div>
                                            <h4>Phone Number</h4>
                                            {isEditing ? (
                                                <input
                                                    name="phone_number"
                                                    value={editedData.phone_number}
                                                    onChange={handleInputChange}
                                                    className="edit-input"
                                                    placeholder="xxx-xxx-xxxx"
                                                />
                                            ) : renderFieldContent(profileData.phone_number)}
                                        </div>
                                        {(profileData.division !== 0 && profileData.division !== null) && (
                                            <div>
                                                <h4>Division</h4>
                                                {renderFieldContent(profileData.division)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isInstructor && (
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
                                                    <p>
                                                        {profileData.working_hours !== 0 || profileData.benchmark !== 0
                                                            ? `${profileData.working_hours} / ${profileData.benchmark} Hours`
                                                            : 'No data available'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;