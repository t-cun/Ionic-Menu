'use strict';

angular.module('SpiceShack.services', ['ngResource'])
.constant('jsonURL', 'https://spiceshack-4b0b7.firebaseio.com/resources/')
.constant('imgURL', 'https://firebasestorage.googleapis.com/v0/b/spiceshack-4b0b7.appspot.com/o/staff%2F')
.constant('imgTail', '?alt=media&token=79907ce4-952b-486e-8b75-b338e478a6dc')

.factory('menuFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {

  return $resource(jsonURL + 'dishes/:id' + '.json', null, {'update':{method:'PUT'}});

}])

.factory('promotionFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {

  return $resource(jsonURL + 'promotions/:id' + '.json');

}])

.factory('corporateFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {
  var leadership = $resource(jsonURL + 'leadership/:id' + '.json' , null, {'update':{method:'PUT'}});

  return {
    getLeaders: function() {
      return leadership;
    }
  };
}])

.factory('feedbackFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {
  var feedback = $resource(jsonURL + 'feedback/:id' + '.json' , null, {'add':{method:'POST'}});

  return {
    putFeedback: function() {
      return feedback;
    }
  };
}])

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
