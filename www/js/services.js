'use strict';

angular.module('conFusion.services', ['ngResource'])
.constant("baseURL", "http://localhost:3000/")

.service('menuFactory', ['$resource', 'baseURL', function($resource, baseURL) {

  this.getDishes = function() {
    return $resource(baseURL+"dishes/:id" , null, {'update':{method:'PUT'}});
  };

  this.getPromotion = function() {
    return $resource(baseURL+"promotions/:id" , null, {'update':{method:'PUT'}});
  };
}])

.factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {
  var leadership = $resource(baseURL+"leadership/:id" , null, {'update':{method:'PUT'}});

  return {
    getLeaders: function() {
      return leadership;
    }
  };
}])

.factory('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL) {
  var feedback = $resource(baseURL+"feedback/:id" , null, {'add':{method:'POST'}});

  return {
    putFeedback: function() {
      return feedback;
    }
  };
}])

.factory('favoriteFactory', ['$resource', 'baseURL', function($resource, baseURL) {
  var favFac = {};
  var favorites = []; //$resource(baseURL+"favorites/:id", null, {'add':method:'POST'});

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
}]);
