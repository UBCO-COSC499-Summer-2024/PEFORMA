import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Edit, Download, ArrowUpDown } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptCourseList.css';

function DeptCourseList() {
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
        const fetchAllCourses = async () => {
            try {
                if (!authToken) {
                    navigate('/Login');
                    return;
                }
                const numericAccountType = Number(accountLogInType);
                if (numericAccountType !== 1 && numericAccountType !== 2) {
                    alert('No Access, Redirecting to instructor view');
                    navigate('/InsDashboard');
                }
                const res = await axios.get(`http://localhost:3001/api/all-courses`, {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                });
                const filledCourses = fillEmptyItems(res.data.courses, res.data.perPage);
                setActiveCoursesCount(filledCourses.filter(course => course.status).length); 
                setDeptCourseList({ ...res.data, courses: filledCourses });
                setExportData({ ...res.data });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/Login');
                } else {
                    console.error('Error fetching courses:', error);
                }
            }
        };
        fetchAllCourses();
    }, [authToken]);

    const sortedCourses = React.useMemo(() => {
        let sortableItems = [...deptCourseList.courses];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [deptCourseList.courses, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredCourses = sortedCourses.filter(
        (course) =>
            (course.courseCode?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
            (course.title?.toLowerCase() ?? '').includes(search.toLowerCase())
    );

    const currentCourses = currentItems(filteredCourses, deptCourseList.currentPage, deptCourseList.perPage);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Course', 'Title', 'Description', 'Status']],
            body: exportData.courses.map(course => [
                course.courseCode,
                course.title,
                course.description,
                { content: course.status ? 'Active' : 'Inactive', styles: { textColor: course.status ? [0, 128, 0] : [255, 0, 0] } }
            ]),
        });
        doc.save("course_list.pdf");
    };

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
                            <button className='icon-button' onClick={exportToPDF}>
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
                                            <button className='sort-button' onClick={() => requestSort('courseCode')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">Title</span>
                                            <button className='sort-button' onClick={() => requestSort('title')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>Description</th>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">Status</span>
                                            <button className='sort-button' onClick={() => requestSort('status')}>
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