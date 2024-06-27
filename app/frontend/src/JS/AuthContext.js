import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    //const [authToken, setAuthToken] = useState(null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const navigate = useNavigate();

    const login = (token, expiresIn) => {
        const tokenString = JSON.stringify(token);
        //alert(`expire time: ${expiresIn}`);
        setAuthToken(token);
        localStorage.setItem('authToken', tokenString);
        setTimeout( () => {
            alert('Session about to expire.');
            logout();
            navigate('/HomePage');},
            (expiresIn - 60) * 10000)
            //kick off 1 min before expire.. 60 * 1000ms = 60s
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
        navigate('/HomePage');

    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
