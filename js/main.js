'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'task', 'data', function($scope, $rootScope, $interval, $timeout, task, data){
  //data for the page
  $rootScope.data;
  //navigation options
  $scope.navigation = data.navigation;
  //navigation number label
  $scope.navigationNumberLable = (index) => {
    return `/0${parseInt(index) + 1}`;
  }
  //navigation click
  $scope.goTo = (pageLocation) => {
    task.goTo(pageLocation);
  }
  //cost page icon classes
  $scope.iconClass = (iconObj) => {
    return iconObj['icon'];
  }
  //start the homepage animation
  task.startHomePageAnimation();
  //set the page content
  task.setPageContent();
  //set scroll speed of webpage
  task.setScrollSpeed();
  //check sticky navigation bar
  task.stickyNavigation();
}]);


app.service('task', function($rootScope, $interval, $timeout, data){
  //set the page content
  this.setPageContent = () => {
    $rootScope.data = data.pageContent;
  }
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
  //set different scroll speeds
  this.setScrollSpeed = () => {
    $.fn.moveIt = function(){
      var $window = $(window);
      var instances = [];

      $(this).each(function(){
        instances.push(new moveItItem($(this)));
      });

      window.addEventListener('scroll', function(){
        var scrollTop = $window.scrollTop();
        instances.forEach(function(inst){
          inst.update(scrollTop);
        });
      }, {passive: true});
    }

    var moveItItem = function(el){
      this.el = $(el);
      this.speed = parseInt(this.el.attr('data-scroll-speed'));
    };

    moveItItem.prototype.update = function(scrollTop){
      this.el.css('transform', 'translateY(' + -(scrollTop / this.speed) + 'px)');
    };

    // Initialization
    $(function(){
      $('[data-scroll-speed]').moveIt();
    });
  }
  //forces the navigationto stick to the top when positioned after the second page
  this.stickyNavigation = () => {
    const navPosition = $('#navBar').position().top;
    const homePageLocation = $('#homePageLocation').position().top;
    const servicePageLocation = $('#servicePageLocation').position().top;
    const costPageLocation = $('#costPageLocation').position().top;
    const contactPageLocation = $('#contactPageLocation').position().top;
    $(window).scroll(() => {
      const currentPosition = $('content').prevObject["0"].scrollingElement.scrollTop;

      if(currentPosition >= contactPageLocation){
        $('#navBar').css('position', 'fixed').css('background', 'rgba(8,9,10,0.8)');
      } else if(currentPosition >= costPageLocation){
        $('#navBar').css('position', 'fixed').css('background', 'rgba(8,9,10,0.8)');
      } else if((currentPosition >= servicePageLocation) || (currentPosition >= navPosition)){
        $('#navBar').css('position', 'fixed').css('background', 'rgba(8,9,10,0.8)');
      } else if(currentPosition >= homePageLocation){
        $('#navBar').css('position', 'relative').css('background', 'transparent');
      }
    })
  }
  //navigation click
  this.goTo = (pageLocation) => {
    const position = $(`#${pageLocation}`).position().top;
    // const position = this.find
    $("body, html").animate({ scrollTop: position }, 1000);
  }
});

app.service('data', function($rootScope, $interval, $timeout){
  //set the page content
  this.pageContent = {
    page: {
      servicePage: [
        {
          heading: 'MULTI-DEVICE',
          body: 'The solution is to have a great looking site for any device type. With my services, your site will look amazing on all devices.'
        },
        {
          heading: 'INTEGRATION',
          body: 'We can always add more features later. No pressure to get it all at once. For now, focus on what is most important for your customers.'
        },
        {
          heading: 'INEXPENSIVE',
          body: 'Websites can cost thousands. No fear, I\'m here, with affordable prices. Check out the pricing table below for details.'
        }
      ]
    },
    icons: [
      { name: 'webpage',      icon: 'fas fa-file'           },
      { name: 'dashboard',    icon: 'fas fa-columns'        },
      { name: 'shoppingCart', icon: 'fas fa-shopping-cart'  },
      { name: 'layout',       icon: 'fas fa-map'            },
      { name: 'signIn',       icon: 'fas fa-sign-in-alt'    },
      { name: 'email',        icon: 'fas fa-envelope-open'  },
      { name: 'text',         icon: 'fas fa-mobile'         },
      { name: 'animation',    icon: 'fas fa-fighter-jet'    },
      { name: 'contact',      icon: 'fas fa-phone'          },
      { name: 'feedback',     icon: 'fas fa-pencil-alt'     }
    ]
  };
  //navigation options
  this.navigation = [
    { navBarName: 'HOME', pageLocation: 'homePageLocation' },
    { navBarName: 'SERVICES', pageLocation: 'servicePageLocation' },
    { navBarName: 'COST', pageLocation: 'costPageLocation' },
    { navBarName: 'CONTACT', pageLocation: 'contactPageLocation' }
  ];
});
