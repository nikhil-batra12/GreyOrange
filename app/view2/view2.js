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
		searchService.getSearchResults($scope.searchText).then(function(response){
			console.log(response.data.results)
			$scope.planets = response.data.results;
		},function(error){
			console.log(error);
		});
	}
}])

.directive('searchItems', function () {
	return{
		link: function(scope, element, attrs) {
        	scope.$watch('searchText', function(text){
		        if (!text || text.length == 0)
		        return 0;
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

	return factory;
}]);
