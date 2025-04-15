document.addEventListener('DOMContentLoaded', () => {
    // Reloj
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        document.getElementById('clock-time').textContent = `${hours}:${minutes}:${seconds}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Modo oscuro
    const darkModeButton = document.getElementById('dark-mode-toggle-btn');
    const body = document.body;
    darkModeButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        darkModeButton.textContent = body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
    });

    // Testimonios funcionales
    const testimonials = [
        'La dedicacion de Nicolas es admirable, siempre busca aprender y mejorar sus habilidades.',
        'Un gran futuro por delante, su pasion por el desarrollo web es evidente en todo lo que hace.',
        'Excelente companero de trabajo, siempre aporta ideas creativas y es muy responsable.'
    ];

    const testimonialElement = document.getElementById('testimonial');

    function showRandomTestimonial() {
        const randomIndex = Math.floor(Math.random() * testimonials.length);
        testimonialElement.textContent = `"${testimonials[randomIndex]}"`;
    }

    showRandomTestimonial();
    setInterval(showRandomTestimonial, 5000); // Cambia cada 5 segundos
});

// Juego Snake
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let apple = spawnApple();
let score = 0;
let gameInterval = setInterval(gameLoop, 120);

// Función para ajustar el tamaño del canvas de manera responsiva
function resizeCanvas() {
    // Ajustamos el tamaño del canvas usando unidades vh y vw para adaptarse a la pantalla
    canvas.width = Math.floor(window.innerWidth * 0.8);  // 80% del ancho de la pantalla
    canvas.height = Math.floor(window.innerHeight * 0.6);  // 60% de la altura de la pantalla
}

// Llamar a la función de ajuste del canvas al cargar la página
resizeCanvas();

// Asegurarse de que el canvas se redimensione cuando cambie el tamaño de la ventana
window.addEventListener("resize", resizeCanvas);

// Función para generar una nueva manzana
function spawnApple() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    return { x, y };
}

// Función para dibujar la serpiente
function drawSnake() {
    snake.forEach(part => {
        const gradient = ctx.createLinearGradient(part.x, part.y, part.x + gridSize, part.y + gridSize);
        gradient.addColorStop(0, "#0d6efd");
        gradient.addColorStop(1, "#66b2ff");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(part.x, part.y, gridSize, gridSize, 6);
        ctx.fill();
    });
}

// Función para dibujar la manzana
function drawApple() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(apple.x + gridSize / 2, apple.y + gridSize / 2, gridSize / 2.2, 0, Math.PI * 2);
    ctx.fill();
}

// Función para mover la serpiente
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        apple = spawnApple();
        score++;
    } else {
        snake.pop();
    }
}

// Función para verificar las colisiones
function checkCollision() {
    const head = snake[0];
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(p => p.x === head.x && p.y === head.y)
    ) {
        clearInterval(gameInterval);
        document.getElementById("final-score").textContent = score;
        document.getElementById("game-over-message").style.display = "block";
    }
}

// Bucle del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    checkCollision();
    drawSnake();
    drawApple();
}

// Controles de teclado (PC)
document.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp": if (direction.y === 0) direction = { x: 0, y: -gridSize }; break;
        case "ArrowDown": if (direction.y === 0) direction = { x: 0, y: gridSize }; break;
        case "ArrowLeft": if (direction.x === 0) direction = { x: -gridSize, y: 0 }; break;
        case "ArrowRight": if (direction.x === 0) direction = { x: gridSize, y: 0 }; break;
    }
});

// Controles táctiles (Móvil)
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

canvas.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", e => {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", () => {
    if (touchEndX < touchStartX && direction.x === 0) {
        direction = { x: -gridSize, y: 0 }; // Izquierda
    }
    if (touchEndX > touchStartX && direction.x === 0) {
        direction = { x: gridSize, y: 0 }; // Derecha
    }
    if (touchEndY < touchStartY && direction.y === 0) {
        direction = { x: 0, y: -gridSize }; // Arriba
    }
    if (touchEndY > touchStartY && direction.y === 0) {
        direction = { x: 0, y: gridSize }; // Abajo
    }
});

// Botón de reiniciar el juego
document.getElementById("restart-btn").addEventListener("click", () => {
    document.getElementById("game-over-message").style.display = "none";
    snake = [{ x: 160, y: 160 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    apple = spawnApple();
    gameInterval = setInterval(gameLoop, 120);
});
