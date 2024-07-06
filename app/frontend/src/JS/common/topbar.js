import { useNavigate } from 'react-router-dom';
import React from 'react';
function Topbar() { 
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token');
        alert('Log out successfully.\n\nRedirecting to Home Page.');
        navigate('/');
    }
        return(
            <div className="topbar" /*onClick={redirect}*/>
                <div className="logout" onClick={handleLogOut}>
                    Logout
                </div>
            </div>
        );
    }
export default Topbar;