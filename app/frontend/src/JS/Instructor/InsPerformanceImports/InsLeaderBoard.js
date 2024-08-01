import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts'; // external library for chart

import { fetchWithAuth } from '../../common/utils';

// custom hook for fetching leader board data
function useLeaderBoard( authToken, navigate ) {
	const [leaderData, setLeaderData] = useState({ // format of chart
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

	useEffect(() => { // fetch data when authToken changes
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
				setLeaderData((prevState) => ({ // set leaderboard data
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

	return leaderData; // return state of leader data
}

// main component to render a leader board chart data
function LeaderBoard( authToken, navigate ) {
	const leaderData = useLeaderBoard( authToken, navigate ); // use custom hook for leader data

	return (
		<div>
			<div id="leader-chart">
				<ReactApexChart options={leaderData.options} series={leaderData.series} type="bar" height={350} />
			</div>
		</div>
	);
}

export default LeaderBoard;
