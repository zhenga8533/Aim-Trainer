/**
 * Initialize game.
 */
let ticks = 0;
let lives = 100;
let score = 0;
const targets = [];

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
console.log(canvas.width);

// Normalize coordinate system to use css pixels.
ctx.imageSmoothingEnabled = false;
ctx.scale(scale, scale);

class Target {
    /**
     * 
     * @param {Target[]} targets 
     */
    constructor() {
        this.radius = 10;
        this.x = Math.random() * (WIDTH - 2 * this.radius) + this.radius;
        this.y = Math.random() * (HEIGHT - 2 * this.radius) + this.radius;
        this.color = 'red';
        targets.push(this);
        this.draw();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    onClick() {
        score++;
        const index = targets.indexOf(this);
        targets.splice(index, 1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        targets.forEach(target => target.draw());
    }
}

function updateGame() {
    // Create new targets 7
    if (ticks % 7 === 0) {
        new Target(targets)
    }

    // Update stats display
    const time = (ticks++) / 20;
    document.getElementById("time").innerText = time.toFixed(0);
    document.getElementById("speed").innerText = (score / time).toFixed(2);
    document.getElementById("lives").innerText = lives;
    document.getElementById("score").innerText = score;
}

const tick = setInterval(() => {
    updateGame()
}, 50);

canvas.addEventListener('click', function (event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    targets.forEach(function (target) {
        let dx = mouseX - target.x;
        let dy = mouseY - target.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < target.radius) {
            target.onClick();
        }
    });
});
