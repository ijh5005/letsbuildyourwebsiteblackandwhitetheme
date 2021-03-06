'use strict';
console.log('built by Isaiah Harrison');

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'task', 'data', function($scope, $rootScope, $interval, $timeout, task, data) {
  //data for the page
  $rootScope.data;
  //the current page
  $rootScope.currentPage = 'homePageLocation';
  //track the positions of the element on the page
  $rootScope.position;
  //home page tech data
  $rootScope.homeTechBarData = data.homeTechData;
  //page scroll time
  $rootScope.pageScrollTime = 1000;
  //is the samples page open
  $rootScope.samplesOpen = false;
  //used to reset the home page video box position
  $rootScope.resetHomeVideoScreenPosition;
  //year for the Copyright
  $rootScope.year = new Date;
  //prepare the url to be compatible with youtube
  $scope.fixUrl = (url) => {
    return url.replace('watch?v=', 'embed/') + '?rel=0&mute=1&controls=0';
  }
  //display the video for the sample works
  $scope.clickSampleBox = (index) => {
    task.clickSampleBox($scope, index);
  }
  //navigation options
  $rootScope.navigation = data.navigation;
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
  //tech page contact method
  $scope.hoverTechPageCostIcon = (index) => {
    const scrollPosition = $(`#costPage div[data="${index}"`).position().top - 60;
    $("body, html").animate({
      scrollTop: scrollPosition
    }, 250);
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
  //send text message
  $scope.sendText = () => {
    task.sendText();
  }
  //hide the video box
  $scope.hideSampleWork = () => {
    task.hideSampleWork();
  }
  //start the homepage animation
  task.startHomePageAnimation();
  //set the page content
  task.setPageContent();
  //request the application data
  $scope.requestData = () => {
    task.requestData();
  }
  //show sample work
  $scope.showSampleWork = (delayClick) => {
    if (delayClick) {
      $timeout(() => {
        $rootScope.samplesOpen = true;
        task.showSamples();
      })
    } else {
      $rootScope.samplesOpen = true;
      task.showSamples();
    }
  }
  //set scroll speed of webpage
  task.setScrollSpeed();
  $scope.startBounce = () => {
    const bounce = $interval(() => {
      if (!$rootScope.samplesOpen) {
        $('#homeTextPlayBtn').toggleClass('bounce');
        $('#homeTextPlayBtn').toggleClass('animated');
        $('#homeTextPlayBtnSmallScreen').toggleClass('bounce');
        $('#homeTextPlayBtnSmallScreen').toggleClass('animated');
      } else {
        $interval.cancel(bounce);
      }
    }, 1000)
  }
  //authentication
  $scope.auth = (auth) => {
    task.signUp();
  }
  $timeout(() => {
    //check sticky navigation bar
    task.stickyNavigation();
    //set the current page
    task.setCurrentPage(task.indentifyCurrentPage());
    //set current page animation
    task[data['navigation'][task.findIndexOfCurrentPage()]['animation']]();
    $scope.startBounce();
    $('#homeText > *').css('opacity', 0);
  })
  $timeout(() => {
    $('#homeText > *').css('transition', 'all 1s').css('opacity', 1);
  }, 4000);
}]);


app.service('task', function($rootScope, $interval, $timeout, $http, data) {
  //display the video for the sample works
  this.clickSampleBox = (scope, index) => {
    //request the youtube video
    // $('#homeVideoBox').attr('src', scope.fixUrl(data['homeTechData'][index]['video']));
    $('.videoDescriptionBar').removeClass('selectedVideo').removeClass('none');
    $('.videoSelection > iframe').addClass('none');
    $('.videoSelection').removeClass('selectedVideo');
    $(`.videoSelection[data="${index}"]`).addClass('selectedVideo');
    $('.videoSelection.selectedVideo > .videoDescriptionBar').addClass('selectedVideo');
    $('iframe.selectedVideo').attr('src', '');
    $timeout(() => {
      $(`.videoSelection.selectedVideo > iframe`).removeClass('none').addClass('selectedVideo');
      $('.videoSelection.selectedVideo > .videoDescriptionBar').addClass('none');
      $('iframe.selectedVideo').attr('src', scope.fixUrl(data['homeTechData'][index]['video']));
    }, 300);
  }
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
    $.fn.moveIt = function() {
      var $window = $(window);
      var instances = [];

      $(this).each(function() {
        instances.push(new moveItItem($(this)));
      });

      window.addEventListener('scroll', function() {
        var scrollTop = $window.scrollTop();
        instances.forEach(function(inst) {
          inst.update(scrollTop);
        });
      }, {
        passive: true
      });
    }

    var moveItItem = function(el) {
      this.el = $(el);
      this.speed = parseInt(this.el.attr('data-scroll-speed'));
    };

    moveItItem.prototype.update = function(scrollTop) {
      this.el.css('transform', 'translateY(' + -(scrollTop / this.speed) + 'px)');
    };

    // Initialization
    $(function() {
      $('[data-scroll-speed]').moveIt();
    });
  }
  //set posiions of nav elements on UI
  this.setNavPointPositions = () => {
    $rootScope.position = {
      navPosition: $('#navBar').position().top,
      homePageLocation: $('#homePageLocation').position().top,
      servicePageLocation: $('#servicePageLocation').position().top,
      costPageLocation: $('#costPageLocation').position().top,
      contactPageLocation: $('#contactPageLocation').position().top
    }
  }
  //position the navigation at the top of the UI
  this.showNavigationAtTop = () => {
    $('#navBar').css('position', 'fixed').css('background', 'rgba(8,9,10,0.8)');
  }
  //position the navigation at the bottom of the hompage
  this.showNavigationAtBottom = () => {
    $('#navBar').css('position', 'relative').css('background', 'transparent');
  }
  //set the current page
  this.setCurrentPage = (currentPage) => {
    $rootScope.currentPage = currentPage;
    this.addNavPageHighlight(currentPage);
  }
  //switch techbar animation
  this.techBarAnimationOnPage = (currentPage) => {
    this[data['navigation'][this.findIndexOfCurrentPage()]['animation']]();
    $timeout(() => {
      this[data['navigation'][this.findIndexOfCurrentPage()]['animation']]();
    }, $rootScope.pageScrollTime - 5);
  }
  //indentify which page we are on
  this.indentifyCurrentPage = () => {
    let currentPage;
    let yOffset = 10;
    const currentPosition = $('content').prevObject["0"].scrollingElement.scrollTop;
    if (currentPosition >= $rootScope.position.contactPageLocation - yOffset) {
      currentPage = 'contactPageLocation';
    } else if (currentPosition >= $rootScope.position.costPageLocation - yOffset) {
      currentPage = 'costPageLocation';
    } else if ((currentPosition >= $rootScope.position.servicePageLocation - yOffset) || (currentPosition >= $rootScope.position.navPosition)) {
      currentPage = 'servicePageLocation';
    } else if (currentPosition >= $rootScope.position.homePageLocation - yOffset) {
      currentPage = 'homePageLocation';
    }
    return currentPage;
  }
  //track the position of the scrolling and control actions related to
  this.stickyNavigation = () => {
    this.setNavPointPositions();
    $(window).resize(this.setNavPointPositions);
    $(window).scroll(() => {
      const currentPage = this.indentifyCurrentPage();
      (currentPage === 'homePageLocation') ? this.showNavigationAtBottom(): this.showNavigationAtTop();
      this.setCurrentPage(currentPage);
      this.techBarAnimationOnPage(currentPage);
      this.addNavPageHighlight(currentPage);
    })
  }
  //add a highlight to the navigation on page switch
  this.addNavPageHighlight = (currentPage) => {
    const index = $rootScope.navigation.findIndex(data => data['pageLocation'] === currentPage);
    $('.navBtn').removeClass('navBtnHover');
    $(`.navBtn[data=${index}]`).addClass('navBtnHover');
    $('.pageNumber').removeClass('whiteText');
    $(`.pageNumber[data=${index}]`).addClass('whiteText');
  }
  //navigation click
  this.goTo = (pageLocation) => {
    const position = $(`#${pageLocation}`).position().top;
    $("body, html").animate({
      scrollTop: position
    }, $rootScope.pageScrollTime);
  }

  //home page tech bar animation
  this.techBarHomeAnimation = () => {
    $('.techHomePage div').fadeIn('slow');
  }
  //home page tech bar animation
  this.techBarServiceAnimation = () => {
    $('#serviceText').fadeIn('slow');
  }
  //cost page tech bar animation
  this.techBarCostAnimation = () => {
    const $icons = document.querySelectorAll('.techCost i');
    for (let i = 0; i < $icons.length; i++) {
      const timeout = i * 50;
      $timeout(() => {
        $(`.techCost i[data="${i}"]`).css('transform', 'scale(1)');
      }, timeout);
    }
  }
  //home page tech bar animation
  this.techBarContactAnimation = () => {
    $('#costText').fadeIn('slow');
  }

  //find index of current page
  this.findIndexOfCurrentPage = () => {
    let currentPageIndex;
    data.navigation.map((data, index) => {
      if (data.pageLocation === $rootScope.currentPage) {
        currentPageIndex = index;
      }
    })
    return currentPageIndex;
  }
  //go up one page
  this.goUp = () => {
    const indexToGoTo = this.findIndexOfCurrentPage() - 1;
    if (indexToGoTo >= 0) {
      this.goTo(data['navigation'][indexToGoTo]['pageLocation']);
    }
  }
  //go down one page
  this.goDown = () => {
    const indexToGoTo = this.findIndexOfCurrentPage() + 1;
    if (indexToGoTo < data['navigation'].length) {
      this.goTo(data['navigation'][indexToGoTo]['pageLocation']);
    }
  }
  //send text message
  this.sendText = () => {
    const uri = window.location.href;
    const url = `${uri}sendText`;
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const message = document.getElementById('message').value;
    const textMessage = `Hi, my name is ${name}. You can reach me at ${contact}, Message: ${message}`;
    const data = {
      message: textMessage
    };
    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function successCallback(response) {
      document.getElementById('name').value = '';
      document.getElementById('contact').value = '';
      document.getElementById('message').value = 'Your message has been sent. Thank you';
      console.log('message sent');
    }, function errorCallback(err) {
      console.log(err);
    });
  }
  //hide the video box
  this.hideSampleWork = () => {
    $('#sampleWork').removeClass('showSamples');
  }
  //request the application data
  this.requestData = () => {
    const url = 'https://script.google.com/macros/s/AKfycbwL6rplZJgFMJ0uSIdIFeWh-ku9HwJUyQ2puvXjrAhod0zrGjMu/exec';
    const data = {
      cellPosition: 'A2',
      cellText: 'heyjhgfdhey'
    };

    $.ajax({
      url: url,
      method: 'POST',
      data: data,
      success: function(data) {
        console.log(data)
      }
    })
  }
  this.showSamples = () => {
    $('#sampleWork').toggleClass('showSamples');
  }
  this.signUp = () => {
    const uri = window.location.href;
    window.location = `${uri}signinpage`;
  }
});

app.service('data', function($rootScope, $interval, $timeout) {
  //set the page content
  this.pageContent = {
    page: {
      servicePage: [{
          heading: 'MULTI-DEVICE',
          body: 'You will have a website that looks amazing on any device whether it\'s by phone, tablet, desktop, or even television.'
        },
        {
          heading: 'INTEGRATION',
          body: 'Focus on what is most important for your customers. Choose the features that are most relevant for your current needs. We can always add more features later.'
        },
        {
          heading: 'INEXPENSIVE',
          body: 'Websites can cost thousands. No fear, I\'m here, with affordable prices. Check out the pricing table below for details.'
        }
      ],
      costPage: [{
        icons: [{
            service: 'Website Page',
            icon: 'fas fa-book-open',
            cost: '$60',
            sub: 'each',
            description: 'Each page (ex: home page, about page) will cost $60 each and includes a custom design. All content (ex: text, images, videos) you provide me with will be added.'
          },
          {
            service: 'Transaction Setup',
            icon: 'fas fa-credit-card',
            cost: '$600',
            sub: '',
            description: 'Earn money. This service includes a shopping cart page so you can sell you products. Also, a third party payment service is linked directly to your bank card.'
          },
          {
            service: 'Athentication',
            icon: 'fas fa-sign-in-alt',
            cost: '$50',
            sub: '',
            description: 'Have a user sign in to your website optionally. This helps build a personal relationship with your customers and speeds the checkout process'
          },
          {
            service: 'Animations',
            icon: 'fas fa-fighter-jet',
            cost: '$50',
            sub: '',
            description: 'Includes custom animations to help your website stand out and build a smooth customer experience.'
          },
          {
            service: 'Email Application',
            icon: 'fas fa-at',
            cost: '$50',
            sub: '',
            description: 'Email your customers this week\'s promotions. This includes a reusable email template ready to send to all customers.'
          },
          {
            service: 'Text Application',
            icon: 'fas fa-mobile',
            cost: '$50',
            sub: '',
            description: 'Text your customers appointment reminders. Texting has become a primary source of communication.'
          },
          {
            service: 'Contact Form',
            icon: 'fas fa-phone',
            cost: '$25',
            sub: '',
            description: 'This form is a convenient way for customers to contact you.'
          },
          {
            service: 'maintenance',
            icon: 'fas fa-wrench',
            cost: '$25',
            sub: '/hour',
            description: 'After your website is complete I can edit content after the free maintenance window closes.'
          }
        ]
      }]
    }
  };
  //navigation options
  this.navigation = [{
      navBarName: 'HOME',
      pageLocation: 'homePageLocation',
      animation: 'techBarHomeAnimation'
    },
    {
      navBarName: 'SERVICES',
      pageLocation: 'servicePageLocation',
      animation: 'techBarServiceAnimation'
    },
    {
      navBarName: 'COST',
      pageLocation: 'costPageLocation',
      animation: 'techBarCostAnimation'
    },
    {
      navBarName: 'CONTACT',
      pageLocation: 'contactPageLocation',
      animation: 'techBarContactAnimation'
    }
  ];
  //home tech bar info
  this.homeTechData = [{
      name: 'West Phillie Produce',
      img: 'background-image: url(./img/WPP.png)',
      video: 'https://www.youtube.com/embed/8eOD_x1Z59E'
    },
    {
      name: 'No Baggage Records',
      img: 'background-image: url(./img/NBR.png)',
      video: 'https://www.youtube.com/embed/YKzIogzt8-o'
    }
  ]
});