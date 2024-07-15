import React, { useState, useEffect } from 'react';
import '../../CSS/Admin/CreateAccount.css';
import axios from 'axios';
import CreateSideBar, { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../CSS/Department/DeptSEIPage.css'
import { checkAccess } from '../common/utils.js';

function DeptSEIPage() {
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate();

  const initialFormData = {
    course: '',
    Q1: '',
    Q2: '',
    Q3: '',
    Q4: '',
    Q5: '',
    retentionRate: '',
    averageGrade: '',
    enrollmentRate: '',
    failedPercentage: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [courseOptions, setCourseOptions] = useState([]); // 상태 추가

  const extractCourseNumber = (courseCode) => {
    const match = courseCode.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      checkAccess(accountLogInType, navigate, 'department');
      try {
        const response = await axios.get('http://localhost:3000/SEIData.json');
        const sortedCourses = response.data.courses.sort((a, b) => {
          return extractCourseNumber(a.courseCode) - extractCourseNumber(b.courseCode);
        });
        const options = sortedCourses.map(course => ({
          value: course.courseCode,
          label: course.courseCode
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
      course: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const postData = {
        course: formData.course,
        Q1: formData.Q1,
        Q2: formData.Q2,
        Q3: formData.Q3,
        Q4: formData.Q4,
        Q5: formData.Q5,
        retentionRate: formData.retentionRate,
        averageGrade: formData.averageGrade,
        enrollmentRate: formData.enrollmentRate,
        failedPercentage: formData.failedPercentage
    };

    try {
      const response = await axios.post('http://localhost:3001/api', postData, //change
        {
          headers: { Authorization: `Bearer ${authToken.token}` },
        }
      );
      console.log('Server response:', response.data);
      alert('Account created successfully.');
      setFormData(initialFormData); 
    } catch (error) {
      console.error('Error sending data to the server:', error);
      alert('Error submitting SEI form: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="dashboard">
      <CreateSideBar sideBarType="Department" />
      <div className='container'>
        <CreateTopBar />
        <div className='SEI-form'>
          <h1>SEI Data Entry</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Select Course:
              <Select name="course" options={courseOptions} onChange={handleCourseChange} isClearable placeholder="Select course"/>
            </label>

            {formData.course && (
              <>
                <label><input type="number" name="Q1" placeholder={`Q1 Average Score`} value={formData.Q1} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label><input type="number" name="Q2" placeholder={`Q2 Average Score`} value={formData.Q2} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label><input type="number" name="Q3" placeholder={`Q3 Average Score`} value={formData.Q3} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label><input type="number" name="Q4" placeholder={`Q4 Average Score`} value={formData.Q4} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label><input type="number" name="Q5" placeholder={`Q5 Average Score`} value={formData.Q5} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label><input type="number" name="retentionRate" placeholder={`Retention Rate of ${formData.course}`} value={formData.retentionRate} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label><input type="number" name="averageGrade" placeholder={`Average Grade of ${formData.course}`} value={formData.averageGrade} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label><input type="number" name="enrollmentRate" placeholder={`Enrollment Rate of ${formData.course}`} value={formData.enrollmentRate} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <label><input type="number" name="failedPercentage" placeholder={`Failed Percentage of ${formData.course}`} value={formData.failedPercentage} onChange={handleChange} required min="0" max="100" step="0.01"/></label>
                <div className='submit-button-align'>
                  <button type="submit">Submit</button>
                  <button type="button" onClick={handleCancel}>Cancel</button>
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