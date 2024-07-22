//import {pool} from '../db/index';
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateToken, TOKEN_EXPIRY_SECONDS } = require('../Manager/jwtManager');
const { queryAccount } = require('../services/queryAccount');
const pool = require('../db/index');
const { uncry } = require('./checkpassword');
const bcrypt = require ('bcryptjs');

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

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async (email, password, done) => {
    const users = await getUsers();
    var user = users.find(user => user.email === email);
    //var user = user_data.find(user => user.username === email);
    if (!user) {
        return done(null, false, { message: `Incorrect email.Input is ${email}` });
    }

    const Match = bcrypt.compareSync(password,user.password);
    const isMatch = (password===user.password);
    const result = (Match | isMatch);
    console.log(JSON.stringify(Match));
    if (!result) {
        console.log('entered|',password,'|--vs--saved|',user.password,'|');
        console.log('|',password,'|--vs--|',user.password,'|');
        return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
}));

router.post('/logincheck', (req, res, next) => {
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
            profileId: user.profileId
        });
    })(req, res, next);
});

module.exports = router;