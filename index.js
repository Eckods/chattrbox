var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var mime = require('mime');
var wss = require('./websockets-server');

// Display a special error page
var handleError = function (err, res) {
  res.writeHead(404, {'Content-Type': 'text/html'});

  // Get readable stream from custom error page
  var file = fs.createReadStream('./app/error.html');

  // Write readable stream to response object (writeable stream)
  file.pipe(res);
}

var server = http.createServer(function (req, res) {
  console.log('Responding to a request.');

  var filePath = extract(req.url);
  fs.readFile(filePath, function (err, data) {
    // File not found so throw error
    if (err) {
      handleError(err, res);
      return;
    } else { // Otherwise display file
      // Get content type from mime
      const contentType = mime.getType(filePath);

      // Set the content type header
      res.setHeader('Content-Type', contentType);
      res.end(data);
    }
  });
});

server.listen(3000);
