import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { fillEmptyItems, currentItems, checkAccess } from '../common/utils.js';
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
	const [memberData, setMemberData] = useState({
		members: [],
		membersCount: 0,
		perPage: 10,
		currentPage: 1,
	});
	const [selectedDivision, setSelectedDivision] = useState('computer-science');

	const getDivisionName = (division) => {
		const divisionNames = {
			'computer-science': 'Computer Science',
			mathematics: 'Mathematics',
			physics: 'Physics',
			statistics: 'Statistics',
		};
		return divisionNames[division] || '';
	};

	const handleItemClick = (type, id) => {
		navigate(`/${type === 'course' ? 'DeptCourseInformation' : 'DeptProfilePage'}?${type}id=${id}`);
	};

	useEffect(() => { // will add course.status later after api is fixed
		checkAccess(accountLogInType, navigate, 'department');
		const fetchCourses = async () => {
			try {
				const res = await axios.get(`http://localhost:3001/api/all-courses`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				const filledCourses = fillEmptyItems(res.data.courses, res.data.perPage);
				setDeptCourseList({
					courses: filledCourses,
					coursesCount: res.data.courses.length,
					perPage: res.data.perPage,
					currentPage: 1,
				});
			} catch (error) {
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('authToken');
					navigate('/Login');
				} else {
					console.error('Error fetching courses:', error);
				}
			}
		};

		const fetchMembers = async () => {
			try {
				const res = await axios.get(`http://localhost:3001/api/allInstructors`, {
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				const activeMembers = res.data.members.filter((member) => member.status);
				const filledMembers = fillEmptyItems(activeMembers, res.data.perPage);
				setMemberData({
					members: filledMembers,
					membersCount: activeMembers.length,
					perPage: res.data.perPage,
					currentPage: 1,
				});
			} catch (error) {
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('authToken');
					navigate('/Login');
				} else {
					console.error('Error fetching members:', error);
				}
			}
		};

		fetchCourses();
		fetchMembers();
	}, [authToken]);

	const handleDivisionChange = (event) => {
		setSelectedDivision(event.target.value);
	};

	const handleDetailClick = () => {
		navigate('/DeptTeachingAssignmentDetail', {
			state: {
				selectedDivision,
				courses: deptCourseList.courses,
				members: memberData.members,
			},
		});
	};

	const filteredCourses = deptCourseList.courses.filter((course) => {
		const prefix =
			selectedDivision === 'computer-science' ? 'COSC' : selectedDivision.slice(0, 4).toUpperCase();
		return course.courseCode.startsWith(prefix);
	});

	const currentCourses = currentItems(
		filteredCourses,
		deptCourseList.currentPage,
		deptCourseList.perPage
	);

	const filteredMembers = memberData.members.filter(
		(member) => member.department === getDivisionName(selectedDivision)
	);
	const currentMembers = currentItems(filteredMembers, memberData.currentPage, memberData.perPage);

	return (
		<div className="dashboard-container">
			<CreateSideBar sideBarType="Department" />
			<div className="container" id="info-test-content">
				<CreateTopBar />
				<div className="teaching-assignment-subtitle">
					<h1>Teaching assignment (2024 winter term)</h1>
				</div>
				<div className="division-box">
					<div className="division-card">
						<div className="division-header">
							<select className="division-selection-assign" onChange={handleDivisionChange}>
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
										{course.courseCode}: {course.title}
									</div>
								))}
							</div>
						</div>
						<div className="professor-list">
							<p>{getDivisionName(selectedDivision)} Professors:</p>
							<div className="professor-cards">
								{currentMembers.map((member) => (
									<div
										key={member.id}
										className="professor-card"
										onClick={() => handleItemClick('professor', member.ubcId)}
										style={{ cursor: 'pointer' }}>
										{member.name}
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
