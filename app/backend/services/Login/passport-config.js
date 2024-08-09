const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { queryAccount } = require('./queryAccount');
//Put the username and password in the local storage
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async (email, password, done) => {
    const users = await queryAccount();
    const user = users.find(u => u.email === email);
    if (!user) {
        return done(null, false, { message: `Incorrect email. Input is ${email}` });
    }

    const match = bcrypt.compareSync(password, user.password);
    const isMatch = (password === user.password);
    const result = (match || isMatch);
    if (!result) {
        return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
}));

module.exports = passport;
