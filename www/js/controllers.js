angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

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

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
  $scope.tab = 1;
  $scope.orderText = '';
  $scope.showDetails = false;
  $scope.showMenu = false;
  $scope.message = "Loading...";
  menuFactory.getDishes().query(
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

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
  $scope.showDish = false;
  $scope.message="Loading...";
  $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id, 10)})
    .$promise.then(
      function(response) {
        $scope.dish = response;
        $scope.showDish = true;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );
}])

.controller('CommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {

  $scope.comment = { rating:5, comment:"", author:"", date: new Date()};

  $scope.addComment = function(comment) {
    $scope.$parent.dish.comments.push(comment);
    menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
  };

  $scope.postComment = function() {
    $scope.addComment($scope.comment);
    $scope.comment = { rating:5, comment:"", author:"", date: new Date()};
    $scope.commentForm.$setPristine();
  };
}])

.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function($scope, menuFactory, corporateFactory, baseURL) {
  $scope.baseURL = baseURL;
  $scope.showDish = false;
  $scope.showPromo = false;
  $scope.showLeader = false;
  $scope.message = "Loading...";
  $scope.promoDish = menuFactory.getDishes().get({id:0})
    .$promise.then(
      function(response) {
        $scope.promoDish = response;
        $scope.showDish = true;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );

  $scope.promo = menuFactory.getPromotion().get({id:0})
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

.controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
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
;
