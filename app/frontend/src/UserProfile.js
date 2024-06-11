import React , {useState} from 'react';
import { useNavigate } from 'react-router-dom'; 
import './UserProfile.css'; // Importing CSS specific to the UserProfile


function Sidebar() {
  return (
    <aside className="sidebar">
    <div className='sidebar-header'>
      <h1>PERFORMA</h1>
      <hr/>
    </div>
      <nav>
        <a href="#dashboard">Dashboard</a>
        <a href="#people">People</a>
        <a href="#ServiceRole">#Service Role</a>
        <a href="#DataEntry">#Data Entry</a>
        <a href="#Course">Course</a>
        <a href="#Performance">Performance</a>
      </nav>
    </aside>
  );
}

function SectionInfo() {
    return (
        <div className='section-info-container'>  
            <section className="member-info">
                <h2>Member name</h2>
                <p>Olivia Rhye</p>
                <h2>Course Assignment</h2>
                <p>COSC 111, COSC 222</p>
                <h2>Phone Number</h2>
                <p>250-123-1234</p>
                <h2>Office Location</h2>
                <p>Alaska</p>
            </section>
            <section className="service-details">
                <h2>Service Role
                    <select>
                        <option value="role1">Role 1</option>
                        <option value="role2">Role 2</option>
                    </select>
                </h2>
                <h2>Working Hours
                    <select>
                        <option value='--?--'>select month</option>
                        <option value='01'>01</option>
                        {/* Other options */}
                    </select>
                    <select>
                        <option value='--?--'>select year</option>
                        <option value='2023'>2023</option>
                        {/* Other options */}
                    </select>
                </h2>
                <h2>Performance Score</h2>
                <p>79.2</p>
                
                <div className="performance-buttons">
                    <button>All</button>
                    <button>Math</button>
                    <button>Physics</button>
                    <button>Stats</button>
                </div>
                
                <div className="performance-graph">
                    <p>Graph Area (Placeholder)</p>
                </div>
            </section>
        </div>
    );
}

function UserProfile() {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
    return (
    <div className="user-profile-container">
       <Sidebar/>
      <div className="user-profile">
        <header className='web-head'>
          <img className='HeadImg'src='temp.png' alt=''/>
          <button onClick={()   => {console.log('Logout');
                                    navigate('/HomePage')}}>
          Logout</button>
        </header>
        <div className="header">
          <img className='BigImg' src="temp.png" alt="Olivia Rhye" />
          <div className="user-details">
            <h1>Olivia Rhye</h1>
            <p>olivia@instructor.ubc.ca</p>
            <p>UBC ID: 12341234</p>
          </div>
          {editMode ? (
            <div>
              <button onClick={toggleEditMode}>Apply</button>
              <button onClick={toggleEditMode}>Cancel</button>
            </div>
          ) : (
            <button onClick={toggleEditMode} className="edit-button">Edit</button>
          )}
        </div>
        <div className="profile-details">
        {editMode?(<EditInfo/>) 
        :(<SectionInfo/>)}
        </div>
      </div>
    </div>
  );
}

function EditInfo() {
    const [name,setname] = useState('');
    const [showDetails, setShowDetails] = useState(false); // State to toggle details visibility
    const [isCourseModalOpen, setCourseModalOpen] = useState(false);
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };
    const toggleCourseModal = () => {
        setCourseModalOpen(!isCourseModalOpen); // Toggle the visibility of the modal
    };
    const toggleRoleModal = () => {
        setRoleModalOpen(!isRoleModalOpen); // Toggle the visibility of the modal
    };

    return (
        <div className='editinfo-container'>
            <section className="member-info-edit">
                <h2>Member name</h2>
                <input type='name' value={setname} placeholder='Enter Name'/>
                <h2>Course Assignment
                    <button onClick={toggleCourseModal}>AssignCourse(s)</button>
                    <CourseModal isOpen={isCourseModalOpen} onClose={toggleCourseModal} />
                </h2>
            </section>
            <section className='service-details-edit' style={{flex: 1}}>
                <h2>Service Role</h2>
                <button onClick={toggleRoleModal}>Toggle Service Roles</button>
                <ServiceRoleModal isOpen={isRoleModalOpen} onClose={toggleRoleModal}/>
                {showDetails && (
                    <div>
                        <div>Current Service Roles:</div>
                        <div>Undergrad Advisor : 14 hours</div>
                        <div>Janitor : 1000 hours</div>
                        <div>Sum : 1014 hours</div>
                    </div>
                )}
            </section>
        </div>
    );
}

function CourseModal({ isOpen, onClose }) {
    const itemsPerPage = 5; // Adjust this number based on your preference
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [courses, setCourses] = useState([
        { id: 1, name: "COSC 101", added: false },
        { id: 2, name: "COSC 111", added: false },
        { id: 3, name: "COSC 121", added: false },
        { id: 4, name: "COSC 123", added: false },
        { id: 5, name: "COSC 210", added: false },
        { id: 6, name: "COSC 221", added: false },
        { id: 7, name: "COSC 222", added: true }
    ]);

    // Toggle the added state for a specific course
    const toggleCourseAdded = id => {
        const updatedCourses = courses.map(course =>
            course.id === id ? { ...course, added: !course.added } : course
        );
        setCourses(updatedCourses);
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < pageCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Assign Courses (CS)</h2>
                <input 
                    type="text" 
                    placeholder="Search for course name" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="course-list">
                    {currentItems.map(course => (
                        <div className="course-item" key={course.id}>
                            <span>{course.name}</span>
                            <button 
                                onClick={() => toggleCourseAdded(course.id)}
                                className={course.added ? 'remove-button' : 'add-button'}>
                                {course.added ? 'Remove' : 'Add'}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {pageCount}</span>
                    <button onClick={handleNextPage} disabled={currentPage === pageCount}>Next</button>
                </div>
                <button className="save-button" onClick={onClose}>Save</button>
            </div>
        </div>
    );
}


function ServiceRoleModal({ isOpen, onClose }) {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roles, setRoles] = useState([
        { id: 1, name: "Undergrad Advisor (COSC)", added: false },
        { id: 2, name: "Overgrad Advisor (STAT)", added: true },
        { id: 3, name: "Betweengrad Advisor (MATH)", added: false },
        { id: 4, name: "Janitor (PHYS)", added: false },
        { id: 5, name: "Janitor (STAT)", added: false },
        { id: 6, name: "Janitor (COSC)", added: false },
        { id: 7, name: "Janitor (MATH)", added: true }
    ]);

    const toggleRoleAdded = id => {
        const updatedRoles = roles.map(role =>
            role.id === id ? { ...role, added: !role.added } : role
        );
        setRoles(updatedRoles);
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pageCount = Math.ceil(filteredRoles.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < pageCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Assign Service Roles</h2>
                <input 
                    type="text" 
                    placeholder="Search for service role" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="role-list">
                    {currentItems.map(role => (
                        <div className="role-item" key={role.id}>
                            <span>{role.name}</span>
                            <button 
                                onClick={() => toggleRoleAdded(role.id)}
                                className={role.added ? 'remove-button' : 'add-button'}>
                                {role.added ? 'Remove' : 'Add'}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {pageCount}</span>
                    <button onClick={handleNextPage} disabled={currentPage === pageCount}>Next</button>
                </div>
                <button className="save-button" onClick={onClose}>Save</button>
            </div>
        </div>
    );
}

export default UserProfile;
