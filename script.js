// Variables globales
let blueScore = [0, 0, 0];
let redScore = [0, 0, 0];
let currentRound = 0;
let roundTime = 120; // 2 minutes en secondes
let timerInterval;

// Éléments DOM
const timeElement = document.getElementById('time');
const roundNumberElement = document.getElementById('roundNumber');
const blueScoreElements = document.querySelectorAll('.score-row:nth-child(2) .score-column');
const redScoreElements = document.querySelectorAll('.score-row:nth-child(3) .score-column');
const gameCanvas = document.getElementById('gameCanvas');
const endScreen = document.getElementById('endScreen');
const resultMessage = document.getElementById('resultMessage');
const ctx = gameCanvas.getContext('2d');

// Initialiser le jeu
function startGame() {
    currentRound = 1;
    roundTime = 120;
    updateRoundDisplay();
    startRound();
}

// Mettre à jour l'affichage du round
function updateRoundDisplay() {
    timeElement.innerText = formatTime(roundTime);
    roundNumberElement.innerText = getRoundLabel(currentRound);
}

// Lancer un round
function startRound() {
    updateRoundDisplay();
    timerInterval = setInterval(updateTimer, 1000);
}

// Mettre à jour le timer chaque seconde
function updateTimer() {
    roundTime--;
    timeElement.innerText = formatTime(roundTime);

    if (roundTime <= 0) {
        endRound();
    }
}

// Formater le temps en minutes et secondes
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
}

// Terminer un round
function endRound() {
    clearInterval(timerInterval);
    determineRoundWinner();
    if (currentRound < 3) {
        showContinueButton();
    } else {
        showFinalResult();
    }
}

// Déterminer le gagnant du round
function determineRoundWinner() {
    // Simuler le gagnant pour cet exemple
    const winner = Math.random() > 0.5 ? 'blue' : 'red';

    if (winner === 'blue') {
        blueScore[currentRound - 1] = 1;
        updateScoreDisplay(blueScoreElements, blueScore);
    } else {
        redScore[currentRound - 1] = 1;
        updateScoreDisplay(redScoreElements, redScore);
    }

    updateRoundColors(winner);
}

// Mettre à jour les scores affichés
function updateScoreDisplay(scoreElements, scores) {
    for (let i = 0; i < scores.length; i++) {
        scoreElements[i].innerText = scores[i];
    }
}

// Inverser les couleurs du score du gagnant du round
function updateRoundColors(winner) {
    if (winner === 'blue') {
        blueScoreElements[currentRound - 1].classList.add('winner');
    } else {
        redScoreElements[currentRound - 1].classList.add('winner');
    }
}

// Montrer le bouton "Continue" après un round
function showContinueButton() {
    const continueButton = document.createElement('button');
    continueButton.innerText = 'Continue';
    continueButton.className = 'button';
    continueButton.style.position = 'absolute';
    continueButton.style.left = '50%';
    continueButton.style.transform = 'translateX(-50%)';
    continueButton.style.top = '60%';
    document.body.appendChild(continueButton);

    continueButton.addEventListener('click', function () {
        document.body.removeChild(continueButton);
        currentRound++;
        roundTime = 120;
        startRound();
    });
}

// Montrer le résultat final
function showFinalResult() {
    const blueTotal = blueScore.reduce((a, b) => a + b, 0);
    const redTotal = redScore.reduce((a, b) => a + b, 0);
    const winner = blueTotal > redTotal ? 'BLUE' : 'RED';

    resultMessage.innerText = `${winner} WINS!`;
    endScreen.style.display = 'flex';
}

// Réinitialiser le jeu
function resetGame() {
    blueScore = [0, 0, 0];
    redScore = [0, 0, 0];
    currentRound = 0;
    roundTime = 120;
    updateScoreDisplay(blueScoreElements, blueScore);
    updateScoreDisplay(redScoreElements, redScore);
    endScreen.style.display = 'none';
    startGame();
}

// Obtenir le libellé du round (1st, 2nd, 3rd)
function getRoundLabel(round) {
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

// Lancement du jeu
document.getElementById('startButton').addEventListener('click', function () {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    startGame();
});

document.getElementById('restartButton').addEventListener('click', function () {
    resetGame();
});
