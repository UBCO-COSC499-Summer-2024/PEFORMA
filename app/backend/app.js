const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginCheckRouter = require('./routes/logincheck'); // 确保路径正确
const serverRouter = require('./routes/server')
const authenticateRouter = require('./routes/authenticate');

const app = express();
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 使用 loginCheckRouter
app.use('/', loginCheckRouter);
app.use('/',serverRouter)
app.use('/api',authenticateRouter);

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
