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
  console.log("divi: "+params);
  console.log("divi: "+params.get('division'));

  const navigate = useNavigate();
  const divisionHandler = (e) => {
    console.log("e.target.value:" + e.target.value);
    navigate("?division=" + e.target.value);
  };
  


  const [divisionData, setDivisionData] = useState({"courses":[{}], divisionCoursesCount:0, perPage: 10});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const divisionCode = params.get('division');
    console.log("divisionCode :" + divisionCode);
    const fetchData = async() => {
      console.log("divisionCode: "+divisionCode);
      let url;
      switch (divisionCode) { //must be replace to API sent by be, its mock up data 
        // data format is under pulbic path
        case "COSC" :
          url = 'http://localhost:3000/divisionCosc.json';
          break;
        case "MATH" :
          url = 'http://localhost:3000/divisionMath.json';
          break;
        case "PHYS" :
          url = 'http://localhost:3000/divisionPhys.json';
          break;
        case "STAT" :
          url = 'http://localhost:3000/divisionStat.json';
          break;
        default:
          url = 'http://localhost:3000/divisionCosc.json';
      }
      const res = await axios.get(url);
      return res.data;
    }

    fetchData().then(res => setDivisionData(res));
  }, [divisionCode]);

  const handlePageClick = (data) => {
    console.log(`User requested page number ${data.selected + 1}`);
    // logic of controlling slect & jump below
    // ......

    // const division = (reactDom.)division

    // request divisionData api with division, currPage, perPage
    // response => divsion, currPage, perPage, divisionCoursesCount, courses, ..
    // setDevisionData(responseJson)

  };

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
          previousLabel={'< Previous'}
          nextLabel={'Next >'}
          breakLabel={'...'}
          pageCount={pageCount}
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