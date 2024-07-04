import React, { useState, useEffect, useRef } from 'react';
import { CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../CSS/Department/DataEntry.css';
import '../../CSS/Department/AssignInstructorModal.css';
import divisions from '../common/divisions.js';
import AssignInstructorsModal from '../assignInstructorsModal.js';

function DataEntryComponent() {
    const navigate = useNavigate();
    window.onbeforeunload = function() {
        return "Data will be lost if you leave this page. Are you sure?";
    };

    const [instructorData, setInstructorData] = useState({ "instructors": [{}], instructorCount: 0, perPage: 8, currentPage: 1 });
    const titleLimit = 100;
    const descLimit = 1000;

    const [selection, setSelection] = useState(''); // State to hold the dropdown selection
    const [showInstructorModal, setShowInstructorModal] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDepartment, setCourseDepartment] = useState('COSC');
    const [courseCode, setCourseCode] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseYear, setCourseYear] = useState("");
    const [courseTerm, setCourseTerm] = useState("");
    const [serviceRoleTitle, setServiceRoleTitle] = useState('');
    const [serviceRoleDepartment, setServiceRoleDepartment] = useState('COSC');
    const [serviceRoleDescription, setServiceRoleDescription] = useState('');
    const [selectedInstructors, setSelectedInstructors] = useState([]);
    const [serviceRoleYear, setServiceRoleYear] = useState("");

    const handleChange = (event) => {
        setSelection(event.target.value);
        // Potentially navigate to different components or render different forms here
        console.log(`Selected: ${event.target.value}`);
    };

    useEffect(() => {
        const fetchData = async() => {
            try {
                const token = localStorage.getItem('token') || process.env.DEFAULT_ACTIVE_TOKEN; // 使用本地存储中的令牌或默认令牌
                const url = "http://localhost:3001/api/instructors";
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = res.data;
                const filledInstructors = fillEmptyInstructors(data.instructors, data.perPage);
                setInstructorData({ ...data, instructors: filledInstructors });
            } catch (error) {
                console.error("Error occurs when fetching people.\nDetail message:\n", error);
            }
        }
        fetchData();
    }, []);

    const fillEmptyInstructors = (instructors, perPage) => {
        const filledInstructors = [...instructors];
        const currentCount = instructors.length;
        const fillCount = perPage - (currentCount % perPage);
        if (fillCount < perPage) {
            for (let i = 0; i < fillCount; i++) {
                filledInstructors.push({});
            }
        }
        return filledInstructors;
    }

    const prevInstructors = useRef({});

    const handleShowInstructorModal = () => {
        prevInstructors.current = JSON.stringify(instructorData);
        setShowInstructorModal(true);
    };

    const handleCloseInstructorModal = (save) => {
        if (!save) {
            if (window.confirm("If you exit, your unsaved data will be lost. Are you sure?")) {
                setInstructorData(JSON.parse(prevInstructors.current));
            } else {
                return;
            }
        } else {
            var selected = instructorData.instructors.filter(instructor => instructor.assigned);
            setSelectedInstructors(selected);
        }
        setShowInstructorModal(false);
    };

    function checkLength(input, limit, section, valid) {
        if (!valid) { 
            return false;
        }
        if (input.length > limit) {
            alert(section + " cannot exceed " + limit + " characters");
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

        let assignedInstructors = [];
        for (let i = 0; i < instructorData.instructors.length; i++) {
            if (instructorData.instructors[i].assigned === true) {
                assignedInstructors.push(instructorData.instructors[i].id);
            }
        }

        const formData = {
            selection,
            courseTitle,
            courseDepartment,
            courseCode,
            courseDescription,
            courseYear,
            courseTerm,
            serviceRoleTitle,
            serviceRoleDepartment,
            serviceRoleDescription,
            assignedInstructors, // Array of instructor ID's that will be added to the newly created course/service role
            serviceRoleYear
        };

        console.log("Submitting data:\n\t" +
            "selection: " + `${selection}\n\t` +
            "courseTitle: " + `${courseTitle}\n\t` +
            "courseDepartment: " + `${courseDepartment}\n\t` +
            "CourseCode: " + `${courseCode}\n\t` +
            "courseDescription: " + `${courseDescription}\n\t` +
            "courseYear: " + `${courseYear}\n\t` +
            "courseTerm: " + `${courseTerm}\n\t` +
            "serviceRoleTitle: " + `${serviceRoleTitle}\n\t` +
            "serviceRoleDepartment: " + `${serviceRoleDepartment}\n\t` +
            "serviceRoleDescription: " + `${serviceRoleDescription}\n\t` +
            "assignedInstructors: " + `${assignedInstructors}\n\t` +
            "serviceRoleYear: " + `${serviceRoleYear}\n\t` +
        "");

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
                axios.post('http://localhost:3001/enter', formData).then(() => {
                    if (selection === "Course") {
                        console.log("data enter success. Navigate to new page: course list.");
                        navigate("/deptCourseList");
                    } else {
                        console.log("data enter success. Navigate to new page: Service Role list.");
                        navigate("/ServiceRoleList");
                    }
                });
            }
        }
    }

    return (
        <div className='DataEntry-page'>
            <CreateSidebarDept />
            <div className="container">
                <CreateTopbar />
                <div className='main'>
                    <h1>Data Entry</h1>
                    <div className="create-new">
                        <label htmlFor="create-new-select">Create New:</label>
                        <select id="create-new-select" value={selection} onChange={(e) => handleChange(e)} role="button" name="dropdown">
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
                                    <input type="text" onChange={(e) => setCourseTitle(e.target.value)} id="course-title" placeholder="Enter course title" name="courseTitle" required />
                                </div>
                                <div className='departmentInput formInput'>
                                    <label htmlFor="course-department">Department:</label>
                                    <select id="course-department" placeholder="Select" name="courseDepartment" onChange={(e) => setCourseDepartment(e.target.value)} required>
                                        <option disabled="disabled">Select a division</option>
                                        {divisions.map(division => {
                                            return (
                                                <option key={division.code} value={division.code}>{division.label}</option>
                                            );
                                        })}
                                    </select>
                                    <div className='coursecodeInput'>
                                        <label htmlFor="course-code">Course Code:</label>
                                        <input type="text" id="course-code" name="courseCode" onChange={(e) => {
                                            setCourseCode(e.target.value);
                                        }} required />
                                    </div>
                                    <div className='courseYear'>
                                        <label htmlFor="courseYear">Course Year:</label>
                                        <input type="text" id="courseYear" name="courseYear" onChange={(e) => {
                                            setCourseYear(e.target.value);
                                        }} required />
                                    </div>
                                    <div className='courseTerm'>
                                        <label htmlFor="courseTerm">Course Term:</label>
                                        <input type="text" id="courseTerm" name="courseTerm" onChange={(e) => {
                                            setCourseTerm(e.target.value);
                                        }} required />
                                    </div>
                                </div>

                                <label htmlFor="course-description">Course Description:</label>
                                <textarea id="course-description" onChange={(e) => setCourseDescription(e.target.value)} placeholder="Describe the course" name="courseDescription" required></textarea>

                                <button className="assign-button" data-testid="assign-button" type="button" onClick={handleShowInstructorModal}><span className="plus">+</span> Assign Professors(s)</button>
                                
                                <div>
                                    {selectedInstructors.length > 0 && (
                                        <div className="selected-instructors">
                                            <h3>Selected Instructors</h3>
                                            <ul>
                                                {selectedInstructors.map(instructor => (
                                                    <li key={instructor.profileId}>{instructor.name} (ID: {instructor.id})</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

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
                                    <input type="text" id="service-role-title" onChange={(e) => setServiceRoleTitle(e.target.value)} placeholder="Enter service role title" name="serviceRoleTitle" required />
                                </div>
                                <div className="departmentInput formInput">
                                    <label htmlFor="service-role-department">Department:</label>
                                    <select id="service-role-department" name="serviceRoleDepartment" onChange={(e) => setServiceRoleDepartment(e.target.value)} required>
                                        {divisions.map(division => {
                                            return (
                                                <option key={division.code} value={division.code}>{division.label}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className='serviceroleYear'>
                                    <label htmlFor="serviceroleYear">Assigned Service Role to year:</label>
                                    <input type="text" id="serviceroleYear" name="serviceroleYear" onChange={(e) => {
                                        setServiceRoleYear(e.target.value);
                                    }} required />
                                </div>
                                <label htmlFor="service-role-description">Service Role Description:</label>
                                <textarea id="service-role-description" onChange={(e) => setServiceRoleDescription(e.target.value)} placeholder="Describe the service role" name="serviceRoleDescription" required></textarea>
                                <button type="button" data-testid="assign-button" className="assign-button" onClick={handleShowInstructorModal}><span className="plus">+</span> Assign Professors(s)</button>
                                
                                <div>
                                    {selectedInstructors.length > 0 && (
                                        <div className="selected-instructors">
                                            <h3>Selected Instructors</h3>
                                            <ul>
                                                {selectedInstructors.map(instructor => (
                                                    <li key={instructor.profileId}>{instructor.name} (ID: {instructor.id})</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                
                                <input type="submit" id="service-role-submit" className='hidden' />
                                <input type="hidden" name="formType" value="Service Role" />
                            </form>
                            <label className="finish-button" htmlFor='service-role-submit'>Finish</label>
                        </div>
                    )}

                    {showInstructorModal && (
                        <AssignInstructorsModal instructorData={instructorData} setInstructorData={setInstructorData} handleCloseInstructorModal={handleCloseInstructorModal} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default DataEntryComponent;

