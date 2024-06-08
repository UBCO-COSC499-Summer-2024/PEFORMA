const express = require('express');
const { Client } = require('pg');
require('dotenv').config();
///////////
const createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");

const app = express();
const port = 3003;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
/////////////

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error:\n', err.stack));

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

/*
app.get('/data', async (req, res) => {
  console.log('Handling /data request...');
  try {
    console.log('Executing database query...');
    const { rows } = await client.query('SELECT * FROM yourTable');  // 使用 client 替代 pool
    console.log('Query successful:', rows);
    res.send(rows);
    console.log('get finished.')
  } catch (err) {
    console.error('Error during database query:', err);
    res.status(500).send('Database error');
  }
});
*/
const getTables = async () => {
  try {
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `;
    const res = await client.query(query);
    console.log("Tables in the public schema:", res.rows);
    if(res.rows=[]){console.log('empty data base');}
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
};

getTables();


module.exports = app;