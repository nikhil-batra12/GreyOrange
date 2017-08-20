'use strict';
/* This file has login functionality */

//Declare login module
var loginModule = angular.module('login', ['ui.router'])

//Set login route
loginModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl',
            url: '/login'
        });
}])

// Login controller where bussiness logic is written
loginModule.controller('loginCtrl', ['$scope', '$state', '$localStorage', 'dataService', function($scope, $state, $localStorage, dataService) {
    $scope.login = function() {
        $scope.disableSubmit = true;
        $scope.invalideCredential = true;
        dataService.authenticateUser($scope.username, $scope.password).then(function(response) {
            $scope.disableSubmit = false;
            //Check if user authenticated, set its object in localstorage
            if (!response.data.isError) {
                if($localStorage.starwarsuser){
                    delete $localStorage.starwarsuser;
                }
                $localStorage.starwarsuser = response.data;
                $scope.$parent.user = response.data;
                $state.go('dashboard');
            } else {
                $scope.invalideCredential = true;
                $scope.errorMessage = response.data.message;
            }
        }, function(error) {
            console.log(error);
        });
    }
}])

//This service authenticates the user
loginModule.factory('dataService', ['$http', function($http) {
    var factory = {};
    factory.authenticateUser = function(username, password) {
        var url = '/api/login';
        return $http.post(url, {
            username: username,
            password: password
        });
    }
    return factory;
}]);