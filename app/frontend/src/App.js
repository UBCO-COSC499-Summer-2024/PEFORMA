//import logo from './logo.svg';
//import './App.css';

import React from "react";
import HomePage from "./HomePage";
import Login from "./Login";
import ForgotPasswordPage from './ForgotPasswordPage';
import Dashboard from './Dashboard';
import CourseList from './CourseList';
import EditProfile from "./EditProfile";
import UserProfile from "./UserProfile";
import PerformancePage from "./PerformancePage";
import CourseHistory from "./CourseHistory";
import { BrowserRouter ,Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div><HomePage/></div>
  );
}

export default App;
