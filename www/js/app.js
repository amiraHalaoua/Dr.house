angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/login");
      
  $stateProvider
     
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'AccountCtrl'
    })
     
    .state('rdvPatient', {
      url: "/rdvPatient",
      templateUrl: "templates/rdvPatient.html",
      controller: 'rdvCtrl'   
    })

 
// *********       menu secretaire      ****************


  

//************ tabs ***********************

    .state('logout', {
      url: '/logout',
      views: {
        'logout': {
          templateUrl: 'templates/login.html'
        }
      }
    })

    .state('tab.siteweb', {
      url: '/siteWeb',
      views: {
        'tab-siteWeb': {
          templateUrl: 'templates/tab-siteWeb.html'
        }
      }
    })
//*****************************************
     /*  .state('snd', {
                url : '/snd',
                templateUrl : 'snd-abstract.html',
                abstract : true,
                controller : 'SndController'
            })
            .state('snd.home', {
                url: '/home',
                views: {
                    'snd': {
                        templateUrl: 'snd-home.html',
                        controller : 'SndHomePageController'
                    }
                }
            })
            .state('snd.drink', {
                url: '/drink',
                views: {
                    'snd': {
                        templateUrl: 'snd-drink.html',
                        controller : 'SndDrinkPageController'
                    }
                }
            })
*/
.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',

  })

  .state('app.agenda', {
    url: '/agenda',
    views: {
      'menuContent': {
        templateUrl: 'templates/agenda.html',
        controller: 'rdvCtrl'
      }
    }
  })

  .state('app.list-patient', {
      url: '/list-patient',
      views: {
        'menuContent': {
          templateUrl: 'templates/list-user.html',
          controller: 'UserCtrl'
        }
      }
    })

  .state('app.createuser', {
      url: '/createuser',
      views: {
        'menuContent': {
          templateUrl: 'templates/create-user.html',
          controller: 'UserCtrl'
        }
      }
    })
});


