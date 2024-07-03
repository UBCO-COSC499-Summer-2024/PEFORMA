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

    const titleLimit = 100;
    const descLimit = 1000;

    const [selection, setSelection] = useState(''); // State to hold the dropdown selection
    const [showInstructorModal, setShowInstructorModal] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDepartment, setCourseDepartment] = useState('COSC');
    const [courseCode, setCourseCode] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [serviceRoleTitle, setServiceRoleTitle] = useState('');
    const [serviceRoleDepartment, setServiceRoleDepartment] = useState('COSC');
    const [serviceRoleDescription, setServiceRoleDescription] = useState('');
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

function checkValidity() {
    
}

    function checkLength(input, limit, section, valid) {
        if (!valid) { 
            return false;
        }
        if (input.length > limit) {
            alert(section+" cannot exceed "+limit+" characters");
            return false;
        }
        return true;
    }

    function checkCourseCode(valid) {
        if (!valid) { 
            return false;
        }
        if (courseCode.length !== 3) {
            alert("Course code should be 3 digits.");
            return false;
        }
        for (let i = 0; i < courseCode.length; i++) {
            if (!Number.isInteger(parseInt(courseCode.charAt(i)))) {
                alert("Course code should be 3 digits.");
                return false;
            }
        }
        return true;
        
    }

    function checkCourseValidity() {
        let valid = true;
        valid = checkLength(courseTitle, titleLimit, "Title", valid);
        valid = checkLength(courseDescription, descLimit, "Description", valid);
        valid = checkCourseCode(valid);
        return valid;
    }

    function checkServiceRoleValidity() {
        let valid = true;
        valid = checkLength(serviceRoleTitle, titleLimit, "Title", valid);
        valid = checkLength(serviceRoleDescription, descLimit, "Description", valid);
        return valid;
    }

   const handleSubmit = async(event) => {
            event.preventDefault();
            const formData = {
                selection,
                courseTitle,
                courseDepartment,
                courseCode,
                courseDescription,
                serviceRoleTitle,
                serviceRoleDepartment,
                serviceRoleDescription
            };
            console.log('Submitting form data:', formData);
            let valid = false;
            let confirmMessage = "";
            if (selection === "Course") {
                valid = checkCourseValidity();
                confirmMessage = "Confirm course creation?";
            }
            if (selection === "Service Role") {
                valid = checkServiceRoleValidity();
                confirmMessage = "Confirm service role creation?";
            }
            if (valid) {
                if (window.confirm(confirmMessage) === true) {
                    axios.post('http://localhost:3001/enter',formData).then(() => {
                        if (selection == "Course") {
                            navigate("/deptCourseList");
                        } else {
                            navigate("/ServiceRoleList");
                        }
                    }); 
                }
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
                    <select id="create-new-select" value={selection} onChange={(e)=>setSelection(e.target.value)} role ="button" name="dropdown">
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
                        <input type="text" onChange={(e) => setCourseTitle(e.target.value)} id="course-title" placeholder="Enter course title" name="courseTitle" required/>
                    </div>
                    <div className='departmentInput formInput'>
                        <label htmlFor="course-department">Department:</label>
                        <select id="course-department" placeholder="Select" name="courseDepartment" onChange={(e)=>setCourseDepartment(e.target.value)} required>
                            <option disabled="disabled">Select a division</option>
                            {divisions.map(division => {
                                return (
                                    <option key={division.code} value={division.code}>{division.label}</option>
                                );
                            })}
                        </select>
                        <div className='coursecodeInput'>
                            <label htmlFor="course-code">Course Code:</label>
                            <input type="text" id="course-code" name="courseCode" onChange={(e)=> {
                                setCourseCode(e.target.value);
                                
                            }} required/>
                        </div>
                    </div>
                    
                    <label htmlFor="course-description">Course Description:</label>
                    <textarea id="course-description" onChange={(e)=>setCourseDescription(e.target.value)} placeholder="Describe the course" name="courseDescription" required></textarea>

                    <button className="assign-button" type="button" onClick={handleShowInstructorModal}><span className="plus">+</span> Assign Professors(s)</button>
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
                        <input type="text" id="service-role-title" onChange={(e)=>setServiceRoleTitle(e.target.value)} placeholder="Enter service role title" name="serviceRoleTitle" required/>
                    </div>
                    <div className="departmentInput formInput">
                        <label htmlFor="service-role-department">Department:</label>
                        <select id="service-role-department" name="serviceRoleDepartment" onChange={(e)=>setServiceRoleDepartment(e.target.value)} required>
                        {divisions.map(division => {
                                return (
                                    <option key={division.code} value={division.code}>{division.label}</option>
                                );
                            })}
                        </select>
                    </div>
                    <label htmlFor="service-role-description">Service Role Description:</label>
                    <textarea id="service-role-description" onChange={(e)=>setServiceRoleDescription(e.target.value)} placeholder="Describe the service role" name="serviceRoleDescription" required></textarea>
                    <button type="button" className="assign-button" onClick={handleShowInstructorModal}><span className="plus">+</span> Assign Professors(s)</button>
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
