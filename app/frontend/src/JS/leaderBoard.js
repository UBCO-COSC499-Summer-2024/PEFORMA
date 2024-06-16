import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

function LeaderBoard() {
  const [leader, setLeader] = useState(
    {  
      series: [{
        name: 'performance score',
        data: []
      }],
      options: {
        chart: {type: 'bar',height: 350},
        plotOptions: {bar: {
            borderRadius: 5,
            borderRadiusApplication: 'end',
            horizontal: true,}
        },
        xaxis: {
          categories: [],
        }
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
          series: [{data: data.series}],
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: data.names,
            }
          }
        }))
      }
    })
  })
    
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