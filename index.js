const gameEngine = require('./gameEngine');

console.log('Bienvenido al Space Shooter. Usa las teclas A y D para moverte a izquierda y derecha.');
setTimeout(gameEngine.startGame, 4000);