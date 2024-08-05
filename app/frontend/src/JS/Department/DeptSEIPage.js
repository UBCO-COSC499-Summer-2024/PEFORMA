import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import SideBar from '../common/SideBar.js';
import TopBar from '../common/TopBar.js';
import { checkAccess, fetchWithAuth, handleCancelForm, submitFormData } from '../common/utils.js';
import { useAuth } from '../common/AuthContext.js';
import '../../CSS/Department/DeptSEIPage.css'
import ImportModal from './DataImportImports/DeptImportModal.js';
import { FaFileImport } from 'react-icons/fa';

const initialFormData = { // initialFormData that will be used in SEI page
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

// handle changes when a new course is selected by user
function handleCourseChange(selectedOption, setFormData, setInstructorOptions) {
  setFormData(prevState => ({
    ...prevState,
    courseId: selectedOption ? selectedOption.value : '',
    course: selectedOption ? selectedOption.label : '',
    profileId: '',
    instructor: ''
  }));

  // update instructor option list based on changed selected course
  const instructors = selectedOption && selectedOption.instructors ? selectedOption.instructors : [];
  const instructorOptions = instructors.map(instructor => ({
    value: instructor.profileId,
    label: instructor.name
  }));
  setInstructorOptions(instructorOptions);
}

// handle changes when a new instructor is selected by user
function handleInstructorChange(selectedOption, setFormData) {
  setFormData(prevState => ({
    ...prevState,
    profileId: selectedOption ? selectedOption.value : '',
    instructor: selectedOption ? selectedOption.label : ''
  }));
}

// custom hook for managing form state
function useFormState() {
  const [formData, setFormData] = useState(initialFormData); // formData will always have initialFormData format
  const [courseOptions, setCourseOptions] = useState([]); // state for courseOptions
  const [instructorOptions, setInstructorOptions] = useState([]); // state for instructorOptions

  // handling form inputs based on user input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return {
    formData,
    setFormData,
    courseOptions,
    setCourseOptions,
    instructorOptions,
    handleChange,
    handleCourseChange: (selectedOption) => handleCourseChange(selectedOption, setFormData, setInstructorOptions),
    handleInstructorChange: (selectedOption) => handleInstructorChange(selectedOption, setFormData)
  };
}

// function to fetch course list and following instructors to render
function useDeptSEIPage({ authToken, accountLogInType, setCourseOptions, navigate }) {
  useEffect(() => {
    const fetchCourses = async () => {
      checkAccess(accountLogInType, navigate, 'department', authToken); // checkAccess with accountLogInType and authToken
      try {
        const data = await fetchWithAuth('http://localhost:3001/api/courseEvaluationForm', authToken, navigate);
        const sortedCourses = data.courses.sort((a, b) => a.courseCode.localeCompare(b.courseCode));
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
  }, [authToken, accountLogInType, navigate, setCourseOptions]);
}

// main component for SEI page
function DeptSEIPage() {
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    courseOptions,
    setCourseOptions,
    instructorOptions,
    handleChange,
    handleCourseChange,
    handleInstructorChange
  } = useFormState();

  // initialize state to control visibility of import modal
  const [showImportModal, setShowImportModal] = useState(false);

  // handle course fetching and access 
  useDeptSEIPage({ authToken, accountLogInType, setCourseOptions, navigate });

  // handle submit using postData that is pulled from formData
  const handleSubmit = async (event) => {
    event.preventDefault();
    const postData = { // set up data for posting to server
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

    // use submitFormData with api url, set to initialFormData when SEI data is submitted successfully
    await submitFormData('http://localhost:3001/api/courseEvaluation', postData, authToken, initialFormData, setFormData, 'SEI data submitted successfully.');
  };

  return (
    <div className="dashboard">
      <SideBar sideBarType="Department" />
      <div className='container'>
        <TopBar />
        <div className='SEI-form' id='SEI-test-content'>
          <div className='SEI-version'>
            <div className="form-header">
              <h1>SEI Data Entry</h1>
              <button
                className="import-button"
                onClick={() => setShowImportModal(true)}
                aria-label="Import data"
              >
                <FaFileImport className='import-icon' />Import
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              Select Course:
              <Select name="course" options={courseOptions} onChange={handleCourseChange} isClearable placeholder="Select course" />
            </label>
            {formData.courseId && (
              <label>
                Select Instructor:
                <Select name="instructor" options={instructorOptions} onChange={handleInstructorChange} isClearable placeholder="Select instructor" />
              </label>
            )}
            {formData.profileId && (
              <>
                {Array.from({ length: 6 }, (_, i) => (
                  <label key={i + 1}>
                    Q {i + 1} Average Score:<input type="number" name={`Q${i + 1}`} placeholder='0 ~ 100' value={formData[`Q${i + 1}`]} onChange={handleChange} required min="0" max="100" step="0.01" />
                  </label>
                ))}
                <label>Retention Rate of {formData.course}<input type="number" name="retentionRate" placeholder='0 ~ 100' value={formData.retentionRate} onChange={handleChange} required min="0" max="100" step="0.01" /></label>
                <label>Average Grade of {formData.course}<input type="number" name="averageGrade" placeholder='0 ~ 100' value={formData.averageGrade} onChange={handleChange} required min="0" max="100" step="0.01" /></label>
                <label>Enrollment Rate of {formData.course}<input type="number" name="enrollmentRate" placeholder='0 ~ 100' value={formData.enrollmentRate} onChange={handleChange} required min="0" max="100" step="0.01" /></label>
                <label>Failed Percentage of {formData.course}<input type="number" name="failedPercentage" placeholder='0 ~ 100' value={formData.failedPercentage} onChange={handleChange} required min="0" max="100" step="0.01" /></label>
                <div className='submit-button-align'>
                  <button type="submit">Submit</button>
                  <button type="button" className="cancel-button" onClick={() => handleCancelForm(setFormData, initialFormData)}>Cancel</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
}

export default DeptSEIPage;