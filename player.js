// player.js

const canvasWidth = 800; // Largeur du canevas (ajustez si nécessaire)
let activeKeys = {}; // Pour garder une trace des touches actives
let moveInterval = null; // Pour stocker l'intervalle de déplacement
let isAnimating = false; // Pour indiquer si une animation est en cours

const playerConfigs = {
    blue: {
        id: 'bluePlayer',
        x: 250, // Position de départ du joueur bleu
        y: 50,
        width: 100,
        height: 150,
        speed: 5,
        guardFrameRate: 50,
        moveFrameRate: 40,
        guardImages: ['img/blue-player.svg', 'img/blue-player-guard.svg'],
        moveImages: ['img/blue-player-move-up.svg', 'img/blue-player-move-down.svg'],
        blockImage: 'img/blue-player-block.svg',
        punchImage: 'img/blue-player-punch.svg',
        trunkKickImage: ['img/blue-player-kick-prepare.svg', 'img/blue-player-trunk-kick.svg', 'img/blue-player-kick-prepare.svg'],
        headKickImage: ['img/blue-player-kick-prepare.svg', 'img/blue-player-head-kick.svg', 'img/blue-player-kick-prepare.svg'],
        turningTrunkKickImages: ['img/blue-player-turning-kick.svg', 'img/blue-player-turning-kick-prepare.svg', 'img/blue-player-turning-trunk-kick.svg'],
        turningHeadKickImages: ['img/blue-player-turning-kick.svg', 'img/blue-player-turning-kick-prepare.svg', 'img/blue-player-turning-head-kick.svg'],
        gotTrunkImage: 'img/blue-player-got-trunk.svg',
        gotHeadImage: 'img/blue-player-got-head.svg',
        element: null,
        currentAnimation: 'guard',
        frameCounter: 0,
        currentImageIndex: 0
    },
    red: {
        id: 'redPlayer',
        x: 450, // Position de départ du joueur rouge
        y: 50,
        width: 100,
        height: 150,
        speed: 5,
        guardFrameRate: 50,
        moveFrameRate: 40,
        guardImages: ['img/red-player.svg', 'img/red-player-guard.svg'],
        moveImages: ['img/red-player-move-up.svg', 'img/red-player-move-down.svg'],
        blockImage: 'img/red-player-block.svg',
        punchImage: 'img/red-player-punch.svg',
        trunkKickImage: ['img/blue-player-kick-prepare.svg', 'img/red-player-trunk-kick.svg', 'img/blue-player-kick-prepare.svg'], 
        headKickImage: ['img/blue-player-kick-prepare.svg', 'img/red-player-head-kick.svg', 'img/blue-player-kick-prepare.svg'],
        turningTrunkKickImages: ['img/red-player-turning-kick.svg', 'img/red-player-turning-kick-prepare.svg', 'img/red-player-turning-trunk-kick.svg'],
        turningHeadKickImages: ['img/red-player-turning-kick.svg', 'img/red-player-turning-kick-prepare.svg', 'img/red-player-turning-head-kick.svg'],
        gotTrunkImage: 'img/red-player-got-trunk.svg',
        gotHeadImage: 'img/red-player-got-head.svg',
        element: null,
        currentAnimation: 'guard',
        frameCounter: 0,
        currentImageIndex: 0
    }
};

// Fonction pour créer et configurer un joueur
export function setupPlayer(color) {
    const config = playerConfigs[color];
    const playerElement = document.createElement('div');
    playerElement.id = config.id;
    playerElement.style.width = `${config.width}px`;
    playerElement.style.height = `${config.height}px`;
    playerElement.style.position = 'absolute';
    playerElement.style.bottom = `${config.y}px`;
    playerElement.style.left = `${config.x}px`;
    playerElement.style.backgroundSize = 'contain';
    playerElement.style.backgroundRepeat = 'no-repeat';
    playerElement.style.backgroundImage = `url(${config.guardImages[0]})`;

    // Ajouter l'élément au DOM
    document.getElementById('gameScreen').appendChild(playerElement);
    config.element = playerElement; // Assigner l'élément au config
}

// Fonction pour animer le joueur
export function animatePlayer(color) {
    const config = playerConfigs[color];
    function animate() {
        config.frameCounter++;
        if (config.currentAnimation === 'guard' && config.frameCounter >= config.guardFrameRate) {
            config.currentImageIndex = (config.currentImageIndex + 1) % config.guardImages.length;
            config.element.style.backgroundImage = `url(${config.guardImages[config.currentImageIndex]})`;
            config.frameCounter = 0;
        } else if (config.currentAnimation === 'move' && config.frameCounter >= config.moveFrameRate) {
            config.currentImageIndex = (config.currentImageIndex + 1) % config.moveImages.length;
            config.element.style.backgroundImage = `url(${config.moveImages[config.currentImageIndex]})`;
            config.frameCounter = 0;
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// Fonction pour permettre au joueur de se déplacer et exécuter les actions
export function movePlayer(color) {
    const config = playerConfigs[color];
    const otherPlayerConfig = color === 'blue' ? playerConfigs.red : playerConfigs.blue;

    document.addEventListener('keydown', function (event) {
        if (activeKeys[event.key]) return; // Ignorer si la touche est déjà active

        activeKeys[event.key] = true;

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            if (!moveInterval) {
                moveInterval = setInterval(() => {
                    let leftPosition = parseInt(config.element.style.left, 10);

                    // Calculer la nouvelle position après mouvement
                    let newLeftPosition = activeKeys['ArrowLeft'] ? leftPosition - config.speed : activeKeys['ArrowRight'] ? leftPosition + config.speed : leftPosition;

                    // Empêcher le joueur de sortir du canvas
                    newLeftPosition = Math.max(0, Math.min(canvasWidth - config.width, newLeftPosition));

                    // Empêcher les joueurs de se traverser, mais permettre une superposition de 50px
                    const otherPlayerLeft = parseInt(otherPlayerConfig.element.style.left, 10);
                    if (color === 'blue' && newLeftPosition + config.width > otherPlayerLeft + 50) {
                        newLeftPosition = otherPlayerLeft + 50 - config.width;
                    } else if (color === 'red' && newLeftPosition < otherPlayerLeft + otherPlayerConfig.width - 50) {
                        newLeftPosition = otherPlayerLeft + otherPlayerConfig.width - 50;
                    }

                    // Appliquer la nouvelle position
                    config.element.style.left = `${newLeftPosition}px`;

                    config.currentAnimation = 'move';
                }, 1000 / config.moveFrameRate); // Déplacement synchronisé avec l'animation
            }
        } else if (event.key === 'b') {
            if (!isAnimating) {
                startBlockAnimation(config);
            }
        } else if (event.key === 'n') {
            if (!isAnimating) {
                startAnimation(config, 'punch', config.punchImage, 500);
            }
        } else if (event.key === 'h') {
            if (!isAnimating) {
                startAnimation(config, 'trunk-kick', config.trunkKickImage, 500);
            }
        } else if (event.key === 'y') {
            if (!isAnimating) {
                startAnimation(config, 'head-kick', config.headKickImage, 500);
            }
        } else if (event.key === 'g') {
            if (!isAnimating) {
                startAnimation(config, 'turning-trunk-kick', config.turningTrunkKickImages, 500);
            }
        } else if (event.key === 't') {
            if (!isAnimating) {
                startAnimation(config, 'turning-head-kick', config.turningHeadKickImages, 500);
            }
        }
    });

    document.addEventListener('keyup', function (event) {
        activeKeys[event.key] = false; // Libérer la touche

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            clearInterval(moveInterval);
            moveInterval = null;
            if (!isAnimating) {
                resetToGuard(config);
            }
        } else if (event.key === 'b') {
            if (!isAnimating) {
                resetToGuard(config);
            }
        }
    });
}

function startBlockAnimation(config) {
    isAnimating = true;
    config.currentAnimation = 'block';
    config.element.style.backgroundImage = `url(${config.blockImage})`;

    setTimeout(() => {
        resetToGuard(config);
    }, 1000); // Durée de l'animation de blocage (1 seconde)
}

function startAnimation(config, animationName, images, duration) {
    isAnimating = true;
    config.currentAnimation = animationName;

    if (Array.isArray(images)) {
        let firstImageDuration = duration * 0.25;
        let secondImageDuration = duration * 0.5;
        let thirdImageDuration = duration * 0.25;
        if (animationName.includes('turning')) {
            firstImageDuration = duration * 0.3;
            secondImageDuration = duration * 0.3;
            thirdImageDuration = duration * 0.4;
        }

        config.element.style.backgroundImage = `url(${images[0]})`;
        setTimeout(() => {
            config.element.style.backgroundImage = `url(${images[1]})`;
            setTimeout(() => {
                config.element.style.backgroundImage = `url(${images[2]})`;
                setTimeout(() => {
                    resetToGuard(config);
                }, thirdImageDuration);
            }, secondImageDuration);
        }, firstImageDuration);
    } else {
        config.element.style.backgroundImage = `url(${images})`;
        setTimeout(() => {
            resetToGuard(config);
        }, duration);
    }
}

// Fonction pour réinitialiser l'animation de garde
function resetToGuard(config) {
    config.currentAnimation = 'guard';
    config.element.style.backgroundImage = `url(${config.guardImages[0]})`;
    isAnimating = false;
}

// Fonction pour jouer l'animation de réception de coup
function playGotHitAnimation(config, type) {
    let imageUrl;
    if (type === 'trunk') {
        imageUrl = config.gotTrunkImage;
    } else if (type === 'head') {
        imageUrl = config.gotHeadImage;
    }

    config.element.style.backgroundImage = `url(${imageUrl})`;
    setTimeout(() => {
        resetToGuard(config);
    }, 500); // La durée de l'animation de réception du coup (500ms ici)
}

