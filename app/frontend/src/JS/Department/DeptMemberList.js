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
import { fillEmptyItems, handlePageClick, pageCount, currentItems, checkAccess, fetchWithAuth, requestSort, sortItems, filterItems, getTermString } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptMemberList.css';

function useDeptMemberList() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();
    const [memberData, setMemberData] = useState({
        members: [{}],
        membersCount: 0,
        perPage: 10,
        currentPage: 1,
    });
    const [allMemberData, setAllMemberData] = useState({ //only for export
        members: [{}]
    })
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                checkAccess(accountLogInType, navigate, 'department', authToken);
                const data = await fetchWithAuth(`http://localhost:3001/api/allInstructors`, authToken, navigate);
                setAllMemberData({ ...data, members: data.members})
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
    }, [authToken, accountLogInType, navigate]);

    const sortedMembers = useMemo(() => sortItems(memberData.members, sortConfig), [memberData.members, sortConfig]);
    const filteredMembers = filterItems(sortedMembers, 'member', search);
    const filledFilteredMembers = fillEmptyItems(filteredMembers, memberData.perPage);
    const currentMembers = currentItems(filledFilteredMembers, memberData.currentPage, memberData.perPage);

    return {
        memberData,
        setMemberData,
        allMemberData,
        setSearch,
        sortConfig,
        setSortConfig,
        currentMembers
    }
}

function exportToPDF(members, term) {
    const filteredMembers = members.members.filter(member => member.name); 
    const doc = new jsPDF();
    const termString = getTermString(term);

    doc.setFontSize(18);
    doc.text(`List of Active Members (${termString})`, 14, 22);
    doc.autoTable({
        startY: 28,
        head: [['#', 'Name', 'UBC ID', 'Service Role', 'Department', 'Email', 'Status']],
        body: filteredMembers.map((member, index) => [
            index + 1,
            member.name,
            member.ubcid,
            Array.isArray(member.serviceRole) ? member.serviceRole.join(',\n') : member.serviceRole,
            member.department,
            member.email,
            { content: member.status ? 'Active' : 'Inactive', styles: { textColor: member.status ? [0, 128, 0] : [255, 0, 0] } }
        ]),
    });
    doc.save("department_active_member_list.pdf");
}



function DeptMemberList() {
    const {
        memberData,
        setMemberData,
        allMemberData,
        setSearch,
        sortConfig,
        setSortConfig,
        currentMembers
    } = useDeptMemberList();
    const term = 20244 //will remove later when query fixed

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType="Department" />
            <div className="container">
            <CreateTopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => { setSearch(newSearch); }} />

                <div className="member-list-main" id="dept-member-list-test-content">
                    <div className="subtitle-member">
                        List of Members ({memberData.membersCount} Active)
                        <button className='icon-button' onClick={() => exportToPDF(allMemberData, term)}>
                            <Download size={20} color="black" />
                        </button>
                    </div>

                    <div className="member-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">Name</span>
                                            <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'name')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">UBC ID</span>
                                            <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'ubcid')}>
                                                <ArrowUpDown size={16} color="black" />
                                            </button>
                                        </div>
                                    </th>
                                    <th>Service Role</th>
                                    <th>
                                        <div className="th-content">
                                            <span className="th-text">Department</span>
                                            <button className='sort-button' onClick={() => requestSort(sortConfig, setSortConfig, 'department')}>
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
                            <tfoot>
                                <tr>
                                    <td>
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
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default DeptMemberList;