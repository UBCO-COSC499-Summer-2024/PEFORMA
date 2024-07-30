import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { fillEmptyItems, currentItems, checkAccess, getDivisionName, getTermString } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptTeachingAssignment.css';

function DeptTeachingAssignment() {
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

	const handleItemClick = (type, id) => {
		navigate(`/${type === 'course' ? 'DeptCourseInformation' : 'DeptProfilePage'}?${type === 'course' ? 'courseid' : 'ubcid'}=${id}`);
	};

	useEffect(() => {
		const fetchCourses = async () => {
			try {
        checkAccess(accountLogInType, navigate, 'department');
				const res = await axios.get(`http://localhost:3001/api/teachingAssignment`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				if (res.data && res.data.teachinginfo) {
					const filledCourses = fillEmptyItems(res.data.teachinginfo.flatMap(info => 
						info.courses.map((course, index) => ({
							courseCode: course,
							courseName: info.courseName[index],
							id: info.courseid[index],
							instructor: info.instructor,
							ubcid: info.ubcid,
							email: info.email,
							division: info.division.toLowerCase().replace(' ', '-')
						}))
					), res.data.perPage);

					setDeptCourseList({
						courses: filledCourses,
						coursesCount: res.data.teachinginfo.reduce((sum, info) => sum + info.courses.length, 0),
						perPage: res.data.perPage || 10,
						currentPage: 1,
					});

					const divisionMap = {
						'computer-science': 'COSC',
						'mathematics': 'MATH',
						'physics': 'PHYS',
						'statistics': 'STAT',
					};

					const selectedDivisionPrefix = divisionMap[selectedDivision];

					const filteredProfessors = res.data.teachinginfo.filter(info => 
						info.courses.some(course => course.startsWith(selectedDivisionPrefix))
					).map(info => ({
						instructor: info.instructor,
						ubcid: info.ubcid,
						email: info.email,
						division: info.division.toLowerCase().replace(' ', '-')
					}));

					setProfessorList(filteredProfessors);
					setCurrentTerm(getTermString(res.data.currentTerm));

				} else {
					console.error('Unexpected response structure:', res.data);
				}

			} catch (error) {
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('authToken');
					navigate('/Login');
				} else {
					console.error('Error fetching courses:', error);
				}
			}
		};

		fetchCourses();
	}, [authToken, accountLogInType, navigate, selectedDivision]);

	const handleDivisionChange = (event) => {
		setSelectedDivision(event.target.value);
	};

	const handleDetailClick = () => {
		navigate('/DeptTeachingAssignmentDetail', {
			state: {
				selectedDivision,
				courses: deptCourseList.courses,
				professors: professorList,
			},
		});
	};

	const divisionMap = {
		'computer-science': 'COSC',
		'mathematics': 'MATH',
		'physics': 'PHYS',
		'statistics': 'STAT',
	};

	const filteredCourses = deptCourseList.courses.filter((course) => {
		const divisionPrefix = divisionMap[selectedDivision];
		return course.courseCode && course.courseCode.startsWith(divisionPrefix);
	});
	

	const currentCourses = currentItems(filteredCourses, deptCourseList.currentPage, deptCourseList.perPage);

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
							<button className="detail-button" onClick={handleDetailClick}>
								Detail
							</button>
						</div>
						<div className="course-list">
							<p>{getDivisionName(selectedDivision)} Courses:</p>
							<div className="course-cards">
								{currentCourses.map((course) => (
									<div
										key={course.id}
										className="course-card"
										onClick={() => handleItemClick('course', course.id)}
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
									.map((professor, index) => (
										<div
											key={index}
											className="professor-card"
											onClick={() => handleItemClick('professor', professor.ubcid)}
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
