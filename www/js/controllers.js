angular.module('starter.controllers', ['ngMessages'])
// controlleur d'authentification
.controller('AccountCtrl', function($scope, $rootScope, fireBaseData, $firebase, $state) {
      
        //Checking if user is logged in
        $scope.user = fireBaseData.ref().getAuth();
        $scope.showErrorConnect = false;
        
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
                    $rootScope.user = fireBaseData.ref().getAuth();       
                    fireBaseData.setCurrentUser($scope.user); 
                    $rootScope.$broadcast('user', $scope.user);      
                    $scope.showLoginForm = false;                 
                    $scope.$apply();
                    $scope.goMyRdv();
                   
                } else {
                    $scope.showErrorConnect = true;
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

        $scope.goListUser = function(){
           $state.go('listUser');
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
          
          $scope.loading = true;
          fireBaseData.getUsers().on("value", function(snapshot) {
            $scope.users   = snapshot.val();
            $scope.nbUsers = Object.keys($scope.users).length;
            $scope.loading = false;
          }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          });
         
        $scope.creatUser = function(ref, civilite, nom, prenom, tel, em){
            var newUser = {
                email: em,
                password: tel,
                profile: {
                reference: ref,
                civilite: civilite,
                nom: nom,
                prenom: prenom,
                telephone: tel
              },
              groupe: "patient",
              rdv: {
                20160415:
                {
                    date: "15/04/2016",
                    todo: "carie",
                    duree: "30min"
                }
              }
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

                    if(fireBaseData.getUsers().push(newUser)){
                       $state.go('listUser');
                    }
                    
                }
            }); 
        }

         
        $scope.edit = function(item) {
          alert('Edit Item: ' + item.id);
        };

      

})

// controlleur de gestion des rdv
.controller('rdvCtrl', function($scope, $rootScope, fireBaseData, $firebase, $state) {
  $scope.loading = true;
  $scope.nbRdvs = 0;
  currentUser = fireBaseData.ref().getAuth();
  console.log(currentUser.uid);
   fireBaseData.getUsers().orderByChild("id").equalTo(currentUser.uid).on("child_added", function(snapshot) {
      $scope.rdvs = snapshot.val().rdv;
      $scope.nbRdvs = Object.keys($scope.rdvs).length;
      console.log($scope.rdvs,snapshot.val() );
      $scope.loading = false;
  });

});
