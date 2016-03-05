(function() {
    
    var app = angular.module('votingApp');
  
    app.controller('pollCtrl', ['$http', "$routeParams", "$alert", "adalAuthenticationService", "$location", "$window",
        function ($http, $routeParams, $alert, adal, $location, $window) {
            var vm = this;
            
            var authenticated = adal.userInfo.isAuthenticated;
            var current = (authenticated && adal.userInfo.profile.email) || "";
            
            vm.message = "loading...";
            vm.poll = {};
            vm.selectedIndex = -1;
            vm.graph = { labels: [], data: [] };
            vm.addOption = false;
            vm.newOption = "";
            
            vm.Select = function(idx) {
                if (vm.addOption) vm.addOption = false;
                console.log("Select " + idx);
                vm.selectedIndex = idx;
            };
            
            vm.Vote = function() {
                var data = {};
                if (vm.addOption) {
                    if (!vm.newOption) return showError("Please fill new option");
                    data = { option: -1, value: vm.newOption };
                } else {
                    if (vm.selectedIndex < 0)  return showError("Please select an option");
                    var option = vm.poll.options[vm.selectedIndex];
                    data = { option: vm.selectedIndex, value: option };
                }
                console.log("Vote for " + data.value);
                
                $http.put("/api/poll/" + vm.poll._id + "/vote", data).then(function(resp){
                    // success
                    vm.addOption = false;
                    vm.newOption = "";
                    vm.poll = resp.data;
                    updateGraph();
                    
                }, function(resp) {
                    // error 
                    var myalert = $alert({
                      title: "Unable to update poll info",
                      content: resp.data,
                      container: "#message",
                      type: "danger",
                      duration: 5,
                      show: false
                    });
                    myalert.$promise.then(myalert.show);
                    
                });
            };
            
            vm.Delete = function() {
                console.log("Delete " + vm.poll.title);
                
                $http.delete("/api/poll/" + vm.poll._id).then(function(resp){
                    // success
                    $location.path("/Polls");
                    
                }, function(resp) {
                    // error s
                    var myalert = $alert({
                      title: "Unable to delete poll info",
                      content: "" + resp.data,
                      container: "#message",
                      type: "danger",
                      duration: 5,
                      show: false
                    });
                    myalert.$promise.then(myalert.show);
                    
                });
            };
            
            vm.Share = function() {
              var url = "http://twitter.com/intent/tweet?text=";
              url += encodeURIComponent(vm.poll.title + " " + $location.absUrl());
              $window.open(url);
            };
            
            var updateGraph = function() {
                console.log("Update graph");
                vm.graph = { labels: vm.poll.options.slice(0), data: Array(vm.poll.options.length).fill(0) };
                if (vm.poll.votes) {
                    for (var i = 0; i < vm.poll.votes.length; i++) {
                        vm.graph.data[vm.poll.votes[i][1]]++;
                    }
                }  
            };
            
            var showError = function(title, msg) {
                var myalert = $alert({
                  title: title,
                  content: msg || "",
                  container: "#message",
                  type: "danger",
                  duration: 5,
                  show: false
                });
                myalert.$promise.then(myalert.show);  
            };
            
            $http.get('/api/poll/' + $routeParams.id).then(function(resp) {
                // Success
                vm.message = false;
                vm.poll = resp.data;
                console.log(vm.poll.votes);
                console.log(current);
                if (vm.poll.votes) {
                    for (var i = 0; i < vm.poll.votes.length; i++) {
                        if (vm.poll.votes[i][0] == current) vm.selectedIndex = vm.poll.votes[i][1];
                    }
                }  
                updateGraph();
                
            }, function(resp) {
                // Error
                if (resp.status == 404) {
                    vm.message = "Poll not found.";
                } else {
                    var myalert = $alert({
                      title: "Unable to get poll info",
                      content: resp.data,
                      container: "#message",
                      type: "danger",
                      duration: 2,
                      show: false
                    });
                    myalert.$promise.then(myalert.show);
                }
            });
            
        }
    ]);
  
  
}());
