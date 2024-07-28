import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Download, ArrowUpDown } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { fillEmptyItems, handlePageClick, handleSearchChange, pageCount, currentItems, checkAccess, requestSort, sortItems, downloadCSV, filterItems } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptTeachingAssignment.css';

// fetch data sent from DeptTeachingAssignment using state, location and render
function useDeptTeachingAssignment() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedDivision, courses, professors, currentTerm } = location.state || {}; // retrieve data sent from DeptTeachingAssignment
    const [courseList, setCourseList] = useState({
        courses: [],
        totalCoursesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [currentDivision, setCurrentDivision] = useState(selectedDivision); // set current division from DeptTeachingAssignment sent
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const handleDivisionChange = event => setCurrentDivision(event.target.value); // set current division to changed division by user

    useEffect(() => {
        checkAccess(accountLogInType, navigate, 'department', authToken); // check access with loginType and authToken
        if (courses && professors) {
            const prefix = currentDivision === 'computer-science' ? 'COSC' : currentDivision.slice(0, 4).toUpperCase(); // set prefix
            const filteredCourses = courses.filter(course => course.courseCode && course.courseCode.startsWith(prefix));
            const filledCourses = fillEmptyItems(filteredCourses, courseList.perPage); // fill courses up for table format
            setCourseList({
                courses: filledCourses,
                totalCoursesCount: filteredCourses.length,
                perPage: 10,
                currentPage: 1,
            });
        }
    }, [currentDivision, courses, professors, courseList.perPage]);

    // sort courses based on Instructor, Course Code, Course Name that user clicks, or if theres a filter, filter from search bar, and set the result into currentCourses
    const sortedCourses = useMemo(() => sortItems(courseList.courses, sortConfig), [courseList.courses, sortConfig]);
    const filteredCourses = filterItems(sortedCourses, 'taCourse', search);
    const currentCourses = currentItems(filteredCourses, courseList.currentPage, courseList.perPage);
    
    return {
        courseList,
        setCourseList,
        currentTerm,
        setSearch,
        sortConfig,
        setSortConfig,
        currentCourses,
        currentDivision,
        handleDivisionChange
    };
}

// export function that exports to CSV
function exportToCSV(courses, currentTerm, currentDivision) {
    const filteredCourses = courses.filter(course => course.courseCode); // filter out the null
    const headers = '#, Instructor, Course Code, Course Name, Email\n'; // csv header
    const csvContent = filteredCourses.reduce((acc, course, index) => { // generate csv Content
        const instructorName = course.instructor === "Not Assigned" ? "N/A" : course.instructor;
        return acc + `${index + 1}, ${instructorName},${course.courseCode},${course.courseName},${course.email}\n`;
    }, headers);
    downloadCSV (csvContent, `${currentTerm} ${currentDivision} Teaching Assignment`); // use downloadCSV defined in utils.js to export
}

// main component function that renders the page component
function DeptTeachingAssignmentDetail() {
    const {
        courseList,
        setCourseList,
        currentTerm,
        setSearch,
        sortConfig,
        setSortConfig,
        currentCourses,
        currentDivision,
        handleDivisionChange
    } = useDeptTeachingAssignment();

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType="Department" />
            <div className="container">
                <CreateTopBar searchListType={'DeptTeachingAssignmentDetail'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setCourseList);}} />

                <div className="srlist-main" id="detail-teaching-assignment-test-content">
                    <div className="subtitle-course">
                        <div className='divison-select-subtitle'>
                            List of Courses 
                            <select className='detail-division-select' onChange={handleDivisionChange} value={currentDivision}>
                                <option value="computer-science">Computer Science</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="physics">Physics</option>
                                <option value="statistics">Statistics</option>
                            </select>
                        </div>
                        <div className="action-buttons">
                            <button className='status-change-button'>
                                <Link to={`/DeptTeachingAssignment`}>Return</Link>
                            </button>
                            <button className='icon-button' onClick={() => exportToCSV(courseList.courses, currentTerm, currentDivision)}>
                                <Download size={20} color="black" />
                            </button>
                        </div>
                    </div>

                    <div className="detail-course-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        Instructor
                                        <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'instructor')}>
                                            <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                    <th>
                                        Course Code
                                        <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig,'courseCode')}>
                                            <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                    <th>
                                        Course Name
                                        <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig,'courseName')}>
                                            <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                    <th>Email</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentCourses.map((course, index) => (
                                    <tr key={`${course.id}-${index}`}>
                                        <td><Link to={`http://localhost:3000/DeptProfilePage?ubcid=${course.ubcid}`}>{course.instructor === "Not Assigned" ? "N/A" : course.instructor}</Link></td>
                                        <td><Link to={`http://localhost:3000/DeptCourseInformation?courseid=${course.id}`}>{course.courseCode}</Link></td>
                                        <td>{course.courseName}</td>
                                        <td>{course.email}</td>
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
                                            pageCount={Math.max(1, pageCount(courseList.totalCoursesCount, courseList.perPage))}
                                            marginPagesDisplayed={3}
                                            pageRangeDisplayed={2}
                                            onPageChange={(data) => handlePageClick(data, setCourseList)}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                            forcePage={Math.min(courseList.currentPage - 1, pageCount(courseList.totalCoursesCount, courseList.perPage) - 1)}
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

export default DeptTeachingAssignmentDetail;