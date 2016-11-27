'use strict';

angular.module('SpiceShack.services', ['ngResource'])

// Store constants for data retreival with API calls
.constant('jsonURL', 'https://spiceshack-4b0b7.firebaseio.com/resources/')
.constant('imgURL', 'https://firebasestorage.googleapis.com/v0/b/spiceshack-4b0b7.appspot.com/o/staff%2F')
.constant('imgTail', '?alt=media&token=79907ce4-952b-486e-8b75-b338e478a6dc')

// menuFactory used to return all dish data from menu
.factory('menuFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {

  return $resource(jsonURL + 'dishes/:id' + '.json', null, {'update':{method:'PUT'}});

}])

// promotionFactory used to return promotion data
.factory('promotionFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {

  return $resource(jsonURL + 'promotions/:id' + '.json');

}])

// corporateFactory used to return corporate leadership data
.factory('corporateFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {
  var leadership = $resource(jsonURL + 'leadership/:id' + '.json' , null, {'update':{method:'PUT'}});

  return {
    getLeaders: function() {
      return leadership;
    }
  };
}])

// feedbackFactory used to push feedback to the firebase database
.factory('feedbackFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {
  var feedback = $resource(jsonURL + 'feedback/:id' + '.json' , null, {'add':{method:'POST'}});

  return {
    putFeedback: function() {
      return feedback;
    }
  };
}])

// favoriteFactory used to add, delete, and retrieve favorites data from firebase
.factory('favoriteFactory', ['$resource', '$localStorage', function($resource, $localStorage) {
  var favFac = {};
  var favorites = [];

  favFac.addToFavorites = function (index) {
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i].id == index)
        return;
    }
    favorites.push({id: index});
    $localStorage.storeObject('favorites', favorites);
  };

  favFac.getFavorites = function () {
    return $localStorage.getObject('favorites', '{}');;
  }

  favFac.deleteFromFavorites = function (index) {
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i].id == index) {
        favorites.splice(i, 1);
        $localStorage.storeObject('favorites', favorites);
      }
    }
  }

  return favFac;
}])

// $localStorage defines functions used to store objects locally
.factory('$localStorage', ['$window', function($window) {
  return {
      store: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key, defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
  }
}]);
