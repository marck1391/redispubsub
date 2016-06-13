require('./config')
var port = process.env.PORT||3000;
var express = require('express');
var redis = require('redis')

var pub = redis.createClient(redisurl)
var sub = redis.createClient(redisurl)

var app = express();

app.set('view engine', 'ejs')
app.get('/', function(req, res){
  res.render('index', {port: port})
})

var server = app.listen(port, function(err){
  console.log('Listening on localhost:%d', server.address().port)
})

var io = require('socket.io')(server);
sub.subscribe('chat')
io.on('connection', function(socket){
  socket.on('message', function(data){
    console.log(data);
    pub.publish('chat', JSON.stringify(data))
  })

  sub.on('message', function(channel, data){
    socket.emit(channel, JSON.parse(data))
  })
})
