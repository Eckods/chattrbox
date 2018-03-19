var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
// Creates a websocket server at specified port
var ws = new WebSocketServer({
  port: port
});
// Holds log of messages
var messages = [];
var topic;

console.log('websockets server started');

// Prints msg on any connection event
ws.on('connection', function (socket) {
  console.log('client connection established');

  // If a topic has been established
  // sends appropriate message to newly connected user
  if (topic){
    socket.send(topic);
  }

  // Sends all previous messages to server on each new connection
  messages.forEach(function (msg) {
    socket.send(msg);
  });

  // Repeats data sent to server
  socket.on('message', function (data) {
    console.log('message received: ' + data);
    messages.push(data);
    
    // Send new messages to all users on every new message coming in
    ws.clients.forEach(function (clientSocket) {
      // Checks if first string entered is the command: '\topic'
      if (data.substring(0, 6) == '\\topic'){
        // Prints the topic name to connected users
        // and stores topic for new users
        clientSocket.send('*** Topic has changed to \'' + data.substring(7) + '\'');
        topic = '*** Topic is \'' + data.substring(7) + '\'';
      }
      else {
        clientSocket.send(data);
      }
    });

  });

});
