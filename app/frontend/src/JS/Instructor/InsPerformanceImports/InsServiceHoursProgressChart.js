import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/AuthContext';

function ServiceHoursProgressChart() {
	const navigate = useNavigate();
	const { authToken } = useAuth();
	const { profileId } = useAuth();
	const [progress, setProgress] = useState({
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
						show: true,
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

	useEffect(() => {
		const date = new Date();
		const currentMonth = date.getMonth() + 1;

		const fetchData = async () => {
			try {
				if (!authToken) {
					navigate('/Login');
					return;
				}
				const res = await axios.get('http://localhost:3001/api/progressRoutes', {
					params: {
						profileId: profileId,
						currentMonth: currentMonth,
					},
					headers: { Authorization: `Bearer ${authToken.token}` },
				});
				console.log(res);
				return res.data;
			} catch (error) {
				console.error('Error fetching data: ', error);
				return null;
			}
		};
		fetchData().then((data) => {
			if (data) {
				setProgress((prevState) => ({
					...prevState,
					series: data.series,
					options: {
						...prevState.options,
					},
				}));
			}
		});
	}, []);

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
