import React from "react";
import HomePage from "./JS/All/HomePage";
import Login from "./JS/All/Login";
import ForgotPasswordPage from './JS/All/ForgotPasswordPage';
import Dashboard from './JS/Instructor/Dashboard';
import CourseList from './JS/Instructor/CourseList';
import EditProfile from "./JS/Instructor/EditProfile";
import PerformanceInstructorPage from "./JS/Instructor/PerformanceInstructorPage";
import CourseHistory from "./JS/Instructor/CourseHistory";
import InstructorProfilePage from "./JS/Instructor/InstructorProfilePage";
import DataEntry from "./JS/Department/DataEntry";
import CreateAccount from "./JS/Admin/CreateAccount";
import DeptCourseList from "./JS/Department/DeptCourseList";
import ServiceRoleList from "./JS/Department/ServiceRoleList";

import { AuthProvider } from './JS/AuthContext';
import PrivateRoute from './JS/PrivateRoute';
import RoleInformation from './JS/Department/RoleInformation';
import CourseInformation from "./JS/Department/CourseInformation";
import PerformanceDepartmentPage from "./JS/Department/PerformanceDepartmentPage";



import { BrowserRouter ,Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider><Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
        <Route path="/Dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/CourseList" element={<CourseList />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/PerformanceInstructorPage" element={<PerformanceInstructorPage />} />
        <Route path="/InstructorProfilePage" element={<InstructorProfilePage />} />
        <Route path="/CourseHistory" element={<CourseHistory />} />
        <Route path="/DataEntry" element={<DataEntry />} />
        <Route path="/ServiceRoleManagement" element={<ServiceRoleManagement />} />

        <Route path="/CreateAccount" element={<CreateAccount />} />

        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/DeptCourseList" element={<DeptCourseList />} />
        <Route path="/ServiceRoleList" element={<ServiceRoleList />} />


        <Route path="/ServiceRoleList" element={<ServiceRoleList />} />
        <Route path="/RoleInformation" element={<RoleInformation />} />

        <Route path="/DeptCourseList" element={<DeptCourseList />} />
        <Route path="/CourseInformation" element={<CourseInformation />} />
        <Route path="/PerformanceDepartmentPage" element={<PerformanceDepartmentPage />} />
          
      </Routes></AuthProvider>
    </BrowserRouter>
  
  );
}

export default App;

