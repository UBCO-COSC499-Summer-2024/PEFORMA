import React, { useState } from 'react';
import '../../CSS/All/Login.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';

function useLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const { login } = useAuth();

	return {
		email, setEmail,
		password, setPassword,
		navigate,
		login
	}
}

function loginRedirect(accountLoggedInType, loginData, navigate) {
	switch (accountLoggedInType) {
		case 1:
			navigate(
				`/DeptPerformancePage?profileId=${loginData.profileId}&accountType=${accountLoggedInType}`,
				{ replace: true }
			);
			break;
		case 2:
			navigate(
				`/DeptPerformancePage?profileId=${loginData.profileId}&accountType=${accountLoggedInType}`,
				{ replace: true }
			);
			break;
		case 3:
			navigate(
				`/InsPerformancePage?profileId=${loginData.profileId}&accountType=${accountLoggedInType}`,
				{ replace: true }
			);
			break;
		case 4:
			navigate(
				`/AdminMemberList`, 
				{ replace: true });
				break;
		default:
			navigate('/', { replace: true });
	}
}

const handleSubmit = async (e, email, password, login, navigate) => {
	e.preventDefault();
	const logindata = { email, password };
	// login logic function call below (BE)
	try {
		const loginResponse = await axios.post('http://localhost:3001/logincheck', logindata);
		if (loginResponse.data.success) {
			let loginData = loginResponse.data;
			// Get account type
			const accountTypeResponse = await axios.get(`http://localhost:3001/accountType/${loginData.accountId}`);
			const accountType = accountTypeResponse.data.accountTypes;
			const accountLoggedInType = accountType[0];
			login(
				loginData.token,
				loginData.token.expiresIn,
				loginData.profileId,
				accountType,
				accountLoggedInType
			);
			if (accountTypeResponse.data.success) {	
				console.log(`Log in as account type: ${accountLoggedInType}`);
				loginRedirect(accountLoggedInType, loginData, navigate);
			} else {
				alert('Failed to get account type');
			}
		} else {
			alert(loginResponse.data.message);
		}
	} catch (error) {
		alert(error.message);
	}
};

function Login() {
	const {
		email, setEmail,
		password, setPassword,
		navigate,
		login
	} = useLogin();

	return (
		<div className="login-container">
			<header className="login-header">
				<h2 className="logo"><Link to="/">PEFORMA</Link></h2>
			</header>
			<div className="login-form-container">
				<form onSubmit={(e)=>handleSubmit(e, email, password, login, navigate)}>
					<h1>Sign In</h1>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email Address"
						required
					/>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						required
					/>
					<Link to="/ForgotPasswordPage" id="forgot">
					
						Forgot password?
					
					</Link>
					<button type="submit" role="button">
						Log In
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
