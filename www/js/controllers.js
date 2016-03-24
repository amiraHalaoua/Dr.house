angular.module('starter.controllers', ['ui.rCalendar', 'ui.calendar'])
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
            $state.go('login');
        };

        $scope.goUser = function(){
           $state.go('creatUser');
        };

        $scope.goListUser = function(){
           $state.go('list-patient');
        };

        $scope.goCalendar = function(){
           $state.go('calendar');
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
.controller('UserCtrl', function($scope, fireBaseData, $firebase, $state, $ionicModal) {
          $scope.showModal = false;
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
                password: nom,
                profile: {
                  reference: ref,
                  civilite: civilite,
                  nom: nom,
                  prenom: prenom,
                  telephone: tel
                },
                groupe: "patient"
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
                    console.log(newUser);
                    if(fireBaseData.getUsers().push(newUser)){
                       $state.go('list-patient');
                    }
                    
                }
            }); 
        }

        $scope.detail= function(id){
          $scope.openModal();
          fireBaseData.getUsers().orderByChild("id").equalTo(id).on("child_added", function(snapshot) {
            var userObject = snapshot.val();

            $scope.ref = userObject.profile.reference;
            $scope.nom = userObject.profile.nom;
            $scope.prenom = userObject.profile.prenom;
            $scope.tel = userObject.profile.telephone;
            $scope.email = userObject.email;
          }); 
          $scope.rdvs = [];
          fireBaseData.getRdvs().orderByChild("idPatient").equalTo(id).on("child_added", function(snapshot) {
            $scope.rdvs.push(snapshot.val());

          });
        };
         // modal
        $ionicModal.fromTemplateUrl('myModal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };


      

})

// controlleur de gestion des rdv
.controller('rdvCtrl', function($scope, $rootScope, fireBaseData, $firebase, $state,$ionicModal, $filter) {
  // get rdv by user
  $scope.loading = true;
  $scope.nbRdvs = 0;
  currentUser = fireBaseData.ref().getAuth();
  
  fireBaseData.getUsers().orderByChild("id").equalTo(currentUser.uid).on("child_added", function(snapshot) {
      $scope.rdvs = snapshot.val().rdv;
      $scope.nbRdvs = Object.keys($scope.rdvs).length;
      $scope.loading = false;
  });
  
  // gestion du calendrier
   $scope.calendar = {eventSource:[]};
   $scope.showModal = false;
    $scope.changeMode = function (mode) {
        $scope.calendar.mode = mode;
    };

    $scope.loadEvents = function () {
       $scope.calendar.eventSource = [];

         var rdvs      = new Firebase("https://dr-house.firebaseio.com/rdv");
         rdvs.on("child_added", function(snapshot) {
          var rdv = snapshot.val();
            $scope.calendar.eventSource.push({
                        title: rdv.patient,
                        startTime: new Date(1000 * rdv.start),
                        endTime: new Date(1000 * rdv.end),
                        allDay: false
                    });
        
          });
          
    };

    $scope.onEventSelected = function (event) {
        $scope.startTime= event.startTime; // Wed Mar 23 2016 09:06:00 GMT+0100 (Paris, Madrid)
        $scope.endTime= event.endTime; // Wed Mar 23 2016 19:07:00 GMT+0100 (Paris, Madrid)
    };

    $scope.onViewTitleChanged = function (title) {
        $scope.viewTitle = title;
    };

    $scope.today = function () {
        $scope.calendar.currentDate = new Date();
    };

    $scope.isToday = function () {
        var today = new Date(),
        currentCalendarDate = new Date($scope.calendar.currentDate);

        today.setHours(0, 0, 0, 0);
        currentCalendarDate.setHours(0, 0, 0, 0);
        return today.getTime() === currentCalendarDate.getTime();
    };
    // *********** gestion des rdv **************//

    $scope.onTimeSelected = function (selectedTime) {
      // selectedTime (month) ===> Wed Mar 23 2016 12:00:00 GMT+0100 (Paris, Madrid)
        if($scope.calendar.mode == 'month'){
           $scope.selectedDate = selectedTime;
           $scope.changeMode('day')
        }else{
         
          $scope.startTime = $filter('date')(selectedTime, "hh:mm"); // 04:00 
          endtime = selectedTime.setHours((selectedTime.getHours())+1); 
          $scope.endTime = $filter('date')(endtime,  "hh:mm"); // 05:00
          $scope.openModal();        
        }
    };


    $scope.createEvent = function(rdv) {
       
        var events = [];
        var date = new Date($scope.selectedDate); // Mon Mar 21 2016 12:00:00 GMT+0100 (Paris, Madrid)
        var startTime = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate() , rdv.rdvstarttime.$viewValue.split(':')[0], rdv.rdvstarttime.$viewValue.split(':')[1]).getTime() / 1000);
        var endTime = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate() , rdv.rdvendtime.$viewValue.split(':')[0], rdv.rdvendtime.$viewValue.split(':')[1]).getTime() / 1000);
        var duree = (endTime - startTime) / 60;
        var idpatient = rdv.patient.$viewValue;
         var patientName  = '';
         fireBaseData.getUsers().orderByChild("id").equalTo(idpatient).on("child_added", function(snapshot) {
           var user = snapshot.val();
           patientName = user.profile.nom;
           var usersRdvRef       = new Firebase("https://dr-house.firebaseio.com/users/"+snapshot.key()+'/rdv');
            usersRdvRef.push(
            {
             date: startTime,
             duree: duree,
             conseil: rdv.conseil.$viewValue
            });
        });

        events.push({
            title: patientName, 
            startTime: startTime,
            endTime: endTime,
            allDay: true
        });

       events.push({
            title: patientName,
            startTime: startTime,
            endTime: endTime,
            allDay: false
        });
       
        
        // push new rdv
        var newRdv = fireBaseData.getRdvs().push();
        newRdv.set({
            idPatient: idpatient,
            patient: patientName,
            idRdv: newRdv.key(),
            conseil: rdv.conseil.$viewValue,
            start: startTime,
            end: endTime,

        });
       
        // add idRdv to patient


        $scope.calendar.eventSource =  events;
        $scope.modal.hide();
    };

        // modal
        $ionicModal.fromTemplateUrl('my-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
         $scope.loadEvents();
})
.controller('NavController', function($scope, $ionicSideMenuDelegate) {
      $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };
    })
 
    .controller('SndController', function($scope, $ionicSideMenuDelegate) {
    })
    .controller('SndHomePageController', function($scope, $ionicSideMenuDelegate) {
    })

    .controller('SndDrinkPageController', function($scope, $ionicSideMenuDelegate) {
    })
    .controller('SndPolicyPageController', function($scope, $ionicSideMenuDelegate) {
    })

