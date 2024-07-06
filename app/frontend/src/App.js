import React from 'react';
//Admin
import CreateAccount from './JS/Admin/CreateAccount';

//All
import HomePage from './JS/All/HomePage';
import Login from './JS/All/Login';
import ForgotPasswordPage from './JS/All/ForgotPasswordPage';

//Instructor
import Dashboard from './JS/Instructor/InsDashboard';
import CourseList from './JS/Instructor/InsCourseList';
import EditProfile from './JS/Instructor/InsEditProfile';
import PerformanceInstructorPage from './JS/Instructor/PerformanceInstructorPage';
import CourseHistory from './JS/Instructor/InsCourseHistory';
import InstructorProfilePage from './JS/Instructor/InsProfilePage';

//Department
import PerformanceDepartmentPage from './JS/Department/DeptPerformancetPage';
import DeptDashboard from './JS/Department/DeptDashboard';
import DeptMemberList from './JS/Department/DeptMemberList';
import DeptCourseList from './JS/Department/DeptCourseList';
import ServiceRoleList from './JS/Department/DeptServiceRoleList';
import DataEntry from './JS/Department/DataEntry';
import RoleInformation from './JS/Department/RoleInformation';
import CourseInformation from './JS/Department/CourseInformation';

//
import ServiceRoleManagement from './JS/Department/DeptServiceRoleManagement';
import { AuthProvider } from './JS/common/AuthContext';
import PrivateRoute from './JS/PrivateRoute';

import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/HomePage" element={<HomePage />} />
					<Route path="/Login" element={<Login />} />
					<Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />

					<Route
						path="/Dashboard"
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route path="/CourseList" element={<CourseList />} />
					<Route path="/EditProfile" element={<EditProfile />} />
					<Route path="/PerformanceInstructorPage" element={<PerformanceInstructorPage />} />
					<Route path="/InstructorProfilePage" element={<InstructorProfilePage />} />
					<Route path="/CourseHistory" element={<CourseHistory />} />
					<Route path="/DataEntry" element={<DataEntry />} />
					<Route path="/ServiceRoleManagement" element={<ServiceRoleManagement />} />

					<Route path="/CreateAccount" element={<CreateAccount />} />

					<Route path="/DeptMemberList" element={<DeptMemberList />} />

					<Route path="/CreateAccount" element={<CreateAccount />} />
					<Route path="/DeptCourseList" element={<DeptCourseList />} />
					<Route path="/ServiceRoleList" element={<ServiceRoleList />} />
					<Route path="/DeptDashboard" element={<DeptDashboard />} />

					<Route path="/ServiceRoleList" element={<ServiceRoleList />} />
					<Route path="/RoleInformation" element={<RoleInformation />} />

					<Route path="/DeptCourseList" element={<DeptCourseList />} />
					<Route path="/CourseInformation" element={<CourseInformation />} />
					<Route path="/PerformanceDepartmentPage" element={<PerformanceDepartmentPage />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
