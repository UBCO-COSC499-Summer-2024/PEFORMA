import React, { useState } from 'react';
import './CourseHistory.css';

function CourseHistory() {
  // Example course history data, import required
  const [selectedCourse, setSelectedCourse] = useState('COSC 304');
  const courses = ['COSC 304', 'COSC 101', 'MATH 116', 'STAT 200'];
  const courseDetails = {
    title: "Databases",
    description: "Databases from a user's perspective: querying with SQL, designing with UML, and using programs to analyze data. Construction of database-driven applications and websites and experience with current database technologies.",
    averageScore: 96.2,
    history: [
      { year: 2023, term: "Winter Term 2", instructor: "Ramon Lawrence", score: 97.7, hours: "410 Hours" },
      { year: 2023, term: "Winter Term 1", instructor: "Ramon Lawrence", score: 96.7, hours: "380 Hours" },
      // More data imported in...
    ]
  };

  return (
    <div className="course-history-container">
      <aside className="sidebar">
      <div className="sidebar-header">
          <h1>PEFORMA</h1>
          <hr />
      </div>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#performance">Performance</a>
        </nav>
      </aside>
      <div className="web-head">
      <img src='temp.png' alt=''/>
      <button onClick={() => console.log('Logging out...')}>Logout</button>
      </div>
      <div className="main-content">
        <div className="header">
          <div className="average-score-card">
            <h4>Average Performance Score</h4>
            <p>{courseDetails.averageScore}</p>
          </div>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="course-select">
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
        <h1>{courseDetails.title} Course History</h1>
        <p><strong>Course Description:</strong> {courseDetails.description}</p>
        <table className='courseTable'>
          <thead>
            <tr>
              <th>Instructor</th>
              <th>Semester</th>
              <th>Term</th>
              <th>Performance Score</th>
              <th>Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {courseDetails.history.map((entry, index) => (
              <tr key={index}>
                <td>{entry.instructor}</td>
                <td>{entry.year}</td>
                <td>{entry.term}</td>
                <td>{entry.score}</td>
                <td>{entry.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseHistory;
