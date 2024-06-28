const AssignInstructorsModal = (props) => {
    let i = 0;
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
            
            <button className="save-button" onClick={()=>handleCloseInstructorModal(true)}>Save</button>
        </div>
    </div>);
}

export default AssignInstructorsModal;