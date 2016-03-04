require('dotenv').config({silent: true});

var http = require('http');
var path = require('path');

var mongoose = require("mongoose");
var driver = process.env.MONGO_URI;
mongoose.connect(driver);

var express = require('express');
var sassMiddleware = require('node-sass-middleware');

var bodyParser = require('body-parser');
var passport = require('passport');

var app = express();
var server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var passport = require('passport');
var OIDCBearerStrategy = require('passport-azure-ad').BearerStrategy;

app.use(passport.initialize());
passport.use(new OIDCBearerStrategy({
  "identityMetadata": "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
  "audience": process.env.APP_ID,
  "validateIssuer": false,
}, function (token, done) {
	return done(null, token, null);
}));

app.use(sassMiddleware({
    src: path.join(__dirname, "scss"),
    dest: path.join(__dirname, "client/css"),
    prefix: "/css",
    outputStyle: 'compressed',
    debug: false
}));

app.route("/api/whoami").get(passport.authenticate('oauth-bearer', { session: false }), function (req, res) {
	res.json({name: req.user.name, email: req.user.email});
});

var Poll = require("./model/polls");

app.route("/api/polls.json").get(function (req, res) {
    console.log("Get all polls");
	  Poll.find(function(err, polls) {
	    if (err) res.status(500).send(err);
	    else {
	      res.json(polls);
	    }
	  });
  })
;

app.route("/api/poll/new").post(passport.authenticate('oauth-bearer', { session: false }), function (req, res) {
    console.log("New poll");

    var poll = {
      ownerName: req.user.name,
      ownerEmail: req.user.email,
      title: req.body.title,
      results: []
    };
    
    req.body.options.forEach(function(o){
      if (o) {
        poll.results.push([o, 0]);
      }
    });
    Poll.create(poll, function(err, obj) {
      if (err) res.status(500).send(err);
      else res.json({status: "ok", id: obj._id});
    });
  });

app.route("/api/poll/:id")
  .get(function (req, res) {
    console.log("Get poll " + req.params.id);
    Poll.findById(req.params.id, function(err, doc){
      if (err) res.status(500).send(err);
      else res.json(doc);
    });
  })
  .put(passport.authenticate('oauth-bearer', { session: false }), function (req, res) {
    console.log("Update poll " + req.param.id);
	  res.json({ status: "ok" });
  })
  .delete(passport.authenticate('oauth-bearer', { session: false }), function (req, res) {
    console.log("Delete poll " + req.param.id);
	  res.json({ status: "ok" });
  })
;

app.use(express.static(path.resolve(__dirname, 'client')));

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
