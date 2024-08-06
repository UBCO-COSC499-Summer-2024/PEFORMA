import React, { useState, useEffect } from 'react';
import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Department/DeptDataEntry.css';
import '../../CSS/Department/AssignInstructorModal.css';
import divisions from '../common/divisions.js';
import { useAuth } from '../common/AuthContext.js';
import { FaFileUpload } from "react-icons/fa";
import ImportModal from './DataImportImports/DeptImportModal.js';
import {checkAccess} from '../common/utils.js';

// Variables for maximum title and description length
const titleLimit = 100;
const descLimit = 1000;

function checkLength(input, limit, section, valid) {
	if (!valid) {
		return false;
	}
	if (input.length > limit) {
		alert(section + ' cannot exceed ' + limit + ' characters');
		return false;
	}
	return true;
}

function checkCourseCode(valid, courseCode) {
	if (!valid) {
		return false;
	}
	// Checks course code length
	if (courseCode.length !== 3) {
		alert('Course code should be 3 digits.');
		return false;
	}
	// Checks course code is all digits
	for (let i = 0; i < courseCode.length; i++) {
		if (!Number.isInteger(parseInt(courseCode.charAt(i)))) {
			alert('Course code should be 3 digits.');
			return false;
		}
	}
	return true;
}

// Helper function for checking course input fields
function checkCourseValidity(courseTitle, titleLimit, courseDescription, descLimit, courseCode) {
	let valid = true;
	valid = checkLength(courseTitle, titleLimit, 'Title', valid);
	valid = checkLength(courseDescription, descLimit, 'Description', valid);
	valid = checkCourseCode(valid, courseCode);
	return valid;
}

// Helper function for checking service role input fields
function checkServiceRoleValidity(serviceRoleTitle, titleLimit, serviceRoleDescription, descLimit) {
	let valid = true;
	valid = checkLength(serviceRoleTitle, titleLimit, 'Title', valid);
	valid = checkLength(serviceRoleDescription, descLimit, 'Description', valid);
	return valid;
}
const handleSubmit = async (event, formData, navigate) => {
	event.preventDefault();
	// Check validity of input and set confirm message
	let valid = false;
	let confirmMessage = '';
	if (formData.selection === 'Course') {
		valid = checkCourseValidity(formData.courseTitle, titleLimit, formData.courseDescription, descLimit, formData.courseCode);
		confirmMessage = 'Confirm course creation?';
	}
	if (formData.selection === 'Service Role') {
		valid = checkServiceRoleValidity(formData.serviceRoleTitle, titleLimit, formData.serviceRoleDescription, descLimit);
		confirmMessage = 'Confirm service role creation?';
	}
	if (valid) {
		if (window.confirm(confirmMessage) === true) {
			sendData(formData, navigate);
		}
	}
};

const sendData = async(formData, navigate) => {
	// Send inputted data to backend to be added to database
	axios.post('http://localhost:3001/enter', formData)
	.then(() => {
		if (formData.selection === 'Course') {
			alert('Data entry successful. Navigating to course list.');
			navigate('/DeptCourseList');
		} else {
			alert('Data entry successful. Navigating to service role list.');
			navigate('/DeptServiceRoleList');
		}
	})
	.catch(error => {
		// Handling errors here
		if (error.response) {
			alert(`Failed to enter data. Server responded with error message: ${error.message}`);
		} else if (error.request) {
			alert('Failed to enter data. No response from server.');
		} else {
			alert('Error: ' + error.message);
		}
	});
}

function useDataEntryComponent() {
	const navigate = useNavigate();
	const { accountLogInType, authToken } = useAuth();
	window.onbeforeunload = function () {
		return 'Data will be lost if you leave this page. Are you sure?';
	};
	// Assortment of state variables
	const [selection, setSelection] = useState('');
	const [courseTitle, setCourseTitle] = useState('');
	const [courseDepartment, setCourseDepartment] = useState('COSC');
	const [courseCode, setCourseCode] = useState('');
	const [courseDescription, setCourseDescription] = useState('');
	const [serviceRoleTitle, setServiceRoleTitle] = useState('');
	const [serviceRoleDepartment, setServiceRoleDepartment] = useState('COSC');
	const [serviceRoleDescription, setServiceRoleDescription] = useState('');
	const [showFileUploadModal, setShowFileUploadModal] = useState(false);
	useEffect(() => {

		const fetchData = async () => {
			try {
				// Ensure account type is correct
				checkAccess(accountLogInType, navigate, 'department', authToken);
				divisions[4].code = "N/A";
				divisions[4].label = "N/A";
			} catch (error) {
				console.error('Error occurs when fetching people.\nDetail message:\n', error);
			}
		};
		fetchData();

	}, []);
	return {
		selection, setSelection,
		courseTitle, setCourseTitle,
		courseDepartment, setCourseDepartment,
		courseCode, setCourseCode,
		courseDescription, setCourseDescription,
		serviceRoleTitle, setServiceRoleTitle,
		serviceRoleDepartment, setServiceRoleDepartment,
		serviceRoleDescription, setServiceRoleDescription,
		showFileUploadModal, setShowFileUploadModal,
		navigate
	}
}

function DataEntryComponent() {
	const {
		selection, setSelection,
		courseTitle, setCourseTitle,
		courseDepartment, setCourseDepartment,
		courseCode, setCourseCode,
		courseDescription, setCourseDescription,
		serviceRoleTitle, setServiceRoleTitle,
		serviceRoleDepartment, setServiceRoleDepartment,
		serviceRoleDescription, setServiceRoleDescription,
		showFileUploadModal, setShowFileUploadModal,
		navigate
	} = useDataEntryComponent();

	const courseFormData = {selection, courseTitle, courseDepartment, courseCode, courseDescription};
	const roleFormData = {selection, serviceRoleTitle, serviceRoleDepartment, serviceRoleDescription};
	
	return (
		<div className="DataEntry-page">
			<SideBar sideBarType="Department" />
			<div className="container">
				<TopBar />
				<div className="main">
					<h1>Create New Course/Role</h1>
					<div className="create-new">
						<label htmlFor="create-new-select">Create New:</label>
						<select
							id="create-new-select"
							value={selection}
							onChange={(e) => setSelection(e.target.value)}
							role="button"
							name="dropdown">
							<option value="" disabled>
								Select
							</option>
							<option value="Service Role" name="newServiceRole" role="button">
								Service Role
							</option>
							<option value="Course" name="newCourse" role="button">
								Course
							</option>
						</select>
						<span>OR</span>
						<button onClick={() => setShowFileUploadModal(true)} id="import">
							Import Data <FaFileUpload className='upload-icon' />
						</button>
					</div>
					{selection === 'Course' && (
						<div className="form-container">
							<form
								className="course-form"
								data-testid="course-form"
								role="form"
								onSubmit={(e)=>handleSubmit(e, courseFormData, navigate)}>
								<div className="titleInput formInput">
									<label htmlFor="course-title">Course Title:</label>
									<input
										type="text"
										onChange={(e) => setCourseTitle(e.target.value)}
										id="course-title"
										placeholder="Enter course title"
										name="courseTitle"
										required
									/>
								</div>
								<div className="departmentInput formInput">
									<label htmlFor="course-department">Department:</label>
									<select
										id="course-department"
										placeholder="Select"
										name="courseDepartment"
										onChange={(e) => setCourseDepartment(e.target.value)}
										required>
										<option disabled="disabled">Select a division</option>
										{divisions.map((division) => {
											if (division.code != "ALL" && division.code != "N/A") {
												return (
													<option key={division.code} value={division.code}>
														{division.label}
													</option>
												);
											}
										})}
									</select>
									<div className="coursecodeInput formInput">
										<label htmlFor="course-code">Course Code:</label>
										<input
											type="text"
											placeholder='e.g. 111'
											id="course-code"
											name="courseCode"
											onChange={(e) => {
												setCourseCode(e.target.value);
											}}
											required
										/>
									</div>
								</div>
								<label htmlFor="course-description">Course Description:</label>
								<textarea
									id="course-description"
									onChange={(e) => setCourseDescription(e.target.value)}
									placeholder="Describe the course"
									name="courseDescription"
									required></textarea>
								
								<input type="submit" id="service-role-submit" className="hidden" />
								<input type="hidden" name="formType" value="Service Role" />
							</form>
							<label className="finish-button" htmlFor="service-role-submit">
								Finish
							</label>
						</div>
					)}

					{selection === 'Service Role' && (
						<div className="form-container">
							<form
								className="service-role-form"
								data-testid="service-role-form"
								role="form"
								onSubmit={(e)=>handleSubmit(e, roleFormData, navigate)}>
								<div className="titleInput formInput">
									<label htmlFor="service-role-title">Service Role Title:</label>
									<input
										type="text"
										id="service-role-title"
										onChange={(e) => setServiceRoleTitle(e.target.value)}
										placeholder="Enter service role title"
										name="serviceRoleTitle"
										required
									/>
								</div>
								<div className="departmentInput formInput">
									<label htmlFor="service-role-department">Department:</label>
									<select
										id="service-role-department"
										name="serviceRoleDepartment"
										onChange={(e) => setServiceRoleDepartment(e.target.value)}
										required>
										{divisions.map((division) => {
											return (
												<option key={division.code} value={division.code}>
													{division.label}
												</option>
											);
										})}
									</select>
								</div>
								
								<label htmlFor="service-role-description">Service Role Description:</label>
								<textarea
									id="service-role-description"
									onChange={(e) => setServiceRoleDescription(e.target.value)}
									placeholder="Describe the service role"
									name="serviceRoleDescription"
									required>
								</textarea>
								<input type="submit" id="service-role-submit" className="hidden" />
								<input type="hidden" name="formType" value="Service Role" />
							</form>
							<label className="finish-button" htmlFor="service-role-submit">
								Finish
							</label>
						</div>
					)}
					<ImportModal
						isOpen={showFileUploadModal}
						onClose={() => setShowFileUploadModal(false)}
					/>
				</div>
			</div>
		</div>
	);
}

export default DataEntryComponent;
