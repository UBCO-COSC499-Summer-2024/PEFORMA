import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import CreateSidebar, { CreateTopBarFilter } from '../commonImports.js';
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
  


  const [divisionData, setDivisionData] = useState({"courses":[{}]});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const divisionCode = params.get('division');
    console.log("divisionCode :" + divisionCode);
    const fetchData = async() => {
      const url = divisionCode != 'MATH' ? 'http://localhost:3000/divisionCosc.json' : 'http://localhost:3000/divisionMath.json';
      const res = await axios.get(url); //replace it to api
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

  return (

    <div className="dashboard">
      
     <CreateSidebar />
      <div className='container'>
      {/* <CreateTopBarFilter /> */}
      <div className="main-content">
      
        
        
        <header className='ListTitle'>List of Courses ({divisionData.divisionLabel})</header>
        {divisionCode}
        <select name="divisionCode" defaultValue={divisionCode} onChange={divisionHandler}>
        {/* <select name="divisionCode" value={divisionCode} onChange={divisionHandler}> */}
          {divisions.map(division => { 
            return <option value={division.code}>{division.label}</option>
            })}
        </select>


        {/* {divisionData.division} */}
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
                <td>{course.id}\</td>
                <td>{course.title}</td>
                <td><img src='temp.png' className='instructor-img'/>
                  <Link to={'http://localhost:3000/InstructorProfilePage?ubcid='+course.ubcid}>{course.instructor}</Link>
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