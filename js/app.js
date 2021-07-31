(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', foundItemsDirective);

function foundItemsDirective() {
  var ddo = {
    templateUrl: 'items.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'ctrl',
    bindToController: true
  };

  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var itemAdder = this;

  itemAdder.searchTerm = "";
  itemAdder.items = MenuSearchService.getItems();
  
  itemAdder.browseItems = function(){
    var promise = MenuSearchService.getMatchedMenuItems(itemAdder.searchTerm);
    promise.then(function (response) {
      console.log(response);

      itemAdder.items = response;
    }).catch(function (error) {
      console.log(error);
    });
    
  };

  itemAdder.removeItem = function(index) {
    MenuSearchService.removeItem(index);
  }

  itemAdder.voidList = function() {
    return itemAdder.items === null;
  }
}

MenuSearchService.$inject = ['$http']
function MenuSearchService($http) {
  var service = this;

  var items = [];

  service.removeItem = function (itemIndex) {
    items.splice(itemIndex.index, 1);
  };

  service.getMatchedMenuItems = function(searchTerm){
    return $http({
        method: "GET",
        url: 'https://davids-restaurant.herokuapp.com/menu_items.json',
      }).then(function (result) {
        // process result and only keep items that match
        var data = result.data.menu_items;
        items = [];
        for (let i = 0; i < data.length; i++){
          if (data[i].description.toLowerCase().indexOf(searchTerm) !== -1){
            items.push(data[i]);
          }
        }
        if (searchTerm === "" || items.length === 0){
          return null;
        }
    
        // return processed items
        return items;
    });
  };

  service.getItems = function () {
    return items;
  };
}

})();
