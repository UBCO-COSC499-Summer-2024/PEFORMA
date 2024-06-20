import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import {CreateSidebarDept, CreateTopSearchBarDept } from '../commonImports.js';
import '../../CSS/Department/DeptCourseList.css';
import { Link, useNavigate } from 'react-router-dom';
import '../common/divisions.js';
import axios from 'axios';


function showCourses(deptCourseList, offset){
  if (deptCourseList.coursesCount > 10) {
    return deptCourseList.courses.slice(offset, offset + deptCourseList.perPage);
  }
  return deptCourseList.courses;
}

function DeptCourseList() {

  const [deptCourseList, setDeptCourseList] = useState({"courses":[{}], coursesCount:0, perPage: 10, currentPage: 1});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async() => {
      const url = "http://localhost:3000/deptCourseList.json";
      const res = await axios.get(url);
      const data = res.data;
      const filledCourses = fillEmptyCourses(data.courses, data.perPage);
      setDeptCourseList({ ...data, courses: filledCourses });
    }
    fetchData();
  }, []);

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


  const handlePageClick = (data) => {
    setDeptCourseList(prevState => ({
      ...prevState,
      currentPage: data.selected + 1
    }))
  };

  const pageCount = Math.ceil(deptCourseList.coursesCount / deptCourseList.perPage);
  const offset = (deptCourseList.currentPage - 1) * deptCourseList.perPage;
  const currentCourses = showCourses(deptCourseList, offset);

  return (

    <div className="dashboard">  
    <CreateSidebarDept />
    <div className='container'>
      <CreateTopSearchBarDept onSearch={setSearch}/>

      <div className='main'>

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