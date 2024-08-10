const passport = require('passport');
require('../../services/Login/passport-config'); //Execute service
const { generateToken, TOKEN_EXPIRY_SECONDS } = require('../../Manager/jwtManager');
async function loginCheck (req, res, next)  {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (!user) {
            return res.json({ success: false, message: info.message });
        }
        const token = generateToken(user); //generate token for the user
        return res.json({
            success: true,
            token: token,
            expiresIn: TOKEN_EXPIRY_SECONDS,
            email: user.email,
            accountId: user.accountId,
            profileId: user.profileId
        });
    })(req, res, next);
};

module.exports = {
    loginCheck
}