'use strict';

// Declare app level module which depends on views, and components
var mainModule = angular.module('main', [
    'ui.router',
    'login',
    'dashboard',
    'ngStorage'
])

//Setup default route when app starts
mainModule.config(['$urlRouterProvider', function($urlRouterProvider) {
    $urlRouterProvider.otherwise(function($injector) {
        $injector.get("$state").go('login');
        return true;
    });
}]);