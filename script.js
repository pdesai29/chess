const chessBoard = document.querySelector("#chessBoard");
let playerTurn = "black";

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

const charCodeTable = {};

const calculateScore = (str) => {
  return str.split("").reduce((acc, val) => {
    return acc + val.charCodeAt(0);
  }, 0);
};

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
    charCodeTable[squareString] = calculateScore(squareString);

    square.setAttribute("id", squareString);
    const place = document.createElement("span");
    place.classList.add("place");
    place.innerHTML = squareString;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "bgSkin" : "bgGreen");
    } else {
      square.classList.add(i % 2 === 0 ? "bgGreen" : "bgSkin");
    }
    square.innerHTML = chessMan;
    chessBoard.append(square);
    // square.append(place);

    if (square.hasChildNodes()) {
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
  const correctPlayerTurn = draggedChessman.firstChild.classList.contains(
    playerTurn + "Color"
  );
  const taken = e.target.classList.contains("chessMan");
  const opponentTurn = playerTurn === "black" ? "whiteColor" : "blackColor";
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentTurn);
  const validMove = checkValidMove(e.target);

  console.log("taken", taken);
  console.log("opponentTurn", opponentTurn);
  console.log("takenByOpponent", takenByOpponent);
  console.log("validMove", validMove);
  if (correctPlayerTurn) {
    if (takenByOpponent && validMove) {
      e.target.append(draggedChessman);
      e.target.remove();
      changePlayerTurn();
      return;
    }
    if (taken && !takenByOpponent) {
      console.log("can't go here");
      return;
    }

    if (validMove) {
      e.target.parentNode.append(draggedChessman);
      changePlayerTurn();
      return;
    }
  }
}

function changePlayerTurn() {
  playerTurn === "black" ? (playerTurn = "white") : (playerTurn = "black");
  document.querySelector("#turn").innerHTML = playerTurn;
  console.log(playerTurn);
}

function checkValidMove(target) {
  const targetId =
    target.getAttribute("id") || target.parentNode.getAttribute("id");
  const startId = startPositionId;
  const piece = draggedChessman.id;

  const fileDifference = Math.abs(
    charCodeTable[targetId] - charCodeTable[startId]
  );
  const rankDifference = Math.abs(
    parseInt(targetId.charAt(0)) - parseInt(startId.charAt(0))
  );
  console.log("target", targetId);
  console.log("startId", startId);
  console.log("piece", piece);
  console.log("fileDifference", fileDifference);
  console.log("rankDifference", rankDifference);
  console.log("playerTurn", playerTurn);
  if (piece === "pawnW") {
    // White Pawn
    if (startId.charAt(0) === "2") {
      // First move, can move forward 1 or 2 squares
      if (targetId.charAt(0) === "3" || targetId.charAt(0) === "4") {
        if (fileDifference === 0 && !target.hasChildNodes()) {
          return true;
        }
      }
    } else {
      // Not the first move, can move forward 1 square
      if (
        targetId.charAt(0) === String.fromCharCode(startId.charCodeAt(0) + 1)
      ) {
        if (fileDifference === 0 && !target.hasChildNodes()) {
          return true;
        }
      }
    }

    // Diagonal capture
    if (fileDifference === 1 && rankDifference === 1) {
      const opponentTurn = playerTurn === "black" ? "blackColor" : "whiteColor";
      const takenByOpponent =
        target.firstChild?.classList.contains(opponentTurn);
      if (takenByOpponent) {
        return true;
      }
    }
  } else if (piece === "pawnB") {
    // Black Pawn
    if (startId.charAt(0) === "7") {
      // First move, can move forward 1 or 2 squares
      if (targetId.charAt(0) === "6" || targetId.charAt(0) === "5") {
        if (fileDifference === 0 && !target.hasChildNodes()) {
          return true;
        }
      }
    } else {
      // Not the first move, can move forward 1 square
      if (
        targetId.charAt(0) === String.fromCharCode(startId.charCodeAt(0) - 1)
      ) {
        if (fileDifference === 0 && !target.hasChildNodes()) {
          return true;
        }
      }
    }

    // Diagonal capture
    if (fileDifference === 1 && rankDifference === 1) {
      const opponentTurn = playerTurn === "black" ? "blackColor" : "whiteColor";
      const takenByOpponent =
        target.firstChild?.classList.contains(opponentTurn);
      if (takenByOpponent) {
        return true;
      }
    }
  }

  return false;
}
