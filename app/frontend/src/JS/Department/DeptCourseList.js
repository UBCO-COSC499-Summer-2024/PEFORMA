import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import {CreateSidebarDept, CreateTopSearchBarDept } from '../commonImports.js';
import '../../CSS/Department/DeptCourseList.css';
import { Link, useNavigate } from 'react-router-dom';
import '../common/divisions.js';
import axios from 'axios';
import '../AuthContext.js';
import { useAuth } from '../AuthContext.js';

function DeptCourseList() {

  const { authToken } = useAuth();
  const navigate = useNavigate();

  const [deptCourseList, setDeptCourseList] = useState({"courses":[{}], coursesCount:0, perPage: 10, currentPage: 1});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        if (!authToken) {
          // Redirect to login if no token
          navigate('/Login'); // Use your navigation mechanism
          return;
        }

        // Fetch course data with Axios, adding token to header
        const res = await axios.get(`http://localhost:3001/api/all-courses`, {
          headers: { Authorization: `Bearer ${authToken.token}` } 
        });
        const data = res.data;
        const filledCourses = fillEmptyCourses(data.courses, data.perPage);
        setDeptCourseList({ ...data, courses: filledCourses });
      } catch (error) {
        // Handle 401 (Unauthorized) error and other errors
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken'); // Clear invalid token
          navigate('/Login'); 
        } else {
          console.error('Error fetching service roles:', error);
        }
      }
    };

    fetchAllCourses();
  }, [authToken]);

  const filteredCourses = deptCourseList.courses.filter(course =>
    (course.courseCode?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    (course.title?.toLowerCase() ?? "").includes(search.toLowerCase())
  );

  const currentCourses = filteredCourses.slice(
    (deptCourseList.currentPage - 1) * deptCourseList.perPage,
    deptCourseList.currentPage * deptCourseList.perPage
  );

  const fillEmptyCourses = (courses, perPage) => {
    const filledCourses = [...courses];
    const currentCount = courses.length;
    const fillCount = perPage - (currentCount % perPage);
    if (fillCount < perPage) {
      for (let i  = 0; i < fillCount; i++) {
        filledCourses.push({});
      }
    }
    return filledCourses;
  }
  const handleSearchChange = (newSearch) => {
    console.log("Searched:", newSearch);
    setSearch(newSearch);
    setDeptCourseList(prevState => ({ ...prevState, currentPage: 1 }));
  };

  const handlePageClick = (data) => {
    setDeptCourseList(prevState => ({
      ...prevState,
      currentPage: data.selected + 1
    }));
  };
  

  const pageCount = Math.ceil(deptCourseList.coursesCount / deptCourseList.perPage);

  return (

    <div className="dashboard">  
    <CreateSidebarDept />
    <div className='container'>
      <CreateTopSearchBarDept onSearch={handleSearchChange}/>

      <div className='main' id='dept-course-list-test-content'>

        <div className='subtitle-course'>List of Course Lists ({deptCourseList.coursesCount} Active) </div>

        <div className="dcourse-table">
          <table>

            <thead>
              <tr>
                <th>Course</th>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
            {currentCourses.map(course => {
                return (
                  <tr key={course.id}>
                    <td><Link to={`http://localhost:3000/CourseInformation?courseid=${(course.id)}`}>{course.courseCode}</Link></td>
                    <td>{course.title}</td>
                    <td>{course.description}</td>
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
                forcePage={deptCourseList.currentPage - 1} 
              />
            </tfoot>

          </table>
        </div>

      </div>
    </div>
  </div>
  );
}

export default DeptCourseList;