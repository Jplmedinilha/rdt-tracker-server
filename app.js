const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

const VALID_TOKEN = 'meu_token_secreto';

app.use(express.static(path.join(__dirname, 'public')));


io.on("connection", (socket) => {
    const token = socket.handshake.query.token;
    console.log(token)
    if (token != VALID_TOKEN) {
      return 
    }
    socket.on("updateInventory", (data) => {

      console.log(data)
      io.emit("inventoryUpdate", data); 
    });
  });
  

io.on('updateInventory', (socket) => {
  console.log(socket)
});

server.listen(3000, () => {
  console.log('Servidor ouvindo em http://localhost:3000');
});
