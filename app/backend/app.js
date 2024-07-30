const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRouter = require('./routes/logincheck'); // 确保路径正确
const profileRoutes = require('./routes/profileRoutes');

const authenticateRouter = require('./Manager/authenticate');
const queryAccountRouter = require('./routes/queryAccountRouter');
const AccountTypeRouter = require('./routes/accountTypeRoutes.js');
const dataImportRoutes = require('./routes/dataImportRoutes');
const saveDataToDatabase = require('./routes/DataEntry');

const createAccount = require('./routes/createAccount');

const workingHoursRoutes = require('./routes/workingHoursRoutes');
//const serverRouter = require('./routes/server')
const DeptPerformanceRouter = require('./routes/deptPerformanceRoutes');
const leaderBoardRoutes = require('./routes/leaderBoardRoutes');
const progressRoutes = require('./routes/progressRoutes');
const serviceRoleRoutes = require('./routes/serviceRoleRoutes');

//const update = require('./routes/update');
const instructorFetch = require('./routes/instructorFetch.js');
const courseRoutes = require('./routes/courses.js');  
const allCoursesRoutes = require('./routes/allCoursesRoutes.js'); 
const benchmark = require('./routes/benchmark.js');
const deptLeaderBoard = require('./routes/deptLeaderboard.js');
const coursePerformance = require('./routes/coursePerformance.js');
const deptProfileRoutes = require('./routes/deptProfileRoutes');


const adminStatusChangeMembers = require('./routes/adminStatusChangeMembersRoutes.js');
const allInstructors = require('./routes/allInstructorsRoutes');
const deptStatusChangeServiceRoutes = require('./routes/deptStatusChangeServiceRoleRoutes');
const imageRoutes = require('./routes/imageRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const userRoutes = require('./routes/userRoutes');
const changePasswordRoutes = require('./routes/changePasswordRoutes');


const courseHistoryRouter = require('./routes/courseHistoryRoutes');
const roleInfoRoutes = require('./routes/roleInfoRoutes');


const updatePasswordRouter = require('./routes/updatePassword');
// const updatePasswordRouter = require('./routes/updatePassword.js')
const deptStatusChangeCourseRoutes = require('./routes/deptStatusChangeCourseRouters.js')
const teachingAssignment = require('./routes/teachingAssignment.js');
const courseEvaluation = require('./routes/courseEvaluationRoutes.js');
const resetPasswordRouter = require('./routes/resetPassword');
//const updatePasswordRouter = require('./routes/updatePassword.js')
const courseEvaluationForm = require('./routes/courseEvaluationFormRoutes.js')

const updateRoleInfo = require('./routes/updateRoleInfo.js');
const updateCourseInfo = require('./routes/updateCourseInfo.js');
const AssignInstructor = require('./routes/AssignInstructorServiceRole.js');
const assignInstructorCourse = require('./routes/assignInstructorCourse.js');
const removeInstructorRoleRouter = require('./routes/removeInstructorRoleRouter');
const removeInstructorCourse = require('./routes/removeInstructorCourseRout.js');
const allTerms = require('./routes/allTermsRoutes.js')
const setTerm = require('./routes/setCurrentTermRoutes.js')

const app = express();

app.use(express.json());
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('before:');

//login pprocess
app.use('/',queryAccountRouter);//serach account in db
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

// User profile
app.use('/api/profile', (req, res, next) => {
    console.log('Profile route hit:', req.url);
    next();
  }, userProfileRoutes);
  
app.use('/api', userRoutes);

app.use('/api/courseHistory',courseHistoryRouter);
app.use('/api/dept-profile', deptProfileRoutes);

app.use('/api/benchmark', benchmark);
app.use('/api/deptLeaderBoard',deptLeaderBoard);
app.use('/api/coursePerformance',coursePerformance);
app.use('/api/service-roles',serviceRoleRoutes);

//reset password
app.use('/api/reset', resetPasswordRouter);
// app.use('/api', updatePasswordRouter);

//reset password
// app.use('/api', resetPasswordRouter);
app.use('/api/update-password', updatePasswordRouter);


app.use('/api/allInstructors',allInstructors);
app.use('/api/adminStatusChangeMembers',adminStatusChangeMembers);

app.use('/api/DeptStatusChangeServiceRole',deptStatusChangeServiceRoutes);
app.use('/api/DeptStatusChangeCourse',deptStatusChangeCourseRoutes);



//reset password

app.use('/api/reset-password', resetPasswordRouter);

//app.use('/api', updatePasswordRouter);

app.use('/api/roleInfo', roleInfoRoutes);
//app.use('/api',ResetPassword);

app.use('/api/upload', dataImportRoutes);

//Course Evaluation
app.use('/api/courseEvaluationForm',courseEvaluationForm);
app.use('/api/courseEvaluation',courseEvaluation);
app.use('/api/assignInstructorCourse',assignInstructorCourse);

app.use('/api/terms',allTerms);
app.use('/api/setCurrentTerm', setTerm)

app.use('/enter',saveDataToDatabase);


app.use('/api/instructors',instructorFetch);

app.use('/api/updateRoleInfo',updateRoleInfo);
app.use('/api/updateCourseInfo',updateCourseInfo);
app.use('/api/assignInstructorServiceRole',AssignInstructor);

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

