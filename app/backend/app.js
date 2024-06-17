const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRouter = require('./routes/logincheck'); // 确保路径正确
const profileRoutes = require('./routes/profileRoutes');
//const serverRouter = require('./routes/server')
const authenticateRouter = require('./Manager/authenticate');
const queryAccountRouter = require('./routes/queryAccountRouter').router;

const app = express();

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('before:');

// 使用 loginCheckRouter

//app.use('/',serverRouter);
app.use('/',queryAccountRouter);
app.use('/', loginRouter);
app.use('/api',authenticateRouter);


//Profile BE
app.use('/api/instructorProfile', profileRoutes);

console.log('after');

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Account info page: http://localhost:${port}/Account`);
});
