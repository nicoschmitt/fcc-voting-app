(function() {
    
  var app = angular.module('votingApp');
  
  app.directive("topNav", ['adalAuthenticationService', "$location",
    function (adalProvider, location) {
        
        console.log(adalProvider);
        
        var topNavCtrl = function() {
          var vm = this;
          
          vm.login = function() {
            adalProvider.login();
          };
          
          vm.logout = function() {
            adalProvider.logout();
          };
          
          vm.getUsername = function() {
              return adalProvider.userInfo.profile.name;
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
