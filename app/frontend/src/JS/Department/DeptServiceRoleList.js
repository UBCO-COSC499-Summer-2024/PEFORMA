import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Edit, Download, ArrowUpDown } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, sortItems, requestSort, checkAccess, fetchWithAuth, getTermString } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptServiceRoleList.css';

function useServiceRoleList() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [roleData, setRoleData] = useState({
        roles: [{}],
        rolesCount: 0,
        perPage: 10,
        currentPage: 1,
    });

    const [activeRolesCount, setActiveRolesCount] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchServiceRoles = async () => {
            try {
                checkAccess(accountLogInType, 'department', navigate, authToken)
                const data = await fetchWithAuth('http://localhost:3001/api/service-roles', authToken, navigate);
                const filledRoles = fillEmptyItems(data.roles, data.perPage);
                setActiveRolesCount(filledRoles.filter(role => role.status).length);
                setRoleData({ ...data, roles: filledRoles });
            } catch (error) {
                console.error('Error fetching service roles:', error);
            }
        };
        fetchServiceRoles();
    }, [authToken]);

    const sortedRoles = useMemo(() => sortItems(roleData.roles, sortConfig), [roleData.roles, sortConfig]);
    const currentRoles = currentItems(sortedRoles, roleData.currentPage, roleData.perPage);
    return {
        roleData,
        setRoleData,
        activeRolesCount,
        sortConfig,
        setSortConfig,
        currentRoles
    };
}

function exportToPDF(roles) {
    const filteredRoles = roles.filter(role => role.name);
    const doc = new jsPDF();
    const termString = getTermString(20244); //roles.currentTerm

    doc.setFontSize(18);
    doc.text(`List of Service Roles (${termString})`, 14, 22);
    doc.autoTable({
        startY: 28,
        head: [['#', 'Role', 'Department', 'Description', 'Status']],
        body: filteredRoles.map((role, index) => [
            index + 1,
            role.name,
            role.department,
            role.description,
            { content: role.status ? 'Active' : 'Inactive', styles: { textColor: role.status ? [0, 128, 0] : [255, 0, 0] } }
        ]),
    });
    doc.save(`${termString} Service Roles List.pdf`);
}

function ServiceRoleList() {
    const {
        roleData,
        setRoleData,
        activeRolesCount,
        sortConfig,
        setSortConfig,
        currentRoles
    } = useServiceRoleList();

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType="Department" />
            <div className="container">
                <CreateTopBar />

                <div className="srlist-main" id="dept-service-role-list-test-content">
                    <div className="subtitle-role">
                        List of Service Roles ({activeRolesCount} Active)
                        <div className="action-buttons">
                            <Link to={`/DeptStatusChangeServiceRole`} state={{ roleData }}>
                                <button className='icon-button'>
                                    <Edit size={20} color="black" />
                                </button>
                            </Link>
                            <button className='icon-button' onClick={() => exportToPDF(roleData.roles)}>
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