import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts'; // external library for chart

import { fetchWithAuth } from '../../common/utils';

// custom hook for fetching department performance data
function useDeptPerformancePieChart( authToken, navigate ) {
	const [score, setScore] = useState({ // format of chart
		series: [],
		options: {
			chart: {
				type: 'polarArea',
			},
			labels: [],
			stroke: {
				colors: ['#fff'],
			},
			fill: {
				opacity: 0.8,
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		},
	});

	useEffect(() => { // fetch data when authToken changes
		const fetchData = async () => {
			try {
				const data = await fetchWithAuth('http://localhost:3001/api/deptPerformance', authToken, navigate);
				if (data) {
					setScore((prevState) => ({ // set score data
						...prevState,
						series: data.series,
						options: {
							...prevState.options,
							labels: data.labels,
						},
					}));
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, [authToken, navigate]);

	return score; // return score state data 
}

// main component to render a department performance pie chart
function DeptPerformancePieChart( authToken, navigate ) {
	const score = useDeptPerformancePieChart( authToken, navigate ); // use custom hook for performance pie chart

	return (
		<div className="App">
			<div className="row"></div>
			<div id="pie-chart">
				<ReactApexChart options={score.options} series={score.series} type="polarArea" />
			</div>
		</div>
	);
}

export default DeptPerformancePieChart;
