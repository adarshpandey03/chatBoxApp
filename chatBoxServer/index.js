 const app = require('express')();
 const bodyParser= require('body-parser');
 var http = require('http').Server(app);
 var io = require('socket.io')(http);
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}))
 var users = [] ;
 var username = "";
 var that = this;
 
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
   var userSocketSchema = new mongoose.Schema({
    username: String,
    socketId: String
   },{collection: 'SOCKET_DETAIL'});
   var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    state: String,
    image: String
   },{collection: 'USER'});
var Chats = mongoose.model('chats', chatSchema);
var LoginAuthentication = mongoose.model('USER', userSchema);
var socketDetails = mongoose.model('SOCKET_DETAIL', userSocketSchema);

// Socket IO  / Messaging Part
io.on('connection', function(socket){
    console.log('a user connected = ' + that.username);
    console.log("socket.id = " + socket.id);
    let newUserSocketDetails = new socketDetails({"username":that.username, "socketId":socket.id});
    newUserSocketDetails.save(function(error, user){

    });
    io.emit("user joined", that.username);
    LoginAuthentication.find({"state":"active"} , function(error, users){
      let activeUsers = [];
      for(let i = 0; i < users.length; i++){
        activeUsers.push(users[i]);
      }
      io.emit('emit users', activeUsers);
    });
    LoginAuthentication.find( {}, function(error, AllUsers){
      let allUsers = [];
      for(let i = 0; i < AllUsers.length; i++){
        allUsers.push(AllUsers[i]);
      }
      io.emit('emit relevant users', allUsers);
    });
    socket.on('new message',function(data){
        console.log('Data from new message : ' + data);
        Chats.create(data, function(err, todo){
            if(err) console.log(err);
          });
        io.emit('emit message', data);
    });
    socket.on('new individual message',function(data){
      console.log('Data from new message : ' + data);
      socketDetails.findOne({"username":data.toUser}, function(error, user){
        
        if(user != null){
          console.log(data.toUser + "    " +  user.socketId);
          io.to(user.socketId).emit('emit individual message', data);
        }
      });
      Chats.create(data, function(err, todo){
          if(err) console.log(err);
        });
  });
    socket.on('disconnect',function(){
        console.log('a user disconnected  = ' + socket.id);
        socketDetails.findOne({"socketId":socket.id}, function(error, user){
          LoginAuthentication.update({"username":user.username},{"state":"inactive"},function(error, userUpdated){
          LoginAuthentication.find({"state":"active"} , function(error, users){
            let activeUsers = [];
            for(let i = 0; i < users.length; i++){
              activeUsers.push(users[i]);
            }
            io.emit('emit users', activeUsers);
            console.log("User Left = " + user.username);
            io.emit("user left", user.username);
            socketDetails.remove({"socketId":socket.id}, function(error, user){});
          });
          LoginAuthentication.find( {}, function(error, AllUsers){
            let allUsers = [];
            for(let i = 0; i < AllUsers.length; i++){
              allUsers.push(AllUsers[i]);
            }
            io.emit('emit relevant users', allUsers);
          });
        });
        });
        
    });
  });
  io.on('connection', function(socket){
       socket.on('add user',function(user){
        console.log('New User added : ' + user);
        if(!users.includes(user)){
        users.push(user);
        }
        // io.emit('emit users', users);
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
          that.username = user.username;
          LoginAuthentication.update({"username":user.username},{"state":"active"},function(error, userUpdated){
            console.log("User After Update = " + userUpdated);
          });
          res.send(user);
        }

      }
    })
  });
  app.post('/checkUsernameAvailability', function(req, res){
    console.log("req.body.username => " + req.body.username);
    LoginAuthentication.findOne({
      username: req.body.username
    }, function(err, user){
      if(!user){
        console.log('Username available');
        res.send("500");
      }
      else{
          console.log("LoginAuthentication => " + user.username);
          res.send("200");
        }
    })
  });
  app.post('/signUp', function(req, res){
    console.log("signUpreq.body.username => " + req.body.username);
    console.log("signUpreq.body.password => " + req.body.password);
    console.log("signUpreq.body.image => " + req.body.image);
    // req.body.image = new Buffer(req.body.image, "base64");
    let newUser = new LoginAuthentication(req.body)
    newUser.save(function(err, user){
      if(!user){
        console.log('Not able to create account');
        res.send("500");
      }
      else{
          console.log("signUp LoginAuthentication => " + user.username);
          res.send("200");
        }
    });
  });
http.listen(3000, function(){
  console.log('listening on *:3000');
});
