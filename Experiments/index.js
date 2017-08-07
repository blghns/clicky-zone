var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (req, res) {
  console.log(req.url);
  if(req.url === "/")
    req.url = "/index.html"
  var file = path.join(__dirname, req.url);
  if(fs.existsSync(file))
    fs.readFile(file, function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
}).listen(80);