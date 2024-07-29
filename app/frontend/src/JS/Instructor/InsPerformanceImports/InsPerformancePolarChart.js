import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

import { fetchWithAuth } from '../../common/utils';

function useDeptPerformancePieChart( authToken ) {
	const navigate = useNavigate();
	const [score, setScore] = useState({
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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchWithAuth('http://localhost:3001/api/deptPerformance', authToken, navigate);
				if (data) {
					setScore((prevState) => ({
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

	return score;
}

function DeptPerformancePieChart( {authToken} ) {
	const score = useDeptPerformancePieChart( authToken );


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
