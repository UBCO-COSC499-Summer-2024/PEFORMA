import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { checkAccess, fetchWithAuth } from '../common/utils.js';
import { useAuth } from '../common/AuthContext';
import '../../CSS/All/UserProfile.css';

function useInstructorProfileData() {
    const { authToken, accountLogInType, profileId } = useAuth();
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const ubcid = params.get('ubcid');
    const [profileData, setProfileData] = React.useState({
        name: '',
        ubcid: '',
        roles: [],
        benchmark: '',
        phone: '',
        email: '',
        office: '',
        teachingAssignments: [],
        performance_score: 0,
        working_hours: 0
    });

    React.useEffect(() => {
        const fetchData = async () => {
            checkAccess(accountLogInType, navigate, 'instructor', authToken);
            try {
                const response = await fetchWithAuth(`http://localhost:3001/api/profile/${profileId}`, authToken, navigate, { ubcid: ubcid });
                setProfileData(response);
            } catch (error) {
                console.error('Error fetching instructor profile:', error);
            }
        };
        fetchData();
    }, [accountLogInType, authToken, ubcid, navigate]);

    return profileData;
}

function InstructorProfilePage() {
    const profileData = useInstructorProfileData();

    return (
        <div className="dashboard">
            <SideBar sideBarType="Instructor" />
            <div className="container">
                <TopBar />
                <div className="user-profilepage">
                    <div className="user-profilecard">
                        <div className="card-header">
                            <h2>Instructor Profile</h2>
                            <div className="performance-score">
                                <div>Performance Score</div>
                                <div>{profileData.performance_score || 'No data available'}</div>
                            </div>
                        </div>
                        <div className="card-content">
                            <ProfileHeader profileData={profileData} />
                            <div className="user-profiledetails-grid">
                                <PersonalInfo profileData={profileData} />
                                <TeachingServiceInfo profileData={profileData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileHeader({ profileData }) {
    return (
        <div className="user-profileheader">
            <div className="user-profileheader-section">
                <div className="user-profileimage-container">
                    <div className="no-image">
                        <span>No Image</span>
                    </div>
                </div>
                <div className="user-profileinfo">
                    <h3>{profileData.name || 'No data available'}</h3>
                    <p className="email">{profileData.email || 'No data available'}</p>
                    <p className="ubc-id">UBC ID: {profileData.ubcid || 'No data available'}</p>
                </div>
            </div>
        </div>
    );
}

function PersonalInfo({ profileData }) {
    return (
        <div className="personal-info">
            <h4>Personal Information</h4>
            <hr />
            <div className="info-grid">
                <div>
                    <h4>Office Location</h4>
                    <p>{profileData.office || 'No data available'}</p>
                </div>
                <div>
                    <h4>Phone Number</h4>
                    <p>{profileData.phone || 'No data available'}</p>
                </div>
                <div>
                    <h4>Monthly Hours Benchmark</h4>
                    <p>{profileData.benchmark || 'No data available'}</p>
                </div>
            </div>
        </div>
    );
}

function TeachingServiceInfo({ profileData }) {
    return (
        <div className="teaching-service">
            <div className="teaching">
                <h4>Teaching</h4>
                <hr />
                <div className="info-grid">
                    <div>
                        <h4>Current Course(s)</h4>
                        <div>
                            {profileData.teachingAssignments.length > 0 ? (
                                profileData.teachingAssignments.map((teachingAssign, index) => (
                                    <p key={index} className="text-item">
                                        <Link to={`/InsCourseHistory?courseid=${teachingAssign.courseid}`}>
                                            {teachingAssign.assign}
                                        </Link>
                                    </p>
                                ))
                            ) : (
                                <p className="text-item">No data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="service">
                <h4>Service</h4>
                <hr />
                <div className="info-grid">
                    <div>
                        <h4>Current Service Role(s)</h4>
                        <div>
                            {profileData.roles.length > 0 ? (
                                profileData.roles.map((role, index) => (
                                    <p key={role.roleid} className="text-item">
                                        <Link to={`/InsRoleInformation?roleid=${role.roleid}`}>
                                            {role.roleTitle}
                                        </Link>
                                    </p>
                                ))
                            ) : (
                                <p className="text-item">No data available</p>
                            )}
                        </div>
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

export default InstructorProfilePage;