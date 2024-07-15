import React, { useState, useEffect } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/DeptCourseInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';

function CourseInformation() {
  const { authToken, accountLogInType } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('courseid');
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [courseData, setCourseData] = useState({
    history: [{}],
    entryCount: 0,
    perPage: 10,
    currentPage: 1,
    courseCode: '',
    courseName: '',
    courseDescription: '',
    avgScore: '',
    currentInstructor: 'Willem Dafoe'
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) {
        navigate('/Login');
        return;
      }
      const numericAccountType = Number(accountLogInType);
      if (numericAccountType !== 1 && numericAccountType !== 2) {
        alert('No Access, Redirecting to instructor view');
        navigate('/Dashboard');
      }
      try {
        const res = await axios.get(`http://localhost:3001/api/courseHistory`, {
          params: { courseId: courseId },
          headers: { Authorization: `Bearer ${authToken.token}` },
        });
        const data = res.data;
        const filledEntries = fillEmptyEntries(data.history, data.perPage);
        setCourseData({ ...data, history: filledEntries });
        setEditDescription(data.courseDescription);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authToken, accountLogInType, navigate, courseId]);

  const fillEmptyEntries = (history, perPage) => {
    const filledEntries = [...history];
    const currentCount = history.length;
    const fillCount = perPage - (currentCount % perPage);
    if (fillCount < perPage) {
      for (let i = 0; i < fillCount; i++) {
        filledEntries.push({});
      }
    }
    return filledEntries;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    const updatedCourseData = { courseId, courseDescription: editDescription };
    try {
      const res = await axios.post('http://localhost:3001/api/updateCourseInfo', updatedCourseData, {
        headers: { Authorization: `Bearer ${authToken.token}` },
      });
      console.log('Update successful', res.data);
      window.location.reload(); // Refresh the page after successful save
    } catch (error) {
      console.error('Error updating course info', error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setEditDescription(value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handlePageClick = (data) => {
    setCourseData((prevState) => ({
      ...prevState,
      currentPage: data.selected + 1,
    }));
  };

  const pageCount = Math.ceil(courseData.entryCount / courseData.perPage);
  const offset = (courseData.currentPage - 1) * courseData.perPage;

  const currentEntries = courseData.history.slice(
    (courseData.currentPage - 1) * courseData.perPage,
    courseData.currentPage * courseData.perPage
  );

  return (
    <div className="dashboard coursehistory">
      <CreateSideBar sideBarType="Department" />
      <div className="container">
        <CreateTopBar />
        <div className="courseinfo-main">
          <button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
          <h1 className="courseName" role="contentinfo">
            {courseData.courseCode}: {courseData.courseName}
          </h1>
          <div className="description" style={{ whiteSpace: isEditing ? 'pre-wrap' : '' }}>
            {isEditing ? (
              <textarea
                name="courseDescription"
                value={editDescription}
                onChange={handleChange}
                className="editable-textarea"
                style={{ minHeight: '80px', height: 'auto', overflow: 'hidden' }}
              />
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }}>{courseData.courseDescription}</p>
            )}
          </div>
          <p id="current-instructor">Current Instructor: {courseData.currentInstructor}</p>
          <div className="bold score">
            Average Performance Score: <span role="contentinfo">{courseData.avgScore}</span>
          </div>
          <div className="buttons">
            {isEditing ? (
              <button role="button" onClick={handleSaveClick}>
                Save
              </button>
            ) : (
              <button id="edit" role="button" onClick={handleEditClick}>
                Edit Course
              </button>
            )}
          </div>
          <div id="history">
            <p className="bold">Course History</p>
            <table id="historyTable">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Session</th>
                  <th>Term</th>
                  <th>Performance Score</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={`/DeptProfilePage?ubcid=${entry.instructorID}`}>
                        {entry.instructorName}
                      </Link>
                    </td>
                    <td>{entry.session}</td>
                    <td>{entry.term}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <ReactPaginate
                      previousLabel={'<'}
                      nextLabel={'>'}
                      breakLabel={'...'}
                      pageCount={pageCount}
                      marginPagesDisplayed={3}
                      pageRangeDisplayed={0}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination'}
                      activeClassName={'active'}
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseInformation;



/*
import React, { useState, useEffect } from 'react';
import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import ReactPaginate from 'react-paginate';
import '../../CSS/Department/DeptCourseInformation.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../common/AuthContext.js';
import { useNavigate } from 'react-router-dom';

function CourseInformation() {
	const { authToken, accountLogInType } = useAuth();
	const navigate = useNavigate();
	const params = new URLSearchParams(window.location.search);
	const courseId = params.get('courseid');
	const [historyData, setHistoryData] = useState({
		history: [{}],
		entryCount: 0,
		perPage: 10,
		currentPage: 1,
		currentInstructor: "Willem Dafoe"
	});

	useEffect(() => {
		console.log('Use effect executing');
		const fetchData = async () => {
			if (!authToken) {
				navigate('/Login');
				return;
			}
			const numericAccountType = Number(accountLogInType);
			if (numericAccountType !== 1 && numericAccountType !== 2) {
				alert('No Access, Redirecting to instructor view');
				navigate('/Dashboard');
			}
			console.log('Before fetch');
			const res = await axios.get(`http://localhost:3001/api/courseHistory`, {
				params: { courseId: courseId },
				headers: { Authorization: `Bearer ${authToken.token}` },
			});
			console.log('After res');
			const data = res.data;
			const filledEntries = fillEmptyEntries(data.history, data.perPage);
			setHistoryData({ ...data, history: filledEntries });
		};
		fetchData();
	}, []);

	const fillEmptyEntries = (history, perPage) => {
		const filledEntries = [...history];
		const currentCount = history.length;
		const fillCount = perPage - (currentCount % perPage);
		if (fillCount < perPage) {
			for (let i = 0; i < fillCount; i++) {
				filledEntries.push({});
			}
		}
		return filledEntries;
	};

	function showHistory(historyData, offset) {
		if (historyData.assigneeCount > historyData.perPage) {
			return historyData.history.slice(offset, offset + historyData.perPage);
		}
		return historyData.assignees;
	}

	const handlePageClick = (data) => {
		setHistoryData((prevState) => ({
			...prevState,
			currentPage: data.selected + 1,
		}));
	};

	const pageCount = Math.ceil(historyData.entryCount / historyData.perPage);
	const offset = (historyData.currentPage - 1) * historyData.perPage;

	const currentEntries = historyData.history.slice(
		(historyData.currentPage - 1) * historyData.perPage,
		historyData.currentPage * historyData.perPage
	);
	let i = 0;
	return (
		<div className="dashboard coursehistory">
			<CreateSideBar sideBarType="Department" />
			<div className="container">
				<CreateTopBar />

				<div className="courseinfo-main">
					<button className='back-to-prev-button' onClick={() => navigate(-1)}>&lt; Back to Previous Page</button>
					<h1 className="courseName" role="contentinfo">
						{historyData.courseCode}: {historyData.courseName}
					</h1>
					<p role="contentinfo">{historyData.courseDescription}</p>
					<br/>
					<p id="current-instructor">Current Instructor: {historyData.currentInstructor}</p>
					<div className="bold score">
						Average Performance Score: <span role="contentinfo">{historyData.avgScore}</span>
					</div>
					<div className="buttons">
						<button id="edit" role="button" name="edit">
							Edit Course
						</button>
						<button id="deactivate" role="button" name="deactivate">
							Deactivate
						</button>
					</div>
					<div id="history">
						<p className="bold">Course History</p>

						<table id="historyTable">
							<thead>
								<tr>
									<th>Instructor</th>
									<th>Session</th>
									<th>Term</th>
									<th>Performance Score</th>
								</tr>
							</thead>
							<tbody>
								{currentEntries.map((entry) => {
									i++;

									return (
										<tr key={i}>
											<td>
												<Link to={`/DeptProfilePage?ubcid=${entry.instructorID}`}>
													{entry.instructorName}
												</Link>
											</td>
											<td>{entry.session}</td>
											<td>{entry.term}</td>
											<td>{entry.score}</td>
										</tr>
									);
								})}
							</tbody>
							<tfoot>
								<tr>
									<td colSpan={4}>
										<ReactPaginate
											previousLabel={'<'}
											nextLabel={'>'}
											breakLabel={'...'}
											pageCount={pageCount}
											marginPagesDisplayed={3}
											pageRangeDisplayed={0}
											onPageChange={handlePageClick}
											containerClassName={'pagination'}
											activeClassName={'active'}
										/>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CourseInformation;
*/