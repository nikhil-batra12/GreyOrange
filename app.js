var express = require('express');
var app = express();
var authController = require('./server/controllers/loginController');
var planetController = require('./server/controllers/planetController');

var path = require('path');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req,res){
	res.sendFile(__dirname + '/client/index.html');
})

app.post('/api/login', authController.loginUser);
app.get('/api/planets/:searchText', planetController.searchPlanet);
app.get('/api/planets/getMoreResults/:nextUrl', planetController.getNextSearchResults);

app.use(express.static(path.normalize(__dirname + '/client')));

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})