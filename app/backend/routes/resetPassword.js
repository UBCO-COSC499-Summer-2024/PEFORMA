const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();
const { queryAccount } = require('./queryAccountRouter');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
router.use(passport.initialize());
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
  usernameField: 'email'
},
async (email,  done) => {
  const users = await getUsers();
  var user = users.find(user => user.email === email);
  //var user = user_data.find(user => user.username === email);
  if (!user) {
      return done(null, false, { message: `Email is not associated with an account.` });
  }
  return done(null, user);
}));


router.post('/', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
  if (!user) {
      return res.json({ success: false, message: info.message });
  }
    const { email } = req.body;
  let valid = false;

 
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'non-Reply - Password Reset',
    text: ''+
    'This is an auto-email send for re-setting password'+
    'If you do not make this request, please ignore it.'+
    'Do not share this link with anyone else you do not trust.'+
    'Please use the link below to reset your password.\n'+
    //FE web page to be changed later
    'http://localhost:3000/NewPassword?email='+email+
    '',
  };
  console.log("Email received: ",email);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
      return res.status(500).json({ message: 'Error sending email' });
    }
    res.status(200).json({ message: 'success' });
    console.log(mailOptions.text);
  });
})(req, res, next);
  
} 
);

module.exports = router;
