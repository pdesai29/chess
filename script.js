const chessBoard = document.querySelector("#chessBoard");
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

const setUpBoard = () => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
  let countFile, row;
  startPosition.forEach((chessMan, i) => {
    const square = document.createElement("div");
    square.classList.add("square");

    if (i < 8) {
      countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
      square.setAttribute("id", `${ranks[7]}-${files[countFile]}`);
    } else if (i >= 8 && i < 16) {
      countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
      square.setAttribute("id", `${ranks[6]}-${files[countFile]}`);
    } else if (i >= 16 && i < 24) {
      countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
      square.setAttribute("id", `${ranks[5]}-${files[countFile]}`);
    } else if (i >= 24 && i < 32) {
      countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
      square.setAttribute("id", `${ranks[4]}-${files[countFile]}`);
    } else if (i >= 32 && i < 40) {
      countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
      square.setAttribute("id", `${ranks[3]}-${files[countFile]}`);
    } else if (i >= 40 && i < 48) {
      countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
      square.setAttribute("id", `${ranks[2]}-${files[countFile]}`);
    } else if (i >= 48 && i < 56) {
      countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
      square.setAttribute("id", `${ranks[1]}-${files[countFile]}`);
    } else if (i >= 56 && i < 64) {
      countFile = ((i + 1) % 8 !== 0 ? (i + 1) % 8 : 8) - 1;
      square.setAttribute("id", `${ranks[0]}-${files[countFile]}`);
    }
    row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "bgSkin" : "bgGreen");
    } else {
      square.classList.add(i % 2 === 0 ? "bgGreen" : "bgSkin");
    }
    square.innerHTML = chessMan;

    chessBoard.append(square);
  });
};
setUpBoard();
