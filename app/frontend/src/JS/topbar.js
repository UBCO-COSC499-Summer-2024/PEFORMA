
function Topbar() { 
        return(
            <div className="topbar" onClick={() => console.log('Logout')}>
                <div className="logout">
                    Logout
                </div>
            </div>
        );
    }
export default Topbar;