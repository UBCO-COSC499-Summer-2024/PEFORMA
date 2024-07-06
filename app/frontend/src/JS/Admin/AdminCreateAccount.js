import React, { useState } from 'react';
import '../../CSS/Admin/CreateAccount.css';
import axios from 'axios';

function CreateAccount() {
    const currentYear = new Date().getFullYear();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        ubcId: '',
        serviceRole: '',
        year : '',
        division: '',
        password: '',
        confirmPassword: ''
    });
    
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roles, setRoles] = useState([
        { id : 1, name: 'Undergraduate Advisor', added: false, year: currentYear },
        { id : 2, name: 'Graduate Admissions', added: false, year: currentYear },
    ]);
    const toggleRoleAdded = (roleId) => {
        const updatedRoles = roles.map(role => 
            ({ ...role, added: role.id === roleId ? !role.added : false })
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
            serviceRole: formData.serviceRole,  // This is now an array of role IDs
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
        <div className="create-account-form">
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                <input type="text" name="ubcId" placeholder="UBC ID" value={formData.ubcId} onChange={handleChange} />
                <div style={{display:'flex'}}>
                <input type="text" name="serviceRole" placeholder="Service Role" value={formData.serviceRole} readOnly />
                <button type="button" onClick={handleAssign}>Assign Role(s)</button>
                </div>
                <input type='text' name="year" placeholder="Assigned Year" value={formData.year} onChange={handleChange}/>
                <input type="integer" name="division" placeholder="Division" value={formData.division} onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                <button type="submit" className="create-button">Create</button>
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
            </form>

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
    );
}

export default CreateAccount;
