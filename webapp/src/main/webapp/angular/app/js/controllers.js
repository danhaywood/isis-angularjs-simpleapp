'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])

  .controller('IsisCtrl', ['$scope', '$http', function($scope, $http) {

    function ISISwww($scope, $http) {

      $http({

        method: "GET",

        url: 'http://halyogatp:8080/restful/services/'

      }).

      success(function (isisdata) {

          $scope.isisdata = isisdata;

        });

    };

    ISISwww($scope, $http);

  }])
;


