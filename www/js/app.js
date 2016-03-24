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

 
// *********       menu    ****************


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

  .state('app.add-user', {
      url: '/add-user',
      views: {
        'menuContent': {
          templateUrl: 'templates/create-user.html',
          controller: 'UserCtrl'
        }
      }
    })

//************ tabs ***********************

    .state('logout', {
      url: '/logout',
      views: {
        'logout': {
          templateUrl: 'templates/login.html',
          controller: 'AccountCtrl'
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

});


