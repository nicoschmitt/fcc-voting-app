(function() {
    
    var app = angular.module('votingApp');
  
    app.controller('myPollsCtrl', ['$http', "$location", "$alert", "adalAuthenticationService",
        function ($http, $location, $alert, adal) {
            var vm = this;
            
            vm.message = "loading...";
            vm.polls = [];
            
            $http.get("/api/polls/" + adal.userInfo.profile.email + "/my.json").then(function(resp) {
                // Success
                vm.message = false;
                vm.polls = resp.data;
                
            }, function(resp) {
                // Error
                vm.message = resp.data;
                
            });
            
        }
    ]);
  
  
}());
