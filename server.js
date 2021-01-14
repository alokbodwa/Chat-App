const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users');
// const { connect } = require('http2');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'chatApp Bot';

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects, remember it's io.on
io.on('connection',socket => {
    socket.on('joinRoom',({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        
        // Welcome NewUser by the bot
        socket.emit('message', formatMessage(botName, 'Welcome to Chat App')); //will be shown to user only when connection is encountered. you may see the same in main.js

        // Broadcast when a user connects (except user)
        socket.broadcast.to(user.room).emit('message',formatMessage(botName, `${user.username} just joined the chat`));

        // Send Users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // // broadcast to all
    // io.emit()
    
    // listen for chatMessage
    socket.on('chatMessage',(msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage( `${user.username}`, msg));
    });

    // Runs when a client disconnects
    socket.on('disconnect',() => {
        const user = userLeaves(socket.id);
        if (user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has just left the chat`));
        
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    });


});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log (`server running on port ${PORT}`));



// start fromm 50 min 