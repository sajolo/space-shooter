const readline = require('readline');

// Configuración inicial del juego
let playerPosition = { x: 10, y: 18 };
const enemies = [{ x: 5, y: 2, dir: 1 }, { x: 15, y: 4, dir: -1 }];
const bullets = [];
let gameInterval;

function updateGame() {
    // Mover enemigos
    enemies.forEach(enemy => {
        if (enemy.x === 0 || enemy.x === 19) enemy.dir *= -1; // Cambia de dirección al llegar al borde
        enemy.x += enemy.dir;
    });

    // Actualizar posición de las balas
    bullets.forEach(bullet => {
        bullet.y += 1; // Mover hacia abajo
    });

    // Verificar si alguna bala ha alcanzado al jugador
    const hitPlayer = bullets.some(bullet => bullet.x === playerPosition.x && bullet.y === playerPosition.y);
    if (hitPlayer) {
        endGame();
    }

    // Generar disparos enemigos aleatorios
    if (Math.random() < 0.1) { // Probabilidad de disparo
        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        bullets.push({ x: enemy.x, y: enemy.y + 1 });
    }

    // Borrar balas fuera del área de juego
    removeOffScreenBullets();
}

function removeOffScreenBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y > 20) { // Límite inferior de la pantalla
            bullets.splice(i, 1);
        }
    }
}

exports.startGame = function() {
    console.log('Space Shooter ASCII Iniciado');
    
    // Configurar la entrada del teclado
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            endGame();
        } else if (key.name === 'a') {
            playerPosition.x = Math.max(playerPosition.x - 1, 0);
        } else if (key.name === 'd') {
            playerPosition.x = Math.min(playerPosition.x + 1, 19);
        }
    });

    // Comenzar el bucle del juego
    gameInterval = setInterval(() => {
        updateGame();
        render();
    }, 200);
};

function endGame() {
    clearInterval(gameInterval);
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.removeAllListeners('keypress');
    console.log('Has sido alcanzado por una bala! Juego terminado. ¡Gracias por jugar!');
    process.exit(0);
}

function render() {
    console.clear();
    console.log('Space Shooter ASCII');
    
    for (let y = 0; y < 20; y++) {
        let line = '';
        for (let x = 0; x < 20; x++) {
            let char = ' ';
            if (x === playerPosition.x && y === playerPosition.y) {
                char = `^`; // Nave del jugador
            } else if (enemies.some(enemy => enemy.x === x && enemy.y === y)) {
                char = `/-^-\\`; // Enemigos
            } else if (bullets.some(bullet => bullet.x === x && bullet.y === y)) {
                char = '|'; // Balas
            }
            line += char;
        }
        console.log(line);
    }
}
