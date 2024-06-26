import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
function LeaderBoard() {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [leader, setLeader] = useState(
    {  
      series: [{
        name: 'performance score',
        data: []
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
        },
        plotOptions: {bar: {
            borderRadius: 5,
            borderRadiusApplication: 'end',
            horizontal: true,}
        },
      },
    });


  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!authToken){
          navigate('/Login');
          return;
      }
      const res = await axios.get('http://localhost:3001/api/leaderBoardRoutes', {
        headers: { Authorization: `Bearer ${authToken.token}` }
    });
    console.log(res);
    return res.data;
} catch (error) {
    console.error('Error fetching data: ', error);
    return null;
}
    };
    fetchData().then(data => {
      if (data) {
        setLeader(prevState => ({
          ...prevState,
          series: [{
            data: data.data.map(wdata => {
              return {
                x: wdata.x,
                y: wdata.y,
              }
            })}],
        }))
      }
    })
  }, []);
    
  return (
    <div>
      <div id="leader-chart">
        <ReactApexChart 
        options={leader.options} 
        series={leader.series} 
        type="bar" 
        height={350} />
      </div>
    </div>

  );
}

export default LeaderBoard;