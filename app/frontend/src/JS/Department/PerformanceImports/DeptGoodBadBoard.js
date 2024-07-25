import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';

function GoodBadBoard({ leaderboard }) {
	const [instructors, setInstructors] = useState(leaderboard.top);

	useEffect(() => {
		setInstructors(leaderboard.top);
	}, [leaderboard]);

	const displayInstructors = (identifier) => {
		if (identifier === 'Top') {
			setInstructors(leaderboard.top);
		} else if (identifier === 'Bottom') {
			setInstructors(leaderboard.bottom);
		}
	};

	return (
		<div className="topbottom-table" id="goodbad-test-content">
			<div className="header-container">
				<h1 className="subTitleD">Leaderboard (Top 5 and Bottom 5)</h1>
				<div>
					{['Top', 'Bottom'].map((identifier) => (
						<button
							className="year-button"
							key={identifier}
							onClick={() => displayInstructors(identifier)}>
							{identifier}
						</button>
					))}
				</div>
			</div>

			<table className="divi-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Score</th>
					</tr>
				</thead>

				<tbody>
					{instructors.map((instructor, index) => (
						<tr key={index}>
							<td>{index + 1}</td>
							<td>{instructor.name}</td>
							<td>{instructor.score}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default GoodBadBoard;
