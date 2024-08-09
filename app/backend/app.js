const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRouter = require('./routes/Login/logincheck.js'); 
const profileRoutes = require('./routes/profileRoutes');

const authenticateRouter = require('./Manager/authenticate');

//Account related Routes
const createAccount = require('./routes/createAccount');
const AccountTypeRouter = require('./routes/Login/accountTypeRoutes.js');

//Data imports and course/service role creation
const dataImportRoutes = require('./routes/dataImportRoutes');
const saveDataToDatabase = require('./routes/DataEntry');

//Performance Routers
const workingHoursRoutes = require('./routes/Performance/workingHoursRoutes.js');
const DeptPerformanceRouter = require('./routes/Performance/deptPerformanceRoutes.js');
const leaderBoardRoutes = require('./routes/Performance/leaderBoardRoutes.js');
const progressRoutes = require('./routes/Performance/progressRoutes.js');
const benchmark = require('./routes/Performance/benchmark.js');
const deptLeaderBoard = require('./routes/Performance/deptLeaderboard.js');
const coursePerformance = require('./routes/Performance/coursePerformance.js');

//Show List
const serviceRoleRoutes = require('./routes/ShowList/serviceRoleRoutes.js');
const allInstructors = require('./routes/ShowList/allInstructorsRoutes.js');
const allTerms = require('./routes/ShowList/allTermsRoutes.js')
const allCoursesRoutes = require('./routes/ShowList/allCoursesRoutes.js'); 
const courseRoutes = require('./routes/ShowList/courses.js');  
const teachingAssignment = require('./routes/ShowList/teachingAssignment.js');

const instructorFetch = require('./routes/AssignInstructor/instructorFetch.js');
const deptProfileRoutes = require('./routes/UpdateInfo/deptProfileRoutes');

//Update Status Router
const deptStatusChangeCourseRoutes = require('./routes/UpdateStatus/deptStatusChangeCourseRouters.js');
const adminStatusChangeMembers = require('./routes/UpdateStatus/adminStatusChangeMembersRoutes.js');
const deptStatusChangeServiceRoutes = require('./routes/UpdateStatus/deptStatusChangeServiceRoleRoutes.js');

//Show Information Router
const courseHistoryRouter = require('./routes/ShowInfo/courseHistoryRoutes.js');
const roleInfoRoutes = require('./routes/ShowInfo/roleInfoRoutes');
const imageRoutes = require('./routes/ShowInfo/imageRoutes.js');
const userProfileGetRoutes = require('./routes/ShowInfo/userProfileGetRoutes');
const userRoutes = require('./routes/ShowInfo/userRoutes.js');

//Update Password Router
const changePasswordRoutes = require('./routes/UpdatePassword/changePasswordRoutes.js');
const updatePasswordRouter = require('./routes/UpdatePassword/updatePassword.js');
const resetPasswordRouter = require('./routes/UpdatePassword/resetPassword.js');

//Course Evaluation
const courseEvaluation = require('./routes/CourseEvaluation/courseEvaluationRoutes.js');
const courseEvaluationForm = require('./routes/CourseEvaluation/courseEvaluationFormRoutes.js');

//Update Info Router
const updateRoleInfo = require('./routes/UpdateInfo/updateRoleInfo.js');
const updateCourseInfo = require('./routes/UpdateInfo/updateCourseInfo.js');
const userProfileUpdateRoutes = require('./routes/UpdateInfo/userProfileUpdateRoutes');

//Assign Instructor Router
const AssignInstructor = require('./routes/AssignInstructor/AssignInstructorServiceRole.js');
const assignInstructorCourse = require('./routes/AssignInstructor/assignInstructorCourse.js');

//Remove Instructor Router
const removeInstructorRoleRouter = require('./routes/RemoveInstructor/removeInstructorRoleRouter.js');
const removeInstructorCourse = require('./routes/RemoveInstructor/removeInstructorCourseRout.js');

//Set Term
const setTerm = require('./routes/setCurrentTermRoutes.js')

//Meeting routes
const meetingRoutes = require('./routes/ShowList/meetingRoutes.js');

const app = express();

app.use(express.json());
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('before:');

//login pprocess
app.use('/logincheck', loginRouter);//check for login
app.use('/api',authenticateRouter);//login account authenticate
app.use('/accountType',AccountTypeRouter);//check account type

//Profile BE
app.use('/api/instructorProfile',profileRoutes);
app.use('/api/create-account', createAccount);

//Performance BE
app.use('/api/workingHoursRoutes',workingHoursRoutes);
app.use('/api/deptPerformance',DeptPerformanceRouter);
app.use('/api/leaderBoardRoutes',leaderBoardRoutes);
app.use('/api/progressRoutes',progressRoutes);

// Course list retrieval process
app.use('/api/courses', courseRoutes);

app.use('/api/all-courses', allCoursesRoutes);

// Service role retrieval process
app.use('/api/service-roles', serviceRoleRoutes);

app.use('/api/teachingAssignment',teachingAssignment);
// Image retrieval process
app.use('/api/image', imageRoutes);

app.use('/api/change-password', changePasswordRoutes);

// Meeting retrieval process
app.use('/meetings', meetingRoutes);
  
app.use('/api', userRoutes);

app.use('/api/courseHistory',courseHistoryRouter);
app.use('/api/dept-profile', deptProfileRoutes);

app.use('/api/benchmark', benchmark);
app.use('/api/deptLeaderBoard',deptLeaderBoard);
app.use('/api/coursePerformance',coursePerformance);
app.use('/api/service-roles',serviceRoleRoutes);

//reset password
app.use('/api/reset', resetPasswordRouter);

//update password
app.use('/api/update-password', updatePasswordRouter);


app.use('/api/allInstructors',allInstructors);
app.use('/api/adminStatusChangeMembers',adminStatusChangeMembers);

app.use('/api/DeptStatusChangeServiceRole',deptStatusChangeServiceRoutes);
app.use('/api/DeptStatusChangeCourse',deptStatusChangeCourseRoutes);

// User profile
app.use('/api/profile', userProfileGetRoutes);
app.use('/api/profile', userProfileUpdateRoutes);

//reset password

app.use('/api/reset-password', resetPasswordRouter);


app.use('/api/roleInfo', roleInfoRoutes);

app.use('/api/upload', dataImportRoutes);

//Course Evaluation
app.use('/api/courseEvaluationForm',courseEvaluationForm);
app.use('/api/courseEvaluation',courseEvaluation);
app.use('/api/assignInstructorCourse',assignInstructorCourse);

//Term related routers
app.use('/api/terms',allTerms);
app.use('/api/setCurrentTerm', setTerm)

//Data Entry 
app.use('/enter',saveDataToDatabase);

//Fetch instructor
app.use('/api/instructors',instructorFetch);

//Update info
app.use('/api/updateRoleInfo',updateRoleInfo);
app.use('/api/updateCourseInfo',updateCourseInfo);
//Assign
app.use('/api/assignInstructorServiceRole',AssignInstructor);

//Remove instructor
app.use('/api/removeInstructorRole',removeInstructorRoleRouter);
app.use('/api/removeInstructorCourse',removeInstructorCourse);

const port = 3001;
// Wrap server startup in an async function
const startServer = async () => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
        console.log(`Account info page: http://localhost:${port}/Account`);
        console.log(`Data entry request: http://localhost:${port}/enter`);
        console.log(`Instructor lists: http://localhost:${port}/api/instructors`);
    });
};

// Call the async function to start the server
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

