import { FaHome, FaSmile } from 'react-icons/fa';

function Sidebar() { 
    return(
      <aside className="sidebar">
      <h2>PEFORMA</h2>
      <hr className="divider" />
      <ul className="menu">
        <li><a href="#"><FaHome className="icon" size={30} /> Dashboard</a></li>
        <li><a href="#"><FaSmile className="icon" size={30} /> Performance</a></li>
      </ul>
    </aside>
    );
}
export default Sidebar;