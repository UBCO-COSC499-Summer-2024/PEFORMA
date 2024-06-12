import React, { useState } from 'react';
import '../../CSS/Admin/CreateAccount.css';

function CreateAccount() {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        ubcId: '',
        serviceRole: '',
        division: '',
        password: '',
        confirmPassword: ''
    });
    
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roles, setRoles] = useState([
        { id: 1, name: 'Undergrad Advisor (COSC)', added: false },
        { id: 2, name: 'Overgrad Advisor (STAT)', added: true },
        // Add other roles as needed
    ]);

    const toggleRoleAdded = (roleId) => {
        setRoles(roles.map(role => 
            role.id === roleId ? { ...role, added: !role.added } : role
        ));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you would handle form submission, such as validating input
        // and sending data to a server
        console.log('Form data submitted:', formData);
    };

    const handleCancel = () => {
        // Optional: handle the cancel action
        console.log('Form cancelled');
    };

    const handleAssign = () => {setShowRoleModal(true);}


    return (
        <div className="create-account-form">
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                <input type="text" name="ubcId" placeholder="UBC ID" value={formData.ubcId} onChange={handleChange} />
                <div style={{display:'flex'}}>
                <input type="text" name="serviceRole" placeholder="Service Role" value={formData.serviceRole} onChange={handleChange} />
                <button onClick={handleAssign}>Assign Role(s)</button>
                </div>
                <input type="text" name="division" placeholder="Division" value={formData.division} onChange={handleChange} />
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
