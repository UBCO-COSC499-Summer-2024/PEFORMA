import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Download } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, handleSearchChange, checkAccess } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptMemberList.css';

function DeptMemberList() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [memberData, setMemberData] = useState({
        members: [{}],
        membersCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!authToken) {
                    navigate('/Login');
                    return;
                }
                checkAccess(accountLogInType, navigate, 'department');
                const res = await axios.get(`http://localhost:3001/api/allInstructors`, {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                });
                const activeMembers = res.data.members.filter(member => member.status);
                const filledMembers = fillEmptyItems(activeMembers, res.data.perPage);
                setMemberData({ ...res.data, members: filledMembers, membersCount: activeMembers.length });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/Login');
                } else {
                    console.error('Error fetching members:', error);
                }
            }
        };

        fetchData();
    }, [authToken]);

    const filteredMembers = memberData.members.filter(
        (member) =>
            (member.ubcid?.toString().toLowerCase() ?? '').includes(search.toLowerCase()) ||
            (member.name?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
            (Array.isArray(member.serviceRole)
                ? member.serviceRole.some((role) => role?.toLowerCase().includes(search.toLowerCase()))
                : (member.serviceRole?.toLowerCase() ?? '').includes(search.toLowerCase()))
    );

    const currentMembers = currentItems(filteredMembers, memberData.currentPage, memberData.perPage);

    const exportToPDF = () => {
        const doc = new jsPDF();
        let yOffset = 10;

        const addTable = (title, data, columns) => {
            doc.setFontSize(16);
            doc.text(title, 14, yOffset);
            
            const rankedData = data.map((item, index) => ({
                '#': index + 1,
                ...item
            }));

            const readableColumns = columns.map(col => {
                switch(col) {
                    case 'ubcid': return 'UBC ID';
                    case 'serviceRole': return 'Service Role';
                    default: return col.charAt(0).toUpperCase() + col.slice(1);
                }
            });

            doc.autoTable({
                startY: yOffset + 10,
                head: [['#', ...readableColumns]],
                body: rankedData.map(item => 
                    ['#', ...columns].map(col => {
                        if (col === 'serviceRole' && Array.isArray(item[col])) {
                            return item[col].join(', ');
                        }
                        return item[col];
                    })
                ),
            });
            yOffset = doc.lastAutoTable.finalY + 20;
        };

        addTable('Department Members', filteredMembers, ['name', 'ubcid', 'serviceRole', 'department', 'email']);

        doc.save('department_members_list.pdf');
    };

    const handleExport = () => {
        setIsLoading(true);
        exportToPDF();
        setIsLoading(false);
    };

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType="Department" />
            <div className="container">
                <CreateTopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => {setSearch(newSearch);handleSearchChange(setMemberData);}} />

                <div className="member-list-main" id="dept-member-list-test-content">
                    <div className="subtitle-member">
                        List of Members ({memberData.membersCount} Active)
                        <button className='icon-button' onClick={handleExport} disabled={isLoading}>
                            <Download size={20} color="black" />
                            {isLoading ? 'Loading...' : ''}
                        </button>
                    </div>

                    <div className="member-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>UBC ID</th>
                                    <th>Service Role</th>
                                    <th>Department</th>
                                    <th>Email</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentMembers.map((member) => {
                                    return (
                                        <tr key={member.ubcid}>
                                            <td>
                                                <Link to={`/DeptProfilePage?ubcid=${member.ubcid}`}>{member.name}</Link>
                                            </td>
                                            <td>{member.ubcid}</td>
                                            <td>
                                                {member.serviceRole ? (
                                                    Array.isArray(member.serviceRole) ? (
                                                        member.serviceRole.map((serviceRole, index) => (
                                                            <React.Fragment key={member.ubcid[index]}>
                                                                <Link to={`/DeptRoleInformation?roleid=${member.roleid[index]}`}>
                                                                    {serviceRole}
                                                                </Link>
                                                                {index < member.serviceRole.length - 1 ? (
                                                                    <>
                                                                        <br />
                                                                        <br />
                                                                    </>
                                                                ) : null}
                                                            </React.Fragment>
                                                        ))
                                                    ) : (
                                                        <Link to={`/DeptRoleInformation?ubcid=${member.roleid}`}>
                                                            {member.roleid}
                                                        </Link>
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </td>
                                            <td>{member.department}</td>
                                            <td>{member.email}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <tfoot>
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                pageCount={pageCount(memberData.membersCount, memberData.perPage)}
                                marginPagesDisplayed={3}
                                pageRangeDisplayed={0}
                                onPageChange={(data) => handlePageClick(data, setMemberData)}
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

export default DeptMemberList;