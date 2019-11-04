var app = angular.module('productApp', ['mgcrea.ngStrap']);

const graphqlAPIUrl = "http://localhost:4000";

app.controller('productDetailController', function($scope, ProductService){
  $scope.products = ProductService;
  $scope.delete = function(){
      $scope.products.delete();
  };
  $scope.update = function(){
      $scope.products.update();
  };
});

app.controller('productController', function($scope, ProductService, $modal) {
  $scope.orderType="idalimento";
  $scope.products = ProductService;

  $scope.showCreateProduct = function(){
      $scope.products.selectedProduct = null;
      $scope.createModal = $modal({
        scope : $scope,
        templateUrl : 'templates/modal.create.tpl.html',
        show : true
      });

    $scope.createContact = function(){
      var selected = $scope.products.selectedProduct;
      console.log(selected);
      if (selected.idalimento != null && selected.nombre != null && selected.foto != null && selected.cantidad != null && selected.fechacaducidad != null) {
        $scope.createModal.hide();
        $scope.products.create($scope.products.selectedProduct);
      } else {
        alert("Fill all data!");
      }
      
    };
  };

  $scope.searchAll = function () {
    $scope.products.searchAll();
  }

  $scope.searchByID = function () {
    if (document.getElementById("searchInput").value != "") { 
      $scope.products.searchByID();
    }
  }
});

app.service('ProductService', function() {
    var _self = {
      "create": function(product){
        fetch(graphqlAPIUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({query: `mutation {
                                              createProduct(idalimento: ${product.idalimento}, nombre: "${product.nombre}",
                                              foto: "${product.foto}", cantidad: ${product.cantidad}, fechacaducidad: "${product.fechacaducidad}") {
                                                status
                                                message
                                              }
                                            }`})})
                      .then(res => res.json())
                      .then(function (response) {
                            if (response.data.createProduct.status == "success") {
                              _self.products.push(product);
                            } else {
                              alert("The product couldn't be created. Message: ".concat(response.data.createProduct.message));
                            }
                            simulateClick();
                          })
                      .catch(console.error);
      },
      "delete":function(){
        fetch(graphqlAPIUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({query: `mutation {
                                              deleteProduct(idalimento: ${_self.selectedProduct.idalimento}) {
                                                status
                                                message
                                              }
                                            }`})})
                      .then(res => res.json())
                      .then(function (response) {
                        console.log(response);
                            if (response.data.deleteProduct.status == "success") {
                              var index = _self.products.indexOf(_self.selectedProduct);
                              if (index != -1){
                                _self.products.splice(index, 1);
                                _self.selectedProduct = null;
                              }
                            } else {
                              alert("The product couldn't be deleted.");
                            }
                            simulateClick();
                          })
                      .catch(console.error);
      },
      "searchAll": function() {
        fetch(graphqlAPIUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({query: `query {
                                              products {
                                                idalimento
                                                nombre
                                                foto
                                                cantidad
                                                fechacaducidad
                                              }
                                            }`})})
                      .then(res => res.json())
                      .then(function (response) {
                            _self.products = [];
                              for (i = 0; i<response.data.products.length; i++) {
                                _self.products.push(response.data.products[i]);
                              }
                              simulateClick();
                          })
                      .catch(console.error);
        },
      "searchByID": function() {
        fetch(graphqlAPIUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({query: `query {
                                              product(idalimento: ${document.getElementById("searchInput").value}) {
                                                idalimento
                                                nombre
                                                foto
                                                cantidad
                                                fechacaducidad
                                              }
                                            }`})})
                      .then(res => res.json())
                      .then(function (response) {
                            _self.products = [];
                              for (i = 0; i<response.data.product.length; i++) {
                                _self.products.push(response.data.product[i]);
                              }
                              simulateClick();
                          })
                      .catch(console.error);
        
        },
      "update": function(product) {
        fetch(graphqlAPIUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({query: `mutation {
                                              updateProduct(idalimento: ${_self.selectedProduct.idalimento}, nombre: "${_self.selectedProduct.nombre}",
                                              foto: "${_self.selectedProduct.foto}", cantidad: ${_self.selectedProduct.cantidad}, fechacaducidad: "${_self.selectedProduct.fechacaducidad}") {
                                                status
                                                message
                                              }
                                            }`})})
                      .then(res => res.json())
                      .then(function (response) {
                            if (response.data.updateProduct.status == "success") {
                              alert("Product updated");
                            } else {
                              alert("The product couldn't be updated.");
                            }
                            simulateClick();
                          })
                      .catch(console.error);
        
      },
    "selectedProduct":null,
    "products": []
  }
  return _self;
});

function simulateClick() {
  var control = document.getElementById("simulate");
  var evObj = document.createEvent('MouseEvents');
  evObj.initMouseEvent('click', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
  control.dispatchEvent(evObj);
}
