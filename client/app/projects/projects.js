'use strict';

angular.module('gaasClientApp.projects', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/projects', {
    templateUrl: 'projects/projects.html',
    controller: 'ProjectsCtl'
  });
}])

.controller('ProjectsCtl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.load_projects = function(org_name) {
        var devel_url = "http://localhost:5000"
        console.log(devel_url + '/api/projects');
        $http.get(devel_url + '/api/projects').success(function(data) {
            console.log(data);
            // SCM should be converted from "," separates list to an array
            $scope.projects = data;
        });
    };

    $scope.load_projects();
}]);
