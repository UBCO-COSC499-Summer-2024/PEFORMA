import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Edit, Download, ArrowUpDown } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess, filterItems, requestSort, sortItems, fetchWithAuth } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptCourseList.css';

function useDeptCourseList() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [deptCourseList, setDeptCourseList] = useState({
        courses: [{}],
        coursesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [exportData, setExportData] = useState({
        courses: [{}],
        coursesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [search, setSearch] = useState('');
    const [activeCoursesCount, setActiveCoursesCount] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        async function fetchAllCourses() {
            try {
                checkAccess(accountLogInType, navigate, 'department', authToken);
                const data = await fetchWithAuth(`http://localhost:3001/api/all-courses`, authToken, navigate);
                const filledCourses = fillEmptyItems(data.courses, data.perPage);
                setActiveCoursesCount(filledCourses.filter(course => course.status).length);
                setDeptCourseList({ ...data, courses: filledCourses });
                setExportData({ ...data });
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchAllCourses();
    }, [authToken, accountLogInType, navigate]);

    const sortedCourses = useMemo(() => sortItems(deptCourseList.courses, sortConfig), [deptCourseList.courses, sortConfig]);
    const filteredCourses = filterItems(sortedCourses, 'course', search);
    const currentCourses = currentItems(filteredCourses, deptCourseList.currentPage, deptCourseList.perPage);

    return {
        deptCourseList,
        setDeptCourseList,
        exportData,
        search,
        setSearch,
        activeCoursesCount,
        sortConfig,
        setSortConfig,
        currentCourses
    };
}

function exportToPDF(courses) {
    const doc = new jsPDF();
    doc.autoTable({
        head: [['Course', 'Title', 'Description', 'Status']],
        body: courses.map(course => [
            course.courseCode,
            course.title,
            course.description,
            { content: course.status ? 'Active' : 'Inactive', styles: { textColor: course.status ? [0, 128, 0] : [255, 0, 0] } }
        ]),
    });
    doc.save("course_list.pdf");
}

function DeptCourseList() {
    const {
        deptCourseList,
        setDeptCourseList,
        exportData,
        search,
        setSearch,
        activeCoursesCount,
        sortConfig,
        setSortConfig,
        currentCourses
    } = useDeptCourseList();

    return (
        <div className="dashboard" id="dept-course-list-test-content">
            <CreateSideBar sideBarType="Department" />
            <div className="container">
                <CreateTopBar searchListType={'DeptCourseList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setDeptCourseList);}} />

                <div className="clist-main">
                    <div className="subtitle-course">
                        List of Courses ({activeCoursesCount} Active in current)
                        <div className="action-buttons">
                            <Link to={`/DeptStatusChangeCourse`} state={{ deptCourseList }}>
                                <button className='icon-button'>
                                    <Edit size={20} color="black" />
                                </button>
                            </Link>
                            <button className='icon-button' onClick={() => exportToPDF(exportData.courses)}>
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