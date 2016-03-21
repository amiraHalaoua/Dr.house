angular.module('starter.services', ['firebase'])

.factory('fireBaseData', function($firebase, $rootScope) {
  
  var ref       = new Firebase("https://dr-house.firebaseio.com/");
  var currentUser = {};
/*
    usersRef.orderByChild("email").equalTo("test@gmail.com").on("child_added", function(snapshot) {
      console.log(snapshot.key());
    });
    usersRef.once("value", function(allUserSnapshot) {
  allUserSnapshot.forEach(function(userSnapshot) {
    // Will be called with a messageSnapshot for each child under the /messages/ node
    var key = userSnapshot.key();  // e.g. "-JqpIO567aKezufthrn8"
    console.log("key: "+key);
  });
  });*/

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
    }

  }
});

