
import React, { useState, useEffect, useRef } from 'react';
import {CreateSidebarDept, CreateTopbar } from '../commonImports.js';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../CSS/Department/DataEntry.css';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/AssignInstructorModal.css';
import divisions from '../common/divisions.js';


function DataEntryComponent() {
    const navigate = useNavigate();
    window.onbeforeunload = function() {
        return "Data will be lost if you leave this page. Are you sure?";
      };

    const [instructorData, setInstructorData] = useState({"instructors":[{}], instructorCount:0, perPage: 8, currentPage: 1});
    const [prevInstructorState, setPrevInstructorState] = useState({"instructors":[{}], instructorCount:0, perPage: 8, currentPage: 1});
    const titleLimit = 100;
    const descLimit = 1000;
    const [search, setSearch] = useState('');

    const [selection, setSelection] = useState(''); // State to hold the dropdown selection
    const [showInstructorModal, setShowInstructorModal] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDepartment, setCourseDepartment] = useState('COSC');
    const [courseCode, setCourseCode] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [serviceRoleTitle, setServiceRoleTitle] = useState('');
    const [serviceRoleDepartment, setServiceRoleDepartment] = useState('COSC');
    const [serviceRoleDescription, setServiceRoleDescription] = useState('');

    
    const handleChange = (event) => {
        setSelection(event.target.value);
        // Potentially navigate to different components or render different forms here
        console.log(`Selected: ${event.target.value}`);
    };

    useEffect(() => {
        const fetchData = async() => {
          const url = "http://localhost:3000/assignInstructors.json"; // Gets from temporary JSON file. Should be replaced with backend.
          const res = await axios.get(url);
          const data = res.data;
          const filledInstructors = fillEmptyInstructors(data.instructors, data.perPage);
          setInstructorData({ ...data, instructors: filledInstructors });
        }
        fetchData();
      }, []);

      const fillEmptyInstructors = (instructors, perPage) => {
        const filledInstructors = [...instructors];
        const currentCount = instructors.length;
        const fillCount = perPage - (currentCount % perPage);
        if (fillCount < perPage) {
          for (let i  = 0; i < fillCount; i++) {
            filledInstructors.push({});
          }
        }
        return filledInstructors;
      }


    const toggleInstructorAssigned = (id, assign) => {
       let button = document.getElementById(id);
        for (let i = 0; i<instructorData.instructorCount;i++) {
            if (instructorData.instructors[i].id === id) {
                if (!assign) {
                    instructorData.instructors[i].assigned = true;
                    button.innerHTML = "Remove";
                    button.classList.toggle("remove");
                    button.classList.toggle("add");
                } else {
                    instructorData.instructors[i].assigned = false;
                    button.innerHTML = "Add";
                    button.classList.toggle("remove");
                    button.classList.toggle("add");
                }
                
            }
        }
        
    };
    const prevInstructors = useRef({});
    const handlePageClick = (data) => {
        setInstructorData(prevState => ({
          ...prevState,
          currentPage: data.selected + 1
        }))
      };

    
    const handleShowInstructorModal = () => {
        prevInstructors.current = JSON.stringify(instructorData);
        setPrevInstructorState(new Object(instructorData));
        setShowInstructorModal(true);
    };

    const handleCloseInstructorModal = (save) => {
        if (!save) {
            if (window.confirm("If you exit, your unsaved data will be lost. Are you sure?")) {
                setInstructorData(JSON.parse(prevInstructors.current));
            } else {
                return;
            }
        }
        setShowInstructorModal(false);
    };

    const onSearch = (newSearch) => {
        console.log("Searched:", newSearch);
        setSearch(newSearch);
        setInstructorData(prevState => ({ ...prevState, currentPage: 1 }));
      };


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
                serviceRoleTitle,
                serviceRoleDepartment,
                serviceRoleDescription,
                assignedInstructors, // Array of instructor ID's that will be added to the newly created course/service role
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


    const pageCount = Math.ceil(instructorData.instructorCount / instructorData.perPage);
    const filteredInstructors = instructorData.instructors.filter(instructor =>
        (instructor.name?.toString().toLowerCase() ?? "").includes(search.toLowerCase()) ||
        (instructor.id?.toString().toLowerCase() ?? "").includes(search.toLowerCase())
      );

      const currentInstructors = filteredInstructors.slice(
        (instructorData.currentPage - 1) * instructorData.perPage,
        instructorData.currentPage * instructorData.perPage
      );



    let i = 0;

    return (
        <div className='DataEntry-page'>
            <CreateSidebarDept/>
            <div className="container">
                <CreateTopbar />
                <div className='main'>
                <h1>Data Entry</h1>
                <div className="create-new">
                    <label htmlFor="create-new-select">Create New:</label>
                    <select id="create-new-select" value={selection} onChange={(e)=>handleChange(e)} role ="button" name="dropdown">

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
                    <div className="assignModal">
                        <div className='assignModalTop'>
                            <div className="modalTitle">Assign <span className='bold'>Instructor(s)</span></div>
                            <button className="close-button" onClick={()=>handleCloseInstructorModal(false)}>X</button>
                        </div>
                        <input type="text" placeholder="Search for instructors to assign" onChange={e => onSearch(e.target.value)} />
                        <table>
                            <tbody>
                                {currentInstructors.map(instructor => {
                                    i++;
                                    if (instructor.id == null) {
                                        return (<tr key={i} className="instructor-item">
                                            <td></td><td></td>
                                            <td></td>
                                        </tr>);
                                    }
                                    return (
                                    <tr key={i} className="instructor-item">
                                        <td className='bold'>{instructor.name}</td><td>UBC ID: {instructor.id}</td>
                                        <td>
                                            <button id={instructor.id} className={"bold "+(instructor.assigned?"remove":"add")} onClick={() => toggleInstructorAssigned(instructor.id, instructor.assigned)}>
                                                {instructor.assigned ? 'Remove' : 'Add'}
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })}
                                
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3">
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            nextLabel={'>'}
                                            breakLabel={'...'}
                                            pageCount={pageCount}
                                            marginPagesDisplayed={3}
                                            pageRangeDisplayed={0}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                        />
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        
                        <button className="save-button" onClick={()=>handleCloseInstructorModal(true)}>Save</button>
                    </div>
                </div>
            )}
            </div>
            </div>
        </div>
    );
}

export default DataEntryComponent;
