angular.module('starter.controllers', ['ngMessages'])
// controlleur d'authentification
.controller('AccountCtrl', function($scope, fireBaseData, $firebase, $state) {
      
        //Checking if user is logged in
        $scope.user = fireBaseData.ref().getAuth();

        if (!$scope.user) {
            $scope.showLoginForm = true;
        }
        //Login method
        $scope.login = function (em, pwd) {
            fireBaseData.ref().authWithPassword({
                email    : em,
                password : pwd
            }, function(error, authData) {
                if (error === null) {
                    //console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
                    $scope.user = fireBaseData.ref().getAuth();                 
                    $scope.showLoginForm = false;                 
                    $scope.$apply();
                    $scope.goMyRdv();
                   
                } else {
                    console.log("Error authenticating user:", error);
                }
            });
        };
        //Logout method
        $scope.logout = function () {
            fireBaseData.ref().unauth();
            $scope.showLoginForm = true;
        };

        $scope.goUser = function(){
           $state.go('creatUser');
        };

        $scope.goMyRdv = function(){
           switch($scope.user.password.email){
                case'admin@gmail.com':
                    $state.go('admin');
                    break;
                case'secretaire@gmail.com':
                    $state.go('secretaire');
                    break;
                default:
                    $state.go('rdvPatient');
                    break;
           }
        };
})

// controlleur de gestion des utilisateurs
.controller('UserCtrl', function($scope, fireBaseData, $firebase, $state) {
        $scope.creatUser = function(ref, civilite, nom, prenom, tel, em){
            var newUser = {
              email: em,
              password: nom,
              profile: {
                reference: ref,
                civilite: civilite,
                nom: nom,
                prenom: prenom,
                telephone: tel
              },
              groupe: "patient",
              rdv:// [
                {
                    date: "200320161415",
                    todo: "carie",
                    duree: "30min"
                }
              //]
            };
            fireBaseData.ref().createUser({email: newUser.email, password:newUser.password}, function(error, userData) {

                if (error) {
                  switch (error.code) {
                    case "EMAIL_TAKEN":
                      console.log("The new user account cannot be created because the email is already in use.");
                      break;
                    case "INVALID_EMAIL":
                      console.log("The specified email is not a valid email.");
                      break;
                    default:
                      console.log("Error creating user:", error);
                  }
                }else{
                    newUser.id = userData.uid;
                    return fireBaseData.usersRef().push(newUser);
                }
            }); 
        }

        
})

// controlleur de gestion des rdv
.controller('RdvCtrl', function($scope, fireBaseData, $firebase, $state) {

});
