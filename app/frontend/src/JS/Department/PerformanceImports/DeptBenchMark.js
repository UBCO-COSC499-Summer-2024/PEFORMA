import React from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';

function DeptBenchMark({ benchmark }) {
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const currentMonth = monthNames[new Date().getMonth()];

	const formatTime = (minutes) => {
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
	};

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
				<div className="scrollable-body">
					<tbody>
						{benchmark.map((item, index) => (
							<tr key={index}>
								<td>{index + 1}</td>
								<td>{item.name}</td>
								<td>{formatTime(item.shortage)}</td>
							</tr>
						))}
					</tbody>
				</div>
			</table>
		</div>
	);
}

export default DeptBenchMark;
