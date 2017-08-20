'use strict';

// Declare app level module which depends on views, and components
angular.module('main', [
    'ui.router',
    'login',
    'dashboard',
    'ngStorage'
]).
config(['$urlRouterProvider', function($urlRouterProvider) {
    $urlRouterProvider.otherwise(function($injector) {
        $injector.get("$state").go('login');
        return true;
    });
}]);