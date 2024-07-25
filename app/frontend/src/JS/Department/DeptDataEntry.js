import React, { useState, useEffect, useRef, useReducer } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Department/DeptDataEntry.css';
import '../../CSS/Department/AssignInstructorModal.css';
import divisions from '../common/divisions.js';
import AssignInstructorsModal from '../InsAssignInstructorsModal.js';
import { useAuth } from '../common/AuthContext.js';
import { FaFileUpload } from "react-icons/fa";
import ImportModal from './DataImportImports/DeptImportModal.js';

function DataEntryComponent() {
	const navigate = useNavigate();
	const { accountLogInType, authToken } = useAuth();
	window.onbeforeunload = function () {
		return 'Data will be lost if you leave this page. Are you sure?';
	};

	const [instructorData, setInstructorData] = useState({
		instructors: [{}],
		instructorCount: 0,
		perPage: 8,
		currentPage: 1,
	});
	const titleLimit = 100;
	const descLimit = 1000;

	const [selection, setSelection] = useState('');
	const [showInstructorModal, setShowInstructorModal] = useState(false);
	const [courseTitle, setCourseTitle] = useState('');
	const [courseDepartment, setCourseDepartment] = useState('COSC');
	const [courseCode, setCourseCode] = useState('');
	const [courseDescription, setCourseDescription] = useState('');
	const [courseYear, setCourseYear] = useState('');
	const [sessionTerm, setSessionTerm] = useState(1);
	const [courseSession, setCourseSession] = useState('W');
	const [serviceRoleTitle, setServiceRoleTitle] = useState('');
	const [serviceRoleDepartment, setServiceRoleDepartment] = useState('COSC');
	const [serviceRoleDescription, setServiceRoleDescription] = useState('');
	const [selectedInstructors, setSelectedInstructors] = useState([]);
	const [serviceRoleYear, setServiceRoleYear] = useState('');
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const [monthlyHours, setMonthlyHours] = useState({ january: 0, february: 0, march: 0, april: 0, may: 0, june: 0, july: 0, august: 0, september: 0, october: 0, november: 0, december: 0 });

	const [showFileUploadModal, setShowFileUploadModal] = useState(false);

	const handleChange = (event) => {
		setSelection(event.target.value);
		console.log(`Selected: ${event.target.value}`);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const numericAccountType = Number(accountLogInType);
				if (numericAccountType !== 1 && numericAccountType !== 2) {
					alert('No Access, Redirecting to instructor view');
					navigate('/Dashboard');
				}
				const token = localStorage.getItem('token') || process.env.DEFAULT_ACTIVE_TOKEN;
				const url = 'http://localhost:3001/api/instructors';
				const res = await axios.get(url, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = res.data;
				const filledInstructors = fillEmptyInstructors(data.instructors, data.perPage);
				setInstructorData({ ...data, instructors: filledInstructors });
			} catch (error) {
				console.error('Error occurs when fetching people.\nDetail message:\n', error);
			}
		};
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
	};

	const prevInstructors = useRef({});

	const handleShowInstructorModal = () => {
		prevInstructors.current = JSON.stringify(instructorData);
		setShowInstructorModal(true);
	};

	const handleCloseInstructorModal = (save) => {
		if (!save) {
			if (window.confirm('If you exit, your unsaved data will be lost. Are you sure?')) {
				setInstructorData(JSON.parse(prevInstructors.current));
			} else {
				return;
			}
		} else {
			var selected = instructorData.instructors.filter((instructor) => instructor.assigned);
			setSelectedInstructors(selected);
		}
		instructorData.currentPage = 1;
		setShowInstructorModal(false);
	};

	const removeInstructor = (id, index) => {
		selectedInstructors.splice(index, 1);
		for (let i = 0; i < instructorData.instructors.length; i++) {
			if (id === instructorData.instructors[i].id) {
				instructorData.instructors[i].assigned = false;
				break;
			}
		}
		forceUpdate();
	}

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

	function checkCourseCode(valid) {
		if (!valid) {
			return false;
		}
		if (courseCode.length !== 3) {
			alert('Course code should be 3 digits.');
			return false;
		}
		for (let i = 0; i < courseCode.length; i++) {
			if (!Number.isInteger(parseInt(courseCode.charAt(i)))) {
				alert('Course code should be 3 digits.');
				return false;
			}
		}
		return true;
	}

	function checkCourseValidity() {
		let valid = true;
		valid = checkLength(courseTitle, titleLimit, 'Title', valid);
		valid = checkLength(courseDescription, descLimit, 'Description', valid);
		valid = checkCourseCode(valid);
		return valid;
	}

	function checkServiceRoleValidity() {
		let valid = true;
		valid = checkLength(serviceRoleTitle, titleLimit, 'Title', valid);
		valid = checkLength(serviceRoleDescription, descLimit, 'Description', valid);
		return valid;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		let assignedInstructors = [];
		for (let i = 0; i < instructorData.instructors.length; i++) {
			if (instructorData.instructors[i].assigned === true) {
				assignedInstructors.push(instructorData.instructors[i].id);
			}
		}
		let courseTerm = 1;
		if (courseSession == "S") {
			if (sessionTerm == 1) {
				courseTerm = 3;
			} else {
				courseTerm = 4;
			}
		} else {
			if (sessionTerm == 1) {
				courseTerm = 1;
			} else {
				courseTerm = 2;
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
			assignedInstructors,
			serviceRoleYear,
			monthlyHours
		};

		console.log('Submitting data:', formData);

		let valid = false;
		let confirmMessage = '';
		if (selection === 'Course') {
			valid = checkCourseValidity();
			confirmMessage = 'Confirm course creation?';
		}
		if (selection === 'Service Role') {
			valid = checkServiceRoleValidity();
			confirmMessage = 'Confirm service role creation?';
		}
		if (valid) {
			if (window.confirm(confirmMessage) === true) {
				axios.post('http://localhost:3001/enter', formData)
					.then(() => {
						if (selection === 'Course') {
							alert('Data entry successful. Navigate to new page: Course list.');
							navigate('/DeptCourseList');
						} else {
							alert('Data entry successful. Navigate to new page: Service Role list.');
							navigate('/DeptServiceRoleList');
						}
					})
					.catch(error => {
						// Handling errors here
						if (error.response) {
							alert(`Failed to enter data. Server responded with status: ${error.response.status}`);
						} else if (error.request) {
							alert('Failed to enter data. No response from server.');
						} else {
							alert('Error: ' + error.message);
						}
					});
			}
			
		}
	};

	return (
		<div className="DataEntry-page">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />
				<div className="main">
					<h1>Create New Course/Role</h1>
					<div className="create-new">
						<label htmlFor="create-new-select">Create New:</label>
						<select
							id="create-new-select"
							value={selection}
							onChange={(e) => handleChange(e)}
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
								onSubmit={handleSubmit}>
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
											if (division.code != "ALL") {
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
								onSubmit={handleSubmit}>
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
					
								<label>Estimated hours per month:</label>
								<div className="monthlyHours">
									<div className='monthlyHoursRow formInput'>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.january = e.target.value }}/>
											<div>January</div>
										</span>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.february = e.target.value }}/>
											<div>February</div>
										</span>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.march = e.target.value }}/>
											<div>March</div>
										</span>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.april = e.target.value }}/>
											<div>April</div>
										</span>
									</div>
									<div className='monthlyHoursRow formInput'>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.may = e.target.value }}/>
											<div>May</div>
										</span>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.june = e.target.value }}/>
											<div>June</div>
										</span>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.july = e.target.value }}/>
											<div>July</div>
										</span>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.august = e.target.value }}/>
											<div>August</div>
										</span>
									</div>
									<div className='monthlyHoursRow formInput'>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.september = e.target.value }}/>
											<div>September</div>
										</span>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.october = e.target.value }} />
											<div>October</div>
										</span>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.november = e.target.value }} />
											<div>November</div>
										</span>
										<span>
											<input type="number" placeholder='hours' min="0" onChange={(e) => { monthlyHours.december = e.target.value }} />
											<div>December</div>
										</span>
									</div>
								</div>
								<label htmlFor="service-role-description">Service Role Description:</label>
								<textarea
									id="service-role-description"
									onChange={(e) => setServiceRoleDescription(e.target.value)}
									placeholder="Describe the service role"
									name="serviceRoleDescription"
									required></textarea>

								<input type="submit" id="service-role-submit" className="hidden" />
								<input type="hidden" name="formType" value="Service Role" />
							</form>
							<label className="finish-button" htmlFor="service-role-submit">
								Finish
							</label>
						</div>
					)}
					
					{showInstructorModal && (
						<AssignInstructorsModal
							instructorData={instructorData}
							setInstructorData={setInstructorData}
							handleCloseInstructorModal={handleCloseInstructorModal}
						/>
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