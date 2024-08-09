import React, { useState } from 'react';
import '../../CSS/All/Login.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';

function useLogin() {
	// State variables
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate(); // For navigating to main dashboard after logging in
	const { login } = useAuth(); // For setting account variables
	// Send data to Login() function
	return {
		email, setEmail,
		password, setPassword,
		navigate,
		login
	}
}
// Function for redirecting the user to the main page of their account type
function loginRedirect(accountLoggedInType, loginData, navigate) {
	switch (accountLoggedInType) {
		// If Department Head, send to DeptPerformancePage
		case 1:
			navigate(
				`/DeptPerformancePage?profileId=${loginData.profileId}&accountType=${accountLoggedInType}`,
				{ replace: true }
			);
			break;
		// If Department Staff, also send to DeptPerformancePage
		case 2:
			navigate(
				`/DeptPerformancePage?profileId=${loginData.profileId}&accountType=${accountLoggedInType}`,
				{ replace: true }
			);
			break;
		// If instructor, send to InsPerformancePage
		case 3:
			navigate(
				`/InsPerformancePage?profileId=${loginData.profileId}&accountType=${accountLoggedInType}`,
				{ replace: true }
			);
			break;
		// If Admin, send to AdminMemberList
		case 4:
			navigate(
				`/AdminMemberList`, 
				{ replace: true });
				break;
		default:
		// In case of accountLoginType not being 1-4, send back to the homepage
			navigate('/', { replace: true });
	}
}

// Function called after submitting Login
const handleSubmit = async (e, email, password, login, navigate) => {
	e.preventDefault();
	const logindata = { email, password };
	// login logic function call below (BE)
	try {
		// Send inputted data to backend, and recieve a response containing a success or failure status and the necessary data
		const loginResponse = await axios.post('http://localhost:3001/logincheck', logindata);
		if (loginResponse.data.success) {
			// loginResponse.data contains: {success: boolean, token, expiresIn, email, accountId, profileId}
			let loginData = loginResponse.data;
			// Get account type
			const accountTypeResponse = await axios.get(`http://localhost:3001/accountType/${loginData.accountId}`);
			// accountTypeResponse.data contain array of account types, with the type of index 0 being the default
			const accountType = accountTypeResponse.data.accountTypes;
			const accountLoggedInType = accountType[0];
			// Set global account variables
			login(
				loginData.token,
				loginData.token.expiresIn,
				loginData.profileId,
				accountType,
				accountLoggedInType
			);
			// If success, call loginRedirect to send the user to the main page of their account type
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
	// Get necessary state variables
	const {
		email, setEmail,
		password, setPassword,
		navigate,
		login
	} = useLogin();
	// display HTML
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
