import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import CreateSidebar, { CreateTopbar } from '../commonImports.js';
import '../../CSS/Instructor/CourseList.css';



function CourseList() {
  const [courses, setCourses] = useState([
    { id: "COSC 101", title: "Digital Citizenship", instructor: "Chris Rye", email: "chris@example.com" },
    { id: "COSC 111", title: "Computer Programming I", instructor: "Phoenix Baker", email: "phoenix@example.com" },
    // sample course showing only, change by data import
  ]);

  const handlePageClick = (data) => {
    console.log(`User requested page number ${data.selected + 1}`);
    // logic of controlling slect & jump below
    // ......
  };
  
  return (

    <div className="dashboard">
      
     <CreateSidebar />
      <div className='container'>
      <CreateTopbar />
      <div className="main-content">
      
        <header className="web-head">
          <input type="search" placeholder="Search by Subject (e.g. COSC123) or Instructor name (e.g. Chipinski)" />
          <img src='temp.png' alt=''/>
          
        </header>
        <header className='ListTitle'>List of Courses (Computer Science)</header>
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
              {courses.map(course => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.title}</td>
                  <td><img src='temp.png' className='instructor-img'/>{course.instructor} ({course.email})</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
            <tr>
              <td colSpan={3}>
            <ReactPaginate
          previousLabel={'< Previous'}
          nextLabel={'Next >'}
          breakLabel={'...'}
          pageCount={10}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
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