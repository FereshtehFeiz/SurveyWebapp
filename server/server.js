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

/*** APIs ***/

// GET /api/surveys
app.get("/api/surveys", async (req, res) => {
    try {
        const surveys = await dao.listSurveys();
        res.json(surveys);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


// creating a survey for a specific user
app.post("/api/surveys", isLoggedIn, async (req, res) => {
    try {
        await dao.createSurvey(req.body);
        res.end();
    }
    catch (error) {
        console.log("POST /api/surveys error: ", error)
        res.status(500).json(error);
    }

});



// get the list of surveys of the logged in user
// by using the user id
app.get("/api/users/:id/surveys", isLoggedIn, async (req, res) => {

    try {
        const surveys = await dao.getSurveysByUser(req.params.id);
        res.json(surveys);
        console.log(surveys);
    }
    catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});


// adding question for the last Survey ID that
app.post("/api/question", isLoggedIn, async (req, res) => {
    try {
        await dao.insertQuestion(req.body);
        res.end();
    }
    catch (error) {
        console.log("POST /api/question error: ", error)
        res.status(500).json(error);
    }

});


// GET /api/questions of the given SurveyId
app.get("/api/survey/:id", async (req, res) => {
    try {
        const questions = await dao.getQuestions(req.params.id);
        res.json(questions);
        console.log(questions);
    }
    catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});



// adding answers
app.post("/api/answer", async (req, res) => {
    try {
        console.log("req.body" , req.body);
        await dao.insertAnswers(req.body);
        res.end();
    }
    catch (error) {
        console.log("POST /api/answer error: ", error)
        res.status(500).json(error);
    }

});

// for showing user answers for the given survey Id
app.get("/api/answers/:id/:userId", async (req, res) => {
    try {
        const answers = await dao.listAnswers(req.params.id,req.params.userId);
        res.json(answers);
        console.log("answers",answers);
    }
    catch (err) {
        res.status(500).json(err);
    }
});


// listing the user Ids that answer the survey
app.get("/api/userids/:id", async (req, res) => {
    try {
        const userIDs = await dao.allUserIDs(req.params.id);
        res.json(userIDs);
        console.log("user IDs",userIDs);
    }
    catch (err) {
        res.status(500).json(err);
    }
});





app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));