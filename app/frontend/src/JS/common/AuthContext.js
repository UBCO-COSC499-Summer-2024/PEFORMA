import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    //const [authToken, setAuthToken] = useState(null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [profileId, setProfileId] = useState(() => localStorage.getItem('profileId'));
    const getInitialAccountType = () => {
        const storedAccountType = localStorage.getItem('accountType');
        try {
            return JSON.parse(storedAccountType) || [];
        } catch (error) {
            return [];
        }
    };
    
    const getInitialAccountLogInType = () => {
        const storedAccountLogInType = localStorage.getItem('accountLogInType');
        try {
            return JSON.parse(storedAccountLogInType);
        } catch (error) {
            return null;
        }
    };
    
    const [accountType, setAccountType] = useState(getInitialAccountType);
    const [accountLogInType, setAccountLogInType] = useState(getInitialAccountLogInType);

    const navigate = useNavigate();

    const login = (token, expiresIn, profileId, accountType, accountLogInType) => {
        const tokenString = JSON.stringify(token);
        const accountTypeString = JSON.stringify(accountType);
        setAuthToken(token);
        setProfileId(profileId);
        setAccountType(accountType);
        setAccountLogInType(accountLogInType);
        localStorage.setItem('authToken', tokenString);
        localStorage.setItem('profileId', profileId);
        localStorage.setItem('accountType', accountTypeString);
        localStorage.setItem('accountLogInType', accountLogInType);
        setTimeout(() => {
            alert('Session about to expire.');
            logout();
            navigate('/HomePage');
        }, (expiresIn - 60) * 1000);
    };

    const logout = () => {
        setAuthToken(null);
        setProfileId(null);
        setAccountType([]);
        setAccountLogInType(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('profileId');
        localStorage.removeItem('accountType');
        localStorage.removeItem('accountLogInType');
        navigate('/HomePage');
    };

    return (
        <AuthContext.Provider value={{ authToken, profileId, accountType, accountLogInType, setAccountLogInType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
    
};