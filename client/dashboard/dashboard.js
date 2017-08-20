'use strict';

var dashboardModule = angular.module('dashboard', ['ui.router'])

dashboardModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'dashboardCtrl',
            url: '/dashboard'
        });
}])


dashboardModule.controller('dashboardCtrl', ['$scope', '$localStorage', '$state', 'searchService', function($scope, $localStorage, $state, searchService) {
    if ($localStorage.starwarsuser) {
        $scope.$parent.user = $localStorage.starwarsuser;
    }
    $scope.searchResults = function() {
        $scope.callLimitExceed = false;
        $scope.searched = false;
        searchService.getSearchResults($scope.searchText, $scope.user.name).then(function(response) {
            searchService.setResolvedState = false;
            if ($scope.searchText) {
                $scope.resultCount = response.data.count;
                $scope.planets = response.data.results;
                $scope.nextItem = response.data.next;
                $scope.searched = true;
            } else {
                $scope.planets = [];
            }
        }, function(error) {
            if (error.status == 429) {
                $scope.callLimitExceed = true;
            }
            console.log(error);
        });
    }

    $scope.getMorResults = function() {
        searchService.getMoreResults($scope.nextItem).then(function(response) {
            $scope.planets = $scope.planets.concat(response.data.results);
            $scope.nextItem = response.data.next;
        }, function(error) {
            console.log(error);
        });
    }

    $scope.logout = function() {
        delete $localStorage.starwarsuser;
        $state.go('login');
    }

}])

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

dashboardModule.factory('searchService', ['$http', '$q', function($http, $q) {
    var factory = {};
    var canceler = $q.defer();
    var resolved = false;

    var cancel = function() {
        canceler.resolve("http call aborted");
    };

    factory.setResolvedState = function(state) {
        resolved = state;
    }

    factory.getSearchResults = function(text, username) {
        if (resolved) {
            cancel();
        }

        canceler = $q.defer();
        resolved = true;
        var isJedi = false;
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

    factory.getMoreResults = function(searchUrl) {
        var url = "/api/planets/getMoreResults/" + encodeURIComponent(searchUrl);
        return $http.get(url);
    }
    return factory;
}])

dashboardModule.filter('customSorter', function() {

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
            return (CustomOrder(a[field]) > CustomOrder(b[field]) ? -1 : 1);
        });
        return filtered;
    };
});