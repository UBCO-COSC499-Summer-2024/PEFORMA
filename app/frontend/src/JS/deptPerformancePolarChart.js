import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


function DeptPerformancePieChart() {
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const [score, setScore] = useState({
        series: [],
        options: {
            chart: {
                type: 'polarArea',
            },
            labels: [],
            stroke: {
                colors: ['#fff']
            },
            fill: {
                opacity: 0.8
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(!authToken){
                    navigate('/Login');
                    return;
                }
                const res = await axios.get('http://localhost:3001/api/deptPerformance', {
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
                setScore(prevState => ({
                    ...prevState,
                    series: data.series,
                    options: {
                        ...prevState.options,
                        labels: data.labels
                    }
                }));
            }
        });
    }, []);

    return (
        <div className='App'>
            <div className='row'></div>
            <div id="pie-chart">
                <ReactApexChart 
                    options={score.options} 
                    series={score.series} 
                    type="polarArea" />
            </div>
        </div>
    );
}
  
export default DeptPerformancePieChart;