const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when user connects or reloads the page, it connects to the frontend file (script.js) thru a variable called socket
io.on('connection', socket => {
    // emit a message to client thru the server, make sure it's inside the io.on('connection')
    // emit requires 2 things, the event of message and the message itself inside quotes
    socket.emit('message', 'Welcome to our chatbot');

    //Broadcast when a user connects
    socket.broadcast.emit('message', 'A User Has Joined');

    //Notify all (io.emit()) when a user disconnects 
    socket.on('disconnect', () => {
        io.emit('message', 'A User Has Left!');  
    });

    //Listen for message from script.js and console log it in the terminal and display / append in the chat 
    socket.on('chatMessage', newMsgL => {
        socket.broadcast.emit('receivedMessage', newMsgL)
        console.log('Client sent:', newMsgL);
    });
    
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));