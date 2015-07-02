var http = require('http');
var port = 18080;
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>连续</h1>');
    res.end('<p>我要玩转 node 与 mongodb !</p>');
}).listen(port);
