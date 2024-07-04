import { FaHome, FaUser, FaSuitcase, FaPaperclip, FaBook, FaChartLine} from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

function Sidebar() { 
  const { profileId } = useAuth();
    return(
      <aside className="sidebar">
      <h2>PEFORMA</h2>
      <hr className="divider" />
      <ul className="menu">
        <li><Link to={`http://localhost:3000/DeptDashboard?profileId=${profileId}`}><FaHome className="icon" size={30} /> Dashboard</Link></li>
        <li><Link to={``}><FaUser className="icon" size={30} /> People</Link></li>
        <li><Link to={`http://localhost:3000/ServiceRoleList?profileId=${profileId}`}><FaSuitcase className="icon" size={30} /> Service Roles</Link></li>
        <li><Link to={`http://localhost:3000/DataEntry`}><FaPaperclip className="icon" size={30} /> Data Entry</Link></li>
        <li><Link to={`http://localhost:3000/DeptCourseList?profileId=${profileId}`}><FaBook className="icon" size={30} /> Course</Link></li>
        <li><Link to={`http://localhost:3000/PerformanceDepartmentPage?profileId=${profileId}`}><FaChartLine className="icon" size={30} /> Performance</Link></li>
      </ul>
    </aside>
    );
}
export default Sidebar;