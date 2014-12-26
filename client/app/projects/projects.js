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
        var devel_url = "http://localhost:5000"
        var url = devel_url + '/api/check_projects'
        console.log(url);

        var headers = {
                "Content-Type": 'application/json'
        };

        $scope.checking = true;
        $http({method:'POST',url:url, data:$scope.projects, headers: headers})
        .success(function(data, status, headers, config) {
            console.log(data);
            $scope.checking = false;
        })
        .error(function(data,status,headers,config){
            console.log("Error in projects urls " + data);
            $scope.error = data;
            $scope.checking = false;
        });

    }

    $scope.save_projects = function() {
        // Send using POST all projects and repos to the server
        // The server will check all new URLs and return the result of the operation
    }

    $scope.create_dash = function() {
        // Create a dash. How the progress will be communicate? WebSockets?
    }


    $scope.load_projects();
    $scope.dashes = {
            "github":{"name":"github",file:"github_test.conf"},
            "bugzilla":{"name":"bugzilla",file:"bugzilla_test.conf"}
    }
}]);
