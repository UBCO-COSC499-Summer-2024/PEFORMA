import { FaHome, FaSmile, FaChartLine} from 'react-icons/fa';

function Sidebar() { 
    return(
      <aside className="sidebar">
      <h2>PEFORMA</h2>
      <hr className="divider" />
      <ul className="menu">
        <li><a href="http://localhost:3000/Dashboard"><FaHome className="icon" size={30} /> Dashboard</a></li>
        <li><a href="http://localhost:3000/PerformanceInstructorPage"><FaChartLine className="icon" size={30} /> Performance</a></li>
      </ul>
    </aside>
    );
}
export default Sidebar;