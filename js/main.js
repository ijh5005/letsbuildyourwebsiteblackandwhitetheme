'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'task', 'data', function($scope, $rootScope, $interval, $timeout, task, data){
  //data for the page
  $rootScope.data;
  //techbar animation tracker
  $rootScope.techBarAnimationDoneFor = {
    cost: false
  }
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
  //hide cost page until icons load
  $scope.showCostPage = true;
  //tech page contact method
  $scope.hoverTechPageCostIcon = (index) => {
    if(index === 'reset'){
      $('div').removeClass('hoverShortDescription').removeClass('hoverLongDescription');
      $('i').removeClass('hoverIcon').removeClass('opacity1');
    }
    $(`.techCostPage i[data="${index}"]`).addClass('opacity1');
    $(`.pricingBox[data="${index}"] div.shortDescription`).addClass('hoverShortDescription');
    $(`.pricingBox[data="${index}"] div.longDescription`).addClass('hoverLongDescription');
    $(`.pricingBox[data="${index}"] i`).addClass('hoverIcon');
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
        this.techBarCostAnimation();
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
  //cost page tech bar animation
  this.techBarCostAnimation  = () => {
    if(!$rootScope.techBarAnimationDoneFor['cost']){
      const $icons = document.querySelectorAll('.techCost i');
      for(let i = 0; i < $icons.length; i++){
        const timeout = i * 100;
        $timeout(() => {
          $(`.techCost i[data="${i}"]`).css('transform', 'scale(1)');
        }, timeout);
      }
    }
    $rootScope.techBarAnimationDoneFor = true;
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
      ],
      costPage: [
        {
          icons: [
            { service: 'webpage',      icon: 'fas fa-file'         , cost: '$50', sub: 'each',   description: 'Includes a custom design. All content (ex: text, images, videos) you provide me with will be added.' },
            { service: 'dashboard',    icon: 'fas fa-columns'      , cost: '$10', sub: '/month', description: 'Edit content on your website, edit existing product information, and add additional products at the click of a button.' },
            { service: 'shoppingCart', icon: 'fas fa-shopping-cart', cost: '$80', sub: '',       description: 'Includes shopping cart, payment pages, and a third party payment service that is linked directly to your bank card.' },
            { service: 'layout',       icon: 'fas fa-map'          , cost: '$25', sub: 'each',   description: 'Your website layout will fit devices of your choice including cell phones, tablets, desktops, and televisions.' },
            { service: 'signIn',       icon: 'fas fa-sign-in-alt'  , cost: '$50', sub: '',       description: 'Includes a sign in/sign up forms page linked to a database that stores usernames and passwords.' },
            { service: 'email',        icon: 'fas fa-envelope-open', cost: '$50', sub: '',       description: 'An application to email customers (ex. promotional sales). This computer and mobile app not to be displayed on your website.' },
            { service: 'text',         icon: 'fas fa-mobile'       , cost: '$50', sub: '',       description: 'An application to text customers (ex. appointment reminders). This computer and mobile app not to be displayed on your website.' },
            { service: 'animation',    icon: 'fas fa-fighter-jet'  , cost: '$50', sub: '',       description: 'Custom animations to help your website stand out and build a smooth customer experience.' },
            { service: 'contact',      icon: 'fas fa-phone'        , cost: '$25', sub: '',       description: 'This form is a convenient way for customers to contact you.' },
            { service: 'feedback',     icon: 'fas fa-pencil-alt'   , cost: '$25', sub: '',       description: 'This form is a convenient way for customers to leave feedback.' }
          ]
        }
      ],
      maintenance: [
        {
          heading: 'DASHBOARD',
          body: '- $20/month - Change your website content at the click of a button with the dashboard.'
        },
        {
          heading: 'HIRE ME!',
          body: '- $25/hour - Don\'t have the time to maintain your website? I can do it for you.'
        },
      ]
    },

  };
  //navigation options
  this.navigation = [
    { navBarName: 'HOME', pageLocation: 'homePageLocation' },
    { navBarName: 'SERVICES', pageLocation: 'servicePageLocation' },
    { navBarName: 'COST', pageLocation: 'costPageLocation' },
    { navBarName: 'CONTACT', pageLocation: 'contactPageLocation' }
  ];
});
