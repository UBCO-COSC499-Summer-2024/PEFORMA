import React, { useState, useReducer } from 'react';
import ReactPaginate from 'react-paginate';
import '../CSS/Department/AssignInstructorModal.css';
import { handlePageClick, currentItems, filterItems } from './common/utils';

// This function is for displaying the assign instructors modal. It's designed to be used in conjunction with the course info
// and role info pages to assign instructors. That's why props is used to access parent elements.
const AssignInstructorsModal = (props) => {
    const [, reactUpdate] = useReducer(i => i + 1, 0); // For forcing the page to update
    // State variables
    const [search, setSearch] = useState('');
    const onSearch = (newSearch) => {
        setSearch(newSearch);
        props.setInstructorData(prevState => ({ ...prevState, currentPage: 1 }));
      };

      const filteredInstructors = filterItems(props.instructorData.instructors, "instructor", search);
      const currentInstructors = currentItems(filteredInstructors, props.instructorData.currentPage, props.instructorData.perPage);

    // function to be called when the user clicks the add or remove button on the modal
      const toggleInstructorAssigned = (id) => {
        // Set selected instructor's assigned attribute to the opposite boolean.
        props.setInstructorData(prevData => ({
            ...prevData,
            instructors: prevData.instructors.map(instructor => 
                instructor.id === id ? { ...instructor, assigned: !instructor.assigned } : instructor
            )
        }));
        reactUpdate(); // Force the page to update
     };
     const pageCount = Math.ceil(props.instructorData.instructorCount / props.instructorData.perPage);

    return (<div className="modal-overlay">
        <div className="assignModal" data-testid="assignModal">
            <div className='assignModalTop'>
                <div className="modalTitle">Assign <span className='bold'>Instructor(s)</span></div>
                <button className="close-button" data-testid="close-button" onClick={()=>props.handleCloseInstructorModal(false, props.closeModalVars)}>X</button>
            </div>
            <input type="text" placeholder="Search for instructors to assign" onChange={e => onSearch(e.target.value)} />
            <table>
                <tbody>
                    {currentInstructors.map((instructor, index) => {
                        if (instructor.id == null) {
                            return (<tr key={index} className="instructor-item">
                                <td></td><td></td>
                                <td></td>
                            </tr>);
                        }
                        return (
                        <tr key={index} className="instructor-item">
                            <td className='bold'>{instructor.name}</td><td>UBC ID: {instructor.id}</td>
                            <td>
                                <button id={instructor.id} className={"bold "+(instructor.assigned?"remove":"add")} onClick={() => toggleInstructorAssigned(instructor.id)}>
                                    {instructor.assigned ? 'Remove' : 'Add'}
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
                                onPageChange={(data)=>handlePageClick(data, props.setInstructorData)}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        </td>
                    </tr>
                </tfoot>
            </table>
            
            <button className="save-button" data-testid="modalsave-button" onClick={()=>props.handleCloseInstructorModal(true, props.closeModalVars)}>Save</button>
        </div>
    </div>);
}

export default AssignInstructorsModal;
