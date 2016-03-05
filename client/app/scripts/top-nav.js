(function() {
    
  var app = angular.module('votingApp');
  
  app.directive("topNav", ['adalAuthenticationService', "$location",
    function (adalProvider, $location) {
        
        var topNavCtrl = function() {
          var vm = this;
          
          vm.login = function() {
            adalProvider.login();
          };
          
          vm.logout = function() {
            adalProvider.logout();
          };
          
          vm.getUsername = function() {
              var auth = adalProvider.userInfo.isAuthenticated;
              return (auth && adalProvider.userInfo.profile.name) || "";
          };
               
          vm.isActive = function (viewLocation) { 
            return viewLocation === $location.path();
          };
        };
        
        
        return {
           restrict: 'E',
           templateUrl: "/app/views/top-nav.html",
           controller: topNavCtrl,
           controllerAs: "nav"
        };
  }]);
  
  
}());
