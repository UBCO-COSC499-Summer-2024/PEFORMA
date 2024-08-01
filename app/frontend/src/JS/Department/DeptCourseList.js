import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Edit, Download, ArrowUpDown } from 'lucide-react';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess, filterItems, requestSort, sortItems, fetchWithAuth, getTermString, downloadCSV } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptCourseList.css';

// custom hook for fetching dept course list data
function useDeptCourseList() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [deptCourseList, setDeptCourseList] = useState({
        courses: [{}],
        coursesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [currentTerm, setCurrentTerm] = useState(''); // state for setting current term for csv import
    const [search, setSearch] = useState('');
    const [activeCoursesCount, setActiveCoursesCount] = useState(0); // state for counting courses that are active
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    
    // fetch all courses and render 
    useEffect(() => {
        async function fetchAllCourses() {
            try {
                checkAccess(accountLogInType, navigate, 'department', authToken); // check access with current logInType with view
                const data = await fetchWithAuth(`http://localhost:3001/api/all-courses`, authToken, navigate);
                console.log(data)
                const filledCourses = fillEmptyItems(data.courses, data.perPage);
                setActiveCoursesCount(filledCourses.filter(course => course.status).length); // filter and set active courses count based on status
                setDeptCourseList({ ...data, courses: filledCourses });
                setCurrentTerm(getTermString(data.currentTerm)); // set currentTerm using getTermString, 20244 => 2024 Summer Term 2
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchAllCourses();
    }, [authToken, accountLogInType, navigate]);
    
    // sort and filter on course data
    const sortedCourses = useMemo(() => sortItems(deptCourseList.courses, sortConfig), [deptCourseList.courses, sortConfig]);
    const filteredCourses = filterItems(sortedCourses, 'course', search);
    const currentCourses = currentItems(filteredCourses, deptCourseList.currentPage, deptCourseList.perPage); // currentCourses are the final data before render

    return {
        deptCourseList,
        setDeptCourseList,
        setSearch,
        activeCoursesCount,
        sortConfig,
        setSortConfig,
        currentCourses,
        currentTerm
    };
}

function exportToCSV(courses, currentTerm) {
    const filteredCourses = courses.filter(course => course.courseCode); // filter out null rows
    const headers = '#, Course Code,Title,Description,Status\n'; // csv header
    const csvContent = filteredCourses.reduce((acc, course, index) => { // generate csv content
        const status = course.status ? 'Active' : 'Inactive';
        return acc + `${index + 1},${course.courseCode},${course.title},"${course.description.replace(/"/g, '""')}",${status}\n`; // table format
    }, headers);
    downloadCSV (csvContent, `${currentTerm} Course List.csv`) // download csv with content and file name
}

function DeptCourseList() {
    const {
        deptCourseList,
        setDeptCourseList,
        setSearch,
        activeCoursesCount,
        sortConfig,
        setSortConfig,
        currentCourses,
        currentTerm
    } = useDeptCourseList();

    return (
        <div className="dashboard" id="dept-course-list-test-content">
            <SideBar sideBarType="Department" />
            <div className="container">
                <TopBar searchListType={'DeptCourseList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setDeptCourseList);}} />

                <div className="clist-main">
                    <div className="subtitle-course">
                        List of Courses ({activeCoursesCount} Active in current)
                        <div className="action-buttons">
                            <Link to={`/DeptStatusChangeCourse`} state={{ deptCourseList }}>
                                <button className='icon-button'>
                                    <Edit size={20} color="black" />
                                </button>
                            </Link>
                            <button className='icon-button' data-testid="download-button" onClick={() => exportToCSV(deptCourseList.courses, currentTerm)}>
                                <Download size={20} color="black" />
                            </button>
                        </div>
                    </div>

                    <div className="dcourse-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">Course</span>
                                            <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'courseCode')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">Title</span>
                                            <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'title')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>Description</th>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">Status</span>
                                            <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'status')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentCourses.map((course) => (
                                    <tr key={course.id}>
                                        <td>
                                            <Link to={`http://localhost:3000/DeptCourseInformation?courseid=${course.id}`}>
                                                {course.courseCode}
                                            </Link>
                                        </td>
                                        <td>{course.title}</td>
                                        <td>{course.description}</td>
                                        <td>{course.status !== undefined ? (course.status ? 'Active' : 'Inactive') : ''}</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <ReactPaginate
                                    previousLabel={'<'}
                                    nextLabel={'>'}
                                    breakLabel={'...'}
                                    pageCount={pageCount(deptCourseList.coursesCount, deptCourseList.perPage)}
                                    marginPagesDisplayed={3}
                                    pageRangeDisplayed={0}
                                    onPageChange={(data) => handlePageClick(data, setDeptCourseList)}
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