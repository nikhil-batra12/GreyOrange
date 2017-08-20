describe('Login data factory', function() {
	var loginDataService;
	var httpBackend;

  	// Before each test load our api.users module
  	beforeEach(angular.mock.module('login'));

  	// Before each test set our injected dataUsers factory (_Users_) to our local Users variable
  	beforeEach(inject(function($httpBackend, _dataService_) {
	    loginDataService = _dataService_;
	    httpBackend = $httpBackend;
  	}));


  	afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

	  // A simple test to verify the Users factory exists
	  it('should exist', function() {
	    expect(loginDataService).toBeDefined();
	  });

	  describe('.authenticateUser()', function() {
	    // A simple test to verify the method all exists
	    it('should exist', function() {
	      expect(loginDataService.authenticateUser).toBeDefined();
	    });

	    it('should work correctly now', function() {
		    var returnData = {};
	 
	        //7. expectGET to make sure this is called once.
	        httpBackend.expectPOST("/api/login", {username: 'Luke Skywalker', password: '19BBY'}).respond(returnData);
	 
	        //8. make the call.
	        var returnedPromise = loginDataService.authenticateUser('Luke Skywalker', '19BBY');
	 
	        //9. set up a handler for the response, that will put the result
	        // into a variable in this scope for you to test.
	        var result;
	        returnedPromise.then(function (response) {
	            result = response.data;
	        });
	 
	        //10. flush the backend to "execute" the request to do the expectedGET assertion.
	        httpBackend.flush();
	 
	        //11. check the result. 
	         
	        expect(result).toEqual(returnData);
	    });
	  });
});