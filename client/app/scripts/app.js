(function() {
  var app = angular.module('votingApp', [ 'ngRoute', 'AdalAngular', "ngAnimate", "mgcrea.ngStrap", "chart.js" ]);
  
  app.config(['$routeProvider','$httpProvider', 'adalAuthenticationServiceProvider',
    function ($routeProvider, $httpProvider, adalProvider) {
   
      $routeProvider.when("/Polls", {
        templateUrl: "/app/views/polls-list.html",
        controller: "pollsListCtrl",
        controllerAs: "vm"

      }).when("/My", {
        templateUrl: "/app/views/my-polls.html",
        controller: "myPollsCtrl",
        controllerAs: "vm",
        requireADLogin: true
 
      }).when("/New", {
        templateUrl: "/app/views/new-poll.html",
        controller: "newPollCtrl",
        controllerAs: "vm",
        requireADLogin: true
        
      }).when("/Poll/:id", {
        controller: "pollCtrl",
        templateUrl: "/app/views/poll.html",
        controllerAs: "vm"
        
      }).otherwise({ redirectTo: "/Polls" });

      adalProvider.init({
          instance: 'https://login.microsoftonline.com/', 
          tenant: 'common',
          clientId: 'a6ce30e5-91f5-4352-bb54-3ebc92e79e6d'
      }, $httpProvider );
        
  }]);
  
}());
