import { useNavigate } from 'react-router-dom';

// Instructor course list
function TopSearchBarIns({ onSearch }) { 
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token');
        alert('Log out successfully.\n\nRedirecting to Home Page.');
        navigate('/');
    }
    return(
        <div className="topbar-search">
            <input type="text" placeholder="Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I), Instructor (e.g. John Doe)" onChange={e => onSearch(e.target.value)} />
            <div className="logout" onClick={handleLogOut}>Logout</div>
        </div>
    );
}

// Department course list
function TopSearchBarDept({ onSearch }) {
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token');
        alert('Log out successfully.\n\nRedirecting to Home Page.');
        navigate('/');
    }
    return (
        <div className="topbar-search">
            <input type="text" placeholder="Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I)" onChange={e => onSearch(e.target.value)} />
            <div className="logout" onClick={handleLogOut}>Logout</div>
        </div>
    );
}

// Instructor member list
function TopSearchBarMemberList({ onSearch }) {
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token');
        alert('Log out successfully.\n\nRedirecting to Home Page.');
        navigate('/');
    }
    return (
        <div className="topbar-search">
            <input type="text" placeholder="Search by Name (e.g. John Doe), Service Role (e.g. Advisor)" onChange={e => onSearch(e.target.value)} />
            <div className="logout" onClick={handleLogOut}>Logout</div>
        </div>
    );
}
export {TopSearchBarIns, TopSearchBarDept, TopSearchBarMemberList};