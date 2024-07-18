import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Download, ArrowUpDown } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, checkAccess, fetchWithAuth } from '../common/utils.js';
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
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                checkAccess(accountLogInType, navigate, 'department', authToken);
                const data = await fetchWithAuth(`http://localhost:3001/api/allInstructors`, authToken, navigate);
                const activeMembers = data.members.filter(member => member.status);
                const filledMembers = fillEmptyItems(activeMembers, data.perPage);
                setMemberData({
                    members: filledMembers,
                    membersCount: activeMembers.length,
                    perPage: data.perPage,
                    currentPage: 1,
                });
            } catch (error) {
                console.log('Error fetching members: ', error);
            }
        };

        fetchData();
    }, [authToken]);

    const sortedMembers = useMemo(() => {
        let sortableItems = [...memberData.members];
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
    }, [memberData.members, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredMembers = sortedMembers.filter(
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
            <CreateTopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => { setSearch(newSearch); }} />

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
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">Name</span>
                                            <button className='sort-button' onClick={() => requestSort('name')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">UBC ID</span>
                                            <button className='sort-button' onClick={() => requestSort('ubcid')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>Service Role</th>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">Department</span>
                                            <button className='sort-button' onClick={() => requestSort('department')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMembers.map((member, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Link to={`/DeptProfilePage?ubcid=${member.ubcid}`}>{member.name}</Link>
                                        </td>
                                        <td>{member.ubcid}</td>
                                        <td>
                                            {member.serviceRole ? (
                                                Array.isArray(member.serviceRole) ? (
                                                    member.serviceRole.map((serviceRole, idx) => (
                                                        <React.Fragment key={idx}>
                                                            <Link to={`/DeptRoleInformation?roleid=${member.roleid[idx]}`}>
                                                                {serviceRole}
                                                            </Link>
                                                            {idx < member.serviceRole.length - 1 && (
                                                                <>
                                                                    <br />
                                                                    <br />
                                                                </>
                                                            )}
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <Link to={`/DeptRoleInformation?roleid=${member.roleid}`}>
                                                        {member.serviceRole}
                                                    </Link>
                                                )
                                            ) : (
                                                ''
                                            )}
                                        </td>
                                        <td>{member.department}</td>
                                        <td>{member.email}</td>
                                    </tr>
                                ))}
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