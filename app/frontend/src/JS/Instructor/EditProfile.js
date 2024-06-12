import React, { useState } from 'react';
import '../../CSS/Instructor/EditProfile.css';

function EditProfile() {
  const [profile, setProfile] = useState({
    name: 'Billy Guy',
    email: 'afjdadifhusdh@asdf.com',
    phone: '250-123-1234',
    location: 'Alaska'
  });

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
    location: false
  });

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
      <div className='sidebar-header'>
        <h1>PERFORMA</h1>
        <hr/>
      </div>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#performance">Performance</a>
        </nav>
      </aside>
      <div className="edit-profile">
      <div>
        <header className="web-head">
          <img src='temp.png' alt=''/>
          <button onClick={() => console.log('Logout')}>Logout</button>
        </header>
       </div>
        <div className="profile-header">
          <h1>Edit Your Profile</h1>
        </div>
        <div className="profile-fields">
          {Object.entries(profile).map(([key, value]) => (
            <div className="profile-field" key={key}>
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
              {editMode[key] ? (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : (
                <span>{value}</span>
              )}
              <button onClick={() => toggleEdit(key)}>Edit</button>
            </div>
          ))}
        </div>
        <div className="profile-actions">
          <button onClick={() => console.log('Save Changes')}>Save</button>
          <button onClick={() => console.log('Cancel Changes')}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
