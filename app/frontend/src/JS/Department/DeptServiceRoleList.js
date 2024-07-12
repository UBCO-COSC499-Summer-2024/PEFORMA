import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Edit, Download } from 'lucide-react';

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

    const currentRoles = currentItems(roleData.roles, roleData.currentPage, roleData.perPage);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Role', 'Department', 'Description', 'Status']],
            body: exportData.roles.map(role => [
                role.name,
                role.department,
                role.description,
                role.status !== undefined ? (role.status ? 'Active' : 'Inactive') : ''
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
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Description</th>
                                    <th>Status</th>
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