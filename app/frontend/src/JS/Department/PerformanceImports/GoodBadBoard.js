import React, { useState, useEffect } from 'react';
import '../../../CSS/Department/PerformanceImports/PerformanceDeptTables.css';
import axios from 'axios';

function GoodBadBoard() {

  const[topInstructors, setTopInstructors] = useState([]);
  const[bottomInstructors, setBottomInstructors] = useState([]);
  const[instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const url = "http://localhost:3000/topbottom.json";
        const res = await axios.get(url);
        const sortedTop = res.data.top.sort((a, b) => b.score - a.score);
        const sortedBottom = res.data.bottom.sort((a, b) => a.score - b.score);
        setTopInstructors(sortedTop);
        setBottomInstructors(sortedBottom);
        setInstructors(sortedTop);
      } catch (error) {
        console.log("Error fetching data: ", error)
      }
    };
    fetchData();
  }, []);

  const displayInstructors = (identifier) => {
    if (identifier == "Top"){
      setInstructors(topInstructors);
    } else if (identifier == "Bottom") {
      setInstructors(bottomInstructors);
    }
  };


  return (

    <div className="topbottom-table">
      
      <div className='header-container'>
        <h1 className='subTitleD'>Leaderboard (Top 5 and Bottom 5)</h1>
        <div>
          {["Top", "Bottom"].map(identifier => (
            <button className='year-button' key={identifier} onClick={() => displayInstructors(identifier)}>
              {identifier}
            </button>
          ))}
        </div>
      </div>
      
      <table className='divi-table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {instructors.map((instructor, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{instructor.name}</td>
              <td>{instructor.score}</td>
            </tr>
          ))}
        </tbody>
        
      </table>
    </div>

  );
}

export default GoodBadBoard;