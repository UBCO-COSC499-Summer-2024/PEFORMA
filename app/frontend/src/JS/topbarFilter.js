function TopSearchBarIns({ onSearch }) { 
        return(
            <header className="topbar-search">
                <input type="text" placeholder="Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I), Instructor (e.g. John Doe)" onChange={e => onSearch(e.target.value)} />
                <div className="logout">Logout</div>
            </header>
        );
    }

function TopSearchBarDept({ onSearch }) {
    return (
        <div className="topbar-search">
        <input type="text" placeholder="Search by Subject (e.g. COSC 111), Title (e.g. Computer Programming I)" onChange={e => onSearch(e.target.value)} />
        <div className="logout">Logout</div>

        </div>
    );
}
export {TopSearchBarIns, TopSearchBarDept};