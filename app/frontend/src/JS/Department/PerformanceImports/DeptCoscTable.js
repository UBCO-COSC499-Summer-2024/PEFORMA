import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import { filterYearLevelCourses } from '../../common/utils';

function CoscTable({ courses }) {
	const [coscCourses, setCoscCourses] = useState(courses);

	useEffect(() => {
		setCoscCourses(courses);
	}, [courses])

	const filterCourses = (identifier) => {
		setCoscCourses(filterYearLevelCourses(courses, identifier, 'COSC'));
	};

	return (
		<div className="division-performance-table" id="cosc-test-content">
			<div className="header-container">
				<h1 className="subTitleD">Computer Science</h1>
				<div>
					{['All', '100', '200', '300', '400'].map((identifier) => (
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
						{coscCourses.map((course, index) => (
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
