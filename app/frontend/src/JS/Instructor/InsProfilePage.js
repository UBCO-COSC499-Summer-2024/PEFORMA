import React from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/Instructor/InsProfilePage.css';

// Custom hook to fetch and manage user profile data
function useUserProfileData() {
    const { accountType, accountLogInType, authToken } = useAuth();
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get('profileid')

    const navigate = useNavigate();
    const [profileData, setProfileData] = React.useState({
        UBCId: 0,
        current_courses: [],
        current_service_roles: [],
        division: 0,
        email: "",
        name: "",
        office_location: "",
        phone_number: "",
        profileId: 1,
        working_hours: 0,
        benchmark: 0,
        image_type: "",
        image_data: ""
    });

    React.useEffect(() => {
        fetchUserProfileData();
    }, [profileId, authToken]);

    // Function to fetch user profile data from the server
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
                setProfileData({
                    ...data,
                    image_data: data.image_data || '',
                    image_type: data.image_type || 'jpeg'
                });
            })
            .catch(handleFetchError);
    }

    // Function to handle errors during data fetching
    function handleFetchError(error) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/Login');
        } else {
            console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
        }
    }

    return {
        profileData,
        isInstructor: accountType.includes(3),
        accountLogInType
    };
}

// Function to render text content, creating links for courses
function renderNewlineSeparatedText(items, type) {
    if (Array.isArray(items) && items.length > 0) {
        return items.map((item, index) => (
            <p key={index} className="text-item">
                {type === 'course' ? (
                    <Link to={`/InsCourseHistory?courseid=${item[1]}`}>
                        {item[0]}
                    </Link>
                ) : (
                    item[0] // For service roles, just display the text without a link
                )}
            </p>
        ));
    } else {
        return <p className="text-item">No data available</p>;
    }
}

// Function to render field content or "No data available" if empty
function renderFieldContent(content) {
    if (content === null || content === undefined || content === '' || content === 0) {
        return <p>No data available</p>;
    }
    return <p>{content}</p>;
}

// Function to determine sidebar type based on account login type
function getSideBarType(accountLogInType) {
    if (accountLogInType === 1 || accountLogInType === 2) return "Department";
    if (accountLogInType === 3) return "Instructor";
    if (accountLogInType === 4) return "Admin";
}

// Main ProfilePage component
function ProfilePage() {
    const { profileData, isInstructor, accountLogInType } = useUserProfileData();

    if (!profileData) return <div>Loading...</div>;

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType={getSideBarType(accountLogInType)} />
            <div className="container">
                <CreateTopBar />
                <div className="user-profilepage">
                    <div className="user-profilecard">
                        <div className="card-header">
                            <h2>Instructor Profile</h2>
                        </div>
                        <div className="card-content">
                            <ProfileHeader profileData={profileData} />
                            <div className={isInstructor ? "user-profiledetails-grid" : ""}>
                                <PersonalInfo profileData={profileData} />
                                {isInstructor && (
                                    <TeachingServiceInfo profileData={profileData} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Component to display the profile header with image and basic info
function ProfileHeader({ profileData }) {
    return (
        <div className="user-profileheader">
            <div className="user-profileheader-section">
                <div className="user-profileimage-container">
                    {profileData.image_data ? (
                        <img
                            src={`data:image/${profileData.image_type};base64,${profileData.image_data}`}
                            alt="Profile"
                            className="user-profileimage"
                        />
                    ) : (
                        <div className="no-image">
                            <span>No Image</span>
                        </div>
                    )}
                </div>
                <div className="user-profileinfo">
                    <h3>{profileData.name || 'No data available'}</h3>
                    <p className="email">{profileData.email || 'No data available'}</p>
                    {profileData.UBCId !== 0 && profileData.UBCId !== null && (
                        <p className="ubc-id">UBC ID: {profileData.UBCId}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Component to display personal information
function PersonalInfo({ profileData }) {
    return (
        <div className="personal-info">
            <h4>Personal Information</h4>
            <hr />
            <div className="info-grid">
                <div>
                    <h4>Office Location</h4>
                    {renderFieldContent(profileData.office_location)}
                </div>
                <div>
                    <h4>Phone Number</h4>
                    {renderFieldContent(profileData.phone_number)}
                </div>
                {(profileData.division !== 0 && profileData.division !== null) && (
                    <div>
                        <h4>Division</h4>
                        {renderFieldContent(profileData.division)}
                    </div>
                )}
            </div>
        </div>
    );
}

// Component to display teaching and service information
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
                        <h4>Annual Service Hours</h4>
                        <p>
                            {profileData.benchmark !== 0
                                ? `${profileData.benchmark} Hours`
                                : 'No data available'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;