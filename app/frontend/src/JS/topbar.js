import { useNavigate } from 'react-router-dom';
function Topbar() { 
    /*
    let navigate = useNavigate();
    const redirect = () => {
        navigate("/HomePage");
    }
    */
        return(
            <div className="topbar" /*onClick={redirect}*/>
                <div className="logout">
                    Logout
                </div>
            </div>
        );
    }
export default Topbar;