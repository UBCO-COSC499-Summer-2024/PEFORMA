import React, { useState, useReducer } from 'react';
import ReactPaginate from 'react-paginate';
import '../CSS/Department/AssignInstructorModal.css';
import { handlePageClick, currentItems, filterItems } from './common/utils';

const AssignCoursesModal = (props) => {
    const [search, setSearch] = useState('');
    const [, reactUpdate] = useReducer(i => i + 1, 0);
    
    const onSearch = (newSearch) => {
        setSearch(newSearch);
        props.setCourseData(prevState => ({ ...prevState, currentPage: 1 }));
    };

    const filteredCourses = filterItems(props.courseData.courses, "course", search);

    const currentCourses = currentItems(filteredCourses, props.courseData.currentPage, props.courseData.perPage);

    const toggleCourseAssigned = (id) => {
        props.setCourseData(prevData => ({
            ...prevData,
            courses: prevData.courses.map(course => 
                course.id === id ? { ...course, assigned: !course.assigned } : course
            )
        }));
        reactUpdate();
    };

    const pageCount = Math.ceil(props.courseData.courseCount / props.courseData.perPage);
    
    return (
        <div className="modal-overlay">
            <div className="assignModal" data-testid="assignModal">
                <div className='assignModalTop'>
                    <div className="modalTitle">Assign <span className='bold'>Courses(s)</span></div>
                    <button className="close-button" data-testid="close-button" onClick={() => props.handleCloseCoursesModal(false)}>X</button>
                </div>
                <input type="text" placeholder="Search for courses to assign" onChange={e => onSearch(e.target.value)} />
                <table>
                    <tbody>
                        {currentCourses.map((course, index) => {
                            if (course.id == null) {
                                return (
                                    <tr key={index} className="instructor-item">
                                        <td></td><td></td>
                                        <td></td>
                                    </tr>
                                );
                            }
                            return (
                                <tr key={index} className="instructor-item">
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
                                    onPageChange={(data)=>handlePageClick(data, props.setCourseData)}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                />
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <button className="save-button" data-testid="modalsave-button" onClick={() => props.handleCloseCoursesModal(true)}>Save</button>
            </div>
        </div>
    );
}

export default AssignCoursesModal;