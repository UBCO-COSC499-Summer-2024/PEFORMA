import React, { useState, useEffect } from 'react';
import '../../CSS/Admin/CreateAccount.css';
import axios from 'axios';
import CreateSideBar, { CreateTopBar } from '../common/commonImports.js';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

function DeptSEIPage() {
    const { authToken, accountLogInType } = useAuth();
    const navigate = useNavigate();

    const initialFormData = {
        course: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/mathDeptP.json');
                setCourses(response.data.courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleChange = (selectedOption) => {
        setFormData(prevState => ({
            ...prevState,
            course: selectedOption ? selectedOption.value : ''
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form data submitted:', formData);

        const postData = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            ubcId: formData.ubcId,
            division: formData.division,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            course: formData.course
        };

        try {
            const response = await axios.post('http://localhost:3001/api/create-account', postData,
                {
                    headers: { Authorization: `Bearer ${authToken.token}` },
                }

            );
            console.log('Server response:', response.data);
            alert('Account created successfully.');
            setFormData(initialFormData); 
        } catch (error) {
            console.error('Error sending data to the server:', error);
            if (error.response && error.response.status === 400 && error.response.data.message === 'Email already exists') {
                alert('Error: Email already exists');
            } else {
                alert('Error creating account: ' + error.message);
            }
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
    };

    const courseOptions = courses.map(course => ({
        value: course.courseCode,
        label: course.courseCode
    }));

    return (
        <div className="dashboard">
            <CreateSideBar sideBarType="Department" />
            <div className='container'>
                <CreateTopBar />
                <div className='SEI-form'>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Select Course:
                            <Select
                                name="course"
                                options={courseOptions}
                                onChange={handleChange}
                                isClearable
                                placeholder="Select a course"
                            />
                        </label>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DeptSEIPage;
