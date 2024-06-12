import React, { Component } from 'react';
import '../../CSS/All/HomePage.css';

class HomePage extends Component {
  // process login button event
  handleLogin() {
    // add login jump-to-page logic here
    console.log('Login button clicked');
  };

  constructor(props) {
    super(props);
    this.state = {message:''};
  }
  
  callAPI() {
    fetch("http://localhost:3001/testAPI")
        .then(res => res.json())
        .then(res => this.setState({ message: res.message }))
       .catch(err=> err);
  }
  
  componentWillMount() {
    this.callAPI();
  }

  render(){
  return (
      <div className="home-container">
        <header className="homepage-header">
          <div className="logo">PEFORMA</div>
          <nav>
            <a href="#support">Support</a>
            <button onClick={''}>Login</button>
          </nav>
        </header>
        <main className="main-content">
          <h1>Get professional performance feedback</h1>
          <h1>message 201 from backend: {this.state.message}</h1>
          <p>Join to see the teaching assignment with individual performance of each months</p>
        </main>
        <footer className="footer">
          <a href="#about">ABOUT US</a>
          <a href="#terms">TERMS OF USE</a>
          <a href="#copy">Copyright</a>
        </footer>
      </div>
    );
  }
}

export default HomePage;
