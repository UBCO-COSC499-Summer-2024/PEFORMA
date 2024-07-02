const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRouter = require('./routes/logincheck'); // 确保路径正确
const profileRoutes = require('./routes/profileRoutes');
//const serverRouter = require('./routes/server')
const authenticateRouter = require('./Manager/authenticate');
const queryAccountRouter = require('./routes/queryAccountRouter').router;
const AccountTypeRouter = require('./routes/AccountType');
const allCoursesRoutes = require('./routes/allCoursesRoutes');
const { saveDataToDatabase } = require('./routes/DataEntry');
const { upsertProfile } = require('./routes/upsertProfile');
const { createAccount } = require('./routes/createAccount');
const { assignServiceRole } = require ('./routes/assignServiceRole');
//const workingHoursRoutes = require('./routes/workingHoursRoutes');
//const serverRouter = require('./routes/server')
const DeptPerformanceRouter = require('./routes/deptPerformanceRoutes');
const leaderBoardRoutes = require('./routes/leaderBoardRoutes');
const progressRoutes = require('./routes/progressRoutes');
const serviceRoleRoutes = require('./routes/serviceRoleRoutes');
//const ResetPassword = require('./routes/ResetPassword');
//const update = require('./routes/update');
const courseRoutes = require('./routes/courses.js');  

const app = express();

app.use(express.json());
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

// Course list retrieval process
app.use('/api/courses', courseRoutes);
app.use('/api/all-courses', allCoursesRoutes);

//Profile BE
app.use('/api/instructorProfile',profileRoutes);

console.log('after');

//Profile BE
app.use('/api/instructorProfile',profileRoutes);

//reset password
//app.use('/api',ResetPassword);

app.post('/enter', async (req, res) => {
    const data = req.body;
    console.log(data); // 打印接收到的数据，确保格式正确
    try {
        // 调用函数将数据存入数据库
        await saveDataToDatabase(data);
        res.status(200).send('Data successfully saved');
    } catch (error) {
        res.status(500).send(`Failed to save data.Error Message:${error.message}`);
    }
});

app.post('/create-account', async (req, res) => {
    console.log('Received data:', req.body);  // 打印接收到的数据
    //res.send('Data received successfully');  // 响应前端
});
/*
app.post('/create-account', async (req, res) => {
    console.log('Received data:', req.body);  // 打印接收到的数据
    //res.send('Data received successfully');  // 响应前端

//Profile BE
app.use('/api/instructorProfile',profileRoutes);

//Profile BE

console.log('after');

    try {
        const profileId = await upsertProfile(req.body);
        const accountId = await createAccount(profileId, req.body.email, req.body.password);
        console.log(`division=${req.body.division}`)
        const roleResult = await assignServiceRole(profileId, String(req.body.serviceRole), Number(req.body.year),Number(req.body.division));
        
        res.status(200).json({ message: 'Account created successfully', accountId: accountId, roles: roleResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});


});
*/

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Account info page: http://localhost:${port}/Account`);
});
