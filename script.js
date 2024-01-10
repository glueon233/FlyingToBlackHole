const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 960;

// 加载小鸟和天空的图片
const birdImage = new Image();
birdImage.src = 'hk.png'; // 小鸟的图片路径
const skyImage = new Image();
skyImage.src = 'sky.jpg'; // 天空的图片路径

let bird = {
    x: 50,
    y: 360,
    width: 128,
    height: 128,
    gravity: 0.98,
    lift: -100,
    velocity: 0
};

let pipes = [];
let pipeWidth = 50;
let gap = 600;
let frame = 0;

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.velocity *= 0.6;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height || bird.y < 0) {
        restart();
    }
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(function(pipe) {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updatePipes() {
    if (frame % 90 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - gap));
        pipes.push({ x: canvas.width, top: pipeHeight, bottom: canvas.height - pipeHeight - gap });
    }
    pipes.forEach(function(pipe) {
        pipe.x -= 2;
    });

    pipes = pipes.filter(pipe => pipe.x > -pipeWidth);
}

function restart() {
    bird.y = 360;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
}

function collisionDetection() {
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            restart();
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(skyImage, 0, 0, canvas.width, canvas.height); // 绘制天空背景
    updateBird();
    updatePipes();
    collisionDetection();
    drawBird();
    drawPipes();

    frame++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        bird.velocity += bird.lift;
    }
});

gameLoop();
