import React, { useState, useReducer } from 'react';
import ReactPaginate from 'react-paginate';
import '../CSS/Department/AssignInstructorModal.css';

const AssignRolesModal = (props) => {
    let i = 0;
    const [search, setSearch] = useState('');
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    
    const onSearch = (newSearch) => {
        setSearch(newSearch);
        props.setRoleData(prevState => ({ ...prevState, currentPage: 1 }));
    };

    const filteredRoles = props.roleData.roles.filter(role =>
        (role.name?.toString().toLowerCase() ?? "").includes(search.toLowerCase()) ||
        (role.department?.toString().toLowerCase() ?? "").includes(search.toLowerCase())
    );

    const currentRoles = filteredRoles.slice(
        (props.roleData.currentPage - 1) * props.roleData.perPage,
        props.roleData.currentPage * props.roleData.perPage
    );

    const toggleRoleAssigned = (id) => {
        props.setRoleData(prevData => ({
            ...prevData,
            roles: prevData.roles.map(role => 
                role.id === id ? { ...role, assigned: !role.assigned } : role
            )
        }));
        forceUpdate();
    };

    const pageCount = Math.ceil(props.roleData.rolesCount / props.roleData.perPage);
    
    const handlePageClick = (data) => {
        props.setRoleData(prevState => ({
            ...prevState,
            currentPage: data.selected + 1
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="assignModal" data-testid="assignModal">
                <div className='assignModalTop'>
                    <div className="modalTitle">Assign <span className='bold'>Role(s)</span></div>
                    <button className="close-button" onClick={() => props.handleCloseRolesModal(false)}>X</button>
                </div>
                <input type="text" placeholder="Search for roles to assign" onChange={e => onSearch(e.target.value)} />
                <table>
                    <tbody>
                        {currentRoles.map(role => {
                            i++;
                            if (role.id == null) {
                                return (
                                    <tr key={i} className="instructor-item">
                                        <td></td><td></td>
                                        <td></td>
                                    </tr>
                                );
                            }
                            return (
                                <tr key={i} className="instructor-item">
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
                                    onPageChange={handlePageClick}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                />
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <button className="save-button" onClick={() => props.handleCloseRolesModal(true)}>Save</button>
            </div>
        </div>
    );
}

export default AssignRolesModal;