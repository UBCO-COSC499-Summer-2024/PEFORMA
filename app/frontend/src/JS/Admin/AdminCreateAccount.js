import React, { useState, useEffect } from 'react';
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
        password: '',
        confirmPassword: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form data submitted:', formData);

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const postData = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            ubcId: formData.ubcId,
            division: formData.division,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        };

        try {
            const response = await axios.post('http://localhost:3001/create-account', postData);
            console.log("checking")
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
                <div className='create-account-form'>
                    <h1>Create Account</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                        <input type="text" name="ubcId" placeholder="UBC ID (optional)" value={formData.ubcId} onChange={handleChange} />
                        <select name="division" value={formData.division} onChange={handleChange} required>
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Statistics">Statistics</option>
                            <option value="N/A">N/A</option>
                        </select>
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
