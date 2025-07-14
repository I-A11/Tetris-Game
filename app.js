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
  let gameEnded = false; // Track game state
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

  //randomly select a tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //draw the tetromino
  const draw = () => {
    current.forEach((index) => {
      squares[currentposition + index].classList.add("tetromino");
      squares[currentposition + index].style.backgroundColor = colors[random];
    });
  };

  //undraw the tetromino
  const undraw = () => {
    current.forEach((index) => {
      squares[currentposition + index].classList.remove("tetromino");
      squares[currentposition + index].style.backgroundColor = "";
    });
  };

  //assign function to keyCodes
  function control(e) {
    if (gameEnded) return; // Don't process input if game is over

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
  left.addEventListener("click", () => {
    if (!gameEnded) moveLeft();
  });
  right.addEventListener("click", () => {
    if (!gameEnded) moveRight();
  });
  up.addEventListener("click", () => {
    if (!gameEnded) rotate();
  });
  down.addEventListener("click", () => {
    if (!gameEnded) moveDown();
  });

  // move down function
  function moveDown() {
    if (gameEnded) return;

    undraw();
    currentposition += width;
    draw();
    freeze();
  }

  // Improved game over function
  function gameOver() {
    gameEnded = true;
    clearInterval(timerId);
    timerId = null;
    scoreDisplay.innerHTML = "GAME OVER";

    // Optional: Change button text to restart
    startBtn.textContent = "Restart";
  }

  // Check if tetromino can be placed at current position
  function canPlaceTetromino(position, tetromino) {
    return tetromino.every((index) => {
      const squareIndex = position + index;
      // Check if square exists and is not taken
      return (
        squares[squareIndex] &&
        !squares[squareIndex].classList.contains("taken")
      );
    });
  }

  //freeze function
  function freeze() {
    if (gameEnded) return;

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
      currentRotation = 0;
      currentposition = 4;
      current = theTetrominoes[random][currentRotation];

      //Check game over - if new tetromino can't be placed at starting position
      if (!canPlaceTetromino(currentposition, current)) {
        gameOver();
        return;
      }

      draw();
      displayShape();
      addScore();
    }
  }

  // move the tetromino left, unless is at the edge or there is blockage
  function moveLeft() {
    if (gameEnded) return;

    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentposition + index) % width === 0
    );
    if (!isAtLeftEdge) currentposition -= 1;
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
    if (gameEnded) return;

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
    if (gameEnded) return;

    undraw();
    currentRotation++;
    if (currentRotation === theTetrominoes[random].length) {
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
    //remove any trace of a tetromino from the entire grid
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

  // Reset game function
  function resetGame() {
    gameEnded = false;
    score = 0;
    currentposition = 4;
    currentRotation = 0;
    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];

    // Clear all squares
    squares.forEach((square) => {
      square.classList.remove("tetromino", "taken");
      square.style.backgroundColor = "";
    });

    // Reset display
    scoreDisplay.innerHTML = score;
    startBtn.textContent = "Start/Pause";

    // Clear mini-grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
  }

  //add functionality to the button
  startBtn.addEventListener("click", () => {
    if (gameEnded) {
      resetGame();
      return;
    }

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
    if (gameEnded) return;

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
        i -= width; // Check the same row again after shifting
      }
    }
  }
});
