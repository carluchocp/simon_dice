// Obtén los botones por su ID
const greenButton = document.getElementById('green');
const redButton = document.getElementById('red');
const yellowButton = document.getElementById('yellow');
const blueButton = document.getElementById('blue');
const startButton = document.getElementById('startButton');

// Array de los botones
const buttons = [greenButton, redButton, yellowButton, blueButton];

// Configuración del juego
class Simon {
    constructor(buttons, startButton) {
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 20;
        this.sequence = [];
        this.speed = 1000; // Tiempo entre los botones de la secuencia
        this.blockedButtons = true; // Bloquea los botones hasta que el jugador pueda interactuar
        this.buttons = buttons;
        this.display = {
            startButton
        };

        // Usuario actual y puntajes
        this.currentUser = localStorage.getItem('currentUser') || 'Guest';
        this.updateCurrentUserDisplay();
        this.scores = JSON.parse(localStorage.getItem('scores')) || {};

        // Contador de victorias
        this.winCount = this.scores[this.currentUser]?.wins || 0;
        this.winCountDisplay = document.getElementById('winCount');
        this.updateWinCount();

        this.errorSound = new Audio('sounds/error.mp3'); // Sonido de error
        this.buttonSounds = [
            new Audio('sounds/verde.mp3'), // Sonido del botón verde
            new Audio('sounds/rojo.mp3'),  // Sonido del botón rojo
            new Audio('sounds/amarillo.mp3'), // Sonido del botón amarillo
            new Audio('sounds/azul.mp3'),  // Sonido del botón azul
        ];
        this.message = document.createElement('div'); // Crear el mensaje de "You lost" o "You win!"
        this.message.className = 'message';
        document.body.appendChild(this.message);
    }

    // Inicia el juego
    init() {
        this.display.startButton.onclick = () => this.startGame();
        document.getElementById('playButton').onclick = () => this.showGame();
        document.getElementById('menuButton').onclick = () => this.showMenu();
        document.getElementById('userForm').onsubmit = (e) => this.saveUsername(e);
        document.getElementById('viewScores').onclick = () => this.viewUserScores();
        document.getElementById('viewUsers').onclick = () => this.viewAllUsers();
        document.getElementById('resetDataButton').onclick = () => this.resetLocalStorage(); // Botón para reiniciar el localStorage
    }

    // Guarda el nombre de usuario
    saveUsername(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        if (username) {
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            this.updateCurrentUserDisplay();

            // Inicializa el puntaje si el usuario no existe
            if (!this.scores[username]) {
                this.scores[username] = { wins: 0, totalScore: 0, games: [] };
                localStorage.setItem('scores', JSON.stringify(this.scores));
            }

            this.winCount = this.scores[username].wins;
            this.updateWinCount();
        }
    }

    // Actualiza la visualización del usuario actual
    updateCurrentUserDisplay() {
        document.getElementById('currentUser').textContent = this.currentUser;
    }

    // Muestra el juego
    showGame() {
        document.getElementById('menu').classList.add('hidden');
        document.querySelector('.desktop').classList.remove('hidden');
    }

    // Comienza el juego
    startGame() {
        this.display.startButton.disabled = true; 
        this.updateRound(0); // Inicializa la ronda
        this.userPosition = 0;
        this.sequence = this.createSequence(); // Crea la secuencia
        this.buttons.forEach((element, i) => {
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence(); // Muestra la secuencia
    }

    // Actualiza la ronda
    updateRound(value) {
        this.round = value;
        this.display.startButton.textContent = `Round ${this.round}`; // Muestra el número de la ronda
    }

    // Crea la secuencia de botones aleatorios
    createSequence() {
        return Array.from({length: this.totalRounds}, () =>  this.getRandomColor());
    }

    // Obtiene un número aleatorio entre 0 y 3
    getRandomColor() {
        return Math.floor(Math.random() * 4); // Genera un número aleatorio entre 0 y 3
    }

    // Función cuando el usuario hace clic en un botón
    buttonClick(value) {
        if (!this.blockedButtons) {
            this.toggleButtonStyle(this.buttons[value]); // Resalta el botón
            this.buttonSounds[value].play(); // Reproduce el sonido
            setTimeout(() => this.toggleButtonStyle(this.buttons[value]), 300); // Quita el resaltado después de 300 ms
            this.validateChosenColor(value); // Verifica si el color seleccionado es correcto
        }
    }

    // Valida el botón seleccionado por el usuario
    validateChosenColor(value) {
        if (this.sequence[this.userPosition] === value) {
            if (this.round === this.userPosition) {
                this.updateRound(this.round + 1); // Aumenta la ronda
                this.speed /= 1.02; // Disminuye el tiempo entre secuencias
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.gameLost(); // Si el usuario falla
        }
    }

    // Verifica si el juego ha terminado
    isGameOver() {
        if (this.round === this.totalRounds) {
            this.gameWon(); // El juego termina cuando alcanza el número total de rondas
        } else {
            this.userPosition = 0;
            this.showSequence(); // Si no se ha acabado, muestra la secuencia nuevamente
        };
    }

    // Muestra la secuencia de botones
    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play(); // Reproduce el sonido
            this.toggleButtonStyle(button); // Resalta el botón
            setTimeout(() => this.toggleButtonStyle(button), this.speed / 2); // Quita el resaltado
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

    // Activa la clase .active en el botón para resaltarlo
    toggleButtonStyle(button) {
        button.classList.toggle('active');
    }

    // Juego perdido
    gameLost() {
        const score = this.round * 10; // Cada ronda vale 10 puntos
        this.scores[this.currentUser].games.push({ score, won: false });
        this.scores[this.currentUser].totalScore += score; // Suma el puntaje al total
        localStorage.setItem('scores', JSON.stringify(this.scores));

        this.errorSound.play(); // Reproduce el sonido de error
        this.blockedButtons = true; // Bloquea los botones

        // Muestra el mensaje de "You lost"
        this.showMessage(`You lost! <br> Score: ${score} <br> <button id="restartGame">Reiniciar</button>`);

        // Reinicia el juego después de 2 segundos
        setTimeout(() => {
            this.resetGame();
        }, 2000);
    }

    // Juego ganado
    gameWon() {
        const score = this.round * 10; // Cada ronda vale 10 puntos
        this.scores[this.currentUser].wins++;
        this.scores[this.currentUser].totalScore += score; // Suma el puntaje al total
        this.scores[this.currentUser].games.push({ score, won: true });
        localStorage.setItem('scores', JSON.stringify(this.scores));

        this.winCount = this.scores[this.currentUser].wins;
        this.updateWinCount();

        this.blockedButtons = true; // Bloquea los botones
        this.showMessage(`🏆 You win! 🏆 <br> Score: ${score}`); // Muestra el mensaje de "You win!"
    }

    // Actualiza el contador de victorias
    updateWinCount() {
        this.winCountDisplay.textContent = this.winCount;
    }

    // Muestra un mensaje emergente
    showMessage(text) {
        this.message.innerHTML = text; // Establece el texto del mensaje
        this.message.style.display = 'block'; // Muestra el mensaje

        // Configura el botón de reinicio
        setTimeout(() => {
            const restartButton = document.getElementById('restartGame');
            if (restartButton) {
                restartButton.onclick = () => {
                    this.resetGame();
                    this.message.style.display = 'none'; // Oculta el mensaje
                };
            }
        }, 100);
    }

    // Muestra el menú
    showMenu() {
        document.getElementById('menu').classList.remove('hidden');
        document.querySelector('.desktop').classList.add('hidden');
    }

    // Reinicia el juego
    resetGame() {
        this.display.startButton.disabled = false; 
        this.display.startButton.textContent = 'Start'; // Restaura el texto del botón
        this.round = 0;
        this.userPosition = 0;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.message.style.display = 'none'; // Oculta cualquier mensaje activo
    }

    // Muestra los puntajes del usuario actual
    viewUserScores() {
        const userScores = this.scores[this.currentUser];
        const scoresDisplay = document.getElementById('scoresDisplay');
        if (userScores) {
            const gamesList = userScores.games.map((game, index) => `
                <p>Game ${index + 1}: ${game.score} points (${game.won ? 'Won' : 'Lost'})</p>
            `).join('');
            scoresDisplay.innerHTML = `
                <h3>Your Scores</h3>
                <p>Total Wins: ${userScores.wins}</p>
                <p>Total Points: ${userScores.totalScore}</p>
                ${gamesList}
            `;
        } else {
            scoresDisplay.innerHTML = `<p>No scores available for ${this.currentUser}.</p>`;
        }
    }

    // Muestra todos los usuarios y sus puntajes totales
    viewAllUsers() {
        const scoresDisplay = document.getElementById('scoresDisplay');
        const users = Object.entries(this.scores)
            .sort((a, b) => b[1].totalScore - a[1].totalScore) // Ordena de mayor a menor
            .map(([user, data]) => `
                <p>${user}: ${data.totalScore} points</p>
            `)
            .join('');
        scoresDisplay.innerHTML = `
            <h3>All Users</h3>
            ${users}
        `;
    }

    // Reinicia toda la información del localStorage
    resetLocalStorage() {
        localStorage.clear(); // Elimina todos los datos del localStorage
        this.scores = {}; // Reinicia el objeto de puntajes
        this.currentUser = 'Guest'; // Restablece el usuario actual
        this.winCount = 0; // Reinicia el contador de victorias
        this.updateCurrentUserDisplay(); // Actualiza la visualización del usuario
        this.updateWinCount(); // Actualiza el contador de victorias
        document.getElementById('scoresDisplay').innerHTML = ''; // Limpia la visualización de puntajes
        alert('All data has been reset!'); // Muestra un mensaje de confirmación
    }
}

// Inicialización del juego
const simon = new Simon(buttons, startButton);
simon.init();