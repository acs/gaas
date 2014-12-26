'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('gaasClientApp', [
  'ngRoute',
  'ui.bootstrap',
  'gaasClientApp.projects'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/projects'});
}]);

app.run(function($rootScope, $location, $http) {
});