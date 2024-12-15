const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const startButton = document.getElementById('start-button');
const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');

let score = 0;
let lives = 3;
let isGameRunning = false;

const spaceship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 7,
    dx: 0
};

const bullets = [];
const enemies = [];
const enemySpeed = 2;

function drawSpaceship() {
    ctx.fillStyle = 'white';
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function moveSpaceship() {
    spaceship.x += spaceship.dx;

    if (spaceship.x < 0) {
        spaceship.x = 0;
    } else if (spaceship.x + spaceship.width > canvas.width) {
        spaceship.x = canvas.width - spaceship.width;
    }
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;

        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function shootBullet() {
    // Wystrzelenie dwóch laserów z lewej i prawej strony statku
    bullets.push({
        x: spaceship.x + 5, // lewy laser
        y: spaceship.y,
        width: 10,
        height: 20,
        speed: 7
    });
    bullets.push({
        x: spaceship.x + spaceship.width - 15, // prawy laser
        y: spaceship.y,
        width: 10,
        height: 20,
        speed: 7
    });
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemySpeed;

        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            lives--;
            updateLives();
            if (lives <= 0) {
                gameOver();
            }
        }

        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(index, 1);
                score++;
                updateScore();
            }
        });
    });
}

function spawnEnemy() {
    const x = Math.random() * (canvas.width - 50);
    enemies.push({
        x: x,
        y: -50,
        width: 50,
        height: 50
    });
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function updateLives() {
    livesDisplay.textContent = lives;
}

function gameOver() {
    isGameRunning = false;
    alert('Koniec gry! Zdobyte punkty: ' + score);
    resetGame();
}

function resetGame() {
    score = 0;
    lives = 3;
    updateScore();
    updateLives();
    enemies.length = 0;
    bullets.length = 0;
}

function gameLoop() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSpaceship();
    moveSpaceship();
    drawBullets();
    drawEnemies();

    requestAnimationFrame(gameLoop);
}

function startGame() {
    isGameRunning = true;
    gameContainer.style.display = 'block';
    mainMenu.style.display = 'none';
    spawnEnemy();
    setInterval(spawnEnemy, 1000);
    gameLoop();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        spaceship.dx = spaceship.speed;
    } else if (e.key === 'ArrowLeft') {
        spaceship.dx = -spaceship.speed;
    } else if (e.key === ' ') {
        shootBullet();
    }
});

document.addEventListener('keyup', () => {
    spaceship.dx = 0;
});

startButton.addEventListener('click', startGame);
