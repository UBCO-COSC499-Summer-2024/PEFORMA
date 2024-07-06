import { FaHome, FaUser, FaSuitcase, FaPaperclip, FaBook, FaChartLine} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Sidebar() { 
    return(
      <aside className="sidebar">
      <h2>PEFORMA</h2>
      <hr className="divider" />
      <ul className="menu">
        <li><Link to={`/DeptDashboard`}><FaHome className="icon" size={30} /> Dashboard</Link></li>
        <li><Link to={`/DeptMemberList`}><FaUser className="icon" size={30} /> People</Link></li>
        <li><Link to={`/DeptServiceRoleList`}><FaSuitcase className="icon" size={30} /> Service Roles</Link></li>
        <li><Link to={`/DeptDataEntry`}><FaPaperclip className="icon" size={30} /> Data Entry</Link></li>
        <li><Link to={`/DeptCourseList`}><FaBook className="icon" size={30} /> Course</Link></li>
        <li><Link to={`/DeptPerformancePage`}><FaChartLine className="icon" size={30} /> Performance</Link></li>
      </ul>
    </aside>
    );
}
export default Sidebar;