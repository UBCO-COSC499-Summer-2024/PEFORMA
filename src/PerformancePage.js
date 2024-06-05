import React from 'react';
import './PerformancePage.css'; // Ensure to create and import CSS for styling

function PerformancePage() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
      <div className='sidebar-header'>
        <h1>PERFORMA</h1>
        <hr/>
      </div>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#performance">Performance</a>
        </nav>
      </aside>
      <div>
        <header className='web-head'>
          <img src='temp.png' alt=''/>
          <button onClick={() => console.log('Logging out...')}>Logout</button>
        </header>
        <h1>Your Performance</h1>
        <div className="performance-details">
          <section className="personal-info">
            <p>Name: Jim Bob</p>
            <p>UBC ID: 12341234</p>
            <p>Service Role: Professor</p>
            <p>Monthly Hours Benchmark: 54</p>
            <p>Email: jbob@ubc.ca</p>
            <p>Teaching Assignments: <br/>COSC777, COSC001</p>
            <p>Your Score: 77.5 {'↓'}</p>
          </section>
          <section className="graph-section">
            <img src='temp.png' alt='' className='graph'/>
            <button>Graph Options</button>
          </section>
          <section className="department-performance">
            <h2>Department Performance</h2>
            <div className="tabs">
              <button>All</button>
              <button>COSC</button>
              <button>MATH</button>
              <button>PHYS</button>
              <button>STATS</button>
            </div>
            <div className="leaderboard">
              <table>
                <thead>
                  <tr>
                    <th>Instructor</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1st: Firstname Lastname</td><td>98.2</td></tr>
                  <tr><td>2nd: Firstname Lastname</td><td>98.2</td></tr>
                  <tr><td>3rd: Firstname Lastname</td><td>98.2</td></tr>
                  <tr><td>4th: Firstname Lastname</td><td>98.2</td></tr>
                  <tr><td>5th: Firstname Lastname</td><td>98.2</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PerformancePage;
