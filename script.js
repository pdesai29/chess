const chessBoard = document.querySelector("#chessBoard");
let playerTurn = "black";
const width = 8;

const startPosition = [
  rookB,
  knightB,
  bishopB,
  queenB,
  kingB,
  bishopB,
  knightB,
  rookB,
  pawnB,
  pawnB,
  pawnB,
  pawnB,
  pawnB,
  pawnB,
  pawnB,
  pawnB,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawnW,
  pawnW,
  pawnW,
  pawnW,
  pawnW,
  pawnW,
  pawnW,
  pawnW,
  rookW,
  knightW,
  bishopW,
  queenW,
  kingW,
  bishopW,
  knightW,
  rookW,
];

function changePlayerTurn() {
  if (playerTurn === "black") {
    reverseBoard();
    playerTurn = "white";
    changeCursor(playerTurn);
  } else if (playerTurn === "white") {
    revertBoard();
    playerTurn = "black";
    changeCursor(playerTurn);
  }
}

function changeCursor(color) {
  if (color === "black") {
    chessBoard.style.cursor = `url('data:image/svg+xml;utf8,${encodeURIComponent(
      cursorB
    )}'), auto`;
  } else {
    chessBoard.style.cursor = ``;
  }
}
const setUpBoard = () => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
  let countFile, row, squareString;
  startPosition.forEach((chessMan, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    row = Math.floor((63 - i) / 8) + 1;
    countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
    squareString = `${ranks[row - 1]}-${files[countFile]}`;
    square.setAttribute("square-id", squareString);
    square.setAttribute("id", i);

    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "bgSkin" : "bgGreen");
    } else {
      square.classList.add(i % 2 === 0 ? "bgGreen" : "bgSkin");
    }
    square.innerHTML = chessMan;
    chessBoard.append(square);
    // square.append(place);

    if (square?.hasChildNodes()) {
      square.firstChild.setAttribute("draggable", true);
    }
    changeCursor(playerTurn);
  });
};
setUpBoard();

const draggableSquares = document.querySelectorAll(".square");
draggableSquares.forEach((element) => {
  element.addEventListener("dragstart", handleDragStart);
  element.addEventListener("dragover", handleDragOver);
  element.addEventListener("drop", handleDrop);
});

let startPositionId, draggedChessman;
function handleDragStart(e) {
  startPositionId = e.target.parentNode.getAttribute("id");
  draggedChessman = e.target;
}
function handleDragOver(e) {
  e.preventDefault();
}
function handleDrop(e) {
  e.stopPropagation();
  const correctPlayerTurn =
    draggedChessman.firstChild.classList.contains(playerTurn);
  const taken = e.target.classList.contains("chessMan");
  const opponentTurn = playerTurn === "black" ? "white" : "black";
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentTurn);
  const validMove = checkValidMove(e.target);
  console.log(validMove);
  if (correctPlayerTurn) {
    if (takenByOpponent && validMove) {
      e.target.parentNode.append(draggedChessman);
      e.target.remove();
      changePlayerTurn();
      return;
    }
    if (taken && !takenByOpponent) {
      console.log("can't go here");
      return;
    }
    if (validMove) {
      e.target.append(draggedChessman);
      changePlayerTurn();
      return;
    }
  }
}
function reverseBoard() {
  const allSquare = document.querySelectorAll(".square");
  allSquare.forEach((square, i) => {
    square.setAttribute("id", width * width - 1 - i);
  });
}
function revertBoard() {
  const allSquare = document.querySelectorAll(".square");
  allSquare.forEach((square, i) => {
    square.setAttribute("id", i);
  });
}
function checkValidMove(target) {
  const targetId =
    Number(target.getAttribute("id")) ||
    Number(target.parentNode.getAttribute("id"));
  const startId = Number(startPositionId);
  const chessMan = draggedChessman.id.slice(0, draggedChessman.id.length - 1);
  switch (chessMan) {
    case "pawn":
      return pawn(startId, targetId);
    case "knight":
      return knight(startId, targetId);
    case "bishop":
      return bishop(startId, targetId);
    case "rook":
      return rook(startId, targetId);
    case "queen":
      return queen(startId, targetId);
    case "king":
      return king(startId, targetId);
  }
}
function pawn(startId, targetId) {
  const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
  if (
    (starterRow.includes(startId) && startId + width * 2 === targetId) ||
    startId + width === targetId ||
    (startId + width - 1 === targetId &&
      document.getElementById(`${startId + width - 1}`)?.hasChildNodes()) ||
    (startId + width + 1 === targetId &&
      document.getElementById(`${startId + width + 1}`)?.hasChildNodes())
  ) {
    return true;
  } else {
    return false;
  }
}
function knight(startId, targetId) {
  if (
    startId + width * 2 - 1 === targetId ||
    startId + width * 2 + 1 === targetId ||
    startId + width - 2 === targetId ||
    startId + width + 2 === targetId ||
    startId - width * 2 - 1 === targetId ||
    startId - width * 2 + 1 === targetId ||
    startId - width - 2 === targetId ||
    startId - width + 2 === targetId
  ) {
    return true;
  } else {
    return false;
  }
}

function bishop(startId, targetId) {
  console.log(startId - width - 1);
  if (
    startId + width + 1 === targetId ||
    (startId + width * 2 + 2 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes()) ||
    (startId + width * 3 + 3 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 2 + 2}`)
        ?.hasChildNodes()) ||
    (startId + width * 4 + 4 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 + 2}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 3 + 3}`)
        ?.hasChildNodes()) ||
    (startId + width * 5 + 5 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 + 3}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 4 + 4}`)
        ?.hasChildNodes()) ||
    (startId + width * 6 + 6 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4 + 4}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 5 + 5}`)
        ?.hasChildNodes()) ||
    (startId + width * 7 + 7 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4 + 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 5 + 5}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 6 + 6}`)
        ?.hasChildNodes()) ||
    startId - width - 1 === targetId ||
    (startId - width * 2 - 2 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes()) ||
    (startId - width * 3 - 3 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 2 - 2}`)
        ?.hasChildNodes()) ||
    (startId - width * 4 - 4 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 - 2}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 3 - 3}`)
        ?.hasChildNodes()) ||
    (startId - width * 5 - 5 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 - 3}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 4 - 4}`)
        ?.hasChildNodes()) ||
    (startId - width * 6 - 6 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4 - 4}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 5 - 5}`)
        ?.hasChildNodes()) ||
    (startId - width * 7 - 7 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4 - 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 5 - 5}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 6 - 6}`)
        ?.hasChildNodes()) ||
    startId - width + 1 === targetId ||
    (startId - width * 2 + 2 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes()) ||
    (startId - width * 3 + 3 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 2 + 2}`)
        ?.hasChildNodes()) ||
    (startId - width * 4 + 4 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 + 2}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 3 + 3}`)
        ?.hasChildNodes()) ||
    (startId - width * 5 + 5 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 + 3}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 4 + 4}`)
        ?.hasChildNodes()) ||
    (startId - width * 6 + 6 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4 + 4}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 5 + 5}`)
        ?.hasChildNodes()) ||
    (startId - width * 7 + 7 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4 + 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 5 + 5}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 6 + 6}`)
        ?.hasChildNodes()) ||
    startId + width - 1 === targetId ||
    (startId + width * 2 - 2 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes()) ||
    (startId + width * 3 - 3 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 2 - 2}`)
        ?.hasChildNodes()) ||
    (startId + width * 4 - 4 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 - 2}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 3 - 3}`)
        ?.hasChildNodes()) ||
    (startId + width * 5 - 5 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 - 3}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 4 - 4}`)
        ?.hasChildNodes()) ||
    (startId + width * 6 - 6 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4 - 4}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 5 - 5}`)
        ?.hasChildNodes()) ||
    (startId + width * 7 - 7 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4 - 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 5 - 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 6 - 6}`)?.hasChildNodes())
  ) {
    return true;
  } else {
    return false;
  }
}

function rook(startId, targetId) {
  if (
    startId + width === targetId ||
    (startId + width * 2 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes()) ||
    (startId + width * 3 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes()) ||
    (startId + width * 4 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3}`)?.hasChildNodes()) ||
    (startId + width * 5 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4}`)?.hasChildNodes()) ||
    (startId + width * 6 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 5}`)?.hasChildNodes()) ||
    (startId + width * 7 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 6}`)?.hasChildNodes()) ||
    startId - width === targetId ||
    (startId - width * 2 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes()) ||
    (startId - width * 3 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes()) ||
    (startId - width * 4 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3}`)?.hasChildNodes()) ||
    (startId - width * 5 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4}`)?.hasChildNodes()) ||
    (startId - width * 6 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 5}`)?.hasChildNodes()) ||
    (startId - width * 7 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 6}`)?.hasChildNodes()) ||
    startId + 1 === targetId ||
    (startId + 2 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes()) ||
    (startId + 3 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes()) ||
    (startId + 4 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 3}`)?.hasChildNodes()) ||
    (startId + 5 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 4}`)?.hasChildNodes()) ||
    (startId + 6 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 5}`)?.hasChildNodes()) ||
    (startId + 7 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 6}`)?.hasChildNodes()) ||
    startId - 1 === targetId ||
    (startId - 2 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes()) ||
    (startId - 3 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes()) ||
    (startId - 4 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 3}`)?.hasChildNodes()) ||
    (startId - 5 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 4}`)?.hasChildNodes()) ||
    (startId - 6 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 5}`)?.hasChildNodes()) ||
    (startId - 7 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 6}`)?.hasChildNodes())
  ) {
    return true;
  } else {
    return false;
  }
}

function queen(startId, targetId) {
  if (
    startId + width === targetId ||
    (startId + width * 2 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes()) ||
    (startId + width * 3 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes()) ||
    (startId + width * 4 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3}`)?.hasChildNodes()) ||
    (startId + width * 5 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4}`)?.hasChildNodes()) ||
    (startId + width * 6 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 5}`)?.hasChildNodes()) ||
    (startId + width * 7 === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 6}`)?.hasChildNodes()) ||
    startId - width === targetId ||
    (startId - width * 2 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes()) ||
    (startId - width * 3 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes()) ||
    (startId - width * 4 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3}`)?.hasChildNodes()) ||
    (startId - width * 5 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4}`)?.hasChildNodes()) ||
    (startId - width * 6 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 5}`)?.hasChildNodes()) ||
    (startId - width * 7 === targetId &&
      !document.getElementById(`${startId - width}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 6}`)?.hasChildNodes()) ||
    startId + 1 === targetId ||
    (startId + 2 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes()) ||
    (startId + 3 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes()) ||
    (startId + 4 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 3}`)?.hasChildNodes()) ||
    (startId + 5 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 4}`)?.hasChildNodes()) ||
    (startId + 6 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 5}`)?.hasChildNodes()) ||
    (startId + 7 === targetId &&
      !document.getElementById(`${startId + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + 6}`)?.hasChildNodes()) ||
    startId - 1 === targetId ||
    (startId - 2 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes()) ||
    (startId - 3 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes()) ||
    (startId - 4 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 3}`)?.hasChildNodes()) ||
    (startId - 5 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 4}`)?.hasChildNodes()) ||
    (startId - 6 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 5}`)?.hasChildNodes()) ||
    (startId - 7 === targetId &&
      !document.getElementById(`${startId - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - 6}`)?.hasChildNodes()) ||
    startId + width + 1 === targetId ||
    (startId + width * 2 + 2 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes()) ||
    (startId + width * 3 + 3 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 2 + 2}`)
        ?.hasChildNodes()) ||
    (startId + width * 4 + 4 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 + 2}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 3 + 3}`)
        ?.hasChildNodes()) ||
    (startId + width * 5 + 5 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 + 3}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 4 + 4}`)
        ?.hasChildNodes()) ||
    (startId + width * 6 + 6 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4 + 4}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 5 + 5}`)
        ?.hasChildNodes()) ||
    (startId + width * 7 + 7 === targetId &&
      !document.getElementById(`${startId + width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4 + 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 5 + 5}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 6 + 6}`)
        ?.hasChildNodes()) ||
    startId - width - 1 === targetId ||
    (startId - width * 2 - 2 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes()) ||
    (startId - width * 3 - 3 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 2 - 2}`)
        ?.hasChildNodes()) ||
    (startId - width * 4 - 4 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 - 2}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 3 - 3}`)
        ?.hasChildNodes()) ||
    (startId - width * 5 - 5 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 - 3}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 4 - 4}`)
        ?.hasChildNodes()) ||
    (startId - width * 6 - 6 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4 - 4}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 5 - 5}`)
        ?.hasChildNodes()) ||
    (startId - width * 7 - 7 === targetId &&
      !document.getElementById(`${startId - width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4 - 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 5 - 5}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 6 - 6}`)
        ?.hasChildNodes()) ||
    startId - width + 1 === targetId ||
    (startId - width * 2 + 2 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes()) ||
    (startId - width * 3 + 3 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 2 + 2}`)
        ?.hasChildNodes()) ||
    (startId - width * 4 + 4 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 + 2}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 3 + 3}`)
        ?.hasChildNodes()) ||
    (startId - width * 5 + 5 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 + 3}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 4 + 4}`)
        ?.hasChildNodes()) ||
    (startId - width * 6 + 6 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 + 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4 + 4}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 5 + 5}`)
        ?.hasChildNodes()) ||
    (startId - width * 7 + 7 === targetId &&
      !document.getElementById(`${startId - width + 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 2 + 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 4 + 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId - width * 5 + 5}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId - width * 6 + 6}`)
        ?.hasChildNodes()) ||
    startId + width - 1 === targetId ||
    (startId + width * 2 - 2 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes()) ||
    (startId + width * 3 - 3 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 2 - 2}`)
        ?.hasChildNodes()) ||
    (startId + width * 4 - 4 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 - 2}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 3 - 3}`)
        ?.hasChildNodes()) ||
    (startId + width * 5 - 5 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 - 3}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 4 - 4}`)
        ?.hasChildNodes()) ||
    (startId + width * 6 - 6 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4 - 4}`)?.hasChildNodes() &&
      !document
        .getElementById(`${startId + width * 5 - 5}`)
        ?.hasChildNodes()) ||
    (startId + width * 7 - 7 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 2 - 2}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 3 - 3}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 4 - 4}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 5 - 5}`)?.hasChildNodes() &&
      !document.getElementById(`${startId + width * 6 - 6}`)?.hasChildNodes())
  ) {
    return true;
  } else {
    return false;
  }
}
function king(startId, targetId) {
  if (
    startId + 1 === targetId ||
    startId - 1 === targetId ||
    startId + width === targetId ||
    startId - width === targetId ||
    startId + width + 1 === targetId ||
    startId + width - 1 === targetId ||
    startId - width + 1 === targetId ||
    startId - width - 1 === targetId
  ) {
    return true;
  } else {
    return false;
  }
}
