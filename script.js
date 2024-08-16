// script.js

import { initializeGame, startGame } from './game.js';

// Lancer le jeu lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la configuration du jeu
    initializeGame();
    
    // Attacher l'événement au bouton Start
    const startButton = document.querySelector('#startScreen .button');
    startButton.addEventListener('click', startGame);
});
