document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-btn");
  const left = document.querySelector("#left");
  const right = document.querySelector("#right");
  const up = document.querySelector("#up");
  const down = document.querySelector("#down");

  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];

  //The Tetrominoes arrays
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  let currentposition = 4;
  let currentRotation = 0;

  //radomly select a tetromino and its fist rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //draw the tetromino
  const draw = () => {
    current.forEach((index) => {
      squares[currentposition + index].classList.add("tetromino");
      squares[currentposition + index].style.backgroundColor = colors[random];
    });
  };

  //undraw the tetromio
  const undraw = () => {
    current.forEach((index) => {
      squares[currentposition + index].classList.remove("tetromino");
      squares[currentposition + index].style.backgroundColor = "";
    });
  };

  //assign function to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode == 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);

  //adding function to screen arrows
  left.addEventListener("click", moveLeft);
  right.addEventListener("click", moveRight);
  up.addEventListener("click", rotate);
  down.addEventListener("click", moveDown);

  // move down function
  function moveDown() {
    undraw();
    currentposition += width;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentposition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentposition + index].classList.add("taken")
      );
      //start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentposition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }
  // move the tetromino left, unless is at the edge or there is blockage
  function moveLeft() {
    undraw();
    const isAteftEdge = current.some(
      (index) => (currentposition + index) % width === 0
    );
    if (!isAteftEdge) currentposition -= 1;
    if (
      current.some((index) =>
        squares[currentposition + index].classList.contains("taken")
      )
    ) {
      currentposition += 1;
    }
    draw();
  }

  // move the tetromino right, unless is at the edge or there is blockage
  function moveRight() {
    undraw();
    const isRightEdge = current.some(
      (index) => (currentposition + index) % width === width - 1
    );
    if (!isRightEdge) currentposition += 1;
    if (
      current.some((index) =>
        squares[currentposition + index].classList.contains("taken")
      )
    ) {
      currentposition -= 1;
    }
    draw();
  }
  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    //if current rotation gets to 4 make it go back to 0
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }
  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 4;

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  //add functionalty to the button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
  // game over

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentposition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
  /////////////////////////
});
