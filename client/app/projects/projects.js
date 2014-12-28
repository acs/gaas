'use strict';

angular.module('gaasClientApp.projects', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/projects', {
    templateUrl: 'projects/projects.html',
    controller: 'ProjectsCtl'
  });
}])

.controller('ProjectsCtl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

    var devel_url = "http://localhost:5000"

    $scope.load_projects = function(dash_name) {
        var url = devel_url + '/api/projects'+'/'+dash_name
        console.log(url);
        $http.get(url).success(function(data) {
            console.log(data);
            $scope.projects = data;
        });
    };

    $scope.create_project = function() {
        var name = $scope.dash_selected['project_new'];
        $scope.projects[name] = {"source":[],"trackers":[]};
    };

    $scope.add_repo = function() {
        var name = $scope.dash_selected['project_new'];
        var repo_url = $scope.dash_selected['source_url'];
        var project = $scope.projects[$scope.dash_selected['project']];
        var scm = '"https://github.com/' + repo_url + '"';
        var its = '"https://api.github.com/repos/' + repo_url + '/issues"';
        project.source.push(scm);
        project.trackers.push(its);
    };

    $scope.check_projects = function() {
        // Check in projects and repos are valid
        var url = devel_url + '/api/check_projects'
        console.log(url);

        var headers = {
                "Content-Type": 'application/json'
        };

        $scope.checking = true;
        $http({method:'POST',url:url, data:$scope.projects, headers: headers})
        .success(function(data, status, headers, config) {
            console.log(data);
            $scope.message = data;
            $scope.checking = false;
        })
        .error(function(data,status,headers,config){
            console.log("Error in projects urls " + data);
            $scope.error = data;
            $scope.checking = false;
        });
    }

    $scope.create_projects_file = function() {
        // Create the dash config file
        // Check in projects and repos are valid
        var url = devel_url + '/api/create_projects_file'
        console.log(url);

        var headers = {
                "Content-Type": 'application/json'
        };

        $scope.checking = true;
        $http({method:'POST',url:url, data:$scope.projects, headers: headers})
        .success(function(data, status, headers, config) {
            console.log(data);
            $scope.message = data;
            $scope.checking = false;
        })
        .error(function(data,status,headers,config){
            console.log("Error creating dash config " + data);
            $scope.error = data;
            $scope.checking = false;
        });

    }

    $scope.select_dash = function() {
        // Select a dash loading all its projects
        $scope.load_projects($scope.dash_selected.name);
    }

    $scope.create_dash = function() {
        // Create a dash. How the progress will be communicate? WebSockets?
    }

    $scope.load_dashes = function() {
        var url = devel_url + '/api/dashboards'
        console.log(url);
        $http.get(url).success(function(data) {
            $scope.dashes = data;
        });
    }

    $scope.load_dashes();
    $scope.dash_selected = {name:""};
}]);
