'use strict';
/* This file is the main dashboard where user is redirected after login */

//Declare dashboard module
var dashboardModule = angular.module('dashboard', ['ui.router'])

//Set dashboard route
dashboardModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'dashboardCtrl',
            url: '/dashboard'
        });
}])

// Dashboard controller where bussiness logic is written
dashboardModule.controller('dashboardCtrl', ['$scope', '$localStorage', '$state', 'searchService', function($scope, $localStorage, $state, searchService) {
    /*Check on start/reload whether there is already loged in user in localstorage
     * If user info is present, then set it in  its scope. Else redirect to login page
     */
    if ($localStorage.starwarsuser) {
        $scope.user = $localStorage.starwarsuser;
    } else{
        $state.go('login');
    }

    /* This function is called when the value of searchtext changes
     */
    $scope.searchResults = function() {
        //Whether 15 or more calls send by user excpt Luke Skywalker
        $scope.callLimitExceed = false;
        //Whether search is completed or not
        $scope.searched = false;
        //Call service to get search results for text and user
        searchService.getSearchResults($scope.searchText, $scope.user.name).then(function(response) {
            // Set to false when call completes. This param is used to cancel prev call if new call is sent.
            searchService.setResolvedState = false;
            if ($scope.searchText) {
                //Set search results in scope
                $scope.resultCount = response.data.count;
                $scope.planets = response.data.results;
                $scope.nextItem = response.data.next;
                $scope.searched = true;
            } else {
                $scope.planets = [];
            }
        }, function(error) {
            //If error is becoz of >15 calls per minute, display error message on screen
            if (error.status == 429) {
                $scope.callLimitExceed = true;
            }
            console.log(error);
        });
    }

    /* Swapi by default returns 10 search results. If we need more results,
     * we call this function.
     */
    $scope.getMorResults = function() {
        //Calls next result set. It uses url of next page results
        searchService.getMoreResults($scope.nextItem).then(function(response) {
            $scope.planets = $scope.planets.concat(response.data.results);
            $scope.nextItem = response.data.next;
        }, function(error) {
            console.log(error);
        });
    }
    /* To log out the user and clear its information stored in localstorage.
     */
    $scope.logout = function() {
        delete $localStorage.starwarsuser;
        $state.go('login');
    }

}])


 // This directive watches over the value of search input box, when debounce time lapses
// It calls the controller's search method which brings search results using a seervice.
dashboardModule.directive('searchItems', function() {
    return {
        link: function(scope, element, attrs) {
            scope.$watch('searchText', function(text) {
                if (!text || text.length == 0) {
                    scope.planets = [];
                    return 0;
                }
                if (text === scope.searchText) {
                    scope.searchResults();
                }
            });
        }
    }

})

//Main service to get search results
dashboardModule.factory('searchService', ['$http', '$q', function($http, $q) {
    var factory = {};
    var canceler = $q.defer();
    var resolved = false;

    /* Cancel promise of previous http request sent, since a new one is sent.
     */
    function cancel() {
        canceler.resolve("http call aborted");
    };
    /* Used by controller to set promise state after it is successfully resolved and data is receieved.
     */
    factory.setResolvedState = function(state) {
        resolved = state;
    }

    /* This is the function that sends the call to get search results to backend
     */
    factory.getSearchResults = function(text, username) {
        //Cancel promise if new request comes
        if (resolved) {
            cancel();
        }

        canceler = $q.defer();
        resolved = true;
        var isJedi = false;
        
        /* Set variable to true for Luke so that he can search text >15 times in a minute
         */
        if (username === "Luke Skywalker") {
            isJedi = true;
        }
        var url = "/api/planets/" + encodeURIComponent(text) + '/' + encodeURIComponent(username) + '/' + isJedi;
        return $http({
            method: "GET",
            url: url,
            timeout: canceler.promise
        });
    }

    // Get more search results for search text
    factory.getMoreResults = function(searchUrl) {
        var url = "/api/planets/getMoreResults/" + encodeURIComponent(searchUrl);
        return $http.get(url);
    }
    return factory;
}])

// This filter is used for ordering of planets in descending order of population
dashboardModule.filter('customSorter', function() {

    /* Special case handling since some planets has population "unknown"
     */
    function CustomOrder(item) {
        if (isNaN(parseInt(item))) {
            return 0;
        } else {
            return parseInt(item);
        }
    }

    return function(items, field) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function(a, b) {
            //Custom comparator
            return (CustomOrder(a[field]) > CustomOrder(b[field]) ? -1 : 1);
        });
        return filtered;
    };
});