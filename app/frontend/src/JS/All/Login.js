import React, { useState } from 'react';
import '../../CSS/All/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const logindata = { email, password};
    //console.log('Sending:'+logindata);
    // login logic function call below (BE)
    try{
      const response = await axios.post('http://localhost:3001/logincheck', logindata);
      if(response.data.success)
        {
          //alert(JSON.stringify(response.data, null, 2));
          alert(`Welcom!  ${response.data.email}!\n Account Id is ${response.data.accountId}! \n
                retrived token is: ${JSON.stringify(response.data.token.token,null,2)}\n
                expire time is: ${JSON.stringify(response.data.token.expiresIn,null,2)}`);
                
                // here is the token and expire time ↑↑↑
                
          const accountTypeResponse = await axios.get(`http://localhost:3001/accountType/${response.data.accountId}`);
          login(response.data.token, response.data.expiresIn);
          if (accountTypeResponse.data.success) {
            const accountType = accountTypeResponse.data.accountType;
            alert(`Log in as account type: ${accountType}`);
            switch (accountType) {
              /*
              case 'admin':
                navigate('/adminDashboard', { replace: true });
                break;
              case 'user':
                navigate('/userDashboard', { replace: true });
                break;
              case 'guest':
                navigate('/guestDashboard', { replace: true });
                break;
              */
              default:
                navigate('/Dashboard', { replace: true });
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
        <div className="logo">PEFORMA</div>
        <nav>
          <a href="#support">Support</a>
          <button href="#login">Login</button>
        </nav>
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
          <a href="#forgot">Forgot password?</a>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
