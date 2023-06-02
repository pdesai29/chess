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
  // playerTurn==="black"? (playerTurn="white" reverseBoard()) : (playerTurn = "black");
  if (playerTurn === "black") {
    reverseBoard();
    playerTurn = "white";
  } else if (playerTurn === "white") {
    revertBoard();
    playerTurn = "black";
  }

  // document.querySelector("#turn").innerHTML = playerTurn;
  // console.log(playerTurn);
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
  const targetPositionId =
    Number(target.getAttribute("id")) ||
    Number(target.parentNode.getAttribute("id"));
  const startPositionId = Number(startPositionId);
  const chessMan = draggedChessman.id.slice(0, draggedChessman.id.length - 1);
  switch (chessMan) {
    case "pawn":
      return pawn(startPositionId, targetPositionId);
    case "knight":
      return knight(startPositionId, targetPositionId);
    case "bishop":
      return bishop(startPositionId, targetPositionId);
    case "rook":
      return rook(startPositionId, targetPositionId);
  }
}
function pawn(startPositionId, targetPositionId) {
  const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
  if (
    (starterRow.includes(startPositionId) &&
      startPositionId + width * 2 === targetPositionId) ||
    startPositionId + width === targetPositionId ||
    (startPositionId + width - 1 === targetPositionId &&
      document
        .getElementById(`${startPositionId + width - 1}`)
        ?.hasChildNodes()) ||
    (startPositionId + width + 1 === targetPositionId &&
      document
        .getElementById(`${startPositionId + width + 1}`)
        ?.hasChildNodes())
  ) {
    return true;
  } else {
    return false;
  }
}
function knight(startPositionId, targetPositionId) {
  if (
    startPositionId + width * 2 - 1 === targetPositionId ||
    startPositionId + width * 2 + 1 === targetPositionId ||
    startPositionId + width - 2 === targetPositionId ||
    startPositionId + width + 2 === targetPositionId ||
    startPositionId - width * 2 - 1 === targetPositionId ||
    startPositionId - width * 2 + 1 === targetPositionId ||
    startPositionId - width - 2 === targetPositionId ||
    startPositionId - width + 2 === targetPositionId
  ) {
    return true;
  } else {
    return false;
  }
}

function bishop(startPositionId, targetPositionId) {
  console.log(startPositionId - width - 1);
  if (
    startPositionId + width + 1 === targetPositionId ||
    (startPositionId + width * 2 + 2 &&
      !document
        .getElementById(`${startPositionId + width + 1}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 3 + 3 &&
      !document
        .getElementById(`${startPositionId + width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 + 2}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 4 + 4 &&
      !document
        .getElementById(`${startPositionId + width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 + 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 3 + 3}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 5 + 5 &&
      !document
        .getElementById(`${startPositionId + width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 + 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 3 + 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 4 + 4}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 6 + 6 &&
      !document
        .getElementById(`${startPositionId + width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 + 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 3 + 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 4 + 4}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 5 + 5}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 7 + 7 &&
      !document
        .getElementById(`${startPositionId + width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 + 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 3 + 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 4 + 4}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 5 + 5}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 6 + 6}`)
        ?.hasChildNodes()) ||
    startPositionId - width - 1 === targetPositionId ||
    (startPositionId - width * 2 - 2 &&
      !document
        .getElementById(`${startPositionId - width - 1}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 3 - 3 &&
      !document
        .getElementById(`${startPositionId - width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 - 2}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 4 - 4 &&
      !document
        .getElementById(`${startPositionId - width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 - 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 3 - 3}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 5 - 5 &&
      !document
        .getElementById(`${startPositionId - width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 - 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 3 - 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 4 - 4}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 6 - 6 &&
      !document
        .getElementById(`${startPositionId - width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 - 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 3 - 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 4 - 4}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 5 - 5}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 7 - 7 &&
      !document
        .getElementById(`${startPositionId - width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 - 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 3 - 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 4 - 4}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 5 - 5}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 6 - 6}`)
        ?.hasChildNodes()) ||
    startPositionId - width + 1 === targetPositionId ||
    (startPositionId - width * 2 + 2 &&
      !document
        .getElementById(`${startPositionId - width + 1}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 3 + 3 &&
      !document
        .getElementById(`${startPositionId - width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 + 2}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 4 + 4 &&
      !document
        .getElementById(`${startPositionId - width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 + 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 3 + 3}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 5 + 5 &&
      !document
        .getElementById(`${startPositionId - width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 + 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 3 + 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 4 + 4}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 6 + 6 &&
      !document
        .getElementById(`${startPositionId - width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 + 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 3 + 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 4 + 4}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 5 + 5}`)
        ?.hasChildNodes()) ||
    (startPositionId - width * 7 + 7 &&
      !document
        .getElementById(`${startPositionId - width + 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 2 + 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 3 - 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 4 + 4}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 5 + 5}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId - width * 6 + 6}`)
        ?.hasChildNodes()) ||
    startPositionId + width - 1 === targetPositionId ||
    (startPositionId + width * 2 - 2 &&
      !document
        .getElementById(`${startPositionId + width - 1}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 3 - 3 &&
      !document
        .getElementById(`${startPositionId + width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 - 2}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 4 - 4 &&
      !document
        .getElementById(`${startPositionId + width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 - 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 3 - 3}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 5 - 5 &&
      !document
        .getElementById(`${startPositionId + width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 - 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 3 - 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 4 - 4}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 6 - 6 &&
      !document
        .getElementById(`${startPositionId + width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 - 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 3 - 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 4 - 4}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 5 - 5}`)
        ?.hasChildNodes()) ||
    (startPositionId + width * 7 - 7 &&
      !document
        .getElementById(`${startPositionId + width - 1}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 2 - 2}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 3 - 3}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 4 - 4}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 5 - 5}`)
        ?.hasChildNodes() &&
      !document
        .getElementById(`${startPositionId + width * 6 - 6}`)
        ?.hasChildNodes())
  ) {
    return true;
  } else {
    return false;
  }
}

function rook(startPositionId, targetPositionId) {}
