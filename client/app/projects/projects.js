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


    $scope.load_projects();
    $scope.dashes = {
            "github":{"name":"github",file:"github_test.conf"},
            "bugzilla":{"name":"bugzilla",file:"bugzilla_test.conf"}
    }
}]);
