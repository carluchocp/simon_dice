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
        this.errorSound = new Audio('sonidos/error.mp3'); // Sonido de error
        this.buttonSounds = [
            new Audio('sonidos/verde.mp3'), // Sonido del botón verde
            new Audio('sonidos/rojo.mp3'),  // Sonido del botón rojo
            new Audio('sonidos/amarillo.mp3'), // Sonido del botón amarillo
            new Audio('sonidos/azul.mp3'),  // Sonido del botón azul
        ];
        this.message = document.createElement('div'); // Crear el mensaje de "You lost" o "You win!"
        this.message.className = 'message';
        document.body.appendChild(this.message);
    }

    // Inicia el juego
    init() {
        this.display.startButton.onclick = () => this.startGame();
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
        this.showMessage('You lost!'); // Muestra el mensaje de "You lost"
    }

    // Juego ganado
    gameWon() {
        this.blockedButtons = true; // Bloquea los botones
        this.showMessage('🏆 You win! 🏆'); // Muestra el mensaje de "You win!"
    }

    // Muestra un mensaje emergente
    showMessage(text) {
        this.message.textContent = text; // Establece el texto del mensaje
        this.message.style.display = 'block'; // Muestra el mensaje
        setTimeout(() => {
            this.message.style.display = 'none'; // Oculta el mensaje después de 2 segundos
            this.resetGame(); // Reinicia el juego
        }, 2000);
    }

    // Reinicia el juego
    resetGame() {
        this.display.startButton.disabled = false; 
        this.display.startButton.textContent = 'Start'; // Restaura el texto del botón
        this.round = 0;
        this.userPosition = 0;
        this.sequence = [];
        this.speed = 1000;
    }
}

// Inicialización del juego
const simon = new Simon(buttons, startButton);
simon.init();