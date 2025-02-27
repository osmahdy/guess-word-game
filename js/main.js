let game_section = document.querySelector(`.game .sections .game_section`);
let keys_section = document.querySelector(`.game .sections .keys_section`);
let inputsDiv = document.querySelector(`.game .sections .game_section .inputs`);
let checkBtn = document.querySelector(`.game .sections .game_section .btns .check`);
let hintBtn = document.querySelector(`.game .sections .game_section .btns .hint`);
let HintsNumEL = document.querySelector(`.game .sections .game_section .btns .hint span`);
let messege = document.querySelector(`.game .messege`);
let messegeWord = document.querySelector(`.game .messege p`);

const words = ['sky', 'code', 'apple', 'planet', 'rocket', 'hunter', 'vision', 'sprint', 'danger', 'tunnel', 'cipher', 'rescue', 'winter', 'racing', 'silent'];
let currentTry = 1;

let r1 = Math.floor(Math.random() * words.length);
let word = words[r1].toUpperCase();
let numberOfLetters = word.length;
let hintsNumber = Math.floor(word.length / 2);

function generateInputs() {
  for (let i = 1; i <= numberOfLetters; i++) {
    let tryDiv = document.createElement('div');
    let label = document.createElement('label');
    tryDiv.classList.add(`try`);
    tryDiv.classList.add(`try${i}`);
    label.textContent = `try${i}`;
    tryDiv.appendChild(label);
    if (i !== 1) tryDiv.classList.add('disabled');
    for (let j = 1; j <= numberOfLetters; j++) {
      let input = document.createElement('input');
      input.type = 'text';
      input.className = 'input';
      input.id = `guess${i}-letter${j}`;
      input.setAttribute('maxlength', 1);
      tryDiv.appendChild(input);
    }
    inputsDiv.appendChild(tryDiv);
  }
  //focus on first element
  inputsDiv.children[0].children[1].focus();

  //disable all inputsDiv in the disabled try divs
  let inputInDisableDiv = document.querySelectorAll(`.disabled .input`);
  inputInDisableDiv.forEach((input) => {
    input.disabled = true;
  });

  //make the value of the input appear as a small letter
  let inputs = document.querySelectorAll(`.input`);
  inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.toUpperCase();
      let nextinput = inputs[index + 1];
      if (nextinput) nextinput.focus();
    });
  });

  //move to left and right using keyboard arrows
  inputs.forEach((input, index) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        let nextinput = inputs[index + 1];
        if (nextinput) nextinput.focus();
      }
      if (event.key === 'ArrowLeft') {
        let lastinput = inputs[index - 1];
        if (lastinput) lastinput.focus();
      }
      if (event.key === 'Enter') {
        checkBtn.click();
      }
    });
  });
}

checkBtn.addEventListener('click', handleChecks);
hintBtn.addEventListener('click', getHint);
HintsNumEL.textContent = hintsNumber;

function handleBackspace(event) {
  if (event.key === 'Backspace') {
    let inputs = document.querySelectorAll(`input:not([disabled])`);
    let currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      let currentInput = inputs[currentIndex];
      let prevInput = inputs[currentIndex - 1];
      currentInput.value = '';
      prevInput.value = '';
      prevInput.focus();
    }
  }
}

document.addEventListener('keydown', handleBackspace);
function handleChecks() {
  let successGuess = true;
  // loop on inputs and check the validity of them
  for (let i = 1; i <= numberOfLetters; i++) {
    let inputField = document.querySelector(`#guess${currentTry}-letter${i}`);
    let writtenLetter = inputField.value.toUpperCase();
    let actualLetter = word[i - 1];
    if (writtenLetter === actualLetter && writtenLetter !== '') {
      inputField.classList.add('in-place');
    } else if (word.includes(writtenLetter) && writtenLetter !== '') {
      inputField.classList.add('not-in-place');
      successGuess = false;
    } else {
      inputField.classList.add('not');
      successGuess = false;
    }
  }
  if (successGuess) {
    messege.innerHTML = `Winner Winner Checken Dinner<br>Right Answer Is: <span>${word}</span>`;

    //disable all divs
    let inputsDivs = document.querySelectorAll(`.inputs > div`);
    let inputsFild = document.querySelectorAll(`.inputs > div .input`);

    inputsDivs.forEach((div) => {
      div.classList.add('disabled');
      inputsFild.forEach((inp) => (inp.disabled = true));
      checkBtn.setAttribute('disabled', true);
      hintBtn.setAttribute('disabled', true);
    });
  } else {
    moveToNextLine();
  }
}

function moveToNextLine() {
  document.querySelector(`.try${currentTry}`).classList.add(`disabled`);
  let currentTryInputs = document.querySelectorAll(`.try${currentTry} .input`);
  currentTryInputs.forEach((input) => (input.disabled = true));
  currentTry++;

  let nextTryInputs = document.querySelectorAll(`.try${currentTry} .input`);
  nextTryInputs.forEach((input) => (input.disabled = false));

  let el = document.querySelector(`.try${currentTry}`);
  if (el) {
    document.querySelector(`.try${currentTry}`).classList.remove(`disabled`);
    nextTryInputs[0].focus();
  } else {
    messege.innerHTML = `Loser Loser Bad Chooser<br>Right Answer Is:  <span>${word}</span>`;
    checkBtn.setAttribute('disabled', true);
    hintBtn.setAttribute('disabled', true);
  }
}
function getHint() {
  if (hintsNumber > 0) {
    hintsNumber--;
    HintsNumEL.textContent = hintsNumber;
  }
  if (hintsNumber === 0) {
    hintBtn.setAttribute('disabled', true);
  }

  // Find the first row that is currently being played
  let activeRow = document.querySelector(`.try${currentTry}`);
  if (!activeRow) return; // No active row means game is over

  // Get all inputs in the active row
  let activeInputs = activeRow.querySelectorAll('.input');

  // Find the first empty input in the active row
  let emptyInputs = Array.from(activeInputs).filter((input) => input.value === '');

  if (emptyInputs.length > 0) {
    let randomIndex = Math.floor(Math.random() * emptyInputs.length);
    let randomInput = emptyInputs[randomIndex];

    // Extract the letter position from the input's ID (e.g., "guess1-letter3" → position = 3)
    let letterPosition = parseInt(randomInput.id.split('-letter')[1]) - 1; // Convert to zero-based index
    // Insert the correct letter in its correct position
    randomInput.value = word[letterPosition].toUpperCase();
  }
}

window.onload = () => {
  generateInputs();
};

let footerYear = document.querySelector(`footer .year`);
let date = new Date();
footerYear.textContent = date.getFullYear();
