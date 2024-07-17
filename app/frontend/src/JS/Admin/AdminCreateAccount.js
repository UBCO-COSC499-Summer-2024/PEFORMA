import React, { useState } from 'react';
import '../../CSS/Admin/CreateAccount.css';
import axios from 'axios';
import CreateSideBar, { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';

function CreateAccount() {
    const { authToken } = useAuth();
    const navigate = useNavigate();

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

    const accountTypeMapping = {
        DepartmentHead: 1,
        DepartmentStaff: 2,
        Instructor: 3,
        Admin: 4
    };

    const [formData, setFormData] = useState(initialFormData);
    const [ubcIdError, setUbcIdError] = useState('');

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

            if (name === 'ubcId') {
                if (value !== '' && (value.length !== 8 || isNaN(value))) {
                    setUbcIdError('UBC ID must be an 8-digit number');
                } else {
                    setUbcIdError('');
                }
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form data submitted:', formData);

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (formData.ubcId && (formData.ubcId.length !== 8 || isNaN(formData.ubcId))) {
            alert('UBC ID must be an 8-digit number');
            return;
        }

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

        try {
            const response = await axios.post('http://localhost:3001/api/create-account', postData,
                {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                }
            );
            console.log('Server response:', response.data);
            alert('Account created successfully.');
            setFormData(initialFormData);
        } catch (error) {
            console.error('Error sending data to the server:', error);
            if (error.response && error.response.status === 400 && error.response.data.message === 'Email already exists') {
                alert('Error: Email already exists');
            } else {
                alert('Error creating account: ' + error.message);
            }
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
    };

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType="Admin" />
            <div className='container'>
                <CreateTopBar />
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
                            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;
