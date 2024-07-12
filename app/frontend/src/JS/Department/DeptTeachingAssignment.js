import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import { fillEmptyItems, currentItems, checkAccess, getDivisionName } from '../common/utils.js';
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

	const getTermString = (term) => {
		const termStr = term.toString();
		const year = termStr.slice(0, -1);
		const termCode = termStr.slice(-1);
	
		const termMap = {
			1: 'Winter Term 1',
			2: 'Winter Term 2',
			3: 'Summer Term 1',
			4: 'Summer Term 2',
		};
	
		if (termStr.length === 4) { // edge case
			return `${termStr} Winter Term 1`;
		}
	
		return `${year} ${termMap[termCode] || ''}`;
	};

	useEffect(() => {
		const fetchCourses = async () => {
			try {
        checkAccess(accountLogInType, navigate, 'department');
				const res = await axios.get(`http://localhost:3001/api/teachingAssignment`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				console.log(res);
				const filledCourses = fillEmptyItems(res.data['teaching-info'].flatMap(info => 
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

				const professors = res.data['teaching-info'].map(info => ({
					instructor: info.instructor,
					ubcid: info.ubcid,
					email: info.email,
					division: info.division.toLowerCase().replace(' ', '-')
				}));

				setDeptCourseList({
					courses: filledCourses,
					coursesCount: res.data['teaching-info'].reduce((sum, info) => sum + info.courses.length, 0),
					perPage: res.data.perPage,
					currentPage: 1,
				});
				setProfessorList(professors);
				setCurrentTerm(getTermString(res.data.currentTerm));
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
	}, [authToken, accountLogInType, navigate]);

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

	const filteredCourses = deptCourseList.courses.filter((course) => course.division === selectedDivision);
	const currentCourses = currentItems(filteredCourses, deptCourseList.currentPage, deptCourseList.perPage);

	return (
		<div className="dashboard-container">
			<CreateSideBar sideBarType="Department" />
			<div className="container" id="info-test-content">
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
									.filter(prof => prof.division === selectedDivision)
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
