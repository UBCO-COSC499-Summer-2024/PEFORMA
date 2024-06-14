import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';
import '../../CSS/Instructor/CourseList.css';
import { Link, useNavigate } from 'react-router-dom';
import '../common/divisions.js';
import divisions from '../common/divisions.js';
import axios from 'axios';

function CourseList() {

  const params = new URLSearchParams(window.location.search);
  const divisionCode = params.get('division');

  const navigate = useNavigate();
  const divisionHandler = (e) => {
    navigate("?division=" + e.target.value);
  };
  
  const [divisionData, setDivisionData] = useState({"courses":[{}], divisionCoursesCount:0, perPage: 10, currentPage: 1});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const divisionCode = params.get('division');

    fetch(`http://localhost:3001/api/courses?division=${divisionCode}`)
      .then(res => res.json())
      .then(data => setDivisionData(data))
      .catch(error => console.error('Error fetching courses:', error))
    }
  , [divisionCode]);

  const handlePageClick = (data) => {
    setDivisionData(prevState => ({
      ...prevState, 
      currentPage: data.selected + 1
    }))
  };
  
  console.log("division data slicing",divisionData.courses.slice(0,2));

  const offset = (divisionData.currentPage - 1) * divisionData.perPage; //0,10,20
  //const currentCourses = divisionData.courses.slice(offset, offset + divisionData.perPage); //0~9, 10~19, 20~29
  //const offfff = divisionData.courses.slice(0,1);
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
              </tr>
            </thead>
            <tbody>


            {divisionData.courses.map(course => {
              return <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.title}</td>
                <td><Link to={'http://localhost:3000/InstructorProfilePage?ubcid='+course.ubcid}>{course.instructor}</Link>
                  <br/>({course.email})</td>
              </tr>;
            })}
            </tbody>
            <tfoot>
            <tr>
              <td colSpan={3}>
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
        </td>
        </tr>
        </tfoot>
          </table>
        
        </div>
      </div>
      </div>
    </div>
  );
}

export default CourseList;