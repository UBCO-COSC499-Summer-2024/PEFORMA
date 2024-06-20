import React, { useState } from 'react';
import '../../CSS/Department/DataEntry.css';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import axios from 'axios';


function DataEntryComponent() {
    const [selection, setSelection] = useState(''); // State to hold the dropdown selection
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDepartment, setCourseDepartment] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [serviceRoleTitle, setServiceRoleTitle] = useState('');
    const [serviceRoleDepartment, setServiceRoleDepartment] = useState('');
    const [serviceRoleDescription, setServiceRoleDescription] = useState('');
    const [monthlyHours, setMonthlyHours] = useState('');
    const [showInstructorModal, setShowInstructorModal] = useState(false);
    const [instructors, setInstructors] = useState([
        { id: '12341234', name: 'Jim Bob', added: false },
        { id: '12341234', name: 'Billy Jim', added: true },
        { id: '12341234', name: 'Jimmy Bill', added: false },
        { id: '12341234', name: 'Jilly Bim', added: false }
    ]);


    const toggleInstructorAdded = id => {
        setInstructors(instructors.map(instructor =>
            instructor.id === id ? { ...instructor, added: !instructor.added } : instructor
        ));
    };

    const handleShowInstructorModal = () => {
        setShowInstructorModal(true);
    };

    const handleCloseInstructorModal = () => {
        setShowInstructorModal(false);
    };

    const handleSubmit = () => {
        // 构建提交到后端的数据对象
        const formData = {
            selection,
            courseTitle,
            courseDepartment,
            courseCode,
            courseDescription,
            serviceRoleTitle,
            serviceRoleDepartment,
            serviceRoleDescription,
            monthlyHours,
        };
        console.log('Submitting form data:', formData);

        // 可以在这里添加POST请求到后端的代码
        axios.post('http://localhost:3001/enter', formData).then(response => console.log(response));
    };

    return (
        <div className='DataEntry-page'>
            <CreateSidebarDept/>
            <div className="container">
                <CreateTopbar />
                <h1>Data Entry</h1>
                <div className="create-new">
                    <label htmlFor="create-new-select">Create New</label>
                    <select id="create-new-select" value={selection} onChange={(e)=>setSelection(e.target.value)}>
                        <option value="" disabled>Select</option>
                        <option value="Service Role">Service Role</option>
                        <option value="Course">Course</option>
                    </select>
                </div>
            {selection === 'Course' && (
                <div className="course-form">
                    <label htmlFor="course-title">Course Title:</label>
                    <input type="text" id="course-title" placeholder="Enter course title" 
                    onChange={(e) => setCourseTitle(e.target.value)}/>

                    <label htmlFor="course-department">Department:</label>
                    <select id="course-department" 
                        onChange={(e)=>setCourseDepartment(e.target.value)}>
                        <option value="">Select</option>
                        <option value="CS">Computer Science</option>
                        <option value="Math">Mathematics</option>
                    </select>

                    <label htmlFor="course-code">Course Code:</label>
                    <input type="text" id="course-code" placeholder="Enter course code"
                    onChange={(e)=>setCourseCode(e.target.value)} />

                    <label htmlFor="course-description">Course Description:</label>
                    <textarea id="course-description" placeholder="Describe the course"
                    onChange={(e)=>setCourseDescription(e.target.value)}></textarea>

                    <button className="assign-professors-button" onClick={handleShowInstructorModal}
                    >+ Assign Professors(s)</button>

                    <button className="finish-button" onClick={handleSubmit}>Finish</button>
                </div>
            )}

            {selection === 'Service Role' && (
                <div className="service-role-form">
                    <label htmlFor="service-role-title">Service Role Title:</label>
                    <input type="text" id="service-role-title" placeholder="Enter service role title" 
                        onChange={(e)=>setServiceRoleTitle(e.target.value)}
                    />

                    <label htmlFor="service-role-department">Department:</label>
                    <select id="service-role-department" onChange={(e)=>setServiceRoleDepartment(e.target.value)}>
                        <option value="">Select</option>
                        <option value="CS">Computer Science</option>
                        <option value="Math">Mathematics</option>
                        <option value="Physics">Physics</option>
                    </select>

                    <label htmlFor="service-role-description">Service Role Description:</label>
                    <textarea id="service-role-description" placeholder="Describe the service role"
                    onChange={(e)=>setServiceRoleDescription(e.target.value)}
                    ></textarea>

                    <label htmlFor="monthly-hours">Monthly Hours Benchmark:</label>
                    <input type="text" id="monthly-hours" placeholder="hours/month" 
                        onChange={(e)=>setMonthlyHours(e.target.value)}
                    />

                    <button className="assign-button" onClick={handleShowInstructorModal}
                    >+ Assign Folks</button>

                    <button className="finish-button" onClick={handleSubmit}>Finish</button>
                </div>
            )}

            {showInstructorModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={handleCloseInstructorModal}>X</button>
                        {instructors.map(instructor => (
                            <div key={instructor.id} className="instructor-item">
                                <span>{instructor.name} UBC ID: {instructor.id}</span>
                                <button onClick={() => toggleInstructorAdded(instructor.id)}>
                                    {instructor.added ? 'Remove' : 'Add'}
                                </button>
                            </div>
                        ))}
                        <button className="save-button" onClick={handleCloseInstructorModal}>Save</button>
                    </div>
                </div>
            )}
            
            </div>
        </div>
    );
}

export default DataEntryComponent;
