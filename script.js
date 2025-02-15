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

        // Contador de victorias
        this.winCount = localStorage.getItem('winCount') ? parseInt(localStorage.getItem('winCount')) : 0;
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
    }

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
        this.errorSound.play(); // Reproduce el sonido de error
        this.blockedButtons = true; // Bloquea los botones
        this.showMessage('You lost! <br> <button id="restartGame">Reiniciar</button>'); // Muestra el mensaje de "You lost"
        setTimeout(() => {
            document.getElementById('restartGame').onclick = () => this.resetGame();
        }, 100); 
    }

    // Juego ganado
    gameWon() {
        this.winCount++;
        localStorage.setItem('winCount', this.winCount);
        this.updateWinCount();
        this.blockedButtons = true; // Bloquea los botones
        this.showMessage('🏆 You win! 🏆'); // Muestra el mensaje de "You win!"
    }

    updateWinCount() {
        this.winCountDisplay.textContent = this.winCount;
    }

    // Muestra un mensaje emergente
    showMessage(text) {
        this.message.innerHTML = text; // Establece el texto del mensaje
        this.message.style.display = 'block'; // Muestra el mensaje
        setTimeout(() => {
            this.message.style.display = 'none'; // Oculta el mensaje después de 2 segundos
            this.resetGame(); // Reinicia el juego
        }, 2000);

        document.getElementById('backToMenu').onclick = () => this.showMenu();
    }

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
}

// Inicialización del juego
const simon = new Simon(buttons, startButton);
simon.init();