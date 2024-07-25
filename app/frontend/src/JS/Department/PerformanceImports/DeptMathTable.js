import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import { filterYearLevelCourses } from '../../common/utils';

function MathTable({ courses }) {
	const [mathCourses, setMathCourses] = useState(courses);

	useEffect(() => {
		setMathCourses(courses);
	}, [courses]);

	const filterCourses = (identifier) => {
		setMathCourses(filterYearLevelCourses(courses, identifier, 'MATH'));
	};

	return (
		<div className="division-performance-table">
			<div className="header-container">
				<h1 className="subTitleD">Mathmatics</h1>
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
						{mathCourses.map((course, index) => (
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

export default MathTable;
