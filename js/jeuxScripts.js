const cards = ['🍎', '🍎', '🍊', '🍊', '🍋', '🍋', '🍉', '🍉', '🍇', '🍇', '🍓', '🍓', '🍌', '🍌', '🍒', '🍒'];
let openedCards = [];
let matchedCards = [];

let seconds = 0;
let minutes = 0;
let totalTime = 0; // Variable pour stocker le temps total
let score = 0; // Variable pour stocker le pointage

// Structure de données pour stocker les scores des joueurs
let leaderboardData = [];
const congratulationsMessage = document.getElementById('congratulations-message');

// Ajouter un écouteur d'événement pour le clic sur le bouton "Résoudre"
const solveButton = document.getElementById('solve');
solveButton.addEventListener('click', solve);
// Fonction pour afficher la boîte de dialogue demandant à l'utilisateur s'il accepte les cookies
    function askForCookies() {
        const cookiedModal = document.getElementById('cookieModal');
    cookiedModal.style.display = 'block';

        // Lorsque l'utilisateur clique sur le bouton "Non"
        document.getElementById('cookieReject').addEventListener('click', function () {
            
            // Fermer la boîte de dialogue modale
            cookiedModal.style.display = 'none';
            // Rediriger vers la page d'index
            window.location.href = 'index.html';
        });

        // Lorsque l'utilisateur clique sur le bouton "Oui"
        document.getElementById('cookieAccept').addEventListener('click', function () {
            // Fermer la boîte de dialogue modale
            cookiedModal.style.display = 'none';

            // Récupérer les résultats à partir des cookies
            getResultsFromCookies();

            // Appeler la fonction pour afficher le chronomètre
            displayTimer();
            window.addEventListener('beforeunload', function() {
                saveResultsToCookies();
            });
        });
    }

    // Appeler la fonction pour demander à l'utilisateur s'il accepte les cookies
    askForCookies();
window.onload = function () {
    
};

// Gestionnaire d'événement pour le clic sur le bouton de bascule du menu
$("#sidebarToggle").on("click", function() {
    // Ajuster la position des modales lorsque le menu est ouvert
    adjustModalsPosition();
});

function adjustModalsPosition() {
    // Récupérer la largeur de la fenêtre
    var windowWidth = $(window).width();
    
    // Récupérer la largeur du menu latéral
    var sidebarWidth = $("#layoutSidenav").outerWidth();
    
    // Récupérer la largeur du contenu principal (sans le menu latéral)
    var contentWidth = windowWidth - sidebarWidth;
    
    // Récupérer la largeur de la modal
    var modalWidth = $(".modal").outerWidth();
    
    // Calculer la position horizontale de la modal pour la centrer
    var modalLeft = (contentWidth - modalWidth) / 2;
    
    // Appliquer la position horizontale calculée à toutes les modales
    $(".modal").css("right", modalLeft);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}

function initializeGame() {
    const shuffledCards = shuffle(cards);
    const gameBoard = document.getElementById('game');

    shuffledCards.forEach(card => {
        const newCard = createCard(card);
        gameBoard.appendChild(newCard);
    });
}

function createCard(cardValue) {
    const card = document.createElement('div');
    card.classList.add('card');
    const front = document.createElement('div');
    front.classList.add('front');
    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = cardValue;
    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (!card.classList.contains('matched') && openedCards.length < 2 && !openedCards.includes(card)) {
        card.classList.toggle('flip');
        openedCards.push(card);

        if (openedCards.length === 2) {
            if (openedCards[0].querySelector('.back').textContent === openedCards[1].querySelector('.back').textContent) {
                matchedCards.push(...openedCards);
                setTimeout(() => {
                    openedCards.forEach(card => {
                        card.classList.add('matched');
                        card.classList.add('success');
                    });

                    openedCards.length = 0; // Réinitialise openedCards après avoir trouvé une paire
                }, 1000)
                // Augmenter le pointage
                score += 10; // Vous pouvez ajuster le score en fonction de vos préférences
                updateScore(); // Mettre à jour l'affichage du pointage

            } else {
                setTimeout(() => {
                    openedCards.forEach(card => card.classList.remove('flip'));
                    openedCards.length = 0;
                }, 1000);
                score -= 5;
                updateScore();
            }
        }

        if (matchedCards.length === cards.length) {
            stopTimer();
            const gameBoard = document.getElementById('game');
            gameBoard.classList.add('game-success');
            congratulationsMessage.style.display = 'block'; 
            addToLeaderboard(totalTime, score); 
            score = 0;
        }

    }
}

function updateScore() {
    // Sélectionnez l'élément où vous souhaitez afficher le pointage
    const scoreElement = document.getElementById('score');
    // Mettez à jour le texte avec le pointage actuel
    scoreElement.textContent = score;
}

// Réinitialiser le jeu dans la fonction restartGame()
function restartGame() {
    // Masquer le message "BRAVO!"
    const congratulationsMessage = document.getElementById('congratulations-message');
    congratulationsMessage.style.display = 'none';

    // Réinitialiser le jeu
    openedCards = [];
    matchedCards = [];
    const gameBoard = document.getElementById('game');
    const children = Array.from(gameBoard.children);
    gameBoard.classList.remove('game-success'); // Supprimer la classe d'animation

    const solveButton = document.getElementById('solve-button'); // Sélectionner le bouton "Résoudre"
    solveButton.style.display = 'block'; // Réafficher le bouton "Résoudre"
    score = 0;
    updateScore();

    // Réinitialiser le chronomètre
    clearInterval(timerInterval);
    seconds = 0;
    minutes = 0;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "00:00"; // Réinitialiser le texte affiché
    displayTimer();

    // Retirer tous les enfants de gameBoard
    children.forEach(child => {
        if (child !== congratulationsMessage) {
            gameBoard.removeChild(child);
        }
    });
    const viewButton = document.getElementById("solve-button");
    viewButton.style.display = 'block';
    const resolveButton = document.getElementById("solve");
    resolveButton.style.display = 'block';
    initializeGame(); // Réinitialiser le jeu
}

function solveGame() {
    const solveButton = document.getElementById('solve-button'); // Sélectionner le bouton "Résoudre"
    solveButton.style.display = 'none'; // Cacher le bouton "Résoudre"

    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('flip');
        setTimeout(() => {
            card.classList.remove('flip');

        }, 5000); // Révélation pendant 5 secondes
    });
}

// Fonction pour formater le temps (ajouter un zéro en tête si nécessaire)
function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

// Fonction pour afficher le chronomètre
function displayTimer() {
    const timerElement = document.getElementById("timer");
    seconds = 0;
    minutes = 0;

    // Mettre à jour le chronomètre toutes les secondes
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        // Mettre à jour le texte affiché
        timerElement.textContent = formatTime(minutes) + ":" + formatTime(seconds);
    }, 1000); // Mise à jour toutes les secondes
}

function stopTimer() {
    clearInterval(timerInterval); // Arrêter le chronomètre
    totalTime = minutes * 60 + seconds; // Calculer le temps total en secondes
}

function solve() {
    const restartButton = document.getElementById("restart-button");
    const viewButton = document.getElementById("solve-button");
    restartButton.style.display = 'none'
    viewButton.style.display = 'none'
    solveButton.style.display = 'none'; // Cacher le bouton "Résoudre"

    const allCards = document.querySelectorAll('.card');
    const pairs = [];

    // Parcourir toutes les cartes pour trouver les paires
    for (let i = 0; i < allCards.length; i++) {
        for (let j = i + 1; j < allCards.length; j++) {
            const card1 = allCards[i];
            const card2 = allCards[j];
            const value1 = card1.querySelector('.back').textContent;
            const value2 = card2.querySelector('.back').textContent;
            if (value1 === value2) {
                // Retourner les cartes identiques
                setTimeout(() => {
                    flipCard(card1);
                    setTimeout(() => {
                        flipCard(card2);
                    }, 500);
                }, 1000*pairs.length); // Délai progressif pour éviter le chevauchement
                pairs.push(card1, card2);
            }
        }
    }

    // Réafficher le bouton "Résoudre" après que toutes les paires ont été retournées
    setTimeout(() => {
        restartButton.style.display = 'block';
        
    }, 1000 * pairs.length);
}


// Fonction pour afficher le tableau de pointage
function showLeaderboard() {
    const leaderboardModal = document.getElementById('leaderboard-modal');
    leaderboardModal.style.display = 'block';
    fillLeaderboard();
}

// Fonction pour masquer le tableau de pointage
function hideLeaderboard() {
    const leaderboardModal = document.getElementById('leaderboard-modal');
    leaderboardModal.style.display = 'none';
}

// Fonction pour ajouter les données d'un joueur au tableau de scores
function addToLeaderboard(time, score) {
    const timestamp = new Date().getTime(); // Obtient un timestamp unique
    leaderboardData.push({ id: timestamp, time, score });

    // Trie le tableau de scores en fonction du score, du plus élevé au plus bas
    leaderboardData.sort((a, b) => {
        // Si les scores sont différents, trie par score décroissant
        if (a.score !== b.score) {
            return b.score - a.score;
        }
        // Si les scores sont égaux, trie par temps croissant
        return a.time - b.time;
    });

    // Limite le tableau aux 10 meilleurs scores
    leaderboardData = leaderboardData.slice(0, 10);

    // Vérifie si le nouveau score est suffisamment élevé pour être dans le top 10
    const isNewHighScore = leaderboardData.some(player => player.time === time && player.score === score);

    // Affiche un message si le score n'est pas dans le top 10
    if (!isNewHighScore) {
        alert("Désolé! Vous pouvez faire mieux!");
    }
}


// Fonction pour remplir le tableau de pointage avec les données des 10 meilleurs scores
function fillLeaderboard() {
    const leaderboardBody = document.querySelector('#leaderboard-modal tbody');
    // Effacez le contenu existant du tableau
    leaderboardBody.innerHTML = '';

    // Trouver l'index du score avec le timestamp le plus élevé
    let latestScoreIndex = 0;
    for (let i = 1; i < leaderboardData.length; i++) {
        if (leaderboardData[i].id > leaderboardData[latestScoreIndex].id) {
            latestScoreIndex = i;
        }
    }

    // Ajoutez les données des 10 meilleurs scores au tableau de pointage
    leaderboardData.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatTime(player.time)} Sec</td>
            <td style="text-align: center; ">${player.score}</td>
            ${index === latestScoreIndex ? '<td>🡰</td>' : '<td></td>'}
        `;
        leaderboardBody.appendChild(row);
    });
}
// Fonction pour récupérer les résultats à partir des cookies
function getResultsFromCookies() {
    // Récupérer le cookie contenant les données
    const cookies = document.cookie.split(';');
    let resultsCookie = '';
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('memoryGameResults=')) {
            resultsCookie = cookie.substring('=memoryGameResults'.length, cookie.length);
            break;
        }
    }

    // Vérifier si le cookie a été trouvé
    if (resultsCookie) {
        // Convertir la chaîne JSON en objet
        const resultsData = JSON.parse(resultsCookie);
        
        // Récupérer les données individuelles (par exemple, totalTime, score, leaderboard) et les utiliser comme nécessaire
        totalTime = resultsData.totalTime;
        score = resultsData.score;
        leaderboardData = resultsData.leaderboard;
    }
}
// Fonction pour enregistrer les résultats dans les cookies
function saveResultsToCookies() {
    // Créer un objet contenant les données à stocker dans les cookies
    const resultsData = {
        totalTime: totalTime,
        score: score,
        leaderboard: leaderboardData
    };

    // Convertir l'objet en chaîne JSON
    const resultsJSON = JSON.stringify(resultsData);

    // Enregistrer les données dans un cookie avec une durée de validité (expiration) appropriée
    document.cookie = `memoryGameResults=${resultsJSON}; max-age=604800; path=/`; // Exemple: expire après une semaine
}

function clearLeaderboard() {
    // Effacer le contenu du tableau de pointage en supprimant toutes les lignes de tbody
    const leaderboardBody = document.querySelector('#leaderboard-modal tbody');
    leaderboardBody.innerHTML = '';
    leaderboardData = [];

    // Effacer les données du tableau de pointage dans les cookies
    clearLeaderboardCookies();
}

function clearLeaderboardCookies() {
    // Effacer le cookie qui stocke les données du tableau de pointage
    document.cookie = 'memoryGameResults=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}



