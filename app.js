/* External module dependencies*/
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var RateLimit = require('express-rate-limit');

/* Internal controller dependencies*/
var authController = require('./server/controllers/loginController');
var planetController = require('./server/controllers/planetController');

/* Set port for local/heroku environment*/
var port = process.env.PORT || 3000;
/* Used to limit no. of calls to 15 per minute for everyone except Luke Skywalker*/
var limiter = new RateLimit({
    max: 15,
    windowMs: 60000,
    message: "Too many accounts search requests generated from this user, please try again after a minute.",
    onLimitReached: function(req, res) {
        //Log on server fr easy debugging
        console.log("Limit reached for user: " + req.params.userId)
    },
    keyGenerator: function(req) {
        //Unique key to identify the user, here username is it's id
        return req.params.userId;
    },
    skip: function(req) {
        //Skip max counts if user is Admin(Luke Skywalker)
        return req.params.isAdmin == "true" ? true : false;
    }
});

activateApp();

// Activate the app and routes
function activateApp(){
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    // parse application/json
    app.use(bodyParser.json());

    //Default routing
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/client/index.html');
    });
    //To authenticate user
    app.post('/api/login', authController.loginUser);
    //To search a planet
    app.get('/api/planets/:searchText/:userId/:isAdmin', limiter, planetController.searchPlanet);
    //To get next search results
    app.get('/api/planets/getMoreResults/:nextUrl', planetController.getNextSearchResults);

    //Set paths
    app.use(express.static(path.normalize(__dirname + '/client')));

    //Start server to listen on port
    app.listen(port, function() {
        console.log('Star wars started. May the force be with you!!')
    })
}