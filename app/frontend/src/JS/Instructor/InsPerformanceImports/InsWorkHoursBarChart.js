import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

import { fetchWithAuth } from '../../common/utils';

function useWorkHoursBarChart(profileid, authToken) {
	const navigate = useNavigate();
	const [workingHours, setWorkingHours] = useState({
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

	useEffect(() => {
			const fetchData = async () => {
					try {
						const data = await fetchWithAuth('http://localhost:3001/api/workingHoursRoutes', authToken, navigate, {
							profileId: profileid,
							currentMonth: new Date().getMonth() + 1
							});

							setWorkingHours((prevState) => ({
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

function WorkHoursBarChart({profileid, height, width, authToken}) {
	const workingHours = useWorkHoursBarChart(profileid, authToken);

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
