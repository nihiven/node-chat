//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//

///
// if get port in use error
// killall -9 node and ps ax
///
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

var channels = [];
var messages = [];
var sockets = [];

// server config
var topic = "It's NoChat!";
var namedaddress = 'irc.nihiven.net';

io.on('connection', function (socket) {
    
    // irc related client attributes
    var irc = { registered: false,
                nick: '',
                channels: []
    };
    socket.irc = irc;
    
    // send topic to connecting user
    // TODO: send when user joins a channel
    socket.emit('topic', {nick: 'Server', text: topic});

    // send initical messages
    messages.forEach(function (data) {
      socket.emit('privmsg', data);
    });
    
    // add new socket to stack
    sockets.push(socket);

    ////////////////////////////////////////////////
    // USER RELATED FUNCTIONS

    ////////////////////
    // User Registration
    // user is considered registered when NICK and USER are received
    
    // CAP - client request capabilities from server
    // not used for now
    
    // PASS - provide password for connection
    // will be handled with user login management
    
    // NICK - change user nickname
    // TODO: check existing users for nickname exist
    // required part of a user becoming registered
    // errors: ERR_NONICKNAMEGIVEN ERR_ERRONEUSNICKNAME ERR_NICKNAMEINUSE ERR_NICKCOLLISION
    socket.on('nick', function (newnick) {

      if (newnick !== '') {
        // only use the first parameter
        newnick = newnick.split(' ').splice(0,1);

        if (socket.irc.nick !== newnick) {
          var message = socket.irc.nick + ' is now known as ' + newnick;
          
          // don't broadcast on initial nick change
          if (String(socket.irc.nick || '') !== '')
            broadcast('privmsg', {nick: 'Server', text: message});
            
          socket.set('nick', newnick, function (err) {
            updateRoster();
            socket.irc.nick = newnick;
          });
        }
      }
    });
    
    // USER - provide user and real name
    // required part of a user becoming registered


    // define disconnect command
    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    // define whois
    socket.on('whois',function(data) {
        console.log(socket.irc.nick);
    });

    ////////////////////////////////////////////////
    // CHANNEL RELATED FUNCTIONS

    // define topic
    // TODO: apply to channel
    socket.on('topic',function(data) {
      if (data !== '') {
        topic = data;
        broadcast('topic', {nick: socket.irc.nick, text: topic});
      }
    });

    // define privmsg - applies to both channel and user
    socket.on('privmsg', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('nick', function (err, nick) {
        var data = {
          nick: nick,
          text: text
        };

        broadcast('privmsg', data);
        messages.push(data);
      });
    });
  });

// server functions
function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('nick', callback);
    },
    function (err, nicks) {
      broadcast('roster', nicks);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3001, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Let's get faded at", addr.address + ":" + addr.port);
});

