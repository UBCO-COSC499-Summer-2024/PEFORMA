import React, { useState } from 'react';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../CSS/Department/DataEntry.css';
import divisions from '../common/divisions.js';


function DataEntryComponent() {
    const navigate = useNavigate();
    window.onbeforeunload = function() {
        return "Data will be lost if you leave this page. Are you sure?";
      };

    const [selection, setSelection] = useState(''); // State to hold the dropdown selection
    const [showInstructorModal, setShowInstructorModal] = useState(false);
    const [instructors, setInstructors] = useState([
        { id: '12341234', name: 'Jim Bob', added: false },
        { id: '12341234', name: 'Billy Jim', added: true },
        { id: '12341234', name: 'Jimmy Bill', added: false },
        { id: '12341234', name: 'Jilly Bim', added: false }
    ]);

    const handleChange = (event) => {
        setSelection(event.target.value);
        // Potentially navigate to different components or render different forms here
        console.log(`Selected: ${event.target.value}`);
    };

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

   const handleSubmit = async(event, props) => {
            event.preventDefault();
            const data = new FormData(event.target);
            const formType = data.get("selection");
            let confirmMessage = "";
            if (formType === "Course") {
                confirmMessage = "Create new course?";
            } else {
                confirmMessage = "Create new service role?";
            }
            if (window.confirm(confirmMessage) === true) {
                axios.post('http://localhost:3001/enter', data).then(navigate("/courseInformation?courseId=1")); // Make courseId equal to that of the newly created course
                
            }
    }

    return (
        <div className='DataEntry-page'>
            <CreateSidebarDept/>
            <div className="container">
                <CreateTopbar />
                <div className='main'>
                <h1>Data Entry</h1>
                <div className="create-new">
                    <label htmlFor="create-new-select">Create New:</label>
                    <select id="create-new-select" value={selection} onChange={handleChange} role ="button" name="dropdown">
                        <option value="" disabled>Select</option>
                        <option value="Service Role" name="newServiceRole" role="button">Service Role</option>
                        <option value="Course" name="newCourse" role="button">Course</option>
                    </select>
                </div>
            {selection === 'Course' && (
                <div className='form-container'>
                <form className="course-form" data-testid="course-form" role='form' onSubmit={handleSubmit}>
                    <div className="titleInput formInput">
                        <label htmlFor="course-title">Course Title:</label>
                        <input type="text" id="course-title" placeholder="Enter course title" name="courseTitle" required/>
                    </div>
                    <div className='departmentInput formInput'>
                        <label htmlFor="course-department">Department:</label>
                        <select id="course-department" name="courseDepartment" required>
                            {divisions.map(division => {
                                return (
                                    <option key={division.code} value={division.code}>{division.label}</option>
                                );
                            })}
                        </select>
                        <div className='coursecodeInput'>
                            <label htmlFor="course-code">Course Code:</label>
                            <input type="text" id="course-code" name="courseCode" required/>
                        </div>
                    </div>
                    <label htmlFor="course-description">Course Description:</label>
                    <textarea id="course-description" placeholder="Describe the course" name="courseDescription" required></textarea>

                    <button className="assign-button" onClick={handleShowInstructorModal}><span className="plus">+</span> Assign Professors(s)</button>
                    <input type="submit" id="course-submit" className='hidden' />
                    <input type="hidden" name="selection" value="Course" />
                </form>
                <label className="finish-button" htmlFor="course-submit">Finish</label>
                </div>
            )}

            {selection === 'Service Role' && (
                <div className='form-container'>
                <form className="service-role-form" data-testid="service-role-form" role="form" onSubmit={handleSubmit}>
                    <div className="titleInput formInput">
                        <label htmlFor="service-role-title">Service Role Title:</label>
                        <input type="text" id="service-role-title" placeholder="Enter service role title" name="serviceRoleTitle" required/>
                    </div>
                    <div className="departmentInput formInput">
                        <label htmlFor="service-role-department">Department:</label>
                        <select id="service-role-department" name="serviceRoleDepartment" required>
                        {divisions.map(division => {
                                return (
                                    <option key={division.code} value={division.code}>{division.label}</option>
                                );
                            })}
                        </select>
                    </div>
                    <label htmlFor="service-role-description">Service Role Description:</label>
                    <textarea id="service-role-description" placeholder="Describe the service role" name="serviceRoleDescription" required></textarea>
                    <div className='monthlyHoursInput formInput'>
                        <label htmlFor="monthly-hours">Monthly Hours Benchmark:</label>
                        <input type="text" id="monthly-hours" placeholder="hours/month" name="monthlyHours" required/>
                    </div>
                    <button className="assign-button" onClick={handleShowInstructorModal}><span className="plus">+</span> Assign Professors(s)</button>
                    <input type="submit" id="service-role-submit" className='hidden' />
                    <input type="hidden" name="formType" value="Service Role" />
                </form>
                <label className="finish-button" htmlFor='service-role-submit'>Finish</label>
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
        </div>
    );
}

export default DataEntryComponent;
