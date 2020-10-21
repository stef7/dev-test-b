import puzzle from "./puzzle";

const init = function () {
  puzzle(4, 4, false);
  // supports 2->4 cols/rows
  // -> danger - small numbers might make some sequences impossible to arrange to
  // last argument = 'startSolved' boolean
};

init();
