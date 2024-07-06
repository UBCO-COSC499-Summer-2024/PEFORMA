import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    //const [authToken, setAuthToken] = useState(null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [profileId, setProfileId] = useState(() => localStorage.getItem('profileId'));
    const [accountType, setAccountType] = useState(() => localStorage.getItem('accountType'));
    const navigate = useNavigate();

    const login = (token, expiresIn, profileId, accountType) => {
        const tokenString = JSON.stringify(token);
        //alert(`expire time: ${expiresIn}`);
        setAuthToken(token);
        setProfileId(profileId);
        setAccountType(accountType);
        localStorage.setItem('authToken', tokenString);
        localStorage.setItem('profileId', profileId);
        localStorage.setItem('accountType', accountType);

        setTimeout( () => {
            alert('Session about to expire.');
            logout();
            navigate('/HomePage');},
            (expiresIn - 60) * 10000);
            //kick off 1 min before expire.. 60 * 1000ms = 60s
    };

    const logout = () => {
        setAuthToken(null);
        setProfileId(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('profileId');
        localStorage.removeItem('accountType');
        navigate('/HomePage');

    };

    return (
        <AuthContext.Provider value={{ authToken, profileId, accountType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
    
};