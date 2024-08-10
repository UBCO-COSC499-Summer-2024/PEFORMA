import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './common/AuthContext';

function PrivateRoute({ children }) {
	const { authToken } = useAuth(); // 假设 authToken 存储在你的 AuthContext 中
	if (!authToken) {
		return <Navigate to="/login" replace />;
	}
	return children;
}

export default PrivateRoute;
