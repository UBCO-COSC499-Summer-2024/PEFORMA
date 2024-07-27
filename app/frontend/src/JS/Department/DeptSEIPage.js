import React, { useState, useEffect } from 'react';
import '../../CSS/Admin/CreateAccount.css';
import axios from 'axios';
import CreateSideBar, { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../CSS/Department/DeptSEIPage.css'
import { checkAccess, handleCancelForm } from '../common/utils.js';

function DeptSEIPage() {
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate();

  const initialFormData = {
    courseId: '',
    course: '',
    profileId: '',
    instructor: '',
    Q1: '',
    Q2: '',
    Q3: '',
    Q4: '',
    Q5: '',
    Q6: '',
    retentionRate: '',
    averageGrade: '',
    enrollmentRate: '',
    failedPercentage: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const [courseOptions, setCourseOptions] = useState([]); 
  const [instructorOptions, setInstructorOptions] = useState([]);

  const extractCourseNumber = (courseCode) => {
    const match = courseCode.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      checkAccess(accountLogInType, navigate, 'department');
      try {
        const response = await axios.get('http://localhost:3001/api/courseEvaluationForm');
        const sortedCourses = response.data.courses.sort((a, b) => {
          return extractCourseNumber(a.courseCode) - extractCourseNumber(b.courseCode);
        });
        const options = sortedCourses.map(course => ({
          value: course.courseId,
          label: course.courseCode,
          instructors: course.instructor
        }));
        setCourseOptions(options);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
  
    fetchCourses();
  }, [accountLogInType, navigate]);
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCourseChange = (selectedOption) => {
    setFormData(prevState => ({
      ...prevState,
      courseId: selectedOption ? selectedOption.value : '',
      course: selectedOption ? selectedOption.label : '',
      profileId: '', 
      instructor: ''   
    }));
  
    const instructors = selectedOption && selectedOption.instructors ? selectedOption.instructors : [];
    const instructorOptions = instructors.map(instructor => ({
      value: instructor.profileId,
      label: instructor.name
    }));
    setInstructorOptions(instructorOptions);
  };
  

  const handleInstructorChange = (selectedOption) => {
    setFormData(prevState => ({
      ...prevState,
      profileId: selectedOption ? selectedOption.value : '',
      instructor: selectedOption ? selectedOption.label : ''
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const postData = {
      courseId: formData.courseId,
      profileId: formData.profileId,
      Q1: formData.Q1,
      Q2: formData.Q2,
      Q3: formData.Q3,
      Q4: formData.Q4,
      Q5: formData.Q5,
      Q6: formData.Q6,
      retentionRate: formData.retentionRate,
      averageGrade: formData.averageGrade,
      enrollmentRate: formData.enrollmentRate,
      failedPercentage: formData.failedPercentage
    };
  
    try {
      console.log('postData', postData)
      await axios.post('http://localhost:3001/api/courseEvaluation', postData, {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      alert('SEI data submitted successfully.');
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error sending data to the server:', error);
      alert('Error submitting SEI form: ' + error.message);
    }
  };
  
  return (
    <div className="dashboard">
      <CreateSideBar sideBarType="Department" />
      <div className='container'>
        <CreateTopBar />
        <div className='SEI-form' id='SEI-test-content'>
          <h1>SEI Data Entry</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Select Course:
              <Select name="course" options={courseOptions} onChange={handleCourseChange} isClearable placeholder="Select course"/>
            </label>
            {formData.courseId && (
            <label>
              Select Instructor:
              <Select name="instructor" options={instructorOptions} onChange={handleInstructorChange} isClearable placeholder="Select instructor"/>
            </label>
          )}
            {formData.profileId && (
              <>
                {Array.from({ length: 6 }, (_, i) => (
                  <label key={i + 1}>
                    Q {i + 1} Average Score:<input type="number" name={`Q${i + 1}`} placeholder='0 ~ 100' value={formData[`Q${i + 1}`]} onChange={handleChange} required min="0" max="100" step="0.01"/>
                  </label>
                ))}
                <label>Retention Rate of {formData.course}<input type="number" name="retentionRate" placeholder='0 ~ 100' value={formData.retentionRate} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label>Average Grade of {formData.course}<input type="number" name="averageGrade" placeholder='0 ~ 100' value={formData.averageGrade} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label>Enrollment Rate of {formData.course}<input type="number" name="enrollmentRate" placeholder='0 ~ 100' value={formData.enrollmentRate} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label>Failed Percentage of {formData.course}<input type="number" name="failedPercentage" placeholder='0 ~ 100' value={formData.failedPercentage} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <div className='submit-button-align'>
                  <button type="submit">Submit</button>
                  <button type="button" className="cancel-button" onClick={() => handleCancelForm(setFormData, initialFormData)}>Cancel</button>
                </div>
              </> 
            )}    
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeptSEIPage;