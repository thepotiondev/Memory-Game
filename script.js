let score = 0;
let initialTimeMultiplier = 10;
let timeReductionFactor = 0.1;
let minimumTimeMultipler = 1.0;
const timerDiv = document.createElement("div");
const scoreDiv = document.querySelector("#score");
const startButton = document.querySelector("button");
const gameTitle = document.querySelector("h1");

startButton.addEventListener("click", startGame);

let intervalID = 0;
function startGame(event){
  timerDiv.textContent = "";
  createDivsForColors(shuffledColors);
  startButton.remove();
  gameTitle.remove();
  scoreDiv.textContent = 'Score: 0';
  scoreDiv.classList.add('visible');
  let startTime = Date.now();

  intervalID = setInterval(function() {
    updateTimer(timerDiv, startTime);
  }, 1000);

}

function updateTimer(timerDiv, startTime){
  const now = Date.now();
  timerDiv.textContent = Math.floor((now - startTime) / 1000);
}


function updateScore(){
  let elapsedTime = parseFloat(timerDiv.textContent)
  let timeMultiplier = Math.max(minimumTimeMultipler, initialTimeMultiplier - (elapsedTime) * (timeReductionFactor));
  score =  Math.floor(score + timeMultiplier);
  scoreDiv.textContent = `Score: ${score}`;
}


const gameContainer = document.getElementById("game");

const images = {
  sword: ['faceDown', 'faceUp']
};

const cards = [
  "sword",
  "shield",
  "bow",
  "castle",
  "sword",
  "shield",
  "bow",
  "castle",
  "sword",
  "shield",
  "bow",
  "castle",
  "sword",
  "shield",
  "bow",
  "castle",
  "sword",
  "shield",
  "bow",
  "castle",
  "sword",
  "shield",
  "bow",
  "castle"
];

let flipCount = 0;
let flippedCards = {
  'Card 1': undefined,
  'Card 2': undefined
}

let allowCardFlips = true;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(cards);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let i = 0; i <= cards.length-1; i++) {
    // creates a 

    // create a new div
    const cardDiv = document.createElement("div");

    // place the timer div at the center of the game grid.
    if (i === cards.length/2){
      timerDiv.className = "timer";
      gameContainer.append(timerDiv);
    }

    // give it a class attribute for the value we are looping over
    cardDiv.classList.add(cards[i]);
    cardDiv.setAttribute('data-state', 'faceDown');

    // call a function handleCardClick when a div is clicked on
    cardDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(cardDiv);
  }


}

// TODO: Implement this function!
let matchedPairs = 0;
let resetButton = document.createElement("button");
function handleCardClick(event) {


  if (!allowCardFlips){
    return;

  }
  else if (event.target.getAttribute('data-state') === 'faceUp'){
    return;
  }

  flipCount++;
  // Change the data-state of the card to faceUP if flipCount <= 2

  if (flipCount <= 2){
    event.target.setAttribute('data-state', 'faceUp');
    flippedCards[`Card ${flipCount}`] = event.target;
  }

  if (flipCount === 2){
    allowCardFlips = false;
    let firstCard = flippedCards['Card 1'].classList[0];
    let secondCard = flippedCards ['Card 2'].classList[0];

    if (firstCard != secondCard){
      setTimeout(function(){
        flippedCards['Card 1'].setAttribute('data-state', 'faceDown');
        flippedCards['Card 2'].setAttribute('data-state', 'faceDown');
        flippedCards['Card 1'] = undefined;
        flippedCards['Card 2'] = undefined;
        allowCardFlips = true;
      }, 1000);
    }

    else {
      flippedCards['Card 1'] = undefined;
      flippedCards['Card 2'] = undefined;
      allowCardFlips = true;
      updateScore();
      matchedPairs++;
    }
    flipCount = 0;
  }

  if (matchedPairs === cards.length / 2){
    clearInterval(intervalID);
    timerDiv.textContent = "Reset";
    timerDiv.className = "reset";
    timerDiv.addEventListener("click", resetGame);
  }
}

function resetGame(event){
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
  matchedPairs = 0;
  score = 0;
  shuffledColors = shuffle(cards);
  startGame(event);
  timerDiv.removeEventListener("click", resetGame);
}