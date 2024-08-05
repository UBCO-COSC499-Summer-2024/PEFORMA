// authenticate.js

const jwtManager = require('./jwtManager');
require("dotenv").config();

function authenticate(req, res, next) {
    var token = req.headers['authorization'];
    /*
    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }
    */
   if (!token){
        token = `Bearer ${process.env.DEFAULT_ACTIVE_TOKEN}`;
   }
   token = token.split(' ')[1];

    const decoded = jwtManager.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // 如果令牌有效，将解码后的用户信息添加到请求对象
    req.user = decoded;
    next();
}

function logout (req, res){
    
}

module.exports = authenticate;
