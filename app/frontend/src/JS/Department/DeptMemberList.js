import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Download, ArrowUpDown } from 'lucide-react';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, handlePageClick, pageCount, currentItems, checkAccess, fetchWithAuth, requestSort, sortItems, filterItems, getTermString, downloadCSV } from '../common/utils.js';
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

    // fetch all member lists and render
    useEffect(() => { 
        const fetchData = async () => {
            try {
                checkAccess(accountLogInType, navigate, 'department', authToken); // check access with log in type and current view
                const data = await fetchWithAuth(`http://localhost:3001/api/allInstructors`, authToken, navigate);
                setAllMemberData({ ...data, members: data.members})
                const activeMembers = data.members.filter(member => member.status); // will only going to use active member filtered by status
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

    // sort and filter on member list data. FillEmptyItems after filtering
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

function exportToCSV(members) {
    const filteredMembers = members.members.filter(member => member.name);
    const termString = getTermString(20244); // will reaplce to curterm from db ######

    const headers = '#, Name, UBC ID, Service Role, Department, Email, Status\n'; // csv header
    const csvContent = filteredMembers.reduce((acc, member, index) => { // generate csv content
        const status = member.status ? 'Active' : 'Inactive';
        const serviceRole = Array.isArray(member.serviceRole) ? member.serviceRole.join('; ') : member.serviceRole; // join roles for csv format
        return acc + `${index + 1},${member.name},${member.ubcid},"${serviceRole}",${member.department},${member.email},${status}\n`; // table format
    }, headers);
    
    downloadCSV (csvContent, `${termString} Members List.csv`) // download csv with content and file name
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

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType="Department" />
            <div className="container">
            <CreateTopBar searchListType={'DeptMemberList'} onSearch={(newSearch) => { setSearch(newSearch); }} />

                <div className="member-list-main" id="dept-member-list-test-content">
                    <div className="subtitle-member">
                        List of Members ({memberData.membersCount} Active)
                        <button className='icon-button' onClick={() => exportToCSV(allMemberData)}>
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