const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 800;
canvas.height = 800;

// Game variables
const boxSize = 10; // Size of each grid square
let snake = [{x:400,y:400}, {x:400,y:400}, {x:400,y:400}, {x:400,y:400}]; // Snake starts at the center
let direction = "DOWN";

// Draw the snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#ce6b32" : "#873e23"; // Head is brighter
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
    });
    drawFOV();
}

function drawFOVleft() {
    const head = snake[0];
    const boxArray = [
        [-boxSize, -boxSize],
        [-boxSize, 0],
        [-boxSize, boxSize],
        [-2*boxSize, -2*boxSize],
        [-2*boxSize, -boxSize],
        [-2*boxSize, 0],
        [-2*boxSize, boxSize],
        [-2*boxSize, 2*boxSize]
    ];
    for(let i = 0; i < boxArray.length; i++) {
        let temp_x = head.x + boxArray[i][0];
        let temp_y = head.y + boxArray[i][1];
        ctx.globalCompositeOperation = "lighter"; // Add colors
        ctx.fillStyle = "rgba(241, 201, 129, 0.5)";   // Semi-transparent green
        ctx.fillRect(temp_x, temp_y, boxSize, boxSize);
        ctx.globalCompositeOperation = "source-over"; // Reset to default
    }
}

function drawFOVright() {
    const head = snake[0];
    const boxArray = [
        [boxSize, -boxSize],
        [boxSize, 0],
        [boxSize, boxSize],
        [2*boxSize, -2*boxSize],
        [2*boxSize, -boxSize],
        [2*boxSize, 0],
        [2*boxSize, boxSize],
        [2*boxSize, 2*boxSize]
    ];
    for(let i = 0; i < boxArray.length; i++) {
        let temp_x = head.x + boxArray[i][0];
        let temp_y = head.y + boxArray[i][1];
        ctx.globalCompositeOperation = "lighter"; // Add colors
        ctx.fillStyle = "rgba(241, 201, 129, 0.5)";   // Semi-transparent green
        ctx.fillRect(temp_x, temp_y, boxSize, boxSize);
        ctx.globalCompositeOperation = "source-over"; // Reset to default
    }
}

function drawFOVup() {
    const head = snake[0];
    const boxArray = [
        [-boxSize, -boxSize],
        [0, -boxSize],
        [boxSize, -boxSize],
        [-2 * boxSize, -2*boxSize],
        [-boxSize, -2*boxSize],
        [0, -2*boxSize],
        [boxSize, -2*boxSize],
        [2 * boxSize, -2*boxSize]
    ];
    for(let i = 0; i < boxArray.length; i++) {
        let temp_x = head.x + boxArray[i][0];
        let temp_y = head.y + boxArray[i][1];
        ctx.globalCompositeOperation = "lighter"; // Add colors
        ctx.fillStyle = "rgba(241, 201, 129, 0.5)";   // Semi-transparent green
        ctx.fillRect(temp_x, temp_y, boxSize, boxSize);
        ctx.globalCompositeOperation = "source-over"; // Reset to default
    }
}

function drawFOVdown() {
    const head = snake[0];
    const boxArray = [
        [-boxSize, boxSize],
        [0, boxSize],
        [boxSize, boxSize],
        [-2 * boxSize, 2 * boxSize],
        [-boxSize, 2 * boxSize],
        [0, 2 * boxSize],
        [boxSize, 2 * boxSize],
        [2 * boxSize, 2 * boxSize]
    ];
    for(let i = 0; i < boxArray.length; i++) {
        let temp_x = head.x + boxArray[i][0];
        let temp_y = head.y + boxArray[i][1];
        ctx.globalCompositeOperation = "lighter"; // Add colors
        ctx.fillStyle = "rgba(241, 201, 129, 0.5)";   // Semi-transparent green
        ctx.fillRect(temp_x, temp_y, boxSize, boxSize);
        ctx.globalCompositeOperation = "source-over"; // Reset to default
    }
}

function drawFOV() {
    const head = snake[0];
    switch (direction) {
        case "UP":
            drawFOVup();
            break;
        case "DOWN":
            drawFOVdown();
            break;
        case "LEFT":
            drawFOVleft();
            break;
        case "RIGHT":
            drawFOVright();
    }
}

// Move the snake
function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case "UP":
            head.y -= boxSize;
            break;
        case "DOWN":
            head.y += boxSize;
            break;
        case "LEFT":
            head.x -= boxSize;
            break;
        case "RIGHT":
            head.x += boxSize;
            break;
    }

    // Check if food is eaten
    snake.pop();
    snake.unshift(head);
}

// Check for collisions
function checkCollision() {
    const head = snake[0];

    if(direction === "DOWN" && head.y >= canvas.height-boxSize) return true;
    if(direction === "UP" && head.y < boxSize) return true;
    if(direction === "LEFT" && head.x < boxSize) return true;
    if(direction === "RIGHT" && head.x >= canvas.width-boxSize) return true;

    return false;
}

// Control the snake
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "ArrowUp") direction = "UP";
    if (key === "ArrowDown") direction = "DOWN";
    if (key === "ArrowLeft") direction = "LEFT";
    if (key === "ArrowRight") direction = "RIGHT";

    if(key === " " && !checkCollision()) moveSnake();
    
    if(!checkCollision()) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
    }
});

drawSnake();

