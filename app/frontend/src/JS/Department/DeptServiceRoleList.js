import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Edit, Download, ArrowUpDown } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptServiceRoleList.css';

function ServiceRoleList() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [roleData, setRoleData] = useState({
        roles: [{}],
        rolesCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [exportData, setExportData] = useState({
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
                if (!authToken) {
                    navigate('/Login');
                    return;
                }
                const numericAccountType = Number(accountLogInType);
                if (numericAccountType !== 1 && numericAccountType !== 2) {
                    alert('No Access, Redirecting to instructor view');
                    navigate('/InsDashboard');
                }
                const res = await axios.get(`http://localhost:3001/api/service-roles`, {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                });
                const data = res.data;
                const filledRoles = fillEmptyItems(data.roles, data.perPage);
                setActiveRolesCount(filledRoles.filter(role => role.status).length);
                setRoleData({ ...data, roles: filledRoles });
                setExportData({ ...data });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/Login');
                } else {
                    console.error('Error fetching service roles:', error);
                }
            }
        };
        fetchServiceRoles();
    }, [authToken]);

    const sortedRoles = React.useMemo(() => {
        let sortableItems = [...roleData.roles];
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
    }, [roleData.roles, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const currentRoles = currentItems(sortedRoles, roleData.currentPage, roleData.perPage);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Role', 'Department', 'Description', 'Status']],
            body: exportData.roles.map(role => [
                role.name,
                role.department,
                role.description,
                { content: role.status ? 'Active' : 'Inactive', styles: { textColor: role.status ? [0, 128, 0] : [255, 0, 0] } }
            ]),
        });
        doc.save("service_roles_list.pdf");
    };

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
                            <button className='icon-button' onClick={exportToPDF}>
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
                                        <button className='sort-button' onClick={() => requestSort('name')}>
                                            <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                    <th>
                                        Department
                                        <button className='sort-button' onClick={() => requestSort('department')}>
                                            <ArrowUpDown size={16} color="black" />
                                        </button>
                                    </th>
                                    <th>Description</th>
                                    <th>
                                        Status
                                        <button className='sort-button' onClick={() => requestSort('status')}>
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