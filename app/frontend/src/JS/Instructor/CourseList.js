import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';
import '../../CSS/Instructor/CourseList.css';
import { Link, useNavigate } from 'react-router-dom';
import '../common/divisions.js';
import divisions from '../common/divisions.js';
import axios from 'axios';
import '../AuthContext.js';
import { useAuth } from '../AuthContext.js';

function showCourses (divisionData, offset){
  if (divisionData.divisionCoursesCount > 10) {
    return divisionData.courses.slice(offset, offset + divisionData.perPage);
  }
  return divisionData.courses;
}

function CourseList() {

  const { authToken } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const divisionCode = params.get('division');

  const navigate = useNavigate();
  const divisionHandler = (e) => {
    navigate("?division=" + e.target.value);
  };
  
  const [divisionData, setDivisionData] = useState({"courses":[{}], divisionCoursesCount:0, perPage: 10, currentPage: 1});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!authToken) {
          // Redirect to login if no token
          navigate('/Login'); // Use your navigation mechanism
          return;
        }

        // Fetch course data with Axios, adding token to header
        const res = await axios.get(`http://localhost:3001/api/courses?division=${divisionCode}`, {
          headers: { Authorization: `Bearer ${authToken.token}` } 
        });
        setDivisionData(res.data);
      } catch (error) {
        // Handle 401 (Unauthorized) error and other errors
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken'); // Clear invalid token
          navigate('/Login'); 
        } else {
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCourses();
  }, [authToken, divisionCode]); 

  const handlePageClick = (data) => {
    setDivisionData(prevState => ({
      ...prevState, 
      currentPage: data.selected + 1
    }))
  };
  
  const offset = (divisionData.currentPage - 1) * divisionData.perPage; //0,10,20
  const currentCourses = showCourses(divisionData, offset);
  const pageCount = Math.ceil(divisionData.divisionCoursesCount / divisionData.perPage);

  return (

    <div className="dashboard">  
    <CreateSidebar />
    <div className='container'>
      <CreateTopbar />

      <div className="main">

        <header className='ListTitle'>
          <div className='ListTitle-text'>List of Courses</div>
          <select name="divisionCode" defaultValue={divisionCode} onChange={divisionHandler}>
            {divisions.map(division => { 
              return <option value={division.code}>{division.label}</option>
              })}
          </select>
        </header>
        
        <div className="course-table">
          <table>

            <thead>
              <tr>
                <th>Course</th>
                <th>Title</th>
                <th>Instructor</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              
              {currentCourses.map(course => {
                return (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.title}</td>
                    <td>
                      {Array.isArray(course.instructor) ? course.instructor.map((instructor, index) => (
                        <React.Fragment key={course.ubcid[index]}>
                          <Link to={`http://localhost:3000/InstructorProfilePage?ubcid=${course.ubcid[index]}`}>
                            {instructor} 
                          </Link>
                          {index < course.instructor.length - 1 ? <><br/><br/></> : null}
                        </React.Fragment>
                      )):
                      <Link to={`http://localhost:3000/InstructorProfilePage?ubcid=${course.ubcid}`}>
                        {course.instructor}<br/>({course.email})
                      </Link>
                      }
                    </td>

                    <td>
                      {Array.isArray(course.email) ? course.email.map((email, index) =>
                        <React.Fragment key={index}>
                          {email}
                          {index < course.instructor.length - 1 ? <><br/><br/></> : null}
                        </React.Fragment>  
                    ) : course.email }
                    </td>
                  </tr>
                );
              })}
                            
            </tbody>

            <tfoot>
              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={3}
                pageRangeDisplayed={0}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
              />
            </tfoot>

          </table>
        </div>
      </div>
      </div>
    </div>
  );
}

export default CourseList;