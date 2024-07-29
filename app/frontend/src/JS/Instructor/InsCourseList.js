import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import divisions from '../common/divisions.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, currentItems, handlePageClick, checkAccess, pageCount, handleSearchChange, fetchWithAuth, filterItems } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Instructor/InsCourseList.css';

// custom hook for fetching course data
function useInsCourseList() {
    const { authToken, accountLogInType } = useAuth();
    const params = new URLSearchParams(window.location.search); // parse url query parameters
    const divisionCode = params.get('division') || 'COSC'; // get division parameter from url, default setting is COSC

    const navigate = useNavigate();
    const divisionHandler = (e) => { // handler for changing division
        navigate('?division=' + e.target.value); // when user click to different division, navigate to it
    };

    const [divisionData, setDivisionData] = useState({
        courses: [{}],
        divisionCoursesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
          try {
            checkAccess(accountLogInType, navigate, 'instructor', authToken); // check access with accountloginType and authToken is valid
            const data = await fetchWithAuth(`http://localhost:3001/api/courses?division=${divisionCode}`, authToken, navigate);
            const filledCourses = fillEmptyItems(data.courses, data.perPage); // fill empty items to keep the format of the table
            setDivisionData({ ...data, courses: filledCourses }); // update state with fetched data
          } catch (error) {
            console.error('Error fetching courses:', error);
          }
        };
        fetchCourses();
      }, [authToken, divisionCode, accountLogInType, navigate]);

    // filter the course based on a filterItem function in utils.js and set it into filteredCourses
    const filteredCourses = filterItems(divisionData.courses, 'insCourse', search);
    const currentCourses = currentItems(filteredCourses, divisionData.currentPage, divisionData.perPage); // set filteredCourses as our currentItems to render on page

    return {
        divisionCode,
        divisionHandler,
        divisionData,
        setDivisionData,
        setSearch,
        currentCourses
    }
}

// main component for rendering the list of courses
function InsCourseList() {
    const {
        divisionCode,
        divisionHandler,
        divisionData,
        setDivisionData,
        setSearch,
        currentCourses
    } = useInsCourseList(); // use custom hook to fetch data

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType="Instructor" />
            <div className="container">
                <CreateTopBar searchListType={'InsCourseList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setDivisionData);}} />

                <div className="courselist-main">
                    <header className="ListTitle" id="dropdown-test-content">
                        <div className="ListTitle-text">List of Courses</div>
                        <select name="divisionCode" defaultValue={divisionCode} onChange={divisionHandler}>
                            {divisions.map((division) => (
                                <option key={division.code} value={division.code}>
                                    {division.label}
                                </option>
                            ))}
                        </select>
                    </header>

                    <div className="course-table" id="course-test-content">
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
                                {currentCourses.map((course) => (
                                    <tr key={course.id}>
                                        <td>
                                            <Link to={`/InsCourseHistory?courseid=${course.courseId}`}>{course.id}</Link>
                                        </td>
                                        <td>{course.title}</td>
                                        <td>
                                            {course.instructor ? (
                                                Array.isArray(course.instructor) ? (
                                                    course.instructor.map((instructor, index) => (
                                                        <React.Fragment key={course.profileid[index]}>
                                                            <div className="instructor-container">
                                                                <img 
                                                                    className="instructor-image"
                                                                    src={`http://localhost:3001/api/image/${course.profileid[index]}`} 
                                                                    alt={instructor}
                                                                    onError={(e) => { e.target.onerror = null }}
                                                                />
                                                                <Link to={`/InsProfilePage?ubcid=${course.ubcid[index]}`}>
                                                                    {instructor}
                                                                </Link>
                                                            </div>
                                                            {index < course.instructor.length - 1 ? <br /> : null}
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <div className="single-instructor">
                                                        <img 
                                                            className="instructor-image"
                                                            src={`http://localhost:3001/api/image/${course.profileid}`} 
                                                            alt={course.instructor}
                                                            onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/default/image.jpg' }}
                                                        />
                                                        <Link to={`/InsProfilePage?ubcid=${course.ubcid}`}>
                                                            {course.instructor}
                                                        </Link>
                                                    </div>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </td>
                                        <td>
                                            {course.email
                                                ? Array.isArray(course.email)
                                                    ? course.email.map((email, index) => (
                                                        <React.Fragment key={index}>
                                                            {email}
                                                            {index < course.email.length - 1 ? (
                                                                <>
                                                                    <br />
                                                                    <br />
                                                                </>
                                                            ) : null}
                                                        </React.Fragment>
                                                    ))
                                                    : course.email
                                                : ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td colSpan="4">
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            nextLabel={'>'}
                                            breakLabel={'...'}
                                            pageCount={pageCount(divisionData.divisionCoursesCount, divisionData.perPage)}
                                            marginPagesDisplayed={3}
                                            pageRangeDisplayed={0}
                                            onPageChange={(data) => handlePageClick(data, setDivisionData)}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                            forcePage={divisionData.currentPage - 1}
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

export default InsCourseList;