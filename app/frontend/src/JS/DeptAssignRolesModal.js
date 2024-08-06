import React, { useState, useReducer } from 'react';
import ReactPaginate from 'react-paginate';
import '../CSS/Department/AssignInstructorModal.css';
import { handlePageClick, currentItems, filterItems } from './common/utils';

const AssignRolesModal = (props) => {
    const [search, setSearch] = useState('');
    const [, reactUpdate] = useReducer(i => i + 1, 0);
    
    const onSearch = (newSearch) => {
        setSearch(newSearch);
        props.setRoleData(prevState => ({ ...prevState, currentPage: 1 }));
    };

    const filteredRoles = filterItems(props.roleData.roles, "role", search);

    const currentRoles = currentItems(filteredRoles, props.roleData.currentPage, props.roleData.perPage);

    const toggleRoleAssigned = (id) => {
        props.setRoleData(prevData => ({
            ...prevData,
            roles: prevData.roles.map(role => 
                role.id === id ? { ...role, assigned: !role.assigned } : role
            )
        }));
        reactUpdate();
    };

    const pageCount = Math.ceil(props.roleData.roleCount / props.roleData.perPage);

    return (
        <div className="modal-overlay">
            <div className="assignModal" data-testid="assignModal">
                <div className='assignModalTop'>
                    <div className="modalTitle">Assign <span className='bold'>Role(s)</span></div>
                    <button className="close-button" data-testid="close-button" onClick={() => props.handleCloseRolesModal(false)}>X</button>
                </div>
                <input type="text" placeholder="Search for roles to assign" onChange={e => onSearch(e.target.value)} />
                <table>
                    <tbody>
                        {currentRoles.map((role, index) => {
                            if (role.id == null) {
                                return (
                                    <tr key={index} className="instructor-item">
                                        <td></td><td></td>
                                        <td></td>
                                    </tr>
                                );
                            }
                            return (
                                <tr key={index} className="instructor-item">
                                    <td className='bold'>{role.name}</td>
                                    <td>{role.department}</td>
                                    <td>
                                        <button 
                                            id={role.id} 
                                            className={"bold " + (role.assigned ? "remove" : "add")} 
                                            onClick={() => toggleRoleAssigned(role.id)}
                                        >
                                            {role.assigned ? 'Remove' : 'Add'}
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
                                    onPageChange={(data)=>handlePageClick(data, props.setRoleData)}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                />
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <button className="save-button" data-testid="modalsave-button" onClick={() => props.handleCloseRolesModal(true)}>Save</button>
            </div>
        </div>
    );
}

export default AssignRolesModal;