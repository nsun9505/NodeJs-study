var events = require('events');

var eventEmitter = new events.EventEmitter();

var connectHandler = function connect(){
    console.log("Connection Successful");

    eventEmitter.emit('data_received');
}

eventEmitter.on('connection', connectHandler);

eventEmitter.on('data_received', function(){
    console.log("Data Recevied");
})


eventEmitter.emit('connection');