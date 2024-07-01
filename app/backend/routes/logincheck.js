//import {pool} from '../db/index';
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateToken, TOKEN_EXPIRY_SECONDS } = require('../Manager/jwtManager');
const { queryAccount } = require('./queryAccountRouter');
const pool = require('../db/index');
const { bcrypt } = require('bcryptjs');
var token_save = '';

const router = express.Router();

router.use(bodyParser.json());
router.use(passport.initialize());
router.use(cors());

// get users from data base
const getUsers = async () => {
    try {
        const users = await queryAccount();
        return users;
      } catch (err) {
        console.error('Error fetching user data', err.stack);
        return [];
      }
}
/*
const getAccountType = async (accountId) => {
    try {
      const client = await pool.connect();
      const result = await client.query(`SELECT * FROM public."AccountType" WHERE accountId = ${accountId}`);
      client.release();
      return result.rows[0].accountType;
    } catch (err) {
      console.error('Error fetching account type', err.stack);
      throw err;
    }
  };
*/
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async (email, password, done) => {
    const users = await getUsers();
    var user = users.find(user => user.email === email);

    if (!user) {
        return done(null, false, { message: `Failed to find account with email.Input is ${email}` });
    }

    var isMatch = false;
    if(user.password.length!=60){
        console.log("user password not hashed");
        isMatch = (password === user.password);
        if(!isMatch){
            return done(null,false,{ message : "Password Incorrect" });
        }
        else {
            return done(null,user,{message :"Please reset password for safety"});
        }
    }else{
        console.log("user password hashed");
        isMatch = bcrypt.compareSync(password,user.password);
        if (!isMatch) {
            return done(null,false,{message:"Password Incroorect"});
        }
        else {
            return done(null, user,{message:""});
        }
    }
}));

// 修改后的登录路由
router.post('/logincheck', (req, res, next) => {
    //console.log('Received:'+JSON.stringify(req.body));
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (!user) {
            return res.json({ success: false, message: info.message });
        }
        const token = generateToken(user);
        return res.json({ 
            success: true, 
            token: token, 
            expiresIn: TOKEN_EXPIRY_SECONDS, 
            email: user.email, 
            accountId: user.accountId,
            profileId: user.profileId,
            //acctype: user.acctype 
            message : info.message
        });
    })(req, res, next);
});

module.exports = router;