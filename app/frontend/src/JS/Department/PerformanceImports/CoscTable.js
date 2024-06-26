import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import axios from 'axios';

function CoscTable() {

  const [course,setCourse] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const url = "http://localhost:3000/coscDeptP.json";
        const res = await axios.get(url);
        setCourse(res.data.courses)
      } catch (error) {
        console.log("Error fetching data: ", error)
      }
    };
    fetchData();
  }, []);


  return (

    <div className="division-performance-table">
      <h1 className='subTitleD'>Computer Science</h1>
      <table className='divi-table'>
        <thead>
          <tr>
            <th>NO.</th>
            <th>Course</th>
            <th>Rank</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {course.map((course, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{course.courseCode}</td>
              <td>{course.rank}</td>
              <td>{course.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}

export default CoscTable;