(function(){

    var passport = require('passport');
    var Poll = require("./model/polls");

    var getAllPolls = function (req, res) {
        console.log("Get all polls");
    	Poll.find(function(err, polls) {
    	    if (err) res.status(500).send(err);
    	    else res.json(polls);
    	});
    };
    
    var getMyPolls = function (req, res) {
        console.log("Get my polls");
    	Poll.find({ownerEmail: req.params.user}, function(err, polls) {
    	    if (err) res.status(500).send(err);
    	    else res.json(polls);
    	});
    };
    
    var createPoll = function (req, res) {
        console.log("New poll");
    
        var poll = {
          ownerName: req.user.name,
          ownerEmail: req.user.email,
          title: req.body.title,
          options: [],
          votes: []
        };
        
        req.body.options.forEach(function(o){
          if (o) poll.options.push(o);
        });
        Poll.create(poll, function(err, obj) {
          if (err) res.status(500).send(err);
          else res.json({status: "ok", id: obj._id});
        });
    };
    
    var votePoll = function (req, res) {
        console.log("Vote for poll " + req.params.id);
        console.log(req.body);
        Poll.findById(req.params.id, function(err, doc){
          if (err) res.status(500).send(err);
          else if (doc == null) res.status(404).send("poll not found");
          else {
            var username = (req.isAuthenticated() && req.user.email) || req.ip;
            if (req.body.option < 0) {
                // add new options
                if (!req.isAuthenticated()) return res.send(401).send("Only authenticated users can add new option");
                else {
                    var idx = doc.options.push(req.body.value) - 1;
                    req.body.option = idx;
                }
            }
            var found = false;
            for(var i = 0; i < doc.votes.length; i++) {
                if (doc.votes[i][0] == username) {
                    found = true;
                    doc.votes[i][1] = req.body.option;
                }
            }
            if (!found) doc.votes.push([username, req.body.option]);
            
            doc.save();
            res.json(doc);
          }
        });
    };
    
    var getPollInfo = function (req, res) {
        console.log("Get poll " + req.params.id);
        Poll.findById(req.params.id, function(err, doc){
          if (err) res.status(500).send(err);
          else if (doc == null) res.status(404).send("poll not found");
          else res.json(doc);
        });
    };
    
    var deletePoll = function (req, res) {
        console.log("Delete poll " + req.params.id);
        Poll.findByIdAndRemove(req.params.id, function(err, doc) {
           if (err) res.status(500).send(err);
           else res.json({ status: "ok" });
        });
    };

    module.exports.register = function(app) {
      
        app.route("/api/polls.json").get(getAllPolls);
        
        app.route("/api/polls/:user/my.json").get(getAllPolls);
        
        app.route("/api/poll/new").post(passport.authenticate('oauth-bearer', { session: false }), createPoll);
        
        app.route("/api/poll/:id/vote").put(passport.authenticate(['oauth-bearer', 'anonymous'], { session: false }), votePoll);
        
        app.route("/api/poll/:id")
            .get(getPollInfo)
            .delete(passport.authenticate('oauth-bearer', { session: false }), deletePoll)
        ;
        
    };
    
}());
