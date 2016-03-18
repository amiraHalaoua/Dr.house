angular.module('starter.services', [])

.factory('fireBaseData', function($firebase) {

  var ref       = new Firebase("https://dr-house.firebaseio.com/");
  var usersRef  = new Firebase("https://dr-house.firebaseio.com/users");

  ref.data = {};
  ref.on("value", function(snapshot) {
    ref.data = snapshot.val();
    userData = snapshot.child("users").val(); //data of users
    rdvData = snapshot.child("users/rdv").val(); // data of rdvs

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
      
 return {
    ref: function () {
      return ref;
    },
    //les données de la base
    refData: function () {
      return ref.data;
    },
    usersRef: function () {
      return usersRef;
    },
    // liste des profiles
    userData: function () {
      return userData;
    },

    rdvRef: function(){
      return rdv;
    },

  }
});

