import React, { useState } from 'react';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/All/ChangePassword.css';

const PasswordChangePage = () => {
    const { accountLogInType, profileId, authToken } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required';
            isValid = false;
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
            isValid = false;
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long';
            isValid = false;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(
                    `http://localhost:3001/api/change-password/${profileId}`,
                    {
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword,
                    },
                    {
                        headers: { Authorization: `Bearer ${authToken.token}` },
                    }
                );
                alert('Password changed successfully');
                navigate('/UserProfile');
            } catch (error) {
                console.error('Error changing password:', error);
                if (error.response && error.response.data.message === 'Current password is incorrect') {
                    alert('Current password is incorrect. Please try again.');
                } else {
                    alert('Failed to change password. Please try again.');
                }
            }
        }
    };

    const getSideBarType = () => {
        if (accountLogInType === 1 || accountLogInType === 2) {
            return "Department";
        } else if (accountLogInType === 3) {
            return "Instructor";
        } else if (accountLogInType === 4) {
            return "Admin";
        }
    };

    const VisibilityIcon = ({ visible }) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {visible ? (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            ) : (
                <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </>
            )}
        </svg>
    );

    return (
        <div className="dashboard">
            <SideBar sideBarType={getSideBarType()} />
            <div className="container">
                <TopBar />
                <div className="password-change-page">
                    <div className="password-change-card">
                        <h2 className="card-title">Change Password</h2>
                        <form onSubmit={handleSubmit}>
                            {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field) => (
                                <div className="form-group" key={field}>
                                    <label htmlFor={field}>
                                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword[field] ? "text" : "password"}
                                            id={field}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            className={errors[field] ? 'error' : ''}
                                        />
                                        <button 
                                            type="button" 
                                            className="toggle-password"
                                            onClick={() => togglePasswordVisibility(field)}
                                            aria-label={showPassword[field] ? "Hide password" : "Show password"}
                                        >
                                            <VisibilityIcon visible={showPassword[field]} />
                                        </button>
                                    </div>
                                    {errors[field] && <p className="error-message">{errors[field]}</p>}
                                </div>
                            ))}
                            <div className="button-container">
                                <button type="submit" className="submit-button">Change Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangePage;