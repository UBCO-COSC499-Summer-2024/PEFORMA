
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';  // Replace with a strong, environment-specific secret key
const TOKEN_EXPIRY_SECONDS = 2000*60;  // 2 minutes in seconds

function generateToken(user) {
    const payload = { id: user.id, username: user.username, acctype: user.acctype, profileId: user.profileId };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRY_SECONDS });
    return {
        token,
        expiresIn: TOKEN_EXPIRY_SECONDS
    };
}

function verifyToken(token) {
    try {
        return { valid: true, decoded: jwt.verify(token, SECRET_KEY) };
    } catch (error) {
        return { valid: false, decoded: null };
    }
}

module.exports = { generateToken, verifyToken, TOKEN_EXPIRY_SECONDS };
