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
var AnonymousStrategy = require('passport-anonymous').Strategy;

app.use(passport.initialize());
passport.use(new AnonymousStrategy());
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

var storage = require("./poll-crud.js");
storage.register(app);

app.use(express.static(path.resolve(__dirname, 'client')));

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
