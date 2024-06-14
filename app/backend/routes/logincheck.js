const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { generateToken, TOKEN_EXPIRY_SECONDS } = require('./jwtManager');

const router = express.Router();

router.use(bodyParser.json());
router.use(passport.initialize());
router.use(cors());

// mock user data
//var users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

const users = [
    {   "id":"0",   "username":"user0@test",    "password":"pswd012",   "acctype" :"inst"
    },
    {   "id":"1",   "username":"user1@test",    "password":"pswd123",   "acctype" :"dept"
    },
    {   "id":"2",   "username":"user2@test",    "password":"pswd234",   "acctype" :"inst"
    },
    {   "id":"3",   "username":"user3@test",    "password":"pswd345",   "acctype" :"dept"
    },
    {   "id":"4",   "username":"user4@test",    "password":"pswd456",   "acctype" :"inst"
    },
    {   "id":"5",   "username":"user5@test",    "password":"pswd567",   "acctype" :"dept"
    },
    {   "id":"6",   "username":"user6@test",    "password":"pswd678",   "acctype" :"inst"
    },
    {   "id":"7",   "username":"user7@test",    "password":"pswd789",   "acctype" :"dept"
    },
    {   "id":"8",   "username":"user8@test",    "password":"pswd890",   "acctype" :"inst"
    },
    {   "id":"9",   "username":"user9@test",    "password":"pswd901",   "acctype" :"dept"
    }
];


// Passport check startegy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async (email, password, done) => {
    var user = users.find(user => user.username === email);
    if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
    }
    const isMatch = (password===user.password);
    if (!isMatch) {
        console.log('|',password,'|--vs--|',user.password,'|');
        return done(null, false, { message: 'Incorrect password.' });
    }
    //const rtn = {username:user.email,acctype:user.acctype};
    console.log('login success as type:'+user.acctype);
    return done(null, user);
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
            email: user.username, 
            acctype: user.acctype 
        });
    })(req, res, next);
});

module.exports = router;