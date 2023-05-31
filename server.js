const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const formatMsg = require('./utils/message');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//static server
app.use(express.static(path.join(__dirname,'public')))

//run when a client connects
const botName = "ChatME";

io.on('connection',socket=>{
    socket.on('joinChat',({username,room})=>{
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

        socket.emit('message',formatMsg(botName,'Welcome to ChatMe'));

        // broadcast when user connect
        socket.broadcast.to(user.room).emit('message',formatMsg(botName  ,`${user.username} Joined `));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        })
    
    })
    //chat message
    socket.on('chatMsg',message=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMsg(user.username  ,message))
    })

    //wehn client disconnect
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){

            io.to(user.room).emit( 'message',formatMsg(botName,`${user.username } left the chat`))
        }
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        })
    })
})



server.listen(3000,()=>{
    console.log('server is live on port 3000')
})