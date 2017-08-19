'use strict';

angular.module('myApp.view2', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
        .state('view2', {
		    templateUrl: 'view2/view2.html',
		    controller: 'View2Ctrl',
		    url: '/view2'
		  });
}])


.controller('View2Ctrl', ['$scope', 'searchService', function($scope, searchService) {
	$scope.searchResults = function(){
		$scope.searched = false;
		searchService.getSearchResults($scope.searchText).then(function(response){
			console.log(response.data.results)
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
		        
		        // if searchStr is still the same..
		        // go ahead and retrieve the data
		        if (text === scope.searchText)
		        {
		        	scope.searchResults();
		        }

			});

	    }
	}
	 	
})

.factory('searchService', ['$http', function($http) {
	var factory = {};

	factory.getSearchResults = function(text) {
		var url = "https://swapi.co/api/planets/?search=";
		return $http.get(url + text);
	}

	factory.getMoreResults = function(url){
		return $http.get(url);
	}
	return factory;
}])

.factory('throttleService', ['$http', function($http) {
	var factory = {};

	factory.getSearchResults = function(text) {
		var url = "https://swapi.co/api/planets/?search=";
		return $http.get(url + text);
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
