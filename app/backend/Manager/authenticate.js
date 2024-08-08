// authenticate.js

const jwtManager = require('./jwtManager');
require("dotenv").config();

function authenticate(req, res, next) {
    var token = req.headers['authorization'];
   if (!token){
        token = `Bearer ${process.env.DEFAULT_ACTIVE_TOKEN}`;
   }
   token = token.split(' ')[1];

    const decoded = jwtManager.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
}

module.exports = authenticate;
