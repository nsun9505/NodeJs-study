var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8081;

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.once('open', function(){
    //CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
})
db.on('error', console.error);

mongoose.connect('mongodb://root:root@localhost:27017/test?authSource=admin');
var Book = require('./models/book');

var server = app.listen(port, function(){
    console.log("Server has started on port" + port);
})

var router = require('./routes')(app, Book);