angular.module('starter.services', [])

.factory('fireBaseData', function($firebase) {

  var ref       = new Firebase("https://dr-house.firebaseio.com/");
  var refUsers  = new Firebase("https://dr-house.firebaseio.com/users");
  ref.on("value", function(snapshot) {
    ref.users = snapshot.child('users').val();
    console.log(ref.users);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
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
    //les données de la base
    refData: function () {
      return ref.users;
    },
    
    // liste des profiles
    refUsers: function () {
      return  refUsers;
    },

    rdvRef: function(){
      return rdv;
    },

  }
});

