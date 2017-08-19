'use strict';

angular.module('myApp.login', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
        .state('login', {
		    templateUrl: 'login/login.html',
		    controller: 'loginCtrl',
		    url: '/login'
		  });
}])

.controller('loginCtrl', ['$scope', '$state', 'dataService', function($scope, $state, dataService) {
	$scope.login = function(){
		$scope.disableSubmit = true;
		$scope.invalideCredential = true;
		dataService.authenticateUser($scope.username, $scope.password).then(function(response){
			$scope.disableSubmit = false;
			if(!response.data.isError){
				$state.go('dashboard');
			} else{
				$scope.invalideCredential = true;
				$scope.errorMessage = response.data.message;
			}
		},function(error){
			console.log(error);
		});
	}
}])

.factory('dataService', ['$http', function($http) {
	var factory = {};

	factory.authenticateUser = function(username, password) {
		var url = '/api/login';
		return $http.post(url,{username: username, password: password});
	}

	return factory;
}]);