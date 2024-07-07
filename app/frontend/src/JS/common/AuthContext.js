import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    //const [authToken, setAuthToken] = useState(null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [profileId, setProfileId] = useState(() => localStorage.getItem('profileId'));
    const [accountType, setAccountType] = useState(() => localStorage.getItem('accountType'));
    const [accountLogInType, setAccountLogInType] = useState(() => localStorage.getItem('accountLogInType'));

    const navigate = useNavigate();

    const login = (token, expiresIn, profileId, accountType, accountLogInType) => {
        const tokenString = JSON.stringify(token);
        //alert(`expire time: ${expiresIn}`);
        setAuthToken(token);
        setProfileId(profileId);
        setAccountType(accountType);
        setAccountLogInType(accountLogInType)
        localStorage.setItem('authToken', tokenString);
        localStorage.setItem('profileId', profileId);
        localStorage.setItem('accountType', accountType);
        localStorage.setItem('accountLogInType', accountLogInType);
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
        localStorage.removeItem('AccountLoggedInType');
        navigate('/HomePage');

    };

    return (
        <AuthContext.Provider value={{ authToken, profileId, accountType, accountLogInType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
    
};