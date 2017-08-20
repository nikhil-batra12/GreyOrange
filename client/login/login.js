'use strict';

var loginModule = angular.module('login', ['ui.router'])

loginModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl',
            url: '/login'
        });
}])

loginModule.controller('loginCtrl', ['$scope', '$state', '$localStorage', 'dataService', function($scope, $state, $localStorage, dataService) {
    $scope.login = function() {
        $scope.disableSubmit = true;
        $scope.invalideCredential = true;
        dataService.authenticateUser($scope.username, $scope.password).then(function(response) {
            $scope.disableSubmit = false;
            if (!response.data.isError) {
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