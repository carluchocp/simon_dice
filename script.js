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
        this.totalRounds = 10;
        this.sequence = [];
        this.speed = 1000; // tiempo entre los botones de la secuencia
        this.blockedButtons = true; // Bloquea los botones hasta que el jugador pueda interactuar
        this.buttons = buttons;
        this.display = {
            startButton
        }
        this.errorSound = new Audio('./sounds/error.wav'); // Si existe este archivo de sonido
        this.buttonSounds = [
            new Audio('./sounds/1.mp3'), // Asegúrate de que estos sonidos existan
            new Audio('./sounds/2.mp3'),
            new Audio('./sounds/3.mp3'),
            new Audio('./sounds/4.mp3'),
        ]
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
            element.classList.remove('winner');
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

    // Función cuando el usuario hace click en un botón
    buttonClick(value) {
        if (!this.blockedButtons) {
            this.validateChosenColor(value); // Verifica si el color seleccionado es correcto
        }
    }

    // Valida el botón seleccionado por el usuario
    validateChosenColor(value) {
        if (this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].play();
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
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            this.toggleButtonStyle(button)
            setTimeout( () => this.toggleButtonStyle(button), this.speed / 2)
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
        this.display.startButton.disabled = false; 
        this.blockedButtons = true; // Bloquea los botones
    }

    // Juego ganado
    gameWon() {
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
        this.buttons.forEach(element => {
            element.classList.add('winner');
        });
        this.updateRound('🏆');
    }
}

// Inicialización del juego
const simon = new Simon(buttons, startButton);
simon.init();