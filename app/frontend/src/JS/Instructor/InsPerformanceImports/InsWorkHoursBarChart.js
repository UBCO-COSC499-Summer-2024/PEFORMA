import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../common/AuthContext';

function WorkHoursBarChart({profileid, height, width}) {
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
	const { authToken } = useAuth();
	const profileId = profileid;
	useEffect(() => {
		const date = new Date();
		const currentMonth = date.getMonth() + 1;
		const fetchData = async () => {
			if (profileId != null) {
			try {
				if (!authToken) {
					navigate('/Login');
					return;
				}
				const res = await axios.get('http://localhost:3001/api/workingHoursRoutes', {
					params: { profileId: profileId, currentMonth: currentMonth },
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				return res.data;
			} catch (error) {
				console.error('Error fetching data: ', error);
				return null;
			} }
		};
		fetchData().then((dataJson) => {
			if (dataJson) {
				setWorkingHours((prevState) => ({
					...prevState,
					series: [
						{
							name: 'Worked Hours',
							data: dataJson.data.map((wdata) => {
								return {
									x: wdata.x,
									y: wdata.y,
								};
							}),
						},
					],
				}));
			}
		});
		fetchData();
	}, [profileId]);

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
