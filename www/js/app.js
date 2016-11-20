angular.module('SpiceShack', ['ionic', 'ngCordova', 'firebase', 'SpiceShack.controllers', 'SpiceShack.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {

      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $timeout(function() {
      $cordovaSplashscreen.hide();
    }, 2000);

  });

  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Loading...'
    });
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  });

  $rootScope.$on('$stateChangeStart', function() {
    $rootScope.$broadcast('loading:show');
  });

  $rootScope.$on('$stateChangeSuccess', function() {
    $rootScope.$broadcast('loading:hide');
  });

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  // Sidebar state definition
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  // Home state - set view/controller and resolve promotional variables for display on home page
  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/home.html',
        controller: 'IndexController',
        resolve: {
          promoDish: [ '$stateParams', 'menuFactory', function($stateParams, menuFactory) {
            return menuFactory.get({id:0});
          }],
          promo: [ '$stateParams', 'promotionFactory', function($stateParams, promotionFactory) {
            return promotionFactory.get({id:0});
          }],
          promoLeader: [ '$stateParams', 'corporateFactory', function($stateParams, corporateFactory) {
            return corporateFactory.getLeaders().get({id:3})
          }]
        }
      }
    }
  })

  // About Us state - set view/controller and resolve corporate leaders from Firebase via corporateFactory
  .state('app.aboutus', {
    url: '/aboutus',
    views: {
      'mainContent': {
        templateUrl: 'templates/aboutus.html',
        controller: 'AboutController',
        resolve: {
          leaders: ['corporateFactory', function(corporateFactory) {
            return corporateFactory.getLeaders().query();
          }]
        }
      }
    }
  })

    // Menu state - set view/controller and resolve menu from Firebase via menuFactory
  .state('app.menu', {
    url: '/menu',
    views: {
      'mainContent': {
        templateUrl: 'templates/menu.html',
        controller: 'MenuController',
        resolve: {
          dishes: ['menuFactory', function(menuFactory){
            return menuFactory.query();
          }]
        }
      }
    }
  })

  // Dish details state - resolve dish information from menuFactory and update controller
  .state('app.dishdetails', {
    url: '/menu/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/dishdetail.html',
        controller: 'DishDetailController',
        resolve: {
          dish: ['$stateParams', 'menuFactory', function($stateParams, menuFactory) {
            return menuFactory.get({id:parseInt($stateParams.id, 10)});
          }]
        }
      }
    }
  })

  // Contact state - no controller - display contact page
  .state('app.contactus', {
    url: '/contactus',
    views: {
      'mainContent': {
        templateUrl: 'templates/contactus.html'
      }
    }
  })

  // Favorites state - return all dishes from menu and use FavoritesController to filter
  .state('app.favorites', {
    url: '/favorites',
    views: {
      'mainContent': {
        templateUrl: 'templates/favorites.html',
        controller:  'FavoritesController',
        resolve: {
          dishes: ['menuFactory', function(menuFactory){
            return menuFactory.query();
          }]
        }
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
