
var http = require('http');
var path = require('path');

var express = require('express');
var sassMiddleware = require('node-sass-middleware')

var router = express();
var server = http.createServer(router);

router.use(sassMiddleware({
    src: path.join(__dirname, "scss"),
    dest: path.join(__dirname, "client/css"),
    prefix: "/css",
    outputStyle: 'compressed',
    debug: true
}));

router.use(express.static(path.resolve(__dirname, 'client')));

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
