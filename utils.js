// utils.js

export function updateRoundDisplay(roundTime, currentRound) {
    const timeElement = document.getElementById('time');
    const roundNumberElement = document.getElementById('roundNumber');
    
    // Appeler les fonctions formatTime et getRoundLabel avec les paramètres
    timeElement.innerText = formatTime(roundTime);
    roundNumberElement.innerText = getRoundLabel(currentRound);
}

export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
}

export function getRoundLabel(round) {
    switch (round) {
        case 1:
            return '1ST';
        case 2:
            return '2ND';
        case 3:
            return '3RD';
        default:
            return '';
    }
}

// Placeholder pour la fonction startRound si nécessaire
export function startRound() {
    // Implémentation de la fonction startRound
}
