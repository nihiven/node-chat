{"changed":true,"filter":false,"title":"server.js","tooltip":"/server.js","value":"//\n// # SimpleServer\n//\n// A simple chat server using Socket.IO, Express, and Async.\n//\n\n///\n// if get port in use error\n// killall -9 node and ps ax\n///\nvar http = require('http');\nvar path = require('path');\n\nvar async = require('async');\nvar socketio = require('socket.io');\nvar express = require('express');\n\n//\n// ## SimpleServer `SimpleServer(obj)`\n//\n// Creates a new instance of SimpleServer with the following options:\n//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.\n//\nvar router = express();\nvar server = http.createServer(router);\nvar io = socketio.listen(server);\n\nrouter.use(express.static(path.resolve(__dirname, 'client')));\n\nvar channels = [];\nvar messages = [];\nvar sockets = [];\n\n// server config\nvar topic = \"It's NoChat!\";\nvar namedaddress = 'irc.nihiven.net';\n\nio.on('connection', function (socket) {\n    \n    // irc related client attributes\n    var irc = { registered: false,\n                nick: '',\n                channels: []\n    };\n    socket.irc = irc;\n    \n    // send topic to connecting user\n    // TODO: send when user joins a channel\n    socket.emit('topic', {nick: 'Server', text: topic});\n\n    // send initical messages\n    messages.forEach(function (data) {\n      socket.emit('privmsg', data);\n    });\n    \n    // add new socket to stack\n    sockets.push(socket);\n\n    ////////////////////////////////////////s////////\n    // USER RELATED FUNCTIONS\n\n    ////////////////////\n    // User Registration\n    // user is considered registered when NICK and USER are received\n    \n    // CAP - client request capabilities from server\n    // not used for now\n    \n    // PASS - provide password for connection\n    // will be handled with user login management\n    \n    // NICK - change user nickname\n    // TODO: check existing users for nickname exist\n    // required part of a user becoming registered\n    // errors: ERR_NONICKNAMEGIVEN ERR_ERRONEUSNICKNAME ERR_NICKNAMEINUSE ERR_NICKCOLLISION\n    socket.on('nick', function (newnick) {\n\n      if (newnick !== '') {\n        // only use the first parameter\n        newnick = newnick.split(' ').splice(0,1);\n\n        if (socket.irc.nick !== newnick) {\n          var message = socket.irc.nick + ' is now known as ' + newnick;\n          \n          // don't broadcast on initial nick change\n          if (String(socket.irc.nick || '') !== '')\n            broadcast('privmsg', {nick: 'Server', text: message});\n            \n          socket.set('nick', newnick, function (err) {\n            updateRoster();\n            socket.irc.nick = newnick;\n          });\n        }\n      }\n    });\n    \n    // USER - provide user and real name\n    // required part of a user becoming registered\n\n\n    // define disconnect command\n    socket.on('disconnect', function () {\n      sockets.splice(sockets.indexOf(socket), 1);\n      updateRoster();\n    });\n\n    // define whois\n    socket.on('whois',function(data) {\n        console.log(socket.irc.nick);\n    });\n\n    ////////////////////////////////////////////////\n    // CHANNEL RELATED FUNCTIONS\n\n    // define topic\n    // TODO: apply to channel\n    socket.on('topic',function(data) {\n      if (data !== '') {\n        topic = data;\n        broadcast('topic', {nick: socket.irc.nick, text: topic});\n      }\n    });\n\n    // define privmsg - applies to both channel and user\n    socket.on('privmsg', function (msg) {\n      var text = String(msg || '');\n\n      if (!text)\n        return;\n\n      socket.get('nick', function (err, nick) {\n        var data = {\n          nick: nick,\n          text: text\n        };\n\n        broadcast('privmsg', data);\n        messages.push(data);\n      });\n    });\n  });\n\n// server functions\nfunction updateRoster() {\n  async.map(\n    sockets,\n    function (socket, callback) {\n      socket.get('nick', callback);\n    },\n    function (err, nicks) {\n      broadcast('roster', nicks);\n    }\n  );\n}\n\nfunction broadcast(event, data) {\n  sockets.forEach(function (socket) {\n    socket.emit(event, data);\n  });\n}\n\nserver.listen(process.env.PORT || 3001, process.env.IP || \"0.0.0.0\", function(){\n  var addr = server.address();\n  console.log(\"Let's get faded at\", addr.address + \":\" + addr.port);\n});\n\n","undoManager":{"mark":99,"position":100,"stack":[[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":15},"end":{"row":71,"column":16}},"text":"h"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":16},"end":{"row":71,"column":17}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":17},"end":{"row":71,"column":18}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":18},"end":{"row":71,"column":19}},"text":"g"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":19},"end":{"row":71,"column":20}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":20},"end":{"row":71,"column":21}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":21},"end":{"row":71,"column":22}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":22},"end":{"row":71,"column":23}},"text":"s"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":23},"end":{"row":71,"column":24}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":24},"end":{"row":71,"column":25}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":25},"end":{"row":71,"column":26}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":26},"end":{"row":71,"column":27}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":27},"end":{"row":71,"column":28}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":28},"end":{"row":71,"column":29}},"text":"c"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":29},"end":{"row":71,"column":30}},"text":"k"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":30},"end":{"row":71,"column":31}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":31},"end":{"row":71,"column":32}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":32},"end":{"row":71,"column":33}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":71,"column":33},"end":{"row":71,"column":34}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":11},"end":{"row":95,"column":12}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":12},"end":{"row":95,"column":13}},"text":"-"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":13},"end":{"row":95,"column":14}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":14},"end":{"row":95,"column":15}},"text":"p"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":15},"end":{"row":95,"column":16}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":16},"end":{"row":95,"column":17}},"text":"o"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":17},"end":{"row":95,"column":18}},"text":"v"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":18},"end":{"row":95,"column":19}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":19},"end":{"row":95,"column":20}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":20},"end":{"row":95,"column":21}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":21},"end":{"row":95,"column":22}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":22},"end":{"row":95,"column":23}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":23},"end":{"row":95,"column":24}},"text":"s"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":24},"end":{"row":95,"column":25}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":25},"end":{"row":95,"column":26}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":26},"end":{"row":95,"column":27}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":27},"end":{"row":95,"column":28}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":28},"end":{"row":95,"column":29}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":29},"end":{"row":95,"column":30}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":30},"end":{"row":95,"column":31}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":31},"end":{"row":95,"column":32}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":32},"end":{"row":95,"column":33}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":33},"end":{"row":95,"column":34}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":34},"end":{"row":95,"column":35}},"text":"l"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":35},"end":{"row":95,"column":36}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":36},"end":{"row":95,"column":37}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":37},"end":{"row":95,"column":38}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":38},"end":{"row":95,"column":39}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":39},"end":{"row":95,"column":40}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":95,"column":40},"end":{"row":96,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":96,"column":0},"end":{"row":96,"column":4}},"text":"    "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":96,"column":4},"end":{"row":96,"column":5}},"text":"/"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":96,"column":5},"end":{"row":96,"column":6}},"text":"/"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":96,"column":6},"end":{"row":96,"column":7}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":72,"column":52},"end":{"row":73,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":73,"column":0},"end":{"row":73,"column":4}},"text":"    "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":4},"end":{"row":73,"column":5}},"text":"/"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":5},"end":{"row":73,"column":6}},"text":"/"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":6},"end":{"row":73,"column":7}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":7},"end":{"row":73,"column":8}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":8},"end":{"row":73,"column":9}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":9},"end":{"row":73,"column":10}},"text":"q"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":10},"end":{"row":73,"column":11}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":11},"end":{"row":73,"column":12}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":12},"end":{"row":73,"column":13}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":13},"end":{"row":73,"column":14}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":14},"end":{"row":73,"column":15}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":15},"end":{"row":73,"column":16}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":16},"end":{"row":73,"column":17}},"text":"p"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":17},"end":{"row":73,"column":18}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":18},"end":{"row":73,"column":19}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":19},"end":{"row":73,"column":20}},"text":"t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":20},"end":{"row":73,"column":21}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":21},"end":{"row":73,"column":22}},"text":"o"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":22},"end":{"row":73,"column":23}},"text":"f"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":23},"end":{"row":73,"column":24}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":24},"end":{"row":73,"column":25}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":25},"end":{"row":73,"column":26}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":26},"end":{"row":73,"column":27}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":27},"end":{"row":73,"column":28}},"text":"s"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":28},"end":{"row":73,"column":29}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":29},"end":{"row":73,"column":30}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":30},"end":{"row":73,"column":31}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":31},"end":{"row":73,"column":32}},"text":"b"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":32},"end":{"row":73,"column":33}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":33},"end":{"row":73,"column":34}},"text":"c"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":34},"end":{"row":73,"column":35}},"text":"o"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":35},"end":{"row":73,"column":36}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":36},"end":{"row":73,"column":37}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":37},"end":{"row":73,"column":38}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":38},"end":{"row":73,"column":39}},"text":"g"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":39},"end":{"row":73,"column":40}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":40},"end":{"row":73,"column":41}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":41},"end":{"row":73,"column":42}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":42},"end":{"row":73,"column":43}},"text":"g"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":43},"end":{"row":73,"column":44}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":44},"end":{"row":73,"column":45}},"text":"s"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":45},"end":{"row":73,"column":46}},"text":"t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":46},"end":{"row":73,"column":47}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":47},"end":{"row":73,"column":48}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":48},"end":{"row":73,"column":49}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":73,"column":49},"end":{"row":73,"column":50}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":97,"column":4},"end":{"row":97,"column":7}},"text":"// "},{"action":"insertText","range":{"start":{"row":97,"column":4},"end":{"row":97,"column":50}},"text":"// required part of a user becoming registered"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":58,"column":44},"end":{"row":58,"column":45}},"text":"s"}]}]]},"ace":{"folds":[],"customSyntax":"javascript","scrolltop":165,"scrollleft":0,"selection":{"start":{"row":91,"column":13},"end":{"row":91,"column":13},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":10,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1410208461996}