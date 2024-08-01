const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


router.post('/', (req, res) => {

  const { email } = req.body;

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
});

module.exports = router;
