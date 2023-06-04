const chessBoard = document.querySelector("#chessBoard");
let playerTurn = "black";
const movesDiv = document.querySelector("#moves");
const width = 8;
const movesObject = { moves: [], moveDetails: [] };

const themes = document.querySelectorAll(".theme");
let currentTheme = "greenTheme";
const themesObject = {
  greenTheme: ["bgGreen", "bgSkin"],
  blueTheme: ["bgdBlue", "bglBlue"],
  classicTheme: ["bgBlack", "bgWhite"],
  pinkTheme: ["bgPink", "bgCream"],
};
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
function addEventListenerTheme() {
  themes.forEach((elem) => {
    elem.addEventListener("click", changeTheme);
  });
}
addEventListenerTheme();
function changeTheme(e) {
  const target = e.target.getAttribute("id");
  const squares = document.querySelectorAll(".square");
  squares.forEach((elem) => {
    if (elem.classList.contains(themesObject[currentTheme][0])) {
      elem.classList.remove(themesObject[currentTheme][0]);
      elem.classList.add(themesObject[target + "Theme"][0]);
    } else if (elem.classList.contains(themesObject[currentTheme][1])) {
      elem.classList.remove(themesObject[currentTheme][1]);
      elem.classList.add(themesObject[target + "Theme"][1]);
    }
  });
  currentTheme = target + "Theme";
}
function changePlayerTurn() {
  if (playerTurn === "black") {
    reverseBoard();
    playerTurn = "white";
    changeCursor(playerTurn);

    const chessMan = document.querySelectorAll(".chessMan");
    chessMan.forEach((chessMan) => {
      chessMan.classList.remove("rotate");
      chessMan.classList.add("rotateReverse");
    });
    chessBoard.classList.add("rotateReverse");
    chessBoard.classList.remove("rotate");
  } else if (playerTurn === "white") {
    revertBoard();
    playerTurn = "black";
    changeCursor(playerTurn);
    const chessMan = document.querySelectorAll(".chessMan");
    chessMan.forEach((chessMan) => {
      chessMan.classList.remove("rotateReverse");
      chessMan.classList.add("rotate");
    });
    chessBoard.classList.remove("rotateReverse");
    chessBoard.classList.add("rotate");
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
  chessBoard.classList.add("rotate");

  startPosition.forEach((chessMan, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    row = Math.floor((63 - i) / 8) + 1;
    countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
    squareString = `${files[countFile]}${ranks[row - 1]}`;
    square.setAttribute("square-id", squareString);
    square.setAttribute("id", i);

    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "bgSkin" : "bgGreen");
    } else {
      square.classList.add(i % 2 === 0 ? "bgGreen" : "bgSkin");
    }
    square.innerHTML = chessMan;
    chessBoard.append(square);

    if (square?.hasChildNodes()) {
      square.firstChild.setAttribute("draggable", true);
    }
    changeCursor(playerTurn);
  });
  const chessMan = document.querySelectorAll(".chessMan");
  chessMan.forEach((chessMan) => {
    chessMan.classList.add("rotate");
  });
};
setUpBoard();

const draggableSquares = document.querySelectorAll(".square");
draggableSquares.forEach((element) => {
  element.addEventListener("dragstart", handleDragStart);
  element.addEventListener("dragover", handleDragOver);
  element.addEventListener("drop", handleDrop);
  element.addEventListener("click", handleClick);
});
let previousClick;
function handleClick(e) {
  e.preventDefault();

  const squares = document.getElementsByClassName("square");
  if (e.target === previousClick) {
    for (const square of squares) {
      if (square.classList.contains("move")) {
        square.classList.toggle(".move");
      }
      if (square.classList.contains("dead")) {
        square.classList.toggle(".dead");
      }
    }
  } else {
    for (const square of squares) {
      if (square.classList.contains("move")) {
        square.classList.remove("move");
      }
      if (square.classList.contains("dead")) {
        square.classList.remove("dead");
      }
    }
  }
  if (e.target.hasChildNodes()) {
    displayPossibleMoves(e.target);
  } else {
    return;
  }
  previousClick = e.target;
}

let startPositionId, draggedChessman;

function handleDragStart(e) {
  const squares = document.getElementsByClassName("square");
  for (const square of squares) {
    if (square.classList.contains("move")) {
      square.classList.remove("move");
    }
    if (square.classList.contains("dead")) {
      square.classList.remove("dead");
    }
  }
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
  const targetId =
    Number(e.target.getAttribute("id")) ||
    Number(e.target.parentNode.getAttribute("id"));
  const startId = Number(startPositionId);
  addMoveDetails(
    draggedChessman.getAttribute("id"),
    e.target.getAttribute("id"),
    startId,
    targetId
  );
  const squares = document.getElementsByClassName("square");
  for (const square of squares) {
    if (square.classList.contains("move")) {
      square.classList.remove("move");
    }
    if (square.classList.contains("dead")) {
      square.classList.remove("dead");
    }
  }

  const validMove = checkValidMove(e.target);
  // console.log(validMove);
  if (!validMove) {
    movesObject.moveDetails[movesObject.moveDetails.length - 1].pop();
  }
  if (correctPlayerTurn) {
    if (takenByOpponent && validMove) {
      let move = `x${e.target.parentNode.getAttribute("square-id")}`;
      let arr = movesObject.moveDetails[movesObject.moveDetails.length - 1];
      arr[arr.length - 1][`move`] = move;
      moveDisplay(
        move,
        draggedChessman.getAttribute("id"),
        e.target.getAttribute("id")
      );
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
      if (validMove === "enPassant") {
        const deadPieceSquare = document.getElementById(`${targetId - width}`);
        const deadPiece = deadPieceSquare.querySelector(".chessMan");
        deadPieceSquare.removeChild(deadPiece);
        let move = `x${deadPieceSquare.getAttribute("square-id")}`;
        let arr = movesObject.moveDetails[movesObject.moveDetails.length - 1];
        arr[arr.length - 1][`move`] = move;
        moveDisplay(
          move,
          e.target.firstChild.getAttribute("id"),
          deadPiece.getAttribute("id")
        );
        changePlayerTurn();
        return;
      }
      let move = `${e.target.getAttribute("square-id")}`;
      let arr = movesObject.moveDetails[movesObject.moveDetails.length - 1];
      arr[arr.length - 1][`move`] = move;
      moveDisplay(move, e.target.firstChild.getAttribute("id"));
      changePlayerTurn();
      return;
    }
  }
}

function addMoveDetails(piece, deadPiece = "", startId, targetId) {
  const { moveDetails } = movesObject;
  let length = moveDetails.length;
  if (!length) {
    moveDetails.push([{ piece, deadPiece, startId, targetId }]);
  } else {
    if (moveDetails[length - 1].length < 2) {
      moveDetails[length - 1].push({
        piece,
        deadPiece,
        startId,
        targetId,
      });
    } else {
      moveDetails.push([{ piece, deadPiece, startId, targetId }]);
    }
  }
}
function displayPossibleMoves(target) {
  const startId = Number(target.parentNode.getAttribute("id"));
  if (
    !(
      (target.getAttribute("id").includes("B") && playerTurn === "black") ||
      (target.getAttribute("id").includes("W") && playerTurn === "white")
    )
  ) {
    return;
  }
  const chessMan = target
    .getAttribute("id")
    .slice(0, target.getAttribute("id").length - 1);
  let possibleMoves;
  switch (chessMan) {
    case "pawn":
      return pawnPossibleMoves(startId);
    case "knight":
      return knightPossibleMoves(startId);
    case "bishop":
      possibleMoves = bishopPossibleMoves(startId);
      renderMoves(possibleMoves);
    case "rook":
      possibleMoves = rookPossibleMoves(startId);
      renderMoves(possibleMoves);
    case "queen":
      possibleMoves = queenPossibleMoves(startId);
      renderMoves(possibleMoves);
    // case "king":
    //   kingPossibleMoves(startId);
  }
}
function moveDisplay(move, piece, deadPiece = "") {
  let { moves } = movesObject;
  const deadPieceSvg = getPieceSvg(deadPiece);
  const pieceSvg = getPieceSvg(piece);
  let movesLength = moves.length;
  if (deadPiece) {
    if (deadPiece.includes("W")) {
      const deadMenColumn = document.querySelector("#deadMenWhite");
      let span = document.createElement("span");
      span.innerHTML = deadPieceSvg;
      deadMenColumn.append(span);
      span.setAttribute("class", "deadMenSpan");
    } else if (deadPiece.includes("B")) {
      const deadMenColumn = document.querySelector("#deadMenBlack");
      let span = document.createElement("span");
      span.setAttribute("class", "deadMenSpan");
      span.innerHTML = deadPieceSvg;
      deadMenColumn.append(span);
    }
  }
  if (!movesLength) {
    moves.push([move]);
    movesLength = moves.length;
    const p = document.createElement("p");
    p.setAttribute("moveRowId", movesLength);
    const span = document.createElement("span");
    span.innerHTML = `${movesLength}. ${pieceSvg}${
      moves[movesLength - 1][0]
    }   ${deadPieceSvg ? `[${deadPieceSvg}]` : ""}`;
    span.setAttribute("moveMessageId", moves[movesLength - 1].length + 1);
    p.append(span);
    movesDiv.append(p);
  } else {
    if (moves[movesLength - 1].length < 2) {
      moves[movesLength - 1].push(move);
      movesLength = moves.length;
      const p = document.querySelector(`p[moveRowId="${movesLength}"]`);
      const span = document.createElement("span");
      span.setAttribute("moveMessageId", moves[movesLength - 1].length + 1);
      span.innerHTML = `, ${pieceSvg}${moves[movesLength - 1][1]}   ${
        deadPieceSvg ? `   [${deadPieceSvg}]` : ""
      }`;
      p.append(span);
    } else {
      moves.push([move]);
      movesLength = moves.length;
      const p = document.createElement("p");
      p.setAttribute("moveRowId", movesLength);
      const span = document.createElement("span");
      span.innerHTML = `${movesLength}. ${pieceSvg}${
        moves[movesLength - 1][0]
      }   ${deadPieceSvg ? `   [${deadPieceSvg}]` : ""}`;
      span.setAttribute("moveMessageId", moves[movesLength - 1].length + 1);
      p.append(span);
      movesDiv.append(p);
    }
  }
}

function getPieceSvg(piece) {
  switch (piece) {
    case "rookB":
      return moverookB;
    case "knightB":
      return moveknightB;
    case "bishopB":
      return movebishopB;
    case "queenB":
      return movequeenB;
    case "kingB":
      return movekingB;
    case "pawnB":
      return movepawnB;
    case "rookW":
      return moverookW;
    case "knightW":
      return moveknightW;
    case "bishopW":
      return movebishopW;
    case "queenW":
      return movequeenW;
    case "kingW":
      return movekingW;
    case "pawnW":
      return movepawnW;
    default:
      return null;
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
  // console.log("current start", startId);
  // console.log("current end", targetId);
  const { moveDetails } = movesObject;
  let lastMove;
  if (
    moveDetails.length === 1 &&
    moveDetails[moveDetails.length - 1].length === 1
  ) {
    lastMove = undefined;
  } else if (moveDetails[moveDetails.length - 1].length === 2) {
    lastMove = moveDetails[moveDetails.length - 1][0];
  } else if (moveDetails[moveDetails.length - 1].length === 1) {
    lastMove = moveDetails[moveDetails.length - 2][1];
  }
  // console.log("lastMove", lastMove);
  const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
  if (
    (starterRow.includes(startId) && startId + width * 2 === targetId) ||
    (startId + width === targetId &&
      !document.getElementById(`${startId + width}`)?.hasChildNodes()) ||
    (startId + width - 1 === targetId &&
      document.getElementById(`${startId + width - 1}`)?.hasChildNodes()) ||
    (startId + width + 1 === targetId &&
      document.getElementById(`${startId + width + 1}`)?.hasChildNodes())
  ) {
    return true;
  } else if (
    lastMove &&
    lastMove.piece === "pawnB" &&
    starterRow.includes(lastMove.startId) &&
    lastMove.startId + width * 2 === lastMove.targetId &&
    (lastMove?.targetId + 1 === 64 - startId - 1 ||
      lastMove?.targetId - 1 === 64 - startId - 1) &&
    ((startId + width - 1 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes()) ||
      (startId + width + 1 === targetId &&
        !document.getElementById(`${startId + width + 1}`)?.hasChildNodes()))
  ) {
    console.log("enPassant black");
    return "enPassant";
  } else if (
    lastMove &&
    lastMove.piece === "pawnW" &&
    starterRow.includes(lastMove.startId) &&
    lastMove.startId + width * 2 === lastMove.targetId &&
    (lastMove?.targetId + 1 === 64 - startId - 1 ||
      lastMove?.targetId - 1 === 64 - startId - 1) &&
    ((startId + width - 1 === targetId &&
      !document.getElementById(`${startId + width - 1}`)?.hasChildNodes()) ||
      (startId + width + 1 === targetId &&
        !document.getElementById(`${startId + width + 1}`)?.hasChildNodes()))
  ) {
    console.log("enPassant white");
    return "enPassant";
  } else {
    return false;
  }
}

function knight(startId, targetId) {
  const startFile = startId % width;
  const targetFile = targetId % width;
  const startRank = Math.floor(startId / width);
  const targetRank = Math.floor(targetId / width);

  const fileDiff = Math.abs(targetFile - startFile);
  const rankDiff = Math.abs(targetRank - startRank);

  if (fileDiff === 1 && rankDiff === 2) {
    return true;
  } else if (fileDiff === 2 && rankDiff === 1) {
    return true;
  } else {
    return false;
  }
}

function bishop(startId, targetId) {
  //check if move is on diagonal or not
  const dx = Math.abs((startId % width) - (targetId % width));
  const dy = Math.abs(
    Math.floor(startId / width) - Math.floor(targetId / width)
  );

  // console.log("startId", startId);
  // console.log("targetId", targetId);
  // console.log("dx", dx);
  // console.log("dy", dy);

  //if dx === dy means move is made on diagonal from startId
  if (dx === dy) {
    // stepX and stepY to find diagonal squares location
    const stepX = targetId % width > startId % width ? 1 : -1;
    const stepY =
      Math.floor(targetId / width) > Math.floor(startId / width)
        ? width
        : -width;

    //currentId is actual diagonal square "id"
    let currentId = startId + stepX + stepY;
    // console.log("stepX", stepX);
    // console.log("stepY", stepY);

    //check if other chessMan in path or not and
    //continue checking all possible move square
    while (currentId !== targetId) {
      // console.log("currentId", currentId);
      if (document.getElementById(`${currentId}`).hasChildNodes()) {
        // console.log("false");
        return false;
      }
      currentId += stepX + stepY;
    }

    return true;
  }

  return false;
}

function rook(startId, targetId) {
  const width = 8;
  const dx = Math.abs((startId % width) - (targetId % width));
  const dy = Math.abs(
    Math.floor(startId / width) - Math.floor(targetId / width)
  );

  if (dx === 0 || dy === 0) {
    let currentId;

    if (dx > 0) {
      if (startId > targetId) {
        currentId = startId - 1;

        while (currentId > targetId) {
          if (document.getElementById(`${currentId}`).hasChildNodes()) {
            return false;
          }
          currentId--;
        }
      } else if (targetId > startId) {
        currentId = startId + 1;

        while (currentId < targetId) {
          if (document.getElementById(`${currentId}`).hasChildNodes()) {
            return false;
          }
          currentId++;
        }
      }
    }

    if (dy > 0) {
      if (startId > targetId) {
        currentId = startId - width;

        while (currentId > targetId) {
          if (document.getElementById(`${currentId}`).hasChildNodes()) {
            return false;
          }
          currentId -= width;
        }
      } else if (targetId > startId) {
        currentId = startId + width;

        while (currentId < targetId) {
          if (document.getElementById(`${currentId}`).hasChildNodes()) {
            return false;
          }
          currentId += width;
        }
      }
    }

    return true;
  }

  return false;
}

function queen(startId, targetId) {
  if (rook(startId, targetId) || bishop(startId, targetId)) {
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
function knightPossibleMoves(startId) {
  const possibleMoves = [];

  const startFile = startId % width;
  const startRank = Math.floor(startId / width);

  const moveOffsets = [
    { file: 1, rank: 2 },
    { file: 2, rank: 1 },
    { file: -1, rank: 2 },
    { file: -2, rank: 1 },
    { file: 1, rank: -2 },
    { file: 2, rank: -1 },
    { file: -1, rank: -2 },
    { file: -2, rank: -1 },
  ];

  for (const offset of moveOffsets) {
    const targetFile = startFile + offset.file;
    const targetRank = startRank + offset.rank;
    const targetId = targetRank * width + targetFile;

    if (
      targetFile >= 0 &&
      targetFile < width &&
      targetRank >= 0 &&
      targetRank < width
    ) {
      possibleMoves.push(targetId);
    }
  }

  for (const move of possibleMoves) {
    const selectSquare = document.getElementById(move);

    if (selectSquare) {
      const chessMan = selectSquare.querySelector(".chessMan");

      if (chessMan) {
        const chessManId = chessMan.getAttribute("id");

        if (
          (chessManId.includes("B") && playerTurn === "white") ||
          (chessManId.includes("W") && playerTurn === "black")
        ) {
          selectSquare.classList.toggle("dead");
        }
      } else {
        selectSquare.classList.toggle("move");
      }
    }
  }
}

function pawnPossibleMoves(startId) {
  const selectSquare = document.getElementById(startId);
  const isBlack = selectSquare.querySelector(".chessMan").id.includes("B");

  // // Remove all existing move and dead classes

  const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];

  if (isBlack) {
    // Black pawn moves
    const oneSquareForward = document.getElementById(startId + width);
    const twoSquaresForward = document.getElementById(startId + width * 2);
    const leftCapture = document.getElementById(startId + width - 1);
    const rightCapture = document.getElementById(startId + width + 1);

    if (oneSquareForward && !oneSquareForward.hasChildNodes()) {
      oneSquareForward.classList.toggle("move");
    }
    if (
      twoSquaresForward &&
      starterRow.includes(startId) &&
      !twoSquaresForward.hasChildNodes() &&
      !oneSquareForward.hasChildNodes()
    ) {
      twoSquaresForward.classList.toggle("move");
    }
    if (leftCapture && leftCapture.hasChildNodes()) {
      if (
        (leftCapture
          .querySelector(".chessMan")
          .getAttribute("id")
          .includes("B") &&
          playerTurn === "white") ||
        (leftCapture
          .querySelector(".chessMan")
          .getAttribute("id")
          .includes("W") &&
          playerTurn === "black")
      )
        // leftCapture.classList.toggle("move");
        leftCapture.classList.toggle("dead");
    }
    if (rightCapture && rightCapture.hasChildNodes()) {
      if (
        (rightCapture
          .querySelector(".chessMan")
          .getAttribute("id")
          .includes("B") &&
          playerTurn === "white") ||
        (rightCapture
          .querySelector(".chessMan")
          .getAttribute("id")
          .includes("W") &&
          playerTurn === "black")
      )
        // leftCapture.classList.toggle("move");
        rightCapture.classList.toggle("dead");
    }
  } else {
    // White pawn moves
    const oneSquareForward = document.getElementById(startId + width);
    const twoSquaresForward = document.getElementById(startId + width * 2);
    const leftCapture = document.getElementById(startId + width - 1);
    const rightCapture = document.getElementById(startId + width + 1);

    if (oneSquareForward && !oneSquareForward.hasChildNodes()) {
      oneSquareForward.classList.toggle("move");
    }
    if (
      twoSquaresForward &&
      starterRow.includes(startId) &&
      !twoSquaresForward.hasChildNodes() &&
      !oneSquareForward.hasChildNodes()
    ) {
      twoSquaresForward.classList.toggle("move");
    }
    if (leftCapture && leftCapture.hasChildNodes()) {
      if (
        (leftCapture
          .querySelector(".chessMan")
          .getAttribute("id")
          .includes("B") &&
          playerTurn === "white") ||
        (leftCapture
          .querySelector(".chessMan")
          .getAttribute("id")
          .includes("W") &&
          playerTurn === "black")
      )
        leftCapture.classList.toggle("dead");
    }
    if (rightCapture && rightCapture.hasChildNodes()) {
      if (
        (rightCapture
          .querySelector(".chessMan")
          .getAttribute("id")
          .includes("B") &&
          playerTurn === "white") ||
        (rightCapture
          .querySelector(".chessMan")
          .getAttribute("id")
          .includes("W") &&
          playerTurn === "black")
      )
        rightCapture.classList.toggle("dead");
    }
  }
}

function bishopPossibleMoves(startId) {
  const width = 8;
  const possibleMoves = [];
  const directions = [7, 9, -7, -9];
  for (const direction of directions) {
    let currentId = startId + direction;

    while (currentId >= 0 && currentId <= 63) {
      const dx = Math.abs((startId % width) - (currentId % width));
      const dy = Math.abs(
        Math.floor(startId / width) - Math.floor(currentId / width)
      );

      if (dy === dx) {
        const possibleMoveSquare = document.getElementById(`${currentId}`);

        if (possibleMoveSquare?.hasChildNodes()) {
          const chessManId = possibleMoveSquare
            .querySelector(".chessMan")
            .getAttribute("id");

          if (
            (chessManId.includes("B") && playerTurn === "white") ||
            (chessManId.includes("W") && playerTurn === "black")
          ) {
            possibleMoves.push(currentId);
          }
          break;
        }

        possibleMoves.push(currentId);
      }

      currentId += direction;
    }
  }

  return possibleMoves;
}

function rookPossibleMoves(startId) {
  const possibleMoves = [];

  for (let targetId = 0; targetId < 64; targetId++) {
    if (rook(startId, targetId)) {
      possibleMoves.push(targetId);
    }
  }

  return possibleMoves;
}
function queenPossibleMoves(startId) {
  const rookMoves = rookPossibleMoves(startId);
  const bishopMoves = bishopPossibleMoves(startId);
  const queenMoves = rookMoves.concat(bishopMoves);
  console.log(queenMoves);
  return queenMoves;
}

function renderMoves(possibleMoves) {
  for (const move of possibleMoves) {
    const selectSquare = document.getElementById(move);

    if (selectSquare) {
      const chessMan = selectSquare.querySelector(".chessMan");

      if (chessMan) {
        const chessManId = chessMan.getAttribute("id");

        if (
          (chessManId.includes("B") && playerTurn === "white") ||
          (chessManId.includes("W") && playerTurn === "black")
        ) {
          selectSquare.classList.toggle("dead");
        }
      } else {
        selectSquare.classList.toggle("move");
      }
    }
  }
}
