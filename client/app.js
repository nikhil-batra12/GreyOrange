'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'myApp.login',
  'myApp.dashboard'
]).
config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider.otherwise(function($injector){
        $injector.get("$state").go('login');  
        return true;
    });
}]);
