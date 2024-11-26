const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const gameLogic = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Use the PORT environment variable provided by Render, or default to 3000
const PORT = process.env.PORT || 3000;

app.use(express.static('client'));

const FPS = 60;
const gameState = gameLogic.initGame();

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    gameLogic.addPlayer(socket.id, gameState);

    socket.on('playerMove', (movement) => {
        gameLogic.updatePlayer(socket.id, movement, gameState);
    });

    socket.on('shoot', () => {
        gameLogic.shootBullet(socket.id, gameState);
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        gameLogic.removePlayer(socket.id, gameState);
    });
});

setInterval(() => {
    gameLogic.updateGame(gameState);
    io.emit('gameState', gameState);
}, 1000 / FPS);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});