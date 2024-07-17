import React, { useState, useReducer } from 'react';
import ReactPaginate from 'react-paginate';
import '../CSS/Department/AssignInstructorModal.css';

const AssignCoursesModal = (props) => {
    let i = 0;
    const [search, setSearch] = useState('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    
    const onSearch = (newSearch) => {
        setSearch(newSearch);
        props.setCourseData(prevState => ({ ...prevState, currentPage: 1 }));
    };

    const filteredCourses = props.courseData.courses.filter(course =>
        (course.title?.toString().toLowerCase() ?? "").includes(search.toLowerCase()) ||
        (course.courseCode?.toString().toLowerCase() ?? "").includes(search.toLowerCase())
    );

    const currentCourses = filteredCourses.slice(
        (props.courseData.currentPage - 1) * props.courseData.perPage,
        props.courseData.currentPage * props.courseData.perPage
    );

    const toggleCourseAssigned = (id) => {
        props.setCourseData(prevData => ({
            ...prevData,
            courses: prevData.courses.map(course => 
                course.id === id ? { ...course, assigned: !course.assigned } : course
            )
        }));
        forceUpdate();
    };

    const pageCount = Math.ceil(props.courseData.coursesCount / props.courseData.perPage);
    
    const handlePageClick = (data) => {
        props.setCourseData(prevState => ({
            ...prevState,
            currentPage: data.selected + 1
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="assignModal" data-testid="assignModal">
                <div className='assignModalTop'>
                    <div className="modalTitle">Assign <span className='bold'>Courses(s)</span></div>
                    <button className="close-button" onClick={() => props.handleCloseCoursesModal(false)}>X</button>
                </div>
                <input type="text" placeholder="Search for courses to assign" onChange={e => onSearch(e.target.value)} />
                <table>
                    <tbody>
                        {currentCourses.map(course => {
                            i++;
                            if (course.id == null) {
                                return (
                                    <tr key={i} className="instructor-item">
                                        <td></td><td></td>
                                        <td></td>
                                    </tr>
                                );
                            }
                            return (
                                <tr key={i} className="instructor-item">
                                    <td className='bold'>{course.courseCode}:</td>
                                    <td>{course.title}</td>
                                    <td>
                                        <button 
                                            id={course.id} 
                                            className={"bold " + (course.assigned ? "remove" : "add")} 
                                            onClick={() => toggleCourseAssigned(course.id)}
                                        >
                                            {course.assigned ? 'Remove' : 'Add'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3">
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
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <button className="save-button" onClick={() => props.handleCloseCoursesModal(true)}>Save</button>
            </div>
        </div>
    );
}

export default AssignCoursesModal;