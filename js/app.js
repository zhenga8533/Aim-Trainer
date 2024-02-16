class Target {
    constructor() {
        this.radius = 100;
    }
}


/**
 * Initialize game.
 */
let ticks = 0;
let lives = 100;
let score = 0;
const targets = [];

function updateGame() {
    const time = (ticks++) / 20;
    document.getElementById("time").innerText = time.toFixed(0);
    document.getElementById("speed").innerText = score / time;
    document.getElementById("lives").innerText = lives;
    document.getElementById("score").innerText = score;
}

const tick = setInterval(() => {
    updateGame()
}, 50);