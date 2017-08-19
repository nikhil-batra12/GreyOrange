var https = require('https');
var CONFIG = require('../config')
/************************************
* Module exports / Public functions
************************************/
exports.loginUser =  loginUser;

function loginUser(req,res){
    
    //Get params from request object
    var username = req.body['username'];
    var password = req.body['password']

    var url = CONFIG.URL.SEARCH_USER + username;

	https.get(url, function(response){
	    var body = '';

	    response.on('data', function(chunk){
	        body += chunk;
	    });

	    response.on('end', function(){
	        var loginResponse = JSON.parse(body).results;
	        console.log(loginResponse)
	        var userAuthenticated = false;
	        for(var user=0;user<loginResponse.length;user++){
	        	console.log(loginResponse[0]);
	        	if(loginResponse[user].name === username && loginResponse[user].birth_year === password){
	        		userAuthenticated = true;
	        		break;
	        	}
	        }
	        if(userAuthenticated){
	        	res.send(loginResponse[user]);
	        } else{
	        	res.send({'isError': true, 'message' : 'User id and password do not match'});
	        }
	    });
	}).on('error', function(e){
	      res.status(500).send(error)
	});
};
