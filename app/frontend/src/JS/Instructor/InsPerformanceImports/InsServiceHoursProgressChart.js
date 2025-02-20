import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts'; // external library for chart

import { fetchWithAuth } from '../../common/utils';
import { useAuth } from '../../common/AuthContext';

// custom hook for fetching service hour progress data
function useServiceHoursProgress(authToken, navigate) {
	const { profileId } = useAuth();
	const [progress, setProgress] = useState({ // format of chart
		series: [],
		options: {
			chart: {
				height: 350,
				type: 'radialBar',
				toolbar: {
					show: true,
				},
			},
			plotOptions: {
				radialBar: {
					startAngle: -180,
					endAngle: 180,
					hollow: {
						margin: 0,
						size: '65%',
						background: '#fff',
						dropShadow: {
							enabled: true,
							top: 5,
							left: 0,
							blur: 4,
							opacity: 0.24,
						},
					},
					track: {
						background: '#fff',
						strokeWidth: '88%',
						margin: 0,
						dropShadow: {
							enabled: true,
							top: -3,
							left: 0,
							blur: 4,
							opacity: 0.35,
						},
					},
					dataLabels: {
						name: {
							offsetY: -10,
							show: true,
							color: '#888',
							fontSize: '23px',
						},
						value: {
							formatter: function (val) {
								return parseInt(val);
							},
							color: '#111',
							fontSize: '30px',
							show: true,
						},
					},
				},
			},
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'dark',
					type: 'horizontal',
					shadeIntensity: 0.5,
					gradientToColors: ['#ABE5A1'],
					inverseColors: true,
					opacityFrom: 1,
					opacityTo: 1,
					stops: [0, 100],
				},
			},
			stroke: {
				lineCap: 'round',
			},
			labels: ['Progress'],
		},
	});

	useEffect(() => { // fetch data when profileId or authToken changes
		const currentMonth = new Date().getMonth() + 1;
		const fetchData = async () => {
			try {
				const data = await fetchWithAuth('http://localhost:3001/api/progressRoutes', authToken, navigate, {
					profileId: profileId,
					currentMonth: currentMonth,
				});
				if (data) {
					setProgress((prevState) => ({ // set progress data in chart
						...prevState,
						series: data.series,
					}));
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, [authToken, profileId, navigate]);

	return progress;
}

// main component for render progress chart
function ServiceHoursProgressChart(authToken, navigate) {
	const progress = useServiceHoursProgress(authToken, navigate); // use custom hook for progress chart data

	return (
		<div className="App">
			<div className="row"></div>
			<div id="radial-chart">
				<ReactApexChart
					options={progress.options}
					series={progress.series}
					type="radialBar"
					height={350}
				/>
			</div>
		</div>
	);
}

export default ServiceHoursProgressChart;
