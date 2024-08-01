import React from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import { getCurrentMonthName } from '../../common/utils.js';

// function to format minutes into hours and minutes
function formatTime(minutes) {
	const totalMinutes = Math.round(minutes); // round minutes
	const hours = Math.floor(totalMinutes / 60); // calculate hours from total minutes
	const remainingMinutes = totalMinutes % 60; // calculate remaining minutes

	const hourText = hours === 1 ? 'Hour' : 'Hours'; // determine unit for hours
	const minuteText = remainingMinutes === 1 ? 'Minute' : 'Minutes'; // determine unit for minutes

	if (hours > 0 && remainingMinutes > 0) { // return formatted time for each case
		return `${hours} ${hourText} ${remainingMinutes} ${minuteText}`;
	} else if (hours > 0) {
		return `${hours} ${hourText}`;
	} else {
		return `${remainingMinutes} ${minuteText}`;
	}
}

// define the bench mark component 
function DeptBenchMark({ benchmark }) { // receive benchmark data to render
	const currentMonth = getCurrentMonthName(); // get current month name

	return (
		<div className="benchmark-table" id="benchmark-test-content">
			<div className="header-container">
				<h1 className="subTitleD">Benchmark</h1>
				<h1 className="subTitleD">Current Month: {currentMonth}</h1>
			</div>

			<table className="divi-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Shortage</th>
					</tr>
				</thead>
				<tbody className="scrollable-body">
					{benchmark.map((item, index) => (
						<tr key={index}>
							<td>{index + 1}</td>
							<td>{item.name}</td>
							<td>{formatTime(item.shortage)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default DeptBenchMark;
