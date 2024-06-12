import { FaHome, FaUser, FaSuitcase, FaPaperclip, FaBook, FaChartLine} from 'react-icons/fa';


function Sidebar() { 
    return(
      <aside className="sidebar">
      <h2>PEFORMA</h2>
      <hr className="divider" />
      <ul className="menu">
        <li><a href="#"><FaHome className="icon" size={30} /> Dashboard</a></li>
        <li><a href="#"><FaUser className="icon" size={30} /> People</a></li>
        <li><a href="#"><FaSuitcase className="icon" size={30} /> Service Roles</a></li>
        <li><a href="#"><FaPaperclip className="icon" size={30} /> Data Entry</a></li>
        <li><a href="#"><FaBook className="icon" size={30} /> Course</a></li>
        <li><a href="#"><FaChartLine className="icon" size={30} /> Performance</a></li>
      </ul>
    </aside>
    );
}
export default Sidebar;