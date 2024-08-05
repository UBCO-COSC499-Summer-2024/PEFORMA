import React, { useState, useEffect } from 'react';
import '../../CSS/All/Login.css';
import axios from 'axios';
import { checkAccess } from '../common/utils';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const { login, authToken, accountLogInType } = useAuth();

	
	function loginRedirect(accountLoggedInType, loginData) {
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

	// Redirect if you're already logged in
	/*
	useEffect(()=>{
		if (accountLogInType) {
			console.log(accountLogInType);
			let accountNumber = Number(accountLogInType);
			if (accountNumber == 1 || accountNumber == 2) {
				navigate("/DeptDashboard",{ replace: true });
			} else if (accountNumber == 3) {
				navigate("/InsDashboard",{ replace: true });
			} else {
				navigate("/AdminDashboard",{ replace: true });
			}
		}
	},[accountLogInType, authToken]);
	*/

	const handleSubmit = async (e) => {
		e.preventDefault();
		const logindata = { email, password };
		// login logic function call below (BE)
		try {
			const loginResponse = await axios.post('http://localhost:3001/logincheck', logindata);
			if (loginResponse.data.success) {
				let loginData = loginResponse.data;
				// here is the token and expire time ↑↑↑
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
					loginRedirect(accountLoggedInType, loginData);
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
	return (
		<div className="login-container">
			<header className="login-header">
				<h2 className="logo"><Link to="/">PEFORMA</Link></h2>
			</header>
			<div className="login-form-container">
				<form onSubmit={handleSubmit}>
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
