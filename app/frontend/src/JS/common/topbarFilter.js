import { useNavigate } from 'react-router-dom';

function TopSearchBar({ onSearch, searchListType }) { 
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('profileId');
        localStorage.removeItem('accountType');
        alert('Log out successfully.\n\nRedirecting to Home Page.');
        navigate('/');
    }

    let placeHolderText = "";
    switch (searchListType) {
        case "InsCourseList":
            placeHolderText = "Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I), Instructor (e.g. John Doe)";
            break;
        case "DeptCourseList":
            placeHolderText = "Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I)";
            break;
        case "DeptMemberList":
            placeHolderText = "Search by Name (e.g. John Doe), Service Role (e.g. Advisor)";
            break;
        default:
            placeHolderText = "Search ..."
    }

    return(
        <div className="topbar-search">
            <input type="text" placeholder={placeHolderText} onChange={e => onSearch(e.target.value)} />
            <div className="logout" onClick={handleLogOut}>Logout</div>
        </div>
    );
}
export default TopSearchBar;