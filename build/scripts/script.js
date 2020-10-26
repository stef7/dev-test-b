(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var numRows;
var numCols;
var numCells;
var container;
var cells = [];
var adjacents = [];
var blankCell;
var startSolved; // UTILS:
// shuffle children - better than usual method:
// https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb

var shuffle = function shuffle(array) {
  for (var i = array.length - 1; i > 0; i -= 1) {
    var j = Math.floor(Math.random() * i);
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}; // create element from html string


var strToElement = function strToElement(htmlStr) {
  var template = document.createElement("template");
  template.innerHTML = htmlStr;
  return template.content.firstElementChild;
};

var createElements = function createElements() {
  var cellNumber = 0;

  for (var i = 0; i < numRows; i += 1) {
    for (var j = 0; j < numCols; j += 1) {
      cellNumber += 1;
      var isBlank = cellNumber === numCells;
      var cell = strToElement("<button\n          ".concat(isBlank ? 'class="blank"' : "", "\n          tabindex=\"-1\"\n        >").concat(isBlank ? "(blank)" : cellNumber, "</button>"));
      cell.origIndex = cellNumber - 1;
      cells.push(cell);
      if (isBlank) blankCell = cell;
    }
  } // shuffle cells and append as children to our container


  container = strToElement("<div data-rows=\"".concat(numRows, "\" data-cols=\"").concat(numCols, "\"></div>"));
  if (!startSolved) shuffle(cells);
  cells.forEach(function (cell) {
    return container.appendChild(cell);
  });
};

var addElements = function addElements() {
  createElements();
  document.body.appendChild(container);
};

var cellsInSequence = function cellsInSequence() {
  return cells.every(function (cell) {
    return cells.indexOf(cell) === cell.origIndex;
  });
}; // math utils for position...


var rowNum = function rowNum(i) {
  return Math.ceil((i + 1) / numCols);
};

var colNum = function colNum(i) {
  return i % numCols + 1;
};

var getAdjacentCells = function getAdjacentCells() {
  var adjacentInds = [];
  var i = cells.indexOf(blankCell);
  var row = rowNum(i);
  if (row !== 1) adjacentInds.push(i - numCols); // cell above if not first row

  if (row !== numRows) adjacentInds.push(i + numCols); // cell below if not last row

  var col = colNum(i);
  if (col !== 1) adjacentInds.push(i - 1); // cell before if not first col

  if (col !== numCols) adjacentInds.push(i + 1); // cell after if not last col

  adjacents = adjacentInds.map(function (ai) {
    return cells[ai];
  });
};

var isSolved = function isSolved() {
  document.documentElement.classList.toggle('is-solved', cellsInSequence());
};

var swapElements = function swapElements(obj1, obj2) {
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
};

var adjacentsOn = function adjacentsOn() {
  console.log('adjacentsOn', getAdjacentCells(), adjacents);
  adjacents.forEach(function (cell) {
    cell.addEventListener('click', onCellClick, false);
    cell.classList.add('adjacent');
    cell.tabIndex = 0;
  });
  isSolved();
};

var adjacentsOff = function adjacentsOff() {
  console.log('adjacentsOff', adjacents);
  adjacents.forEach(function (cell) {
    cell.removeEventListener('click', onCellClick, false);
    cell.classList.remove('adjacent');
    cell.tabIndex = -1;
  });
};

var onCellClick = function onCellClick(event) {
  adjacentsOff();
  swapElements(event.target, blankCell);
  adjacentsOn();
};

var init = function init(rows, cols, solved) {
  numRows = rows;
  numCols = cols;
  numCells = rows * cols;
  startSolved = solved;
  addElements();
  adjacentsOn();
};

var _default = init;
exports["default"] = _default;

},{}],2:[function(require,module,exports){
"use strict";

var _puzzle = _interopRequireDefault(require("./puzzle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var init = function init() {
  (0, _puzzle["default"])(4, 4, false); // supports 2->4 cols/rows
  // -> danger - small numbers might make some sequences impossible to arrange to
  // last argument = 'startSolved' boolean
};

init();

},{"./puzzle":1}]},{},[2])

//# sourceMappingURL=script.js.map
