'use strict';

angular.module('pesto.basil', ['ngRoute', 'pesto.settings', 'pesto.tabs'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/basil/:id', {
    templateUrl: 'basil/main.html',
    controller: 'MainCtrl'
  })
  .when('/basil/:id/:tab', {
    templateUrl: 'basil/main.html',
    controller: 'MainCtrl'
  })
  .when('/new', {
    templateUrl: 'basil/new.html',
    controller: 'NewCtrl'
  })
  ;
}])

.controller('MainCtrl', ['$log', '$routeParams', '$scope', 'server', 
                         function($log, $routeParams, $scope, server) {
    if(!$routeParams.tab){
	$scope.tab = 'spec';
	$scope.edit = false;
    }else{
	var a = $routeParams.tab.split(':');
	$scope.tab = a[0];
	$scope.edit = a[1] == 'edit' ? $scope.tab : false;
	$log.info('a:', a)
    }
    
    $scope.title = $routeParams.id;
    $scope.tabs = [{
	id: 'spec',
        title: 'Specification',
        url: "basil/spec.html"
    }, {
	id: 'docs',
        title: 'Description',
        url: "basil/docs.html"
    }, {
	id: 'views',
        title: 'View scripts',
        url: "basil/views.html"
    }];
    //set current tab
    $scope.tabs.forEach(function(i){
	if(i.id == $scope.tab){
	    $scope.currentTab = i.url;
	}
    });
	//$scope.currentTab = 'basil/spec.html';
	$scope.onClickTab = function (tab) {
	    $scope.currentTab = tab.url;
	};
	$scope.isActiveTab = function(tabUrl) {
	    return tabUrl == $scope.currentTab;
	};
	
}])
.controller('SpecCtrl', ['$log','$http', '$routeParams', '$scope', 'server', '$timeout', '$location',
                         function($log, $http, $routeParams, $scope, server, $timeout, $location) {
    $scope.editable = ($scope.edit == 'spec');
    
    $scope.save = function(){
	$log.info('endpoint', $scope.spec.endpoint);
	$log.info('query', $scope.spec.query);
	$http({
	    method  : 'PUT',
	    url     : server.location + '/' + $scope.spec.id + '/spec',
	    data    : $scope.spec.query,  // pass in data as strings
	    headers : { 'X-Basil-Endpoint': $scope.spec.endpoint }  // set the headers so angular passing info as form data (not request payload)
	   })
	   .success(function(data, status, headers, config) {
	       $location.path('/basil/' + $scope.spec.id + '/spec');
           })
           .error(function(data, status, headers, config) {
               $scope.messages = [{'type':'alert-danger', 'message':headers('X-Basil-Error')}];
	   });
    }
    
    $http.get(server.location + '/' + $routeParams.id + '/spec').success(function(o, status, headers, config){
	var spec = {};
	spec.query = o;
	spec.id = $routeParams.id;
	spec.endpoint = headers('X-Basil-Endpoint');
	$scope.spec = spec;
    });
}])

.controller('NewCtrl', ['$log','$http', '$scope', function($log, $http, $scope){
    // Show the new Api form
}])
;