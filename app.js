var express = require('express');
var app = express();
var authController = require('./server/controllers/loginController');
var planetController = require('./server/controllers/planetController');

var path = require('path');
var bodyParser = require('body-parser');
var RateLimit = require('express-rate-limit');

var limiter = new RateLimit({
    max: 15,
    windowMs: 60000,
    message: "Too many accounts search requests generated from this user, please try again after a minute.",
    onLimitReached: function(req, res) {
        console.log("Limit reached for user: " + req.params.userId)
    },
    keyGenerator: function(req) {
        return req.params.userId;
    },
    skip: function(req) {
        return req.params.isAdmin == "true" ? true : false;
    }
});


var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
})

app.post('/api/login', authController.loginUser);
app.get('/api/planets/:searchText/:userId/:isAdmin', limiter, planetController.searchPlanet);
app.get('/api/planets/getMoreResults/:nextUrl', planetController.getNextSearchResults);

app.use(express.static(path.normalize(__dirname + '/client')));

app.listen(port, function() {
    console.log('Example app listening on port 3000!')
})