(function() {
    
    var app = angular.module('votingApp');
  
    app.controller('pollCtrl', ['$http', "$routeParams",
        function ($http, $routeParams) {
            var vm = this;
            
            vm.loading = true;
            vm.poll = {};
            $http.get('/api/poll/' + $routeParams.id).then(function(resp) {
                // Success
                vm.loading = false;
                vm.poll = resp.data;
                
                console.log(vm.poll);
                
            }, function(resp) {
                // Error
                
            });
            
        }
    ]);
  
  
}());
