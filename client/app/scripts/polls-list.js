(function() {
    
    var app = angular.module('votingApp');
  
    app.controller('pollsListCtrl', ['$http',
        function ($http) {
            var vm = this;
            
            vm.polls = [];
            $http.get('/api/polls.json').then(function(resp) {
                // Success
                vm.polls = resp.data;
                
            }, function(resp) {
                // Error
                
            });
            
        }
    ]);
  
}());
