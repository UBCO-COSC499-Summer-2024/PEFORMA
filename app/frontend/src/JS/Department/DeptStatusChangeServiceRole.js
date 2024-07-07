import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, 
	handlePageClick, 
	pageCount, 
	currentItems
 } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';

function DeptStatusChangeServiceRole(){
  const location = useLocation();
  const [roleData, setRoleData] = useState(location.state.roleData || 
    { roles: [], 
      rolesCount: 0, 
      perPage: 10, 
      currentPage: 1 
    });

  // useEffect(() => {
  //   if (location.state.roleData){
  //     const filledRoles = fillEmptyItems(location.state.roleData.roles, location.state.roleData.perPage);
  //     setRoleData({ ...location.state.roleData, roles: filledRoles });
  //   }
  // }, [location.state]);

  useEffect(() => {
    const fetchServiceRoles = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/serviceRoles.json`);
        const data = res.data;
        const filledRoles = fillEmptyItems(data.roles, data.perPage);
        setRoleData({ ...data, roles: filledRoles });
      } catch (error) {
        console.error('Error fetching service roles:', error);
      }
    };

    fetchServiceRoles();
  }, []);
  
  const currentRoles = currentItems(roleData.roles, roleData.currentPage, roleData.perPage);

  const toggleStatus = (role) => {
    const updatedRoles = roleData.roles.map(r => 
      r.id === role.id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
    );
    setRoleData({ ...roleData, roles: updatedRoles });
  };
  return (
    <div className="dashboard">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />

				<div className="srlist-main" id="dept-service-role-list-test-content">
					<div className="subtitle-role">List of Serivce Roles ({roleData.rolesCount} Active)
					<button className='status-change-button'><Link to={`/DeptServiceRoleList`}>Return</Link></button>
					</div>
					

					<div className="role-table">
						<table>
							<thead>
								<tr>
									<th>Role</th>
									<th>Department</th>
									<th>Status</th>
								</tr>
							</thead>

							<tbody>
              {currentRoles.map((role) => {
									return (
										<tr key={role.id}>
											<td>
												<Link to={`/DeptRoleInformation?roleid=${role.id}`}>
													{role.name}
												</Link>
											</td>
											<td>{role.department}</td>
                      <td>
                        <button className={`${role.status === 'active' ? 'active-button' : 'default-button'} button`}onClick={() => toggleStatus(role)}>Active</button>
                        <button className={`${role.status === 'inactive' ? 'inactive-button' : 'default-button'} button`}onClick={() => toggleStatus(role)}>Inactive</button>
                      </td>
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
  )
}

export default DeptStatusChangeServiceRole;