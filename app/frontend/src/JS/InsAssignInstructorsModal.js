import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import '../CSS/Department/AssignInstructorModal.css';


const AssignInstructorsModal = (props, instructorData) => {
    let i = 0;
    const [search, setSearch] = useState('');
    const onSearch = (newSearch) => {
        console.log("Searched:", newSearch);
        setSearch(newSearch);
        props.setInstructorData(prevState => ({ ...prevState, currentPage: 1 }));
      };
      const filteredInstructors = props.instructorData.instructors.filter(instructor =>
        (instructor.name?.toString().toLowerCase() ?? "").includes(search.toLowerCase()) ||
        (instructor.id?.toString().toLowerCase() ?? "").includes(search.toLowerCase())
      );
      const currentInstructors = filteredInstructors.slice(
        (props.instructorData.currentPage - 1) * props.instructorData.perPage,
        props.instructorData.currentPage * props.instructorData.perPage
      );
      const toggleInstructorAssigned = (id, assign) => {
        let button = document.getElementById(id);
         for (let i = 0; i<props.instructorData.instructorCount;i++) {
             if (props.instructorData.instructors[i].id === id) {
                 if (!assign) {
                     props.instructorData.instructors[i].assigned = true;
                     button.innerHTML = "Remove";
                     button.classList.toggle("remove");
                     button.classList.toggle("add");
                 } else {
                     props.instructorData.instructors[i].assigned = false;
                     button.innerHTML = "Add";
                     button.classList.toggle("remove");
                     button.classList.toggle("add");
                 }
                 
             }
         }
         
     };
     const pageCount = Math.ceil(props.instructorData.instructorCount / props.instructorData.perPage);
     const handlePageClick = (data) => {
        props.setInstructorData(prevState => ({
          ...prevState,
          currentPage: data.selected + 1
        }))
      };
    return (<div className="modal-overlay">
        <div className="assignModal" data-testid="assignModal">
            <div className='assignModalTop'>
                <div className="modalTitle">Assign <span className='bold'>Instructor(s)</span></div>
                <button className="close-button" onClick={()=>props.handleCloseInstructorModal(false)}>X</button>
            </div>
            <input type="text" placeholder="Search for instructors to assign" onChange={e => onSearch(e.target.value)} />
            <table>
                <tbody>
                    {currentInstructors.map(instructor => {
                        i++;
                        if (instructor.id == null) {
                            return (<tr key={i} className="instructor-item">
                                <td></td><td></td>
                                <td></td>
                            </tr>);
                        }
                        return (
                        <tr key={i} className="instructor-item">
                            <td className='bold'>{instructor.name}</td><td>UBC ID: {instructor.id}</td>
                            <td>
                                <button id={instructor.id} className={"bold "+(instructor.assigned?"remove":"add")} onClick={() => toggleInstructorAssigned(instructor.id, instructor.assigned)}>
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
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        </td>
                    </tr>
                </tfoot>
            </table>
            
            <button className="save-button" onClick={()=>props.handleCloseInstructorModal(true)}>Save</button>
        </div>
    </div>);
}

export default AssignInstructorsModal;