'use strict';

angular.module('myApp.dashboard', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
        .state('dashboard', {
		    templateUrl: 'dashboard/dashboard.html',
		    controller: 'dashboardCtrl',
		    url: '/dashboard'
		  });
}])


.controller('dashboardCtrl', ['$scope', 'searchService', function($scope, searchService) {
	$scope.searchResults = function(){
		$scope.searched = false;
		searchService.getSearchResults($scope.searchText).then(function(response){
			$scope.resultCount = response.data.count;
			$scope.planets = response.data.results;
			$scope.nextItem = response.data.next;
			$scope.searched = true;
		},function(error){
			console.log(error);
		});
	}

	$scope.getMorResults = function(){
		searchService.getMoreResults($scope.nextItem).then(function(response){
			$scope.planets = $scope.planets.concat(response.data.results);
			$scope.nextItem = response.data.next;
		},function(error){
			console.log(error);
		});
	}

}])

.directive('searchItems', function () {
	return{
		link: function(scope, element, attrs) {
        	scope.$watch('searchText', function(text){
		        if (!text || text.length == 0){
		        	scope.planets = [];
		        	return 0;
		        }
		        if (text === scope.searchText){
		        	scope.searchResults();
		        }
			});
	    }
	}
	 	
})

.factory('searchService', ['$http', function($http) {
	var factory = {};

	factory.getSearchResults = function(text) {
		var url = "/api/planets/" + encodeURIComponent(text);
		return $http.get(url);
	}

	factory.getMoreResults = function(searchUrl){
		var url = "/api/planets/getMoreResults/" + encodeURIComponent(searchUrl);
		return $http.get(url);
	}
	return factory;
}])

.filter('customSorter', function() {

  function CustomOrder(item) {
    if(isNaN(parseInt(item))){
    	return 0;
    } else{
    	return parseInt(item);
    }
  }

  return function(items, field) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {    
      return (CustomOrder(a[field]) > CustomOrder(b[field]) ? -1 : 1);
    });
    console.log(filtered)
    return filtered;
  };
});
