function TopSearchBarIns({ onSearch }) { 
        return(
            <header className="topbar-search">
                <input type="text" placeholder="Search by Subject (e.g. COSC123) or Instructor name (e.g. Chipinski)" />
                <img src='temp.png' alt=''/>
          
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