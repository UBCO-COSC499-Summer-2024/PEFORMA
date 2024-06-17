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
        //{alert(`${JSON.stringify(response.data)}`)}
        {alert(`Welcom!  ${response.data.email}!\nRe-directing to ${response.data.acctype} page!`);
          login(response.data.token, response.data.expiresIn);
          navigate('/Dashboard',{replace:true});
        }
      else{alert(response.data.message);}
    }catch(error){alert(error.message);}
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
