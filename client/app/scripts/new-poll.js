(function() {
    
    var app = angular.module('votingApp');
  
    app.controller('newPollCtrl', ['$http', "$location", "$alert",
        function ($http, $location, $alert) {
            var vm = this;
            
            vm.poll = { title: "", options: "" };
         
            vm.create = function() {
              
              var newpoll = { title: vm.poll.title, options: vm.poll.options.split(/\n/) };
              $http.post("/api/poll/new", newpoll).then(function(resp) {
                  // success
                  console.log("Poll created");
                  console.log(resp.data);
                  $location.path("/Polls");
                  
              }, function(resp) {
                  // error
                  console.log("Unable to create poll");
                  var myalert = $alert({
                      title: "Unable to create poll",
                      content: resp.data,
                      container: "body",
                      placement: "top-right",
                      type: "danger",
                      //duration: 2,
                      show: false
                    });
                  myalert.$promise.then(myalert.show);
              });
                
            };
            
        }
    ]);
  
  
}());
