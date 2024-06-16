import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LeaderBoard() {
  const navigate = useNavigate();
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
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const dataIndex = config.dataPointIndex;
              console.log("dataIndex: "+ dataIndex); 

              const data = leader.series[0].data[dataIndex];
              console.log("data ubc id: "+data);
              navigate(`/InstructorProfilePage?ubcid=${data.ubcid}`);
            }
          }
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
        const res = await axios.get('http://localhost:3000/leaderBoard.json'); 
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
                ubcid: wdata.ubcid
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