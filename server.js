var http = require('http');
var port = 18080;
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('')
    res.write('<!doctype html>'+
    '<html>'+
    '<head>'+
    '<meta charset="utf-8"/>'+
    '<title>连续</title>'+
    '</head>'+
    '<body>'+
    '<h1>我要玩转node与mongodb</h1>'+
    '<h3>我是连续</h3>'+
    '</body>'+
    '</html>');
    res.end();
}).listen(port);
