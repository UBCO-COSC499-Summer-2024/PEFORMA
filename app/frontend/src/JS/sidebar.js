
function Sidebar() { 
    return(
        <aside className="sidebar">
            <div className="sidebar-header">
              <h1>PEFORMA</h1>
              <hr />
            </div>
            <nav>
              <a href="#dashboard">Dashboard</a>
              <a href="#performance">Performance</a>
            </nav>
        </aside>
    );
}
export default Sidebar;