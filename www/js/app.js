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
      controller: 'RdvCtrl'   
    })

    .state('secretaire', {
      url: "/secretaire",
      templateUrl: "templates/secretaire.html",
      //controller: 'CalendarCtrl'
    })

    .state('listUser', {
      url: "/list",
      templateUrl: "templates/listUser.html",
      controller: 'UserCtrl'
    })

// *********       menu secretaire      ****************
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/secretaire.html",
      //controller: 'AppCtrl'
    })

    .state('creatUser', {
      url: "/addUser",
      templateUrl: "templates/createUser.html",
      controller: 'UserCtrl'
    })

    .state('app.listUser', {
      url: "/listUser",
      views: {
        'menuContent' :{
          templateUrl: "templates/listUser.html"
        }
      }
    });
// *****************************************************
});


