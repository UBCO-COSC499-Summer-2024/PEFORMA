import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts'; // external library for chart

import { fetchWithAuth } from '../../common/utils';

// custom hook for fetching work hours data
function useWorkHoursBarChart(profileid, authToken, navigate) {
	const [workingHours, setWorkingHours] = useState({ // format of chart
			series: [
					{
							name: 'Worked Hours',
							data: [],
					},
			],
			options: {
					chart: { height: 350, type: 'bar' },
					plotOptions: { bar: { columnWidth: '50%' } },
					colors: ['#00E396'],
					dataLabels: { enabled: false },
					legend: {
							show: true,
							showForSingleSeries: true,
							customLegendItems: ['Service Hours'],
							markers: { fillColors: ['#00E396'] },
					},
			},
	});

	useEffect(() => { // fetch data when profileId or authToken changes
			const fetchData = async () => {
					try {
						const data = await fetchWithAuth('http://localhost:3001/api/workingHoursRoutes', authToken, navigate, {
							profileId: profileid,
							currentMonth: new Date().getMonth() + 1
							});

							setWorkingHours((prevState) => ({ // set working hours bar chart data
									...prevState,
									series: [
											{
													name: 'Worked Hours',
													data: data.data.map((wdata) => ({
															x: wdata.x,
															y: wdata.y,
													})),
											},
									],
							}));
					} catch (error) {
							console.error('Error fetching data:', error);
					}
			};

			fetchData();
	}, [profileid, authToken, navigate]);

	return workingHours;
}

// main component for render a bar chart of service hours
function WorkHoursBarChart({profileid, height, width, authToken, navigate}) {
	const workingHours = useWorkHoursBarChart(profileid, authToken, navigate); // use custom hook for work hours bar chart

	return (
		<div className="App">
			<div className="row"></div>
			<div id="bar-chart">
				<ReactApexChart
					options={workingHours.options}
					series={workingHours.series}
					type="bar"
					height={height}
					width={width}
				/>
			</div>
		</div>
	);
}

export default WorkHoursBarChart;
