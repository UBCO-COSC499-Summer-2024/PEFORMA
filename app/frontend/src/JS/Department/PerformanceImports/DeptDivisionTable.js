import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import { filterYearLevelCourses } from '../../common/utils';

function filterCourses(courses, identifier, prefix) {
	return filterYearLevelCourses(courses, identifier, prefix);
}

function DeptDivisionTable({ departmentName, courses, prefix }) {
	const [courseTable, setCourseTable] = useState(courses);

	useEffect(() => {
		setCourseTable(courses);
	}, [courses]);

	return (
		<div className="division-performance-table" id="division-table-test-content">
			<div className="header-container">
				<h1 className="subTitleD">{departmentName}</h1>
				<div>
					{['All', '100', '200', '300', '400'].map((identifier) => (
						<button
							className="year-button"
							key={identifier}
							onClick={() => setCourseTable(filterCourses(courses, identifier, prefix))}>
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
					<tbody className="scrollable-body">
						{courseTable.map((course, index) => (
							<tr key={index}>
								<td>{index + 1}</td>
								<td>{course.courseCode}</td>
								<td>{course.rank}</td>
								<td>{course.score}</td>
							</tr>
						))}
					</tbody>
			</table>
		</div>
	);
}

export default DeptDivisionTable;
