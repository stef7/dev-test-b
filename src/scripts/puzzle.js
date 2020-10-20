import { html } from "common-tags";

let numRows;
let numCols;
let numCells;

let container;
let cells = [];
let adjacents = [];
let blankCell;

let startSolved;

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

      const cell = strToElement(
        `<button
          ${isBlank ? 'class="blank"' : ""}
        >${isBlank ? "(blank)" : cellNumber}</button>`
      );

      cell.origIndex = cellNumber - 1;

      cells.push(cell);
      if (isBlank) blankCell = cell;
    });
  });

  // shuffle cells and append as children to our container
  container = strToElement(
    `<div data-rows="${numRows}" data-cols="${numCols}"></div>`
  );

  if (!startSolved) shuffle(cells);
  cells.forEach((cell) => container.appendChild(cell));
};


const addElements = function () {
  createElements();
  document.body.appendChild(container);
};

const cellsInSequence = function() {
  return cells.every(cell => cells.indexOf(cell) === cell.origIndex);
};

// math utils for position...
const rowNum = i => Math.ceil((i + 1) / numCols);
const colNum = i => (i % numCols) + 1;
const getAdjacentCells = function() {
  adjacents = [];
  const i = cells.indexOf(blankCell);

  const row = rowNum(i);
  if (row !== 1) adjacents.push(i - numCols); // cell above if not first row
  if (row !== numRows) adjacents.push(i + numCols); // cell below if not last row
  
  const col = colNum(i);
  if (col !== 1) adjacents.push(i - 1); // cell before if not first col
  if (col !== numCols) adjacents.push(i + 1); // cell after if not last col

  adjacents = adjacents.map(ci => cells[ci]);
};

const isSolved = function() {
  document.documentElement.classList.toggle('is-solved', cellsInSequence());
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

  cells = Array.from(obj2.parentNode.children);
  isSolved();
}

const adjacentsOn = function() {
  console.log('adjacentsOn', getAdjacentCells(), adjacents);
  adjacents.forEach(cell => {
    cell.addEventListener('click', onCellClick, false);
    cell.classList.add('adjacent');
  });
  isSolved();
};

const adjacentsOff = function() {
  console.log('adjacentsOff', adjacents);
  adjacents.forEach(cell => {
    cell.removeEventListener('click', onCellClick, false);
    cell.classList.remove('adjacent');
  });
};

const onCellClick = function(event) {
  adjacentsOff();
  swapElements(event.target, blankCell);
  adjacentsOn();
};

const init = function (rows, cols, solved) {
  numRows = rows;
  numCols = cols;
  numCells = rows * cols;
  startSolved = solved;

  addElements();
  adjacentsOn();

  window.debug = {
    cells,
  }
};

export default init;
