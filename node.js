const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {    
        origin: "https://chatio-ferlr.netlify.app",    
}})

var num_usr = 0;
var msgs = [];
var usrs = [];


//EVENTO CONEXION
io.on('connection', (socket) => { 
    console.log('conexion');
    //EVENTO LOGIN
    socket.on('login', (usrdata)=>{
        //EMISION USUARIOS
        socket.emit('users', usrs);

        //CREAMOS EL USUARIO Y LO GUARDAMOS
        num_usr++;
        socket.nickname = usrdata.nickname;
        socket.estado = usrdata.estado;
        socket.avatar = usrdata.avatar;
        socket.id = num_usr;
        usrs[socket.id] = {nickname: socket.nickname, estado: socket.estado, avatar: socket.avatar};

        //EMISION WELCOME
        io.emit('welcomep', {msg: 'welcomep', name: socket.nickname, estado: socket.estado, avatar: socket.avatar});
        msgs.push({msg: 'welcomep', name: socket.nickname});

        //EVENTO HOLA
        socket.on('holap', (msg) => {   
            //CREAMOS UN SOBRE CON LOS DATOS DEL MENSAJE Y LO ENVIAMOS A LOS USUARIOS 
            let envelope = {msg: msg, name: socket.nickname}
            console.log('author: ' + envelope.name + " |msg: " + envelope.msg); 
            msgs.push(envelope);
            //EMISION ADIOS
            io.emit('adiop', envelope);
        });
    });

    //EVENTO DESCONEXION
    socket.on('disconnect', () => {
        //SE CIOMPRUEBA QUE LA DESCONEXION SE HAYA REALIZADO TRAS UN LOGEO
        if(usrs[socket.id]){
            //ELIMINAMOS AL USUARIO
            usrs[socket.id] = null;
            
            //EMISION BYEBYE
            io.emit('byebyep', {msg: 'byebyep', name: socket.nickname});
            msgs.push({msg: 'byebyep', name: socket.nickname});
        }
    });
});

server.listen(process.env.PORT || 3000, () => {  
    console.log('listening on *:3000');
});
