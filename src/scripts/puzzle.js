import { html } from "common-tags";

let numRows;
let numCols;
let numCells;

let container;
const cells = [];
let actionCells = [];
let blankCell;

// UTILS:
// create 'undefined' arrays to loop/map over
const arr = (length) => Array.from({ length });

// shuffle children - better than usual method:
// https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
// create element from html string
const strToElement = (htmlStr) => {
  const template = document.createElement("template");
  template.innerHTML = html`${htmlStr}`;
  return template.content.firstElementChild;
};

const createElements = function () {
  let cellNumber = 0;

  arr(numRows).forEach((r, rowIndex) => {
    arr(numCols).forEach((c, colIndex) => {
      cellNumber += 1;
      
      const isBlank = cellNumber === numCells;

      const cell = strToElement(`
        <li
          `/*data-row="${rowIndex}"
          data-col="${colIndex}"
          data-index="${cellNumber - 1}"*/+`
          data-number="${cellNumber}"
          ${isBlank ? 'class="blank"' : ""}
        >${isBlank ? "(blank)" : cellNumber}</li>
      `);

      cell.origIndex = cellNumber - 1;

      cells.push(cell);
      if (isBlank) blankCell = cell;
    });
  });

  // shuffle cells and append as children to our container
  container = strToElement(
    `<ul data-rows="${numRows}" data-cols="${numCols}"></ul>`
  );
  shuffle(cells).forEach((cell) => container.appendChild(cell));
};


const addElements = function () {
  createElements();
  document.body.appendChild(container);
};

const cellsInSequence = function() {
  return cells.every(cell => cells.indexOf(cell) === cell.origIndex);
};

const getAdjacentCells = function(targetCell) {
  
};

const swapElements = function(obj1, obj2) {
  // taken from https://stackoverflow.com/questions/10716986/swap-two-html-elements-and-preserve-event-listeners-on-them/10717422#10717422 to save time:
  var parent2 = obj2.parentNode;
  var next2 = obj2.nextSibling;
  if (next2 === obj1) {
      parent2.insertBefore(obj1, obj2);
  } else {
      obj1.parentNode.insertBefore(obj2, obj1);
      if (next2) {
          parent2.insertBefore(obj1, next2);
      } else {
          parent2.appendChild(obj1);
      }
  }

  cells = Array.from(obj2.parentNode);
}

const onCellClick = function(event) {
  unbindClicks();
  swapElements(event.target, blankCell);
  bindClicksToAdjacent(event.target);
  
};

const addListeners = function () {
  cells.forEach(cell => cell.addEventListener('click', onCellClick, true));
};

const init = function (rows, cols) {
  numRows = rows;
  numCols = cols;
  numCells = rows * cols;

  addElements();
  addListeners();
};

export default init;
