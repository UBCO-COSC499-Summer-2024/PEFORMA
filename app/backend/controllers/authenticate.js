// authenticate.js

const jwtManager = require('./jwtManager');

function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    const decoded = jwtManager.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // 如果令牌有效，将解码后的用户信息添加到请求对象
    req.user = decoded;
    next();
}

module.exports = authenticate;
