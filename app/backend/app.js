const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRouter = require('./routes/logincheck'); // 确保路径正确
const profileRoutes = require('./routes/profileRoutes');
const workingHoursRoutes = require('./routes/workingHoursRoutes');
//const serverRouter = require('./routes/server')
const authenticateRouter = require('./Manager/authenticate');
const queryAccountRouter = require('./routes/queryAccountRouter').router;
const AccountTypeRouter = require('./routes/AccountType');
const DeptPerformanceRouter = require('./routes/deptPerformanceRoutes');
const leaderBoardRoutes = require('./routes/leaderBoardRoutes');
const progressRoutes = require('./routes/progressRoutes');
const serviceRoleRoutes = require('./routes/serviceRoleRoutes');
//const ResetPassword = require('./routes/ResetPassword');
//const update = require('./routes/update');

const courseHistoryRouter = require('./routes/courseHistoryRoutes');

const app = express();

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('before:');

//login pprocess
app.use('/',queryAccountRouter);//serach account in db
app.use('/', loginRouter);//check for login
app.use('/api',authenticateRouter);//login account authenticate
app.use('/',AccountTypeRouter);//check account type
//reset password
//app.use('/api',ResetPassword);

//update date into db
//app.use('/api',update);


//Profile BE
app.use('/api/instructorProfile',profileRoutes);
app.use('/api/workingHoursRoutes',workingHoursRoutes);
app.use('/api/deptPerformance',DeptPerformanceRouter);
app.use('/api/leaderBoardRoutes',leaderBoardRoutes);
app.use('/api/progressRoutes',progressRoutes);


//Performance BE
//app.use('/api/instructorPerformance',performanceRoutes);
// Service role retrieval process
app.use('/api/service-roles', serviceRoleRoutes);

//Dept course info
app.use('/api/courseHistory',courseHistoryRouter);

console.log('after');

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Account info page: http://localhost:${port}/Account`);
});
