import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

function BenchMark() {
  const { authToken } = useAuth();
  const[data, setData] = useState([]);
  const[currentMonth, setCurrentMonth] = useState('');
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const fetchData = async() => {
      const date = new Date();
      const currMonth = date.getMonth() +1;
      setCurrentMonth(monthNames[currMonth-1])

      try {
        const res = await axios.get(`http://localhost:3001/api/benchmark`, {
          params: {currMonth:currMonth},
          headers: { Authorization: `Bearer ${authToken.token}` }
        });
        const sortedData = res.data.people.sort((a, b) => b.shortage - a.shortage);
        setData(sortedData);
      } catch (error) {
        console.log("Error fetching data: ", error)
      }
    };
    fetchData();
  }, []);

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hours ${remainingMinutes} minutes`
  }

  return (

    <div className="benchmark-table">
      
      <div className='header-container'>
        <h1 className='subTitleD'>Benchmark</h1>
        <h1 className='subTitleD'>Current Month: {currentMonth}</h1>
        <div>

        </div>
      </div>
      
      <table className='divi-table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Shortage</th>
          </tr>
        </thead>
        <div className='scrollable-body'>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index +1}</td>
                <td>{item.name}</td>
                <td>{formatTime(item.shortage)}</td>
              </tr>
            ))}
          </tbody>
        </div> 
      </table>
    </div>

  );
}

export default BenchMark;