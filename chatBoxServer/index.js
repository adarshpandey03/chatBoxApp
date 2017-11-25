 const app = require('express')();
 const bodyParser= require('body-parser');
 var http = require('http').Server(app);
 var io = require('socket.io')(http);
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}))
 var users = [] ;
 
 // Db Connection
 var mongoose = require('mongoose');
 var mongoDB = 'mongodb://127.0.0.1/Chatbox';
 mongoose.connect(mongoDB, {
     useMongoClient: true
 });
 var db = mongoose.connection;
 db.on('open', console.error.bind(console, 'MongoDB connection open:'));
 db.on('error', console.error.bind(console, 'MongoDB connection error:'));
 var chatSchema = new mongoose.Schema({
    username: String,
    message: String
   });
   var loginAuthentication = new mongoose.Schema({
    username: String,
    password: String
   },{collection: 'loginAuthentication'});
var Chats = mongoose.model('chats', chatSchema);
var LoginAuthentication = mongoose.model('loginAuthentication', loginAuthentication);

// Socket IO  / Messaging Part
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('new message',function(data){
        console.log('Data from new message : ' + data);
        Chats.create(data, function(err, todo){
            if(err) console.log(err);
          });
        io.emit('emit message', data);
    });
    socket.on('disconnect',function(){
        console.log('a user disconnected');
    });
  });
  io.on('connection', function(socket){
       socket.on('add user',function(user){
        console.log('New User added : ' + user);
        if(!users.includes(user)){
        users.push(user);
        }
        io.emit('emit users', users);
    });
  });

// Express JS client-server communication  
app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });
app.post('/userAuthentication', function(req, res){
    console.log("req.body.username => " + req.body.username);
    console.log("req.body.password => " + req.body.password);
    LoginAuthentication.findOne({
      username: req.body.username
    }, function(err, user){
      if(!user){
        console.log('Authentication failed. User not found');
        res.send("500");
      }
      else if(user){
        if(user.password != req.body.password){
          console.log('Authentication failed. Wrong password');
          res.send("500");
        }
        else{
          console.log("LoginAuthentication => " + user.username);
          console.log("LoginAuthentication => " + user.password);
          var token = 200;
          res.send("200");
        }

      }
    })
  });
http.listen(4000, function(){
  console.log('listening on *:3000');
});
