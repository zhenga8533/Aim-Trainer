/**
 * Initialize global game variables.
 */
const targets = [];
let ticks = 0;
let lives = 0;
let score = 0;
let paused = false;
let start = false;
let end = false;
let tick = undefined;

// Set canvas size and rendering
const HEADER_HEIGHT = window.innerHeight * 0.1;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight * 0.88;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.style.width = WIDTH + "px";
canvas.style.height = HEIGHT + "px";
const scale = window.devicePixelRatio;
canvas.width = WIDTH * scale;
canvas.height = HEIGHT * scale;

// Normalize coordinate system to use css pixels.
ctx.imageSmoothingEnabled = false;
ctx.scale(scale, scale);

class Target {
    /**
     * Target object.
     * 
     * @param {Target[]} targets 
     */
    constructor() {
        this.radius = 25;
        this.x = Math.random() * (WIDTH - 2 * this.radius) + this.radius;
        this.y = Math.random() * (HEIGHT - 2 * this.radius) + this.radius;
        this.color = 'red';
        targets.push(this);
        this.update();
    }

    /**
     * Shrink target and redraw every tick. Removes any target with radius of 0.
     */
    update() {
        this.radius -= 0.05;
        if (this.radius <= 0) {
            const index = targets.indexOf(this);
            targets.splice(index, 1);
            lives--;
        } else this.draw();
    }

    /**
     * Draws target onto canvas.
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2 / 3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius / 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    /**
     * Removes target when clicked on.
     */
    onClick() {
        score++;
        const index = targets.indexOf(this);
        targets.splice(index, 1);
    }
}

/**
 * Resets all variables to default and registers tick interval.
 */
function startGame() {
    document.getElementById("start").style.display = "none";
    document.getElementById("end").style.display = "none";
    targets.length = 0;
    ticks = 0;
    lives = 100;
    score = 0;
    paused = false;
    start = true;
    end = false;
    tick = setInterval(() => {
        if (!paused) updateGame();
    }, 50);
}

function endGame() {
    clearInterval(tick);
    document.getElementById("end").style.display = "block";
}

/**
 * Function to update t
 */
function updateGame() {
    // Create new targets every 7 ticks (350ms)
    if (ticks % 7 === 0) {
        new Target(targets);
    }

    // Redraw board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    targets.forEach(target => {
        target.radius -= 0.1;
        target.update();
    });

    // End game when lives run out
    if (lives <= 0) endGame();

    // Update stats display
    const time = (ticks++) / 20;
    document.getElementById("time").innerText = time.toFixed(0);
    document.getElementById("speed").innerText = (score / time).toFixed(2);
    document.getElementById("lives").innerText = lives;
    document.getElementById("score").innerText = score;
}

/**
 * Register mouse listener.
 */
canvas.addEventListener('click', event => {
    if (!start) startGame();
    if (paused) return;

    // Check pos of mouse click
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if any target was clicked on
    targets.forEach(target => {
        const dx = mouseX - target.x;
        const dy = mouseY - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < target.radius) target.onClick();
    });
});

/**
 * Register keyboard listener.
 */
document.addEventListener('keydown', event => {
    if (event.key === 'p') paused = !paused;
    switch (event.key) {
        case 'p':
            paused = !paused;
            break;
        case 'r':
            break;
    }
});
