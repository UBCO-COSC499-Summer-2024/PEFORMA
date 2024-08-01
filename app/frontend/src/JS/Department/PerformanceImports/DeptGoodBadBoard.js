import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';

// function to select top or bottom button
function displayInstructors(identifier, leaderboard) {
	if (identifier === 'Top') {
		return leaderboard.top; // return top section of leaderboard if identifier is top
	} else if (identifier === 'Bottom') {
		return leaderboard.bottom; // return bottom section of leaderboard if identifier is bottom
	}
	return [];
}

function GoodBadBoard({ leaderboard }) { // define goodbadboard component that render leaderboard
	const [instructors, setInstructors] = useState(leaderboard.top); // default set is top 

	useEffect(() => { // update instructor list when prop change
		setInstructors(leaderboard.top);
	}, [leaderboard]);

	return (
		<div className="topbottom-table" id="goodbad-test-content">
			<div className="header-container">
				<h1 className="subTitleD">Leaderboard (Top 5 and Bottom 5)</h1>
				<div>
					{['Top', 'Bottom'].map((identifier) => (
						<button
							className="year-button"
							key={identifier}
							onClick={() => setInstructors(displayInstructors(identifier, leaderboard))}>
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

				<tbody >
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
