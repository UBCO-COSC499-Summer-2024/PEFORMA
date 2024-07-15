import React, { useState } from 'react';
import '../../CSS/All/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const logindata = { email, password };
		// login logic function call below (BE)
		try {
			const response = await axios.post('http://localhost:3001/logincheck', logindata);
			if (response.data.success) {
				alert(`Welcom!  ${response.data.email}!\n Account Id is ${response.data.accountId}! \n
                retrived token is: ${JSON.stringify(response.data.token.token, null, 2)}\n
                expire time is: ${JSON.stringify(response.data.token.expiresIn, null, 2)}`);
				// here is the token and expire time ↑↑↑
				const accountTypeResponse = await axios.get(
					`http://localhost:3001/accountType/${response.data.accountId}`
				);
				const accountType = accountTypeResponse.data.accountTypes;
				const accountLoggedInType = accountType[0];
				login(
					response.data.token,
					response.data.token.expiresIn,
					response.data.profileId,
					accountType,
					accountLoggedInType
				);
				if (accountTypeResponse.data.success) {
					alert(`Log in as account type: ${accountLoggedInType}`);
					switch (accountLoggedInType) {
						case 1:
							navigate(
								`/DeptPerformancePage?profileId=${response.data.profileId}&accountType=${accountLoggedInType}`,
								{ replace: true }
							);
							break;
						case 2:
							navigate(
								`/DeptPerformancePage?profileId=${response.data.profileId}&accountType=${accountLoggedInType}`,
								{ replace: true }
							);
							break;
						case 3:
							navigate(
								`/InsPerformancePage?profileId=${response.data.profileId}&accountType=${accountLoggedInType}`,
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
				} else {
					alert('Failed to get account type');
				}
			} else {
				alert(response.data.message);
			}
		} catch (error) {
			alert(error.message);
		}
	};
	return (
		<div className="login-container">
			<header className="login-header">
				<h2 className="logo">PEFORMA</h2>
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
					<a id="forgot" href="#forgot">
						Forgot password?
					</a>
					<button type="submit" role="button">
						Log In
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
