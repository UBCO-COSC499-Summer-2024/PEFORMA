import React from "react";
import HomePage from "./JS/All/HomePage";
import Login from "./JS/All/Login";
import ForgotPasswordPage from './JS/All/ForgotPasswordPage';
import Dashboard from './JS/Instructor/Dashboard';
import CourseList from './JS/Instructor/CourseList';
import EditProfile from "./JS/Instructor/EditProfile";
import UserProfile from "./JS/Instructor/UserProfile";
//import PerformancePage from "./PerformancePage";
//import CourseHistory from "./CourseHistory";
import { BrowserRouter ,Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/CourseList" element={<CourseList />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/UserProfile" element={<UserProfile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

