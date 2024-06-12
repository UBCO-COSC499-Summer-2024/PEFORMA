import React, { useState } from 'react';
import '../../CSS/Department/ServiceRoleManagement.css';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';


// Role Details Component
function RoleDetails({ role, onEdit, onDeactivate }) {
    return (
        <div className="role-details">
            <h1>{role.title} ({role.department})</h1>
            <p>{role.description}</p>
            <div>Department: {role.department}</div>
            <div>Benchmark: {role.benchmark} hours/month</div>
            <button onClick={onEdit}>Edit Role</button>
            <button onClick={onDeactivate} className="deactivate-button">Deactivate</button>
        </div>
    );
}

// Assignee List Component
function AssigneeList({ assignees }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;  // Adjust based on your preference

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = assignees.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(assignees.length / itemsPerPage);

    return (
        <div className="assignee-list">
            <button onClick={() => alert("Assign Folks")}>+ Assign Folks</button>
            {currentItems.map(assignee => (
                <div key={assignee.id}>
                    {assignee.name} UBC ID: {assignee.id}
                </div>
            ))}
            <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
}

// Main Component
function ServiceRoleManagement() {
    const [role, setRole] = useState({
        title: "Undergrad Advisor",
        department: "Computer Science (COSC)",
        description: "Person who teaches computers",
        benchmark: 67
    });

    const [assignees, setAssignees] = useState([
        { id: '12341234', name: 'Jim Bob' },
        { id: '12341234', name: 'Jibby Job' },
        { id: '12341234', name: 'Jimmy Bill' }
    ]);

    return (
        <div className="service-role-management">
            <CreateSidebarDept/>
            <div className='Manage-container'>
                <CreateTopbar />
            <RoleDetails role={role} onEdit={() => console.log('Edit')} onDeactivate={() => console.log('Deactivate')} />
            <AssigneeList assignees={assignees} />
            </div>
        </div>
    );
}

export default ServiceRoleManagement;
