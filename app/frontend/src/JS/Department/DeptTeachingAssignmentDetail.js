import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { fillEmptyItems, handlePageClick, handleSearchChange, pageCount, currentItems, checkAccess } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Download, ArrowUpDown } from 'lucide-react';
import '../../CSS/Department/DeptTeachingAssignment.css';

function DeptTeachingAssignmentDetail() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedDivision, courses, professors } = location.state || {};
    const [courseList, setCourseList] = useState({
        courses: [],
        totalCoursesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [currentDivision, setCurrentDivision] = useState(selectedDivision);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        checkAccess(accountLogInType, navigate, 'department', authToken);
        if (courses && professors) {
            const prefix = currentDivision === 'computer-science' ? 'COSC' : currentDivision.slice(0, 4).toUpperCase();
            const filteredCourses = courses.filter(course => course.courseCode && course.courseCode.startsWith(prefix));

            const filledCourses = fillEmptyItems(filteredCourses, courseList.perPage);

            setCourseList({
                courses: filledCourses,
                totalCoursesCount: filteredCourses.length,
                perPage: 10,
                currentPage: 1,
            });
        }
    }, [currentDivision, courses, professors, courseList.perPage]);

    const sortedCourses = useMemo(() => {
        let sortableItems = [...courseList.courses];
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
    }, [courseList.courses, sortConfig]);

    const filteredCourses = sortedCourses.filter(
        (course) =>
            (course.instructor?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
            (course.courseCode?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
            (course.courseName?.toLowerCase() ?? '').includes(search.toLowerCase())
    );

    const currentCourses = currentItems(filteredCourses, courseList.currentPage, courseList.perPage);

    const handleDivisionChange = (event) => {
        setCurrentDivision(event.target.value);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const exportToPDF = () => {
        setIsLoading(true);
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text(`Teaching Assignments - ${currentDivision.replace('-', ' ').toUpperCase()}`, 14, 15);

        doc.autoTable({
            startY: 25,
            head: [['Instructor', 'Course Code', 'Course Name', 'Email']],
            body: filteredCourses.map(course => [
                course.instructor,
                course.courseCode,
                course.courseName,
                course.email
            ]),
        });

        doc.save(`teaching_assignments_${currentDivision}.pdf`);
        setIsLoading(false);
    };

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
                            <button className='icon-button' onClick={exportToPDF} disabled={isLoading}>
                                <Download size={20} color="black" />
                                {isLoading ? 'Loading...' : ''}
                            </button>
                        </div>
                    </div>

                    <div className="detail-course-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        Instructor
                                        <button className='sort-button' onClick={() => requestSort('instructor')}>
                                            <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                    <th>
                                        Course Code
                                        <button className='sort-button' onClick={() => requestSort('courseCode')}>
                                            <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                    <th>
                                        Course Name
                                        <button className='sort-button' onClick={() => requestSort('courseName')}>
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