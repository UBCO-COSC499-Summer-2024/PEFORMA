import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

function WorkHoursBarChart() {
    const [workingHours, setWorkingHours] = useState({ 
        series: [{
            name: 'Worked Hours',
            data: []
        }],
        options: {
            chart: {height: 350, type: 'bar'},
            plotOptions: {bar: {columnWidth: '50%'}},
            colors: ['#00E396'],
            dataLabels: {enabled: false},
            legend: {show: true,
                    showForSingleSeries: true,
                    customLegendItems: ['Worked Hours', 'Average Working Hours'],
                    markers: {fillColors: ['#00E396', '#775DD0']}
                    }
            },
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/workingHours.json');
                return res.data;
            } catch (error) {
                console.error('Error fetching data: ', error);
                return null;
            }
        };
        fetchData().then(dataJson => {
            if (dataJson) {
                setWorkingHours(prevState => ({
                    ...prevState,
                    series: [{
                        name: 'Worked Hours',
                        data: dataJson.data.map(wdata => {
                            return {
                                x: wdata.x,
                                y: wdata.y,
                                goals: [
                                  {
                                    name: 'Average Working Hours',
                                    value: wdata.avgWorkHour,
                                    strokeHeight: 5,
                                    strokeColor: '#775DD0'
                                  }
                                ]
                              };
                        })
                    }]
                }));
            }
        })
      }, []);

    return (
        <div className='App'>
            <div className='row'></div>
            <div id="bar-chart">
                <ReactApexChart 
                    options={workingHours.options} 
                    series={workingHours.series} 
                    type="bar" 
                    height={600} 
                />
            </div>
        </div>
    );
  }
  
export default WorkHoursBarChart;
  
  