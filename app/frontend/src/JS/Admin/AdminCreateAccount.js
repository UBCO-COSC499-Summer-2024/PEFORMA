import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { checkAccess, handleCancelForm, submitFormData } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Admin/CreateAccount.css';

// initial form data that will be used in createAccount
const initialFormData = {
    email: '',
    firstName: '',
    lastName: '',
    ubcId: '',
    division: '',
    accountType: [],
    password: '',
    confirmPassword: ''
};

// mapping of account types to numerical values for BE processing
const accountTypeMapping = {
    DepartmentHead: 1,
    DepartmentStaff: 2,
    Instructor: 3,
    Admin: 4
};

// custom hook for managing form state
function useFormState(initialState) {
    const [formData, setFormData] = useState(initialState);
    const [ubcIdError, setUbcIdError] = useState('');

    // handle form input changes including checkboxes for account type
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setFormData(prevState => {
                const accountType = checked 
                    ? [...prevState.accountType, accountTypeMapping[name]]
                    : prevState.accountType.filter(type => type !== accountTypeMapping[name]);
                return {
                    ...prevState,
                    accountType
                };
            });
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
            
            // validate ubc id as 8 digit number
            if (name === 'ubcId') {
                if (value !== '' && (value.length !== 8 || isNaN(value))) {
                    setUbcIdError('UBC ID must be an 8-digit number');
                } else {
                    setUbcIdError('');
                }
            }
        }
    };

    return { formData, ubcIdError, handleChange, setFormData };
}

// function for validating data before submission
function validateForm(formData) {
    // check password matches
    if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }
    // check ubcid is 8 digit number
    if (formData.ubcId && (formData.ubcId.length !== 8 || isNaN(formData.ubcId))) {
        alert('UBC ID must be an 8-digit number');
        return false;
    }

    return true;
}

// main component for creating user accounts in the admin view
function CreateAccount() {
    const { accountLogInType, authToken } = useAuth();
    const navigate = useNavigate();
    const { formData, ubcIdError, handleChange, setFormData } = useFormState(initialFormData);

    useEffect(() => {
        checkAccess(accountLogInType, navigate, 'admin', authToken)
    }, [authToken, navigate]);

    // handle submitting form
    const handleSubmit = async (event) => {
        event.preventDefault();

        // validate form first and if it doenst meet the requirements, do nothing and return
        if (!validateForm(formData)) return;

        const postData = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            ubcId: formData.ubcId,
            division: formData.division,
            accountType: formData.accountType,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        };

        // custom error handling message for form submission
        const errorMessageHandler = (error) => {
            if (error.response && error.response.status === 400 && error.response.data.message === 'Email already exists') {
                alert('Error: Email already exists');
            } else {
                alert('Error creating account: ' + error.message);
            }
        };

        // submuit for data to server and handle responses and erros
        await submitFormData('http://localhost:3001/api/create-account', postData, authToken, initialFormData, setFormData, 'Account created successfully.', errorMessageHandler);
    };

    return (
        <div className="dashboard">
            <SideBar sideBarType="Admin" />
            <div className='container'>
                <TopBar />
                <div className='create-account-form' id='admin-create-account-test-content'>
                    <h1>Create Account</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                        <input type="text" name="ubcId" placeholder="UBC ID (optional)" value={formData.ubcId} onChange={handleChange} />
                        {ubcIdError && <div className="error">{ubcIdError}</div>}
                        <select name="division" value={formData.division} onChange={handleChange} required>
                            <option value="">Select Department</option>
                            <option value="1">Computer Science</option>
                            <option value="2">Mathematics</option>
                            <option value="3">Physics</option>
                            <option value="4">Statistics</option>
                            <option value="5">N/A</option>
                        </select>
                        <div className="checkbox-group">
                            <label>
                                <input type="checkbox" name="DepartmentHead" checked={formData.accountType.includes(accountTypeMapping.DepartmentHead)} onChange={handleChange} />
                                Department Head
                            </label>
                            <label>
                                <input type="checkbox" name="DepartmentStaff" checked={formData.accountType.includes(accountTypeMapping.DepartmentStaff)} onChange={handleChange} />
                                Department Staff
                            </label>
                            <label>
                                <input type="checkbox" name="Instructor" checked={formData.accountType.includes(accountTypeMapping.Instructor)} onChange={handleChange} />
                                Instructor
                            </label>
                            <label>
                                <input type="checkbox" name="Admin" checked={formData.accountType.includes(accountTypeMapping.Admin)} onChange={handleChange} />
                                Admin
                            </label>
                        </div>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                        <div className='button-align-div'>
                            <button type="submit" className="create-button">Create</button>
                            <button type="button" className="cancel-button" onClick={() => handleCancelForm(setFormData, initialFormData)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;
