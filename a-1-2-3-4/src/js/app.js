import { html } from "common-tags";

const app = (function (window, document) {
  // settings for 'table'
  const numRows = 4;
  const numCols = 4;
  const numCells = numRows * numCols;

  // utility for creating 'undefined' arrays to loop/map over
  const arr = (length) => Array.from({ length });
  // utility for shuffling children which is better than the usual:
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

  // create elements
  const items = [];
  let cellNumber = 0;
  arr(numRows).forEach((v, ri) => {
    arr(numCols).forEach((v, ci) => {
      cellNumber += 1;
      const isBlank = cellNumber === numCells;

      const cell = html`
        <li
          data-row="${ri}"
          data-col="${ci}"
          data-index="${cellNumber - 1}"
          data-number="${cellNumber}"
          ${isBlank ? "data-blank" : ""}
        >
          ${isBlank ? "(blank)" : cellNumber}
        </li>
      `;

      cell.origIndex = cellNumber - 1;

      items.push(cell);
    });
  });

  // shuffle cells and append as children to our container
  const container = html`<ul
    data-rows="${numRows}"
    data-cols="${numCols}"
  ></ul>`;
  shuffle(cells).forEach((cell) => container.appendChild(cell));

  const appendElements = function () {
    document.body.appendChild(container);
  };

  const init = function () {
    appendElements();
    addListeners();
  };

  init();

  const obj = {};

  return obj;
})(window, document);

console.trace("app.js", app);
