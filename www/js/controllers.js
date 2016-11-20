angular.module('SpiceShack.controllers', [])

/* Initial controller loaded when app starts - handles all login/registration *
 * functionality                                                              */
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform, $cordovaCamera, $firebaseAuth, $firebaseObject, $cordovaToast) {

  // Store firebase reference variables
  var authObj = $firebaseAuth();
  var storageRef = firebase.storage().ref();
  var databaseRef = firebase.database().ref();
  var userObj;
  var imgRef;

  // Form data for the modals
  $scope.reservationData = {};
  $scope.loginData = {};
  $scope.registrationData = {};

  // Storage for current login information, object for error handling
  $scope.loggedIn = false;
  $scope.authError = {};
  $scope.authError.error = false;

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.authError.error = false;
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

    // Call to default firebase function passing user data from modal
    authObj.$signInWithEmailAndPassword($scope.loginData.email, $scope.loginData.password)
      .then(function(firebaseUser) {
        // Login was Successful, set session bool
        $scope.loggedIn = true;

        // Download user profile data into a local object
        userObj = $firebaseObject(databaseRef.child('users/' + firebaseUser.uid));
        imgRef = storageRef.child('users/' + firebaseUser.uid + '/profile.jpg');

        // Download user image from firebase storage
        imgRef.getDownloadURL()
          .then(function(url) {
            // Get the download URL for 'users/{uid}/profile.jpg'
            $scope.userImage = url;
          })
          .catch(function(error) {
          // Handle any errors
        });

        // Once the object has been safely loaded, populate page with information
        userObj.$loaded().then(function () {
          $scope.loginData = userObj.userData;
          $scope.closeLogin();
          $cordovaToast.show('Welcome, ' + userObj.userData.firstName + '!', 'long', 'center');
        });

      })
      .catch( function(error) {
        $scope.authError.msg = error.message;
        $scope.authError.error = true;
    });
  };

  // Perform logout - triggered by sign out button in sidebar
  $scope.doLogout = function() {

    // Destroy current firebase user object to avoid attempted changes after logout
    userObj.$destroy();
    $scope.loggedIn = false;

    // Call Firebase signOut function and send toast notification to users
    authObj.$signOut().then(function () {
      $cordovaToast.show('Signed out.', 'long', 'center');
    });
  }

  // Create reservation modal
  $ionicModal.fromTemplateUrl('templates/reserve.html', { scope: $scope })
    .then(function(modal) {
      $scope.reserveForm = modal;
  });

  $scope.closeReserve = function() {
    $scope.reserveForm.hide();
  };

  $scope.reserve = function() {
    $scope.reserveForm.show();
  };

  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  };

  // Create the registration modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
  }).then(function (modal) {
      $scope.registerForm = modal;
  });

  // Triggered in the registration modal to close it
  $scope.closeRegister = function () {
    $scope.authError.error = false;
    $scope.registerForm.hide();
  };

  // Open the registration modal
  $scope.register = function () {
    $scope.registerForm.show();
  };

  // Convert cordovaDataURL to Blob to be uploaded to Firebase
  $scope.convertDataURL = function (dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  };

  // Perform the registration action when the user submits the registration form
  $scope.doRegister = function () {
    // Call to default firebase function passing user data from modal
    authObj.$createUserWithEmailAndPassword($scope.registrationData.email, $scope.registrationData.password)
      .then(function(firebaseUser) {
        // registration authenticates user - set session variable
        $scope.loggedIn = true;

        // Prepare to upload user image and user data to firebase
        imgRef = storageRef.child('users/' + firebaseUser.uid + '/profile.jpg');
        userObj = $firebaseObject(databaseRef.child('users/' + firebaseUser.uid));

        // Once user reference has loaded, create object and save to database
        userObj.$loaded().then(function () {
          userObj.userData = {};
          userObj.userData.id = firebaseUser.uid;
          userObj.userData.firstName = $scope.registrationData.firstName;
          userObj.userData.lastName = $scope.registrationData.lastName;
          userObj.userData.email = $scope.registrationData.email;
          $scope.loginData = userObj.userData;
          userObj.$save();
        });

        // Create blob from user image and upload to Firebase
        var blob = $scope.convertDataURL($scope.registrationData.imgSrc);
        imgRef.put(blob).then(function () {
          $scope.userImage = $scope.registrationData.imgSrc;
          $scope.closeRegister();
          $cordovaToast.show('Registration Successful! Logged in.', 'long', 'center');
        });

      }).catch(function(error) {
        $scope.authError.msg = error.message;
        $scope.authError.error = true;
      });
  };

  // do not define options or takePicture until ionicPlatform signals it is ready
  $ionicPlatform.ready(function() {

    // camera options passed into takePicture
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    // takePicture used during registration
    $scope.takePicture = function() {
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.registrationData.imgSrc = "data:image/jpeg;base64," + imageData;
      }, function(err) {
          // Error
      });
    };
  });
})

/* MenuController - manages menu view, including tabs, display, and ability   *
 * for adding dishes to favorites                                             */
.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory',
                               'dishes', 'imgURL', 'imgTail', '$ionicListDelegate',
                               '$ionicPlatform', '$cordovaLocalNotification',
                               '$cordovaToast', function($scope, menuFactory,
                                favoriteFactory, dishes, imgURL, imgTail,
                                $ionicListDelegate, $ionicPlatform,
                                $cordovaLocalNotification, $cordovaToast) {

  // store default controller variables
  $scope.imgURL = imgURL;
  $scope.imgTail = imgTail;
  $scope.tab = 1;
  $scope.orderText = '';
  $scope.dishes = dishes;

  // filters appropriate dishes based on current menu tab
  $scope.select = function(setTab) {
    $scope.tab = setTab;

    if(setTab === 2) {
      $scope.orderText = 'appetizer';
    } else if (setTab === 3) {
      $scope.orderText = 'mains';
    } else if (setTab === 4) {
      $scope.orderText = 'dessert';
    } else {
      $scope.orderText = '';
    }
  };

  // return tab selection bool
  $scope.isSelected = function(tab) {
    return $scope.tab === tab;
  };

  // add dish to favorite list and notify the user
  $scope.addFavorite = function(index) {
    favoriteFactory.addToFavorites(index);
    $ionicListDelegate.closeOptionButtons();
    $ionicPlatform.ready(function() {
      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Added Favorite',
        text: $scope.dishes[index].name
      });
      $cordovaToast.show('Added Favorite ' + $scope.dishes[index].name,
                         'long', 'center')
       .then(function(success) {
         //success
       }, function(error) {
         //error
       });
    });
  };
}])

/* ContactController - basic contact controller to be implemented             *
 *                                                                            */
.controller('ContactController', ['$scope', function($scope) {
  $scope.feedback = { mychannel:"", firstName:"",
  lastName:"", agree:false, email:""};

  var channels = [{value:"tel", label:"Tel."},
  {value:"Email",label:"Email"}];

  $scope.channels = channels;
  $scope.invalidChannelSelection = false;

}])

/* DishDetailController - display dish details as well as add favorite        *
 * capability and add comment to dish                                         */
.controller('DishDetailController', ['$scope', '$stateParams', 'dish',
                                     'menuFactory', 'favoriteFactory', 'imgURL',
                                     'imgTail', '$ionicModal', '$ionicPopover',
                                     '$cordovaLocalNotification', '$cordovaToast',
                                     function($scope, $stateParams, dish,
                                     menuFactory, favoriteFactory, imgURL,
                                     imgTail, $ionicModal, $ionicPopover,
                                     $cordovaLocalNotification, $cordovaToast) {

  // store default controller variables
  $scope.imgURL = imgURL;
  $scope.imgTail = imgTail;
  $scope.dish = dish;

  // open popover event
  $scope.openPopover = function($event) {
    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
      $scope.popover.show($event);
    });
  };

  // add comment modal creation and display
  $scope.showCommentForm = function() {
    $scope.comment = { rating:"5", comment:"", author:"", date: new Date()};
    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.commentForm = modal;
      $scope.commentForm.show();
    });
  };

  // add favorite functionality
  $scope.addFavorite = function(index) {
    $cordovaLocalNotification.schedule({
      id: 1,
      title: 'Added Favorite',
      text: $scope.dish.name
    });
    $scope.popover.hide();
    favoriteFactory.addToFavorites(index);
    $cordovaToast.show('Added Favorite ' + $scope.dish.name,
                       'long', 'center')
     .then(function(success) {
       //success
     }, function(error) {
       //error
     });
  };

  // closes popover and comment modal
  $scope.closeCommentForm = function() {
    $scope.popover.hide();
    $scope.commentForm.hide();
  }

  // push comment to dish in firebase database
  $scope.addComment = function(comment) {
    $scope.dish.comments.push(comment);
    menuFactory.update({id:$scope.dish.id},$scope.dish);
  };

  // comment submission button press
  $scope.postComment = function() {
    $scope.closeCommentForm();
    $scope.addComment($scope.comment);
  };

  // remove popover when hidden
  $scope.$on('popover.hidden', function() {
    $scope.popover.remove();
  });

  // remove modal when hidden
  $scope.$on('modal.hidden', function() {
    $scope.commentForm.remove();
  });
}])

.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory',
                                'promotionFactory', 'promoDish', 'promo',
                                'promoLeader', 'imgURL', 'imgTail',
                                function($scope, menuFactory, corporateFactory,
                                promotionFactory, promoDish, promo, promoLeader,
                                imgURL, imgTail) {
  $scope.imgURL = imgURL;
  $scope.imgTail = imgTail;
  $scope.promoDish = promoDish;
  $scope.promo = promo;
  $scope.promoLeader = promoLeader;

}])

.controller('AboutController', ['$scope', 'corporateFactory', 'leaders',
                                'imgURL', 'imgTail', function($scope,
                                corporateFactory, leaders, imgURL, imgTail) {
  $scope.imgURL = imgURL;
  $scope.imgTail = imgTail;
  $scope.showLeaders = false;
  $scope.leaders = leaders;
}])

.controller('FavoritesController', ['$scope', 'dishes', 'favoriteFactory',
                                    'imgURL', 'imgTail', '$ionicListDelegate',
                                    '$ionicPopup', '$ionicLoading', '$cordovaToast',
                                    '$cordovaVibration', function($scope, dishes,
                                    favoriteFactory, imgURL, imgTail, $ionicListDelegate,
                                    $ionicPopup, $ionicLoading, $cordovaToast,
                                    $cordovaVibration) {

  $scope.$on('$ionicView.enter', function(e) {
    $scope.showDelete = false;
    $scope.favorites = favoriteFactory.getFavorites();
  });

  $scope.imgURL = imgURL;
  $scope.imgTail = imgTail;
  $scope.dishes = dishes;

  $scope.toggleDelete = function() {
    $scope.showDelete = !$scope.showDelete;
  };

  $scope.deleteFavorite = function(index) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm Delete',
      template: 'Are you sure you want to delete this item?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $cordovaVibration.vibrate(150);
        favoriteFactory.deleteFromFavorites(index);
        $scope.favorites = favoriteFactory.getFavorites();
        $cordovaToast.show('Removed Favorite ' + $scope.dishes[index].name,
                           'long', 'center')
         .then(function(success) {
           //success
         }, function(error) {
           //error
         });
      }
    });

    $scope.showDelete = false;
  };

}])

.filter('favoriteFilter', function() {
  return function(dishes, favorites) {
    var out = [];

    for(var i = 0; i < favorites.length; i++) {
      for(var j = 0; j < dishes.length; j++) {
        if(dishes[j].id === favorites[i].id) {
          out.push(dishes[j]);
        }
      }
    }
    return out;
  }
});
