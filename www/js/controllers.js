angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo', '{}');
  $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo', $scope.loginData);
  };

  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
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

})

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'jsonURL', '$ionicListDelegate', function($scope, menuFactory, favoriteFactory, jsonURL, $ionicListDelegate) {
  $scope.jsonURL = jsonURL;
  $scope.tab = 1;
  $scope.orderText = '';
  $scope.showDetails = false;
  $scope.showMenu = false;
  $scope.message = "Loading...";

  menuFactory.query(
    function(response) {
      $scope.dishes = response;
      $scope.showMenu = true;
    },
    function(response) {
      $scope.message = "Error: " + response.status + " " + response.statusText;
    }
  );

  $scope.select = function(setTab) {
    $scope.tab = setTab;

    if(setTab === 2) {
      $scope.orderText = "appetizer";
    } else if (setTab === 3) {
      $scope.orderText = "mains";
    } else if (setTab === 4) {
      $scope.orderText = "dessert";
    } else {
      $scope.orderText = "";
    }
  };

  $scope.isSelected = function(tab) {
    return $scope.tab === tab;
  };
  $scope.toggleDetails = function() {
    $scope.showDetails = !$scope.showDetails;
  };

  $scope.addFavorite = function(index) {
    favoriteFactory.addToFavorites(index);
    $ionicListDelegate.closeOptionButtons();
  };

}])

.controller('ContactController', ['$scope', function($scope) {
  $scope.feedback = { mychannel:"", firstName:"",
  lastName:"", agree:false, email:""};

  var channels = [{value:"tel", label:"Tel."},
  {value:"Email",label:"Email"}];

  $scope.channels = channels;
  $scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
  $scope.sendFeedback = function() {
    if ($scope.feedback.agree && ($scope.feedback.mychannel === "")&& !$scope.feedback.mychannel) {
      $scope.invalidChannelSelection = true;
    } else {
      // Submission action
      feedbackFactory.putFeedback().add($scope.feedback);
      $scope.invalidChannelSelection = false;
      $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
      $scope.feedback.mychannel="";
      $scope.feedbackForm.$setPristine();
    }
  };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'jsonURL', '$ionicModal', '$ionicPopover', function($scope, $stateParams, dish, menuFactory, favoriteFactory, jsonURL, $ionicModal, $ionicPopover) {
  $scope.jsonURL = jsonURL;
  $scope.dish = dish;

  $scope.openPopover = function($event) {
    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
      $scope.popover.show($event);
    });

  };

  $scope.showCommentForm = function() {
    $scope.comment = { rating:"5", comment:"", author:"", date: new Date()};
    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.commentForm = modal;
      $scope.commentForm.show();
    });
  };

  $scope.addFavorite = function(index) {
    $scope.popover.hide();
    favoriteFactory.addToFavorites(index);
  };

  $scope.closeCommentForm = function() {
    $scope.popover.hide();
    $scope.commentForm.hide();
  }

  $scope.addComment = function(comment) {
    $scope.dish.comments.push(comment);
    menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
  };

  $scope.postComment = function() {
    $scope.closeCommentForm();
    $scope.addComment($scope.comment);
  };

  $scope.$on('popover.hidden', function() {
      // console.log("popover hidden");
      $scope.popover.remove();
  });
    // Execute action on remove popover
  $scope.$on('popover.removed', function() {
      // console.log("popover removed");
  });

  $scope.$on('modal.hidden', function() {
      // console.log("commentForm hidden");
      $scope.commentForm.remove();
  });

  $scope.$on('modal.removed', function() {
      // console.log("commentForm removed");
  });
}])

.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'promotionFactory', 'jsonURL', function($scope, menuFactory, corporateFactory, promotionFactory, jsonURL) {
  $scope.jsonURL = jsonURL;
  $scope.showDish = false;
  $scope.showPromo = false;
  $scope.showLeader = false;
  $scope.message = "Loading...";
  $scope.promoDish = menuFactory.get({id:0})
    .$promise.then(
      function(response) {
        $scope.promoDish = response;
        $scope.showDish = true;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );

  $scope.promo = promotionFactory.get({id:0})
    .$promise.then(
      function(response) {
        $scope.promo = response;
        $scope.showPromo = true;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );

  $scope.promoLeader = corporateFactory.getLeaders().get({id:3})
    .$promise.then(
      function(response) {
        $scope.promoLeader = response;
        $scope.showLeader = true;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );
}])

.controller('AboutController', ['$scope', 'corporateFactory', 'jsonURL', function($scope, corporateFactory, jsonURL) {
  $scope.jsonURL = jsonURL;
  $scope.showLeaders = false;
  corporateFactory.getLeaders().query(
    function(response) {
      $scope.leaders = response;
      $scope.showLeaders = true;
    },
    function(response) {
      $scope.message = "Error: " + response.status + " " + response.statusText;
    }
  );
}])

.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'jsonURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', function($scope, dishes, favorites, favoriteFactory, jsonURL, $ionicListDelegate, $ionicPopup, $ionicLoading) {

  $scope.$on('$ionicView.enter', function(e) {
    $scope.showDelete = false;
  });

  $scope.jsonURL = jsonURL;
  $scope.favorites = favorites;
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
        favoriteFactory.deleteFromFavorites(index);
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
