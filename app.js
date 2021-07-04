document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-btn");
  const width = 10;
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
  // console.log(current);

  //draw the tetromino
  const draw = () => {
    current.forEach((index) => {
      squares[currentposition + index].classList.add("tetromino");
    });
  };

  //undraw the tetromio
  const undraw = () => {
    current.forEach((index) => {
      squares[currentposition + index].classList.remove("tetromino");
    });
  };

  //make the tetromino move down
  timerId = setInterval(moveDown, 1000);
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
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentposition = 4;
      draw();
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

  /////////////////////////
});
