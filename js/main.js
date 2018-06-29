'use strict';
console.log('built by Isaiah Harrison');

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'task', 'data', function($scope, $rootScope, $interval, $timeout, task, data){
  //data for the page
  $rootScope.data;
  //the current page
  $rootScope.currentPage = 'homePageLocation';
  //page scroll time
  $rootScope.pageScrollTime = 1000;
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
    const scrollPosition = $(`#costPage div[data="${index}"`).position().top - 100;
    $("body, html").animate({ scrollTop: scrollPosition }, 250);
    $(`.techCostPage i[data="${index}"]`).addClass('opacity1');
    $(`.pricingBox[data="${index}"] div.shortDescription`).addClass('hoverShortDescription');
    $(`.pricingBox[data="${index}"] div.longDescription`).addClass('hoverLongDescription');
    $(`.pricingBox[data="${index}"] i`).addClass('hoverIcon');
  }
  //tech page contact method reset
  $scope.hoverTechPageCostIconReset = () => {
    $('div').removeClass('hoverShortDescription').removeClass('hoverLongDescription');
    $('i').removeClass('hoverIcon').removeClass('opacity1');
  }
  //go up one page
  $scope.goUp = () => {
    task.goUp();
  }
  //go down one page
  $scope.goDown = () => {
    task.goDown();
  }
  //start the homepage animation
  task.startHomePageAnimation();
  //set the page content
  task.setPageContent();
  //set scroll speed of webpage
  task.setScrollSpeed();
  $timeout(() => {
    //check sticky navigation bar
    task.stickyNavigation();
  })
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
  //get posiions of nav elements on UI
  this.getNavPointPositions = () => {
    return {
      navPosition :         $('#navBar').position().top,
      homePageLocation :    $('#homePageLocation').position().top,
      servicePageLocation : $('#servicePageLocation').position().top,
      costPageLocation :    $('#costPageLocation').position().top,
      contactPageLocation : $('#contactPageLocation').position().top
    }
  }
  //forces the navigationto stick to the top when positioned after the second page
  this.stickyNavigation = () => {
    const position = this.getNavPointPositions();
    $(window).scroll(() => {
      const currentPosition = $('content').prevObject["0"].scrollingElement.scrollTop;
      if(currentPosition >= position.contactPageLocation){
        $('#navBar').css('position', 'fixed').css('background', 'rgba(8,9,10,0.8)');
        $rootScope.currentPage = 'contactPageLocation';
      } else if(currentPosition >= position.costPageLocation){
        $('#navBar').css('position', 'fixed').css('background', 'rgba(8,9,10,0.8)');
        $rootScope.currentPage = 'costPageLocation';
        $timeout(() => {
          this[data['navigation'][this.findIndexOfCurrentPage()]['animation']]();
        }, $rootScope.pageScrollTime - 5)
      } else if((currentPosition >= position.servicePageLocation) || (currentPosition >= position.navPosition)){
        $('#navBar').css('position', 'fixed').css('background', 'rgba(8,9,10,0.8)');
        $rootScope.currentPage = 'servicePageLocation';
      } else if(currentPosition >= position.homePageLocation){
        $('#navBar').css('position', 'relative').css('background', 'transparent');
        $rootScope.currentPage = 'homePageLocation';
      }
    })
  }
  //navigation click
  this.goTo = (pageLocation) => {
    const position = $(`#${pageLocation}`).position().top;
    $("body, html").animate({ scrollTop: position }, $rootScope.pageScrollTime);
  }
  //cost page tech bar animation
  this.techBarCostAnimation  = () => {
    const $icons = document.querySelectorAll('.techCost i');
    for(let i = 0; i < $icons.length; i++){
      const timeout = i * 50;
      $timeout(() => {
        $(`.techCost i[data="${i}"]`).css('transform', 'scale(1)');
      }, timeout);
    }
  }
  //find index of current page
  this.findIndexOfCurrentPage = () => {
    let currentPageIndex;
    data.navigation.map((data, index) => {
      if(data.pageLocation === $rootScope.currentPage){
        currentPageIndex = index;
      }
    })
    return currentPageIndex;
  }
  //go up one page
  this.goUp = () => {
    const indexToGoTo = this.findIndexOfCurrentPage() - 1;
    if(indexToGoTo >= 0){
      this.goTo(data['navigation'][indexToGoTo]['pageLocation']);
    }
  }
  //go down one page
  this.goDown = () => {
    const indexToGoTo = this.findIndexOfCurrentPage() + 1;
    if(indexToGoTo < data['navigation'].length){
      this.goTo(data['navigation'][indexToGoTo]['pageLocation']);
    }
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
            { service: 'Website Page',      icon: 'fas fa-book-open'    , cost: '$60', sub: 'each',   description: 'Each page (ex: home page, about page) will cost $60 each and includes a custom design. All content (ex: text, images, videos) you provide me with will be added.' },
            { service: 'Dashboard',         icon: 'fas fa-wrench'       , cost: '$20', sub: '/month', description: 'Edit content on your website from the dashboard. Which includes text, images, and products' },
            { service: 'Transaction Setup', icon: 'fas fa-credit-card'  , cost: '$80', sub: '',       description: 'Earn money. This service includes a shopping cart page so you can sell you products. Also, a third party payment service is linked directly to your bank card.' },
            { service: 'Athentication',     icon: 'fas fa-sign-in-alt'  , cost: '$50', sub: '',       description: 'Have a user sign in to your website optionally. This helps build a personal relationship with your customers and speeds the checkout process' },
            { service: 'Animations',        icon: 'fas fa-fighter-jet'  , cost: '$50', sub: '',       description: 'Includes custom animations to help your website stand out and build a smooth customer experience.' },
            { service: 'Email Form',        icon: 'fas fa-at'           , cost: '$50', sub: '',       description: 'Email your customers this week\'s promotions. This includes a reusable email template ready to send to all customers.' },
            { service: 'Text Form',         icon: 'fas fa-mobile'       , cost: '$50', sub: '',       description: 'Text your customers appointment reminders. Texting has become a primary source of communication.' },
            { service: 'Contact Form',      icon: 'fas fa-phone'        , cost: '$25', sub: '',       description: 'This form is a convenient way for customers to contact you.' },
            { service: 'Feedback Form',     icon: 'fas fa-pencil-alt'   , cost: '$25', sub: '',       description: 'This form is a convenient way for customers to leave feedback.' }
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
    { navBarName: 'HOME',     pageLocation: 'homePageLocation',    animation: '' },
    { navBarName: 'SERVICES', pageLocation: 'servicePageLocation', animation: '' },
    { navBarName: 'COST',     pageLocation: 'costPageLocation',    animation: 'techBarCostAnimation' },
    { navBarName: 'CONTACT',  pageLocation: 'contactPageLocation', animation: '' }
  ];
});
