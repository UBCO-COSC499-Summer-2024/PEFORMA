import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Edit, Download, ArrowUpDown } from 'lucide-react';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, sortItems, requestSort, checkAccess, fetchWithAuth, getTermString, downloadCSV } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptServiceRoleList.css';

// custom hook for fetching service role list data
function useServiceRoleList() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [roleData, setRoleData] = useState({
        roles: [{}],
        rolesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [currentTerm, setCurrentTerm] = useState(''); // state for setting current term for csv import
    const [activeRolesCount, setActiveRolesCount] = useState(0); // state for active role counts
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // fetch all roles and render
    useEffect(() => { // fetch data when authToken and accountLogInType changes
        const fetchServiceRoles = async () => {
            try {
                checkAccess(accountLogInType, 'department', navigate, authToken) // check access with loginType and view
                const data = await fetchWithAuth('http://localhost:3001/api/service-roles', authToken, navigate);
                const filledRoles = fillEmptyItems(data.roles, data.perPage);
                setActiveRolesCount(filledRoles.filter(role => role.status).length); // filter and set active roles count based on status
                setRoleData({ ...data, roles: filledRoles }); // set roledata with filledRoles
                setCurrentTerm(getTermString(data.currentTerm));  // set currentTerm using getTermString, 20244 => 2024 Summer Term 2
            } catch (error) {
                console.error('Error fetching service roles:', error);
            }
        };
        fetchServiceRoles();
    }, [authToken, accountLogInType, navigate]);

    // currentRoles will be updated every time user use sort function
    const sortedRoles = useMemo(() => sortItems(roleData.roles, sortConfig), [roleData.roles, sortConfig]);
    const currentRoles = currentItems(sortedRoles, roleData.currentPage, roleData.perPage);

    return { // return data that will be rendered
        roleData,
        setRoleData,
        activeRolesCount,
        sortConfig,
        setSortConfig,
        currentRoles,
        currentTerm
    };
}

function exportToCSV(roles, currentTerm) {
    const filteredRoles = roles.filter(role => role.name); // filter only the valid ones
    const headers = '"#", "Role", "Department", "Description", "Status"\n'; // csv header
    const csvContent = filteredRoles.reduce((acc, role, index) => { // generate csv content
        const status = role.status ? 'Active' : 'Inactive';
        return acc + `${index + 1}, ${role.name.replace(/,/g, '')}, ${role.department}, ${role.description.replace(/,/g, '')}, ${status}\n`; // table format
    }, headers);
    downloadCSV(csvContent, `${currentTerm} Service Roles List.csv`); // download csv with content and file name
}

// main component to render a Service role list
function ServiceRoleList() {
    const {
        roleData,
        setRoleData,
        activeRolesCount,
        sortConfig,
        setSortConfig,
        currentRoles,
        currentTerm
    } = useServiceRoleList(); // use custom hook for serviceRoleList

    return (
        <div className="dashboard">
            <SideBar sideBarType="Department" />
            <div className="container">
                <TopBar />

                <div className="srlist-main" id="dept-service-role-list-test-content">
                    <div className="subtitle-role">
                        List of Service Roles ({activeRolesCount} Active)
                        <div className="action-buttons">
                            <Link to={`/DeptStatusChangeServiceRole`} state={{ roleData }}>
                                <button className='icon-button'>
                                    <Edit size={20} color="black" />
                                </button>
                            </Link>
                            <button className='icon-button' data-testid="download-button" onClick={() => exportToCSV(roleData.roles, currentTerm)}>
                                <Download size={20} color="black" />
                            </button>
                        </div>
                    </div>

                    <div className="role-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        Role
                                        <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'name')}>
                                        <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                    <th>
                                        Department
                                        <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'department')}>
                                        <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                    <th>Description</th>
                                    <th>
                                        Status
                                        <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'status')}>
                                        <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentRoles.map((role) => (
                                    <tr key={role.id}>
                                        <td><Link to={`/DeptRoleInformation?roleid=${role.id}`}>{role.name}</Link></td>
                                        <td>{role.department}</td>
                                        <td>{role.description}</td>
                                        <td>{role.status !== undefined ? (role.status ? 'Active' : 'Inactive') : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <tfoot>
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                pageCount={pageCount(roleData.rolesCount, roleData.perPage)}
                                marginPagesDisplayed={3}
                                pageRangeDisplayed={0}
                                onPageChange={(data) => handlePageClick(data, setRoleData)}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        </tfoot>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceRoleList;