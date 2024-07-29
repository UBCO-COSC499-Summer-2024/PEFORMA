import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

import { fetchWithAuth } from '../../common/utils';

function useLeaderBoard( authToken ) {
	const navigate = useNavigate();
	const [leaderData, setLeaderData] = useState({
		series: [{ name: 'performance score', data: [] }],
		options: {
			chart: { type: 'bar', height: 350 },
			plotOptions: {
				bar: {
					borderRadius: 5,
					borderRadiusApplication: 'end',
					horizontal: true,
				},
			},
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchWithAuth('http://localhost:3001/api/leaderBoardRoutes', authToken, navigate);
				return data;
			} catch (error) {
				console.error('Error fetching data:', error);
				return null;
			}
		};

		fetchData().then((data) => {
			if (data) {
				setLeaderData((prevState) => ({
					...prevState,
					series: [
						{
							data: data.data.map((item) => ({
								x: item.x,
								y: item.y,
							})),
						},
					],
				}));
			}
		});
	}, [authToken, navigate]);

	return leaderData;
}

function LeaderBoard( authToken ) {
	const leaderData = useLeaderBoard( authToken );

	return (
		<div>
			<div id="leader-chart">
				<ReactApexChart options={leaderData.options} series={leaderData.series} type="bar" height={350} />
			</div>
		</div>
	);
}

export default LeaderBoard;
