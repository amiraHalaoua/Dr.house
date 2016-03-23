angular.module('starter.services', ['firebase'])

.factory('fireBaseData', function($firebase, $rootScope) {
  
  var ref       = new Firebase("https://dr-house.firebaseio.com/");

 return {
    ref: function () {
      return ref;
    },

    key: function () {
      return key;
    },
    
    // liste des profiles
    getUsers: function (user) {
         return ref.child('users');
    },

    setCurrentUser: function(user){
      
      currentUser = user;
     
      return true;
    },
    getCurrentUser: function(){
      return {user : currentUser};
    },

    // liste des rdv
    getRdvs: function (rdv) {
      return ref.child('rdv');
    }
    
  }
});

