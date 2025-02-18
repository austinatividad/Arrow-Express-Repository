// import module `express`
const express = require('express');

//import dotenv
require('dotenv').config();


const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
// import module `hbs`
const hbs = require('hbs');

// import module `routes` from `./routes/routes.js`
const routes = require('./routes/routes.js');

// import module `database` from `./model/db.js`
//const db = require('./models/db.js');
const db = mongoose.connection;

const app = express();
const port = 3000;

app.use(session({
    secret: 'sessionID',
    cookie: {maxAge: 7*24*60*60*3000},
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: db, autoRemove: 'disabled'}),
    resave: false
}));

// set `hbs` as view engine
app.set('view engine', 'hbs');

app.use(express.json());

// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));

// set the folder `public` as folder containing static assets
// such as css, js, and image files
app.use(express.static('public'));

// define the paths contained in `./routes/routes.js`
app.use('/', routes);

// if the route is not defined in the server, render `../views/error.hbs`
// always define this as the last middleware

app.use(function (req, res) {

    var details = {};

    /*
        checks if a user is logged-in by checking the session data
        if a user is logged-in,
        display the profile tab and logout tab in the nav bar.
    */ 
    if(req.session.idNumber) {
        details.flag = true;
        details.idNumber = req.session.idNumber;
    }

    /*
        if no user is logged-in,
        do not display the profile tab and the logout tab in the nav bar.
    */
    else
        details.flag = false;

    // render `../views/error.hbs`
    res.render('Error', details);
});

// connects to the database
//db.connect();

// binds the server to a specific port
app.listen(port, function () {
    console.log('app listening at port ' + port);
});