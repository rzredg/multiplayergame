// Generate random obstacles in the arena
function generateObstacles() {
    const arenaWidth = 800;
    const arenaHeight = 600;
    const obstacleCount = 10;

    const obstacles = [];

    for (let i = 0; i < obstacleCount; i++) {
        const width = Math.random() * 50 + 30;  // Random width between 30 and 80
        const height = Math.random() * 50 + 30; // Random height between 30 and 80
        const x = Math.random() * (arenaWidth - width);
        const y = Math.random() * (arenaHeight - height);

        obstacles.push({ x, y, width, height });
    }

    return obstacles;
}

// Initialize the game state with players, bullets, and obstacles
function initGame() {
    return {
        players: {},
        bullets: [],
        obstacles: generateObstacles(),
        powerUps: [],
        mapOpen: false,
    };
}

// Add a new player to the game
function addPlayer(id, state) {
    state.players[id] = {
        x: 100,
        y: 100,
        lives: 3,
        color: getRandomColor(),
        cooldown: 0,
    };
}

function removePlayer(id, state) {
    delete state.players[id];
}

// Update player movement based on WASD keys
function updatePlayer(id, movement, state) {
    const player = state.players[id];
    if (!player) return;

    const speed = 2;
    if (movement.up) player.y -= speed;
    if (movement.down) player.y += speed;
    if (movement.left) player.x -= speed;
    if (movement.right) player.x += speed;
}

// Shoot a bullet from the player's position
function shootBullet(id, state) {
    const player = state.players[id];
    if (!player || player.cooldown > 0) return;

    state.bullets.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(player.angle) * 5,
        vy: Math.sin(player.angle) * 5,
    });

    player.cooldown = 2 * 60; // Cooldown for 2 seconds
}

// Update the game state (bullets, players, etc.)
function updateGame(state) {
    // Update bullets
    for (const bullet of state.bullets) {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        // Check collisions with players or obstacles
    }

    // Reduce cooldowns
    for (const player of Object.values(state.players)) {
        if (player.cooldown > 0) player.cooldown--;
    }
}

// Helper function to generate random colors for players
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports = { initGame, addPlayer, updatePlayer, shootBullet, updateGame };