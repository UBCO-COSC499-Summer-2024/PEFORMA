// routes/data.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 定义查询函数
const queryAccount = async () => {
  try {
    console.log('connected --');
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."Account"'); // 替换为你的表名
    //console.log('Result start :');
    //console.log('Query Result:', result.rows); // 在控制台中打印查询结果
    //console.log('Result end.')
    client.release();
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

// 定义路由
router.get('/Account', async (req, res) => {
  try {
    const data = await queryAccount();
    //res.send('这是数据');
    res.json(data);
    //console.log(JSON(data));
  } catch (err) {
    res.status(500).send('Error querying database');
    console.log(err);
  }
});

module.exports = {
  router:router,
  queryAccount:queryAccount};
