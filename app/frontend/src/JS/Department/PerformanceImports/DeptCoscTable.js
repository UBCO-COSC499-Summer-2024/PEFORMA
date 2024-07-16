import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import axios from 'axios';
import { useAuth } from '../../common/AuthContext';

function CoscTable() {
	const { authToken } = useAuth();

	const [courses, setCourses] = useState([]);
	const [filteredCourses, setFilteredCourses] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`http://localhost:3001/api/coursePerformance`, {
					params: { divisionId: 1 },
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				if (res.data && Array.isArray(res.data.courses)) {
					const coursesData = res.data.courses;
					const sortedCourses =
						coursesData.length > 1
							? coursesData.sort((a, b) => b.score - a.score)
							: coursesData.course;
					setCourses(sortedCourses);
					setFilteredCourses(sortedCourses);
				} else {
					console.log('wrong data format');
				}
			} catch (error) {
				console.log('Error fetching data: ', error);
			}
		};
		fetchData();
	}, []);

	const filterCourses = (identifier) => {
		if (identifier == 'All') {
			setFilteredCourses(courses);
		} else {
			const filtered = courses.filter((course) =>
				course.courseCode.startsWith(`COSC ${identifier}`)
			);
			setFilteredCourses(filtered);
		}
	};

	return (
		<div className="division-performance-table" id="cosc-test-content">
			<div className="header-container">
				<h1 className="subTitleD">Computer Science</h1>
				<div>
					{['All', 1, 2, 3, 4].map((identifier) => (
						<button
							className="year-button"
							key={identifier}
							onClick={() => filterCourses(identifier)}>
							{identifier}
						</button>
					))}
				</div>
			</div>

			<table className="divi-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Course</th>
						<th>Rank</th>
						<th>Score</th>
					</tr>
				</thead>
				<div className="scrollable-body">
					<tbody>
						{filteredCourses.map((course, index) => (
							<tr key={index}>
								<td>{index + 1}</td>
								<td>{course.courseCode}</td>
								<td>{course.rank}</td>
								<td>{course.score}</td>
							</tr>
						))}
					</tbody>
				</div>
			</table>
		</div>
	);
}

export default CoscTable;
