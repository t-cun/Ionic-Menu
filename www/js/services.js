'use strict';

angular.module('conFusion.services', ['ngResource'])
.constant("jsonURL", 'http://192.168.222.223:3000/')
.constant("imgURL", 'https://firebasestorage.googleapis.com/v0/b/coursera-angular-js.appspot.com/o/');

.factory('menuFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {

  return $resource(jsonURL+"dishes/:id" , null, {'update':{method:'PUT'}});

}])

.factory('promotionFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {

  return $resource(jsonURL + "promotions/:id");

}])

.factory('corporateFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {
  var leadership = $resource(jsonURL+"leadership/:id" , null, {'update':{method:'PUT'}});

  return {
    getLeaders: function() {
      return leadership;
    }
  };
}])

.factory('feedbackFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {
  var feedback = $resource(jsonURL+"feedback/:id" , null, {'add':{method:'POST'}});

  return {
    putFeedback: function() {
      return feedback;
    }
  };
}])

.factory('favoriteFactory', ['$resource', 'jsonURL', function($resource, jsonURL) {
  var favFac = {};
  var favorites = []; //$resource(jsonURL+"favorites/:id", null, {'add':method:'POST'});

  favFac.addToFavorites = function (index) {
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i].id == index)
        return;
    }

    favorites.push({id: index});
  };

  favFac.getFavorites = function () {
    return favorites;
  }

  favFac.deleteFromFavorites = function (index) {
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i].id == index)
        favorites.splice(i, 1);
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
