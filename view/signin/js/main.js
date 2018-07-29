'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'task', function($scope, $rootScope, $interval, $timeout, task){

  $rootScope.errorText;

  $scope.submit = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const hasInputs = (username.replace(/\s/g,'') !== '' && password.replace(/\s/g,'') !== '');
    task.submit(hasInputs, { username, password });
  }

  $scope.backToHome = () => {
    window.history.back();
  }

}]);


app.service('task', function($rootScope, $interval, $timeout, data){

  this.submit = (hasInputs, auth) => {
    if(!hasInputs) {
      $rootScope.errorText = data.emptyFields;
      return null;
    }
    $rootScope.errorText = data.loading;

    const url = 'http://localhost:3000/signin/'

    $.ajax({
      url: url,
      method: 'POST',
      data: auth,
      success: function (data) {
        console.log(data)
      }
    })
  }

});

app.service('data', function($rootScope, $interval, $timeout){

  this.emptyFields = 'Please fill out all fields'
  this.loading = 'loading...'

});
