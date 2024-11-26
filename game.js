const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameState = null;
let keys = {};

document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function sendMovement() {
    const movement = {
        up: keys['w'],
        down: keys['s'],
        left: keys['a'],
        right: keys['d'],
    };
    socket.emit('playerMove', movement);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        socket.emit('shoot');
    }
});

socket.on('gameState', (state) => {
    gameState = state;
    renderGame();
});

function renderGame() {
    if (!gameState) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw players
    for (const player of Object.values(gameState.players)) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, 20, 20);
    }

    // Draw bullets
    for (const bullet of gameState.bullets) {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 5);
    }

    // Draw obstacles and power-ups (add logic here)
}

function gameLoop() {
    sendMovement();
    requestAnimationFrame(gameLoop);
}

gameLoop();