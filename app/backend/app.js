const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRouter = require('./routes/logincheck'); // 确保路径正确
const profileRoutes = require('./routes/profileRoutes');
//const serverRouter = require('./routes/server')
const authenticateRouter = require('./Manager/authenticate');
const queryAccountRouter = require('./routes/queryAccountRouter').router;
const AccountTypeRouter = require('./routes/AccountType');
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

//Profile BE
app.use('/api/instructorProfile',profileRoutes);

console.log('after');


const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Account info page: http://localhost:${port}/Account`);
});
