let unitLength = 15;
let strokeColor = 0; /*color of border */
let backgroundColor = 0;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let RWDcolumns; /* To be determined by window width */
let RWDrows; /* To be determined by window height */
let RWDcurrentBoard;
let RWDnextBoard;
let fr = 30; /*frame rate */
let drawRect = 40; /*value of shape */
let life = 0; /*color of life */
let sur = 2; /*survival rules */
let sur2 = 3;
let rep = 3; /*repoduction rules */
let survival = document.querySelector("#surInput"); /*new survival rules */
let reproduction =
  document.querySelector("#repInput"); /*new repoduction rules */
let StartGame = "Start"; /*start / pause game */
let StopGame = "Stop";
let state = true;
let style = false; /*change styke */
let colorTheme = false;

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth / 2, windowHeight / 2);
  canvas.parent(document.getElementById("canvas"));
  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  frameRate(fr);
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard
}

/**
 * Initialize/reset the board state
 */
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

function init2() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = random() > 0.8 ? 1 : 0;
      nextBoard[i][j] = 0;
    }
  }
}

function draw() {
  background(backgroundColor);
  generate(sur, sur2, rep);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        let dot = Math.floor(Math.random() * 16777215).toString(16);
        let color = "#" + dot;
        fill(color);
      } else {
        fill(life);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength, drawRect);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth / 2, windowHeight / 2);
  // RWDcolumns = floor(width / unitLength);
  // RWDrows = floor(height / unitLength);
  // RWDcurrentBoard = [];
  // RWDnextBoard = [];

  // for (let i = 0; i < columns; i++) {
  //   RWDcurrentBoard[i] = [];
  //   RWDnextBoard[i] = [];
  // }

  // for (let i = 0; i < columns; i++) {
  //   for (let j = 0; j < rows; j++) {
  //     RWDcurrentBoard[i][j] = 0;
  //     RWDnextBoard[i][j] = 0;
  //   }
  // }

  // currentBoard = RWDcurrentBoard;
  // nextBoard = RWDnextBoard;
}

/**
 * survial & reproduction rules
 */
document.querySelector("#surInput").addEventListener("input", inputValue);
document.querySelector("#surInput2").addEventListener("input", inputValue);
document.querySelector("#repInput").addEventListener("input", inputValue);

function inputValue() {
  survival = document.querySelector("#surInput");
  survival2 = document.querySelector("#surInput2");
  reproduction = document.querySelector("#repInput");
  sur = survival.value;
  sur2 = survival2.value;
  rep = reproduction.value;
}

function generate(sur, sur2, rep) {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < sur) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > sur2) {
        // Die of overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == rep) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  let dot = Math.floor(Math.random() * 16777215).toString(16);
  let color = "#" + dot;
  fill(color);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength, drawRect);
}

/**
 * rest game button
 */
document.querySelector("#reset-game").addEventListener("click", function () {
  loop();
  init();
});

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop();
  mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
  // loop();
  if (document.querySelector("#gameState").innerHTML == StopGame) {
    loop();
  } else if (document.querySelector("#gameState").innerHTML == StartGame) {
    noLoop();
  }
}

/**
 * range silder
 */
function sliderValue() {
  var range = document.getElementById("customRange3");
  fr = parseInt(range.value);
  frameRate(fr);
  document.getElementById("rageStats").innerHTML = "Game Speed: " + fr;
}

/**
 * change unit
 */
function setunitLength() {
  var unit = document.getElementById("customRange");
  unitLength = parseInt(unit.value);
  document.getElementById("unitStats").innerHTML =
    "Current unit: " + unitLength;
}

/**
 * pause / start keydown
 */
document.addEventListener("keydown", function (event) {
  if (
    document.querySelector("#gameState").innerHTML == StopGame &&
    event.key === " "
  ) {
    noLoop();
    document.querySelector("#gameState").innerHTML = StartGame;
    state = true;
  } else if (
    document.querySelector("#gameState").innerHTML == StartGame &&
    event.key === " "
  ) {
    loop();
    document.querySelector("#gameState").innerHTML = StopGame;
    state = false;
  }
});

/**
 * reset key
 */
document.addEventListener("keydown", function (event) {
  if (event.key === "r") {
    loop();
    init();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "t") {
    if (document.querySelector("#gameState").innerHTML == StopGame) {
      init2();
      loop();
    } else if (document.querySelector("#gameState").innerHTML == StartGame) {
      init2();
      noLoop();
    }
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "g") {
    if (style == false) {
      drawRect = 0;
      style = true;
    } else {
      drawRect = 40;
      style = false;
    }
  }
});

/**
 * start & pause button
 */
document.querySelector("#gameState").addEventListener("click", function () {
  if (document.querySelector("#gameState").innerHTML == StopGame) {
    noLoop();
    document.querySelector("#gameState").innerHTML = StartGame;
    state = true;
  } else if (document.querySelector("#gameState").innerHTML == StartGame) {
    loop();
    document.querySelector("#gameState").innerHTML = StopGame;
    state = false;
  }
});

document.querySelector("#random").addEventListener("click", function () {
  if (document.querySelector("#gameState").innerHTML == StopGame) {
    init2();
    loop();
  } else if (document.querySelector("#gameState").innerHTML == StartGame) {
    init2();
    loop();
    noLoop();
  }
});

document.querySelector("#shape").addEventListener("click", function () {
  if (style == false) {
    drawRect = 0;
    style = true;
  } else {
    drawRect = 40;
    style = false;
  }
});

document.querySelector("#theme").addEventListener("click", function () {
  if (colorTheme == false) {
    colorTheme = true;
    document.body.style.backgroundImage = "url('lightTheme.jpeg')";
    var fontColor = document.querySelectorAll(
      ".fontColor, .form-lable, .form-label"
    );
    for (var i = 0; i < fontColor.length; i++) {
      fontColor[i].style.color = "black";
    }
    backgroundColor = 255;
    life = 255;
    strokeColor = 255;
    // var lableColor = document.querySelectorAll(".form-lable, .form-lable");
    // for (var j = 0; j < lableColor.length; j++) {
    //   lableColor[i].style.color = "black";
    // }
  } else if (colorTheme == true) {
    colorTheme = false;
    document.body.style.backgroundImage = "url('spaceBackground.png')";
    var fontColor = document.querySelectorAll(
      ".fontColor, .form-lable, .form-label"
    );
    for (var i = 0; i < fontColor.length; i++) {
      fontColor[i].style.color = "white";
    }
    backgroundColor = 0;
    life = 0;
    strokeColor = 0;
    // var lableColor = document.querySelectorAll(".form-lable, .form-lable");
    // for (var j = 0; j < lableColor.length; j++) {
    //   lableColor[i].style.color = "white";
    // }
  }
});

// https://conwaylife.appspot.com/library
