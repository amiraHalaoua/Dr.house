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

    .state('creatUser', {
      url: "/user",
      templateUrl: "templates/createUser.html",
      controller: 'UserCtrl'
    });

});


