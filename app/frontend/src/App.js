import React from 'react';
//Admin
import AdminCreateAccount from './JS/Admin/AdminCreateAccount';
import AdminMemberList from './JS/Admin/AdminMemberList';
import AdminStatusChangeMember from './JS/Admin/AdminStatusChangeMember';

//All
import HomePage from './JS/All/HomePage';
import Login from './JS/All/Login';
import ForgotPasswordPage from './JS/All/ForgotPasswordPage';

//Instructor
import InsDashboard from './JS/Instructor/InsDashboard';
import InsCourseList from './JS/Instructor/InsCourseList';
import InsEditProfile from './JS/Instructor/InsEditProfile';
import InsPerformancePage from './JS/Instructor/InsPerformancePage';
import InsCourseHistory from './JS/Instructor/InsCourseHistory';
import InsProfilePage from './JS/Instructor/InsProfilePage';
import InsRoleInformation from './JS/Instructor/InsRoleInformation';

//Department
import DeptPerformancePage from './JS/Department/DeptPerformancePage';
import DeptDashboard from './JS/Department/DeptDashboard';
import DeptMemberList from './JS/Department/DeptMemberList';
import DeptCourseList from './JS/Department/DeptCourseList';
import DeptServiceRoleList from './JS/Department/DeptServiceRoleList';
import DeptDataEntry from './JS/Department/DeptDataEntry';
import DeptRoleInformation from './JS/Department/DeptRoleInformation';
import DeptCourseInformation from './JS/Department/DeptCourseInformation';
import DeptProfilePage from './JS/Department/DeptProfilePage';
import DeptStatusChangeServiceRole from './JS/Department/DeptStatusChangeServiceRole';
import DeptTeachingAssignment from './JS/Department/DeptTeachingAssignment';
import DeptTeachingAssignmentDetail from './JS/Department/DeptTeachingAssignmentDetail';
import DeptStatusChangeCourse from './JS/Department/DeptStatusChangeCourse';

//
import DeptServiceRoleManagement from './JS/Department/DeptServiceRoleManagement';
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
						path="/InsDashboard"
						element={
							<PrivateRoute>
								<InsDashboard />
							</PrivateRoute>
						}
					/>
					<Route path="/InsCourseList" element={<InsCourseList />} />
					<Route path="/InsEditProfile" element={<InsEditProfile />} />
					<Route path="/InsPerformancePage" element={<InsPerformancePage />} />
					<Route path="/InsProfilePage" element={<InsProfilePage />} />
					<Route path="/InsCourseHistory" element={<InsCourseHistory />} />
					<Route path="/InsRoleInformation" element={<InsRoleInformation />} />
					<Route path="/DeptDataEntry" element={<DeptDataEntry />} />
					<Route path="/DeptServiceRoleList" element={<DeptServiceRoleList />} />

					<Route path="/DeptMemberList" element={<DeptMemberList />} />
          <Route path="/DeptProfilePage" element={<DeptProfilePage />} />


					<Route path="/AdminCreateAccount" element={<AdminCreateAccount />} />
					<Route path="/DeptCourseList" element={<DeptCourseList />} />
					<Route path="/DeptServiceRoleList" element={<DeptServiceRoleList />} />
					<Route path="/DeptDashboard" element={<DeptDashboard />} />

					<Route path="/DeptServiceRoleManagement" element={<DeptServiceRoleManagement />} />
					<Route path="/DeptRoleInformation" element={<DeptRoleInformation />} />

					<Route path="/DeptCourseList" element={<DeptCourseList />} />
					<Route path="/DeptCourseInformation" element={<DeptCourseInformation />} />
					<Route path="/DeptPerformancePage" element={<DeptPerformancePage />} />
					<Route path="/DeptStatusChangeServiceRole" element={<DeptStatusChangeServiceRole />} />
					<Route path="/DeptStatusChangeCourse" element={<DeptStatusChangeCourse />} />

					

					<Route path="/AdminMemberList" element={<AdminMemberList />} />
					<Route path="/AdminStatusChangeMember" element={<AdminStatusChangeMember />} />
					<Route path="/DeptTeachingAssignment" element={<DeptTeachingAssignment />} />
					<Route path="/DeptTeachingAssignmentDetail" element={<DeptTeachingAssignmentDetail />} />

				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
