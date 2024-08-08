require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",  // Use CORS_ORIGIN from .env or default to "*"
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (room) => {
    socket.join(room); // Join the room with the provided key
    console.log(`Client joined room: ${room}`);
  });

  socket.on('message', ({ room, message }) => {
    console.log(`Message received in room ${room}: ${message}`);
    io.to(room).emit('message', message); // Emit to specific room
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 4000; // Use PORT from .env or default to 4000
server.listen(port, () => console.log(`Server running on port ${port}`));
