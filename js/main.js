'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'task', function($scope, $rootScope, $interval, $timeout, task){

  task.startHomePageAnimation();
}]);


app.service('task', function($rootScope, $interval, $timeout){
  //start the homepage animation
  this.startHomePageAnimation = () => {
    $timeout(() => {
      $('.firstLift').addClass('screenLift1');
    }, 500).then(() => {
      $timeout(() => {
        $('.secondLift').addClass('screenLift2');
      }, 1000).then(() => {
        $timeout(() => {
          $('#screen').addClass('rotateFront');
        }, 1000).then(() => {
          $timeout(() => {
            $('.firstLift').removeClass('screenLift1');
            $('.secondLift').removeClass('screenLift2');
          }, 1400).then(() => {
            $timeout(() => {
              $('#screen').addClass('backgroundColorFadeIn');
              $('.bottomSection').addClass('shadow');
            }, 500)
          })
        })
      });
    });

    $interval(() => {
      const numbers = [0, 1, 2, 3, 4, 5, 6, 7];
      const random1 = Math.floor(Math.random() * numbers.length);
      numbers.splice(numbers.indexOf(random1), 1);
      const random2 = numbers[Math.floor(Math.random() * numbers.length)];
      $('#screenInsideTopBottom > * > span').removeClass('lighter');
      $(`#screenInsideTopBottom > * > span[data="${random1}"]`).addClass('lighter');
      $(`#screenInsideTopBottom > * > span[data="${random2}"]`).addClass('lighter');
    }, 2000)
  };
});
