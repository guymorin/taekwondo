// game.js

import { setupPlayer, animatePlayer, movePlayer } from './player.js';
import { updateRoundDisplay, startRound as startRoundUtil } from './utils.js';

let currentRound = 0;
let roundTime = 120; // 2 minutes en secondes
let timerInterval;

// Initialiser le jeu
export function initializeGame() {
    document.getElementById('gameScreen').style.display = 'none';
}

// Démarrer le jeu
export function startGame() {
    currentRound = 1;
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    updateRoundDisplay(roundTime, currentRound);
    
    // Démarrer le round
    startNewRound();
    
    // Configurer et lancer les animations pour les deux joueurs
    ['blue', 'red'].forEach(color => {
        setupPlayer(color); 
        animatePlayer(color); 
        movePlayer(color);
    });
}

// Lancer un nouveau round
function startNewRound() {
    roundTime = 120;
    updateRoundDisplay(roundTime, currentRound);
    timerInterval = setInterval(updateTimer, 1000); // Démarrer le timer
}

// Mettre à jour le timer chaque seconde
function updateTimer() {
    roundTime--;
    updateRoundDisplay(roundTime, currentRound);

    if (roundTime <= 0) {
        endRound(); // Terminer le round si le temps est écoulé
    }
}

// Terminer un round
function endRound() {
    clearInterval(timerInterval);
    // Logique supplémentaire pour la fin du round
}
