'use strict';

angular.module('myApp.view1', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
        .state('view1', {
		    templateUrl: 'view1/view1.html',
		    controller: 'View1Ctrl',
		    url: '/view1'
		  });
}])

.controller('View1Ctrl', ['$scope', '$state', 'dataService', function($scope, $state, dataService) {
	$scope.login = function(){
		dataService.getUserInfo($scope.username).then(function(response){
			response = response.data.results[0];
			if(response.name === $scope.username && response.birth_year === $scope.password){
				console.log("Success");
				$state.go('view2');
			} else{
				console.log("Failed");
			}
		},function(error){
			console.log(error);
		});
	}
}])

.factory('dataService', ['$http', function($http) {
	var factory = {};

	factory.getUserInfo = function(username) {
		var url = "https://swapi.co/api/people/?search=";
		return $http.get(url + username);
	}

	return factory;
}]);