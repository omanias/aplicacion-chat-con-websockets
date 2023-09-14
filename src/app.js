const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { Server } = require("socket.io");
const handlebars = require('express-handlebars');
// const Swal = require('sweetalert2');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Configuración de handlebars
app.engine("handlebars", handlebars.engine())
//Usa la carpeta views como carpeta de vistas
app.set("views", __dirname + "/views")
//Usa handlebars como motor de plantillas
app.set("view engine", "handlebars")
//Usa los archivos dentro de la carpeta views
app.use(express.static(__dirname, + "/views"))
//Usa los archivos dentro de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

//Ruta de la página principal
app.get('/', (req, res) => {
    res.render('index.hbs');
});


const users = {};

//Socket.io
io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('newUser', (username) => {
        users[socket.id] = username;
        io.emit('userConnected', username);
    });

    socket.on('chatMessage', (message) => {
        const username = users[socket.id];
        io.emit('message', { username, message });
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('userDisconnected', username);
    });
});

//Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});