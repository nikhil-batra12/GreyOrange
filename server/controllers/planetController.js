var https = require('https');
var CONFIG = require('../config')
/************************************
* Module exports / Public functions
************************************/
exports.searchPlanet =  searchPlanet;
exports.getNextSearchResults =  getNextSearchResults;

function searchPlanet(req,res){
    
    //Get params from request object
    var searchText = req.params['searchText'];
console.log(searchText)
    var url = CONFIG.URL.SEARCH_PLANET + searchText;

	https.get(url, function(response){
	    var body = '';

	    response.on('data', function(chunk){
	        body += chunk;
	    });

	    response.on('end', function(){
	        var searchResponse = JSON.parse(body);
	        res.send(searchResponse);
	    });
	}).on('error', function(e){
	      res.status(500).send(e)
	});
};

function getNextSearchResults(req, res){
	var nextSearchUrl = req.params['nextUrl'];
	console.log(nextSearchUrl)
	https.get(nextSearchUrl, function(response){
	    var body = '';

	    response.on('data', function(chunk){
	        body += chunk;
	    });

	    response.on('end', function(){
	        var searchResponse = JSON.parse(body);
	        res.send(searchResponse);
	    });
	}).on('error', function(e){
	      res.status(500).send(e)
	});

}