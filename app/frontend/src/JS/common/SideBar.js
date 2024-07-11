import { FaHome, FaChartLine } from 'react-icons/fa';
import { FaUser, FaSuitcase, FaPaperclip, FaBook } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

function SideBar({ sideBarType }) {
  const { profileId } = useAuth();
  if (sideBarType === 'Instructor') {
    return (
      <aside className="sidebar">
        <h2>PEFORMA</h2>
        <hr className="divider" />
        <ul className="menu">
          <li>
            <Link to={`/InsDashboard?`}>
              <FaHome className="icon" size={30} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to={`/InsPerformancePage?profileId=${profileId}`}>
              <FaChartLine className="icon" size={30} /> Performance
            </Link>
          </li>
        </ul>
      </aside>
    );
  } else if (sideBarType === 'Department') {
    return (
      <aside className="sidebar">
        <h2>PEFORMA</h2>
        <hr className="divider" />
        <ul className="menu">
          <li>
            <Link to={`/DeptDashboard`}>
              <FaHome className="icon" size={30} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to={`/DeptMemberList`}>
              <FaUser className="icon" size={30} /> Member
            </Link>
          </li>
          <li>
            <Link to={`/DeptServiceRoleList`}>
              <FaSuitcase className="icon" size={30} /> Service Roles
            </Link>
          </li>
          <li>
            <Link to={`/DeptCourseList`}>
              <FaBook className="icon" size={30} /> Course
            </Link>
          </li>
					<li>
						<Link to={`/DeptDataEntry`}>
							<FaPaperclip className="icon" size={30} /> Data Entry
						</Link>
					</li>
					<li>
						<Link to={`/DeptPerformancePage`}>
							<FaChartLine className="icon" size={30} /> Performance
						</Link>
					</li>
					<li>
						<Link to={`/DeptTeachingAssignment`}>
							<FaChartLine className="icon" size={30} /> Teaching Assignment
						</Link>
					</li>
        </ul>
      </aside>
    );
  } else {
		return (
      <aside className="sidebar">
        <h2>PEFORMA</h2>
        <hr className="divider" />
        <ul className="menu">
          <li>
            <Link to={`/AdminDashboard`}>
              <FaHome className="icon" size={30} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to={`/AdminMemberList`}>
              <FaUser className="icon" size={30} /> Account Management
            </Link>
          </li>
          <li>
            <Link to={`/AdminServiceRoleList`}>
              <FaSuitcase className="icon" size={30} /> Service Roles
            </Link>
          </li>
          <li>
            <Link to={`/AdminCourseList`}>
              <FaBook className="icon" size={30} /> Course
            </Link>
          </li>
					<li>
				<Link to={`/AdminCreateAccount`}>
					<FaChartLine className="icon" size={30} /> Create Account
				</Link>
			</li>
        </ul>
      </aside>
    );
	}
}

export default SideBar;
