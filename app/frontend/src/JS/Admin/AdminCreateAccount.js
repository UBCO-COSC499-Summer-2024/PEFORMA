import React, { useState, useEffect } from 'react';
import '../../CSS/Admin/CreateAccount.css';
import axios from 'axios';
import CreateSideBar, { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { fillEmptyItems } from '../common/utils.js';

function CreateAccount() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [roleData, setRoleData] = useState({
        roles: [{}],
        rolesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const currentYear = new Date().getFullYear();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        ubcId: '',
        serviceRole: '',
        year: '',
        division: '',
        password: '',
        confirmPassword: ''
    });

    const [roles, setRoles] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);

    useEffect(() => {
        const fetchServiceRoles = async () => {
            try {
                if (!authToken) {
                    navigate('/Login'); // Use your navigation mechanism
                    return;
                }

                const res = await axios.get(`http://localhost:3001/api/service-roles`, {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                });
                const data = res.data;
                const filledRoles = fillEmptyItems(data.roles, data.perPage);
                setRoleData({ ...data, roles: filledRoles });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken'); // Clear invalid token
                    navigate('/Login');
                } else {
                    console.error('Error fetching service roles:', error);
                }
            }
        };
        fetchServiceRoles();
    }, [authToken]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/service-roles`, {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                });
                setRoles(res.data.roles);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        if (showRoleModal) {
            fetchRoles();
        }
    }, [showRoleModal, authToken]);

    const toggleRoleAdded = (roleId) => {
        const updatedRoles = roles.map(role =>
            ({ ...role, added: role.id === roleId ? !role.added : role.added })
        );
        setRoles(updatedRoles);

        const addedRole = updatedRoles.find(role => role.added);
        setFormData({
            ...formData,
            serviceRole: addedRole ? [addedRole.name] : []
        });
    };

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

        const postData = {
            ...formData,
            serviceRole: formData.serviceRole,
        };
        try {
            const response = await axios.post('http://localhost:3001/create-account', postData);
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Error sending data to the server:', error);
        }
    };

    const handleCancel = () => {
        console.log('Form cancelled');
    };

    const handleAssign = () => setShowRoleModal(true);

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
                        <input type="text" name="ubcId" placeholder="UBC ID (optional)" value={formData.ubcId} onChange={handleChange} required minLength="8" maxLength="8" />
                        <div className='service-role-button-align'>
                            <input type="text" name="serviceRole" placeholder="Service Role" value={formData.serviceRole} readOnly />
                            <button type="button" onClick={handleAssign}>Assign Role(s)</button>
                            {showRoleModal && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <button onClick={() => setShowRoleModal(false)}>Close</button>
                                        {roles.map(role => (
                                            <div key={role.id}>
                                                {role.name}
                                                <button onClick={() => toggleRoleAdded(role.id)}>
                                                    {role.added ? 'Remove' : 'Add'}
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => setShowRoleModal(false)}>Save</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input type='number' name="year" placeholder="Assigned Year" value={formData.year} onChange={handleChange} required/>
                        <input type="integer" name="division" placeholder="Division" value={formData.division} onChange={handleChange} required />
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
