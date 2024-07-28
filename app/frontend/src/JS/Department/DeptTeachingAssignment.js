import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { fillEmptyItems, currentItems, checkAccess, getDivisionName, getTermString, fetchWithAuth, filterByDivision } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptTeachingAssignment.css';

function handleItemClick(navigate, type, id) {
	navigate(`/${type === 'course' ? 'DeptCourseInformation' : 'DeptProfilePage'}?${type === 'course' ? 'courseid' : 'ubcid'}=${id}`);
}

function useDeptTeachingAssignment() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const [deptCourseList, setDeptCourseList] = useState({
		courses: [],
		coursesCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [professorList, setProfessorList] = useState([]);
	const [selectedDivision, setSelectedDivision] = useState('computer-science');
	const [currentTerm, setCurrentTerm] = useState('');
	const divisionMap = {
    'computer-science': 'COSC',
    'mathematics': 'MATH',
    'physics': 'PHYS',
    'statistics': 'STAT',
	};
	const handleDivisionChange = event => setSelectedDivision(event.target.value);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
        checkAccess(accountLogInType, navigate, 'department');
				const data = await fetchWithAuth(`http://localhost:3001/api/teachingAssignment`, authToken, navigate);
				if (data && data.teachinginfo) {
					const filledCourses = fillEmptyItems(data.teachinginfo.flatMap(info => 
						info.courses.map((course, index) => ({
							courseCode: course,
							courseName: info.courseName[index],
							id: info.courseid[index],
							instructor: info.instructor,
							ubcid: info.ubcid,
							email: info.email,
							division: info.division.toLowerCase().replace(' ', '-')
						}))
					), data.perPage);
					setDeptCourseList({
						courses: filledCourses,
						coursesCount: data.teachinginfo.reduce((sum, info) => sum + info.courses.length, 0),
						perPage: data.perPage || 10,
						currentPage: 1,
					});

					const selectedDivisionPrefix = divisionMap[selectedDivision];
					const filteredProfessors = data.teachinginfo.filter(info => 
						info.courses.some(course => course.startsWith(selectedDivisionPrefix))
					).map(info => ({
						instructor: info.instructor,
						ubcid: info.ubcid,
						email: info.email,
						division: info.division.toLowerCase().replace(' ', '-')
					}));

					setProfessorList(filteredProfessors);
					setCurrentTerm(getTermString(data.currentTerm));

				} else {
					console.error('Unexpected response structure:', data);
				}

			} catch (error) {
				console.error('Error fetching courses:', error);
			}
		};

		fetchCourses();
	}, [authToken, accountLogInType, navigate]);

	const filteredByDivisionCourses = filterByDivision(deptCourseList.courses, selectedDivision, divisionMap);
	const currentCourses = currentItems(filteredByDivisionCourses, deptCourseList.currentPage, deptCourseList.perPage);

	return {
		deptCourseList,
		professorList,
		navigate,
		handleDivisionChange,
		selectedDivision,
		currentTerm,
		currentCourses,
	}
}

function DeptTeachingAssignment() {
	const {
		deptCourseList,
		professorList,
		navigate,
		handleDivisionChange,
		selectedDivision,
		currentTerm,
		currentCourses
    } = useDeptTeachingAssignment();

	return (
		<div className="dashboard-container">
			<CreateSideBar sideBarType="Department" />
			<div className="container" id='teaching-assignment-test-content'>
				<CreateTopBar />
				<div className="teaching-assignment-subtitle">
					<h1>Teaching assignment ({currentTerm})</h1>
				</div>
				<div className="division-box">
					<div className="division-card">
						<div className="division-header">
							<select className="division-selection-assign" onChange={handleDivisionChange} value={selectedDivision}>
								<option value="computer-science">Computer Science</option>
								<option value="mathematics">Mathematics</option>
								<option value="physics">Physics</option>
								<option value="statistics">Statistics</option>
							</select>
							<Link to={`/DeptTeachingAssignmentDetail`} className='detail-button'
								state={{ selectedDivision,
									courses: deptCourseList.courses,
									professors: professorList
										}}>
								Detail
							</Link>
						</div>
						<div className="course-list">
							<p>{getDivisionName(selectedDivision)} Courses:</p>
							<div className="course-cards">
								{currentCourses.map((course) => (
									<div
										key={course.id}
										className="course-card"
										onClick={() => handleItemClick(navigate, 'course', course.id)}
										style={{ cursor: 'pointer' }}>
										{course.courseCode}: {course.courseName}
									</div>
								))}
							</div>
						</div>
						<div className="professor-list">
							<p>{getDivisionName(selectedDivision)} Professors:</p>
							<div className="professor-cards">
								{professorList
									.filter(professor => professor.instructor !== "Not Assigned")
									.map((professor, index) => (
										<div
											key={index}
											className="professor-card"
											onClick={() => handleItemClick(navigate, 'professor', professor.ubcid)}
											style={{ cursor: 'pointer' }}>
											{professor.instructor}
										</div>
									))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeptTeachingAssignment;
