const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 800;
canvas.height = 800;

// Game variables
const boxSize = 20; // Size of each grid square
let snake = [{x:400,y:400}, {x:400,y:380}, {x:400,y:360}]; // Snake starts at the center
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};
let score = 0;
let gameInterval = null; // Reference to the game loop interval

// Draw the snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#0f0" : "#0a0"; // Head is brighter
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
    });
}

// Draw the food
function drawFood() {
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
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
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
            y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
        };
    } else {
        snake.pop(); // Remove the tail if no food is eaten
    }

    snake.unshift(head);
}

// Check for collisions
function checkCollision() {
    const head = snake[0];

    // Check wall collisions
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        return true;
    }

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Control the snake
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Main game loop
function gameLoop() {
    if (checkCollision()) {
        alert(`Game Over! Your score: ${score}`);
        clearInterval(gameInterval); // Stop the game loop
        gameInterval = null;
        resetGame(); // Reset the game state
        createStartButton(); // Recreate the start button
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        moveSnake();
        drawSnake();
    }
}

// Reset the game state
function resetGame() {
    snake = [{ x: 400, y: 400 }];
    direction = "RIGHT";
    score = 0;
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
    };
}

// Create the start button dynamically
function createStartButton() {
    // Remove existing button if present
    const existingButton = document.getElementById("startButton");
    if (existingButton) existingButton.remove();

    // Create a new button
    const startButton = document.createElement("button");
    startButton.id = "startButton";
    startButton.textContent = "Start Game";
    startButton.style.position = "absolute";
    startButton.style.top = "50%";
    startButton.style.left = "50%";
    startButton.style.transform = "translate(-50%, -50%)";
    startButton.style.padding = "10px 20px";
    startButton.style.fontSize = "16px";
    startButton.style.cursor = "pointer";

    // Add the button to the document
    document.body.appendChild(startButton);

    // Start the game on button click
    startButton.addEventListener("click", () => {
        startButton.remove(); // Remove the button
        startGame(); // Start the game
    });
}

// Start the game
function startGame() {
    if (!gameInterval) {
        gameInterval = setInterval(gameLoop, 80); // Run the game loop
    }
}

// Initialize the game
createStartButton();

