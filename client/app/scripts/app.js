(function() {
  var app = angular.module('votingApp', [ 'ngRoute', 'AdalAngular' ]);
  
  app.config(['$routeProvider','$httpProvider', 'adalAuthenticationServiceProvider',
    function ($routeProvider, $httpProvider, adalProvider) {
   
      $routeProvider.when("/Home", {
        controller: "homeCtrl",
        templateUrl: "/app/views/Home.html",
      }).when("/TodoList", {
        controller: "todoListCtrl",
        templateUrl: "/app/views/TodoList.html",
        requireADLogin: true, // Ensures that the user must be logged in to access the route
      }).when("/UserData", {
        controller: "userDataCtrl",
        templateUrl: "/app/views/UserData.html",
      }).otherwise({ redirectTo: "/Home" });

      adalProvider.init({
          
          instance: 'https://login.microsoftonline.com/', 
          tenant: 'common', // app.nicontoso.eu
          clientId: 'a6ce30e5-91f5-4352-bb54-3ebc92e79e6d'
          //extraQueryParameter: 'nux=1',
          //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
          
      }, $httpProvider );
        
  }]);
  
}());
