const express = require('express');

// middleware for printing info about HTTP requests
// METHOD URI STATUS TIME_FOR_THE_RESPONSE
// POST /api/sessions 401 2.899 ms
const morgan = require('morgan');

// interface with the tasks table of the DB
const dao = require("./dao.js");

// interface with the users table of the DB
const userDao = require('./user-dao.js');

// session middleware
const session = require('express-session');


const passport = require('passport');
const passportLocal = require('passport-local');


// initialize and configure passport
passport.use(new passportLocal.Strategy((username, password, done) => {
    // console.log("passport.use")
    // verification callback for authentication
    // User not found: false
    // User found: user object {id, email, password}
    // DB error: err
    userDao.getUser(username, password).then(user => {

        // done(null, user) valid credentials
        // done(null, false, {message}) invalid credentials
        // done({error}) application error
        if (user)
            done(null, user);
        else
            done(null, false, { message: 'Email and/or password wrong' });
    }).catch(err => {
        done(err);
    });

}));

// port of the express server
const PORT = 3001;

const app = express();

// setup the morgan middleware
app.use(morgan("dev"));

// parse the body in JSON format => populate req.body attributes
app.use(express.json());

// initialize and configure  HTTP sessions
// enable sessions in Expresss
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

// serialize the user id to be stored in the session
// passport takes that user id and stores it internally
// on req.session.passport
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
// the user object created by deserializeUser() will be available in every authenticated
// request in req.user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

// logging in the user
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// middleware for checking if the user is authenticated
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    // console.log("isLoggedIn, req.user: ", req.user)
    // console.log("isLoggedIn, req.isAuthenticated(): ", req.isAuthenticated())
    return res.status(401).json({ error: 'isLoggedIn: not authenticated' });
}


// get info about the current logged in user
app.get('/api/sessions/current', isLoggedIn, (req, res) => {
    res.status(200).json(req.user);
});

// logging out the current user
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
})



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));