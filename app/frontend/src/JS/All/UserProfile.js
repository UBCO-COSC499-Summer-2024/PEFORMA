import React, { useRef } from 'react';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/All/UserProfile.css';

// Custom hook to fetch and manage user profile data
function useUserProfileData() {
    const { accountType, accountLogInType, profileId, authToken } = useAuth();
    const navigate = useNavigate();
    const [allData, setAllData] = React.useState({
        profileData: {
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
        },
        isEditing: false,
        editedData: {},
        tempImage: null
    });

    React.useEffect(() => {
        fetchUserProfileData();
    }, [profileId, authToken]);

    function fetchUserProfileData() {
        if (!authToken) {
            navigate('/Login');
            return;
        }

        axios.get(`http://localhost:3001/api/profile/${profileId}`, {
            headers: { Authorization: `Bearer ${authToken.token}` },
        })
            .then(function (res) {
                const data = res.data;
                const updatedData = {
                    ...data,
                    image_data: data.image_data || '',
                    image_type: data.image_type || 'jpeg'
                };
                setAllData(prevData => ({
                    ...prevData,
                    profileData: updatedData,
                    editedData: updatedData
                }));
            })
            .catch(handleFetchError);
    }

    function handleFetchError(error) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/Login');
        } else {
            console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
        }
    }

    function handleEdit() {
        setAllData(prevData => ({
            ...prevData,
            isEditing: true,
            editedData: { ...prevData.profileData },
            tempImage: null
        }));
    }

    function handleCancel() {
        setAllData(prevData => ({
            ...prevData,
            isEditing: false,
            editedData: { ...prevData.profileData },
            tempImage: null
        }));
    }

    function handleSave() {
        if (!validateUserInput(allData.editedData)) return;

        const formData = new FormData();
        Object.keys(allData.editedData).forEach(function (key) {
            formData.append(key, allData.editedData[key]);
        });
        if (allData.tempImage) {
            formData.append('image', allData.tempImage);
        }

        axios.put(
            `http://localhost:3001/api/profile/${profileId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${authToken.token}`,
                    'Content-Type': 'multipart/form-data'
                },
            }
        )
            .then(function () {
                window.location.reload(); // Full page refresh
            })
            .catch(function (error) {
                console.error('Error updating profile:', error);
                alert("An error occurred while updating the profile. Please try again.");
            });
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setAllData(prevData => ({
            ...prevData,
            editedData: { ...prevData.editedData, [name]: value }
        }));
    }

    function handleImageChange(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const MAX_FILE_SIZE = 600 * 1024; // 600 KB

            if (file.size > MAX_FILE_SIZE) {
                alert(`Image file is too large. Please choose an image smaller than 600 KB.`);
                return;
            }

            setAllData(prevData => ({ ...prevData, tempImage: file }));

            const reader = new FileReader();
            reader.onloadend = function () {
                const result = reader.result;
                const base64Data = result.split(',')[1];
                setAllData(prevData => ({
                    ...prevData,
                    editedData: {
                        ...prevData.editedData,
                        image_data: base64Data,
                        image_type: file.type.split('/')[1]
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    return {
        ...allData,
        handleEdit,
        handleCancel,
        handleSave,
        handleInputChange,
        handleImageChange,
        isInstructor: accountType.includes(3),
        accountLogInType
    };
}

// Validation functions
function validateUserInput(data) {
    return validateName(data.name) &&
        validateEmail(data.email) &&
        validatePhoneNumber(data.phone_number);
}

function validateName(name) {
    if (!name.trim().includes(' ')) {
        alert("Please enter both first and last name separated by a space.");
        return false;
    }
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert("Please enter a valid phone number in the format xxx-xxx-xxxx.");
        return false;
    }
    return true;
}

// Utility functions
function renderNewlineSeparatedText(items, type) {
    if (Array.isArray(items) && items.length > 0) {
        return items.map((item, index) => (
            <p key={index} className="text-item">
                {item[0]}
            </p>
        ));
    } else {
        return <p className="text-item">No data available</p>;
    }
}

function renderFieldContent(content) {
    if (content === null || content === undefined || content === '' || content === 0) {
        return <p>No data available</p>;
    }
    return <p>{content}</p>;
}

// Function to determine sideBarType based on accountLogInType
function getSideBarType(accountLogInType) {
    if (accountLogInType === 1 || accountLogInType === 2) return "Department";
    if (accountLogInType === 3) return "Instructor";
    if (accountLogInType === 4) return "Admin";
}

// Main component
function ProfilePage() {
    const fileInputRef = useRef(null);
    const allData = useUserProfileData();

    if (!allData.profileData) return <div>Loading...</div>;

    return (
        <div className="dashboard">
            <SideBar sideBarType={getSideBarType(allData.accountLogInType)} />
            <div className="container">
                <TopBar />
                <div className="user-profilepage">
                    <div className="user-profilecard">
                        <div className="card-header">
                            <h2>My Profile</h2>
                            {allData.isInstructor && (
                                <div className="performance-score">
                                    <div>Performance Score</div>
                                    <div>{allData.profileData.performance_score || 'No data available'}</div>
                                </div>
                            )}
                        </div>
                        <div className="card-content">
                            <ProfileHeader
                                allData={allData}
                                fileInputRef={fileInputRef}
                            />
                            <div className={allData.isInstructor ? "user-profiledetails-grid" : ""}>
                                <PersonalInfo allData={allData} />
                                {allData.isInstructor && (
                                    <TeachingServiceInfo profileData={allData.profileData} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ProfileHeader component
function ProfileHeader({ allData, fileInputRef }) {
    function handleImageClick() {
        if (allData.isEditing) {
            fileInputRef.current.click();
        }
    }

    return (
        <div className="user-profileheader">
            <div className="user-profileheader-section">
                <div className="user-profileimage-container" onClick={handleImageClick}>
                    {allData.editedData.image_data ? (
                        <img
                            src={`data:image/${allData.editedData.image_type};base64,${allData.editedData.image_data}`}
                            alt="Profile"
                            className="user-profileimage"
                        />
                    ) : (
                        <div className="no-image">
                            <span>No Image</span>
                        </div>
                    )}
                    {allData.isEditing && (
                        <div className="image-overlay">
                            <span>Click to upload</span>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={allData.handleImageChange}
                        className="hidden-input"
                        accept="image/*"
                    />
                </div>
                <div className="user-profileinfo">
                    {allData.isEditing ? (
                        <input
                            name="name"
                            value={allData.editedData.name}
                            onChange={allData.handleInputChange}
                            className="edit-input name-input"
                            placeholder="First Last"
                        />
                    ) : (
                        <h3>{allData.profileData.name || 'No data available'}</h3>
                    )}
                    {allData.isEditing ? (
                        <input
                            name="email"
                            value={allData.editedData.email}
                            onChange={allData.handleInputChange}
                            className="edit-input email-input"
                            placeholder="email@example.com"
                        />
                    ) : (
                        <p className="email">{allData.profileData.email || 'No data available'}</p>
                    )}
                    {allData.profileData.UBCId !== 0 && allData.profileData.UBCId !== null && (
                        <p className="ubc-id">UBC ID: {allData.profileData.UBCId}</p>
                    )}
                </div>
            </div>
            {allData.isEditing ? (
                <div className="edit-buttons">
                    <button className="user-profile-save-button" onClick={allData.handleSave}>
                        Save
                    </button>
                    <button className="cancel-button" onClick={allData.handleCancel}>
                        Cancel
                    </button>
                </div>
            ) : (
                <button className="user-profile-edit-button" onClick={allData.handleEdit}>
                    Edit
                </button>
            )}
        </div>
    );
}

// PersonalInfo component
function PersonalInfo({ allData }) {
    return (
        <div className="personal-info">
            <h4>Personal Information</h4>
            <hr />
            <div className={allData.isInstructor ? "info-grid" : "info-row"}>
                <div>
                    <h4>Office Location</h4>
                    {allData.isEditing ? (
                        <input
                            name="office_location"
                            value={allData.editedData.office_location}
                            onChange={allData.handleInputChange}
                            className="edit-input"
                        />
                    ) : renderFieldContent(allData.profileData.office_location)}
                </div>
                <div>
                    <h4>Phone Number</h4>
                    {allData.isEditing ? (
                        <input
                            name="phone_number"
                            value={allData.editedData.phone_number}
                            onChange={allData.handleInputChange}
                            className="edit-input"
                            placeholder="xxx-xxx-xxxx"
                        />
                    ) : renderFieldContent(allData.profileData.phone_number)}
                </div>
                {(allData.profileData.division !== 0 && allData.profileData.division !== null) && (
                    <div>
                        <h4>Division</h4>
                        {renderFieldContent(allData.profileData.division)}
                    </div>
                )}
            </div>
        </div>
    );
}

// TeachingServiceInfo component
function TeachingServiceInfo({ profileData }) {
    return (
        <div className="teaching-service">
            <div className="teaching">
                <h4>Teaching</h4>
                <hr />
                <div className="info-grid">
                    <div>
                        <h4>Current Course(s)</h4>
                        <div>{renderNewlineSeparatedText(profileData.current_courses, 'course')}</div>
                    </div>
                </div>
            </div>
            <div className="service">
                <h4>Service</h4>
                <hr />
                <div className="info-grid">
                    <div>
                        <h4>Current Service Role(s)</h4>
                        <div>{renderNewlineSeparatedText(profileData.current_service_roles, 'role')}</div>
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
    );
}

export default ProfilePage;