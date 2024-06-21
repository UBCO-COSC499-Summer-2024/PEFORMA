import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import CreateSidebar, { CreateTopSearchbarIns } from '../commonImports.js';
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
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const divisionCode = params.get('division');
    const fetchData = async() => {
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
        case "ALL" :
          url = 'http://localhost:3000/divisionAll.json';
          break;
        default:
          url = 'http://localhost:3000/divisionCosc.json';
      }
      const res = await axios.get(url);
      const data = res.data;
      const filledCourses = fillEmptyCourses(data.courses, data.perPage);
      setDivisionData({ ...data, courses: filledCourses});
    }
    fetchData();
  }, []);

  const handlePageClick = (data) => {
    setDivisionData(prevState => ({
      ...prevState, 
      currentPage: data.selected + 1
    }))
  };

  const handleSearchChange = (newSearch) => {
    console.log("Searched:", newSearch);
    setSearch(newSearch);
    setDivisionData(prevState => ({ ...prevState, currentPage: 1 }));
  };

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

  const pageCount = Math.ceil(divisionData.divisionCoursesCount / divisionData.perPage);

  const filteredCourses = divisionData.courses.filter(course =>
    (course.id?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    (course.title?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    (course.instructor && Array.isArray(course.instructor) && course.instructor.some(instructor => instructor.toLowerCase().includes(search.toLowerCase())))
  );

  const currentCourses = filteredCourses.slice(
    (divisionData.currentPage - 1) * divisionData.perPage,
    divisionData.currentPage * divisionData.perPage
  )

  return (

    <div className="dashboard">  
    <CreateSidebar />
    <div className='container'>
      <CreateTopSearchbarIns onSearch={handleSearchChange} />

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
                      {course.instructor ? (
                        Array.isArray(course.instructor) ? course.instructor.map((instructor, index) => (
                          <React.Fragment key={course.ubcid[index]}>
                            <Link to={`http://localhost:3000/InstructorProfilePage?ubcid=${course.ubcid[index]}`}>
                              {instructor}
                            </Link>
                            {index < course.instructor.length - 1 ? <><br/><br/></> : null}
                          </React.Fragment>
                        )) : (
                          <Link to={`http://localhost:3000/InstructorProfilePage?ubcid=${course.ubcid}`}>
                            {course.instructor}
                          </Link>
                        )
                      ) : ''}
                    </td>
                    <td>
                      {course.email ? (
                        Array.isArray(course.email) ? course.email.map((email, index) => (
                          <React.Fragment key={index}>
                            {email}
                            {index < course.email.length - 1 ? <><br/><br/></> : null}
                          </React.Fragment>
                        )) : course.email
                      ) : ''}
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