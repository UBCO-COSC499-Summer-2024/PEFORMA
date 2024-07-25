import React from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import { getCurrentMonthName } from '../../common/utils.js';


function formatTime(minutes) {
	const totalMinutes = Math.round(minutes);
	const hours = Math.floor(totalMinutes / 60);
	const remainingMinutes = totalMinutes % 60;

	const hourText = hours === 1 ? 'Hour' : 'Hours';
	const minuteText = remainingMinutes === 1 ? 'Minute' : 'Minutes';

	if (hours > 0 && remainingMinutes > 0) {
		return `${hours} ${hourText} ${remainingMinutes} ${minuteText}`;
	} else if (hours > 0) {
		return `${hours} ${hourText}`;
	} else {
		return `${remainingMinutes} ${minuteText}`;
	}
}

function DeptBenchMark({ benchmark }) {
	const currentMonth = getCurrentMonthName();

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
