const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const gameLogic = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});