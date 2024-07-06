import { FaHome, FaChartLine } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

function Sidebar() {
	const { profileId } = useAuth();
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
}
export default Sidebar;
//
