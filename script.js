// player factory function
let Player = (name) => {
  let playerMoves = [];
  let winCount = 0;
  let isBot = false;
  return {
    name,
    playerMoves,
    winCount,
    isBot,
  };
};

// game board module
let gameBoard = (() => {
  let squares = document.querySelectorAll(".grid-item");

  squares.forEach((div) => {
    div.addEventListener("click", function () {
      if (this.innerHTML === "O" || this.innerHTML === "X") {
        // do nothing
      } else if (this.innerHTML === "" && gameFlow.moveCount % 2 !== 0) {
        gameFlow.players[1].playerMoves.push(div.id);
        gameFlow.moveCount++;
      } else if (this.innerHTML === "") {
        gameFlow.players[0].playerMoves.push(div.id);
        gameFlow.moveCount++;
      }

      gameFlow.checkMoves(gameFlow.players[0].playerMoves);
      gameFlow.checkMoves(gameFlow.players[1].playerMoves);

      if (
        gameFlow.players[0].playerMoves.length +
          gameFlow.players[1].playerMoves.length ===
        9
      ) {
        gameFlow.tie();
      }
    });
  });
})();

// squares event listeners module
let eventListeners = (() => {
  let squares = document.querySelectorAll(".grid-item");

  squares.forEach((div) => {
    div.addEventListener("click", function () {
      if (
        gameFlow.hasWon === false &&
        this.innerHTML === "" &&
        gameFlow.moveCount % 2 === 0
      ) {
        this.innerHTML = "O";
      } else if (this.innerHTML === "" && gameFlow.hasWon === false) {
        this.innerHTML = "X";
      } else if (gameFlow.hasWon === true) {
        this.innerHTML = "";
        gameFlow.hasWon = false;
      }

      if (computer.isComputerTurn()) {
        computer.makeMove();
      }
    });
  });
})();

// game flow module
let gameFlow = (() => {
  let players = [];
  let moveCount = 0;
  let hasWon = false;

  let convertArray = (x) => {
    for (i = 0; i < x.length; i++) {
      x[i] = parseInt(x[i], 10);
    }
  };

  let checkMoves = (x) => {
    convertArray(x);
    for (i = 1; i < 10; i++) {
      if (
        (i === 1 || i === 4 || i === 7) &&
        x.includes(i) &&
        x.includes(i + 1) &&
        x.includes(i + 2)
      ) {
        win();
        break;
      } else if (
        i === 3 &&
        x.includes(i) &&
        x.includes(i + 2) &&
        x.includes(i + 4)
      ) {
        win();
        break;
      } else if (x.includes(i) && x.includes(i + 3) && x.includes(i + 6)) {
        win();
        break;
      } else if (x.includes(i) && x.includes(i + 4) && x.includes(i + 8)) {
        win();
        break;
      }
    }
  };

  let win = () => {
    sendMessage();
    addPoint();
    formHandler.updateScore();
    gameFlow.hasWon = true;
    clearGrid();
  };

  let clearGrid = () => {
    let squares = document.querySelectorAll(".grid-item");
    squares.forEach((div) => {
      div.innerHTML = "";
    });

    gameFlow.players[0].playerMoves = [];
    gameFlow.players[1].playerMoves = [];
  };

  let addPoint = () => {
    if (gameFlow.moveCount % 2 === 0) {
      players[1].winCount++;
      gameFlow.moveCount = 2;
    } else {
      players[0].winCount++;
      gameFlow.moveCount = 1;
    }
  };

  let tie = () => {
    let message = document.getElementById("message");

    let clearMessage = () => {
      message.innerHTML = "";
    };

    message.innerHTML = "Tie.";
    setTimeout(clearMessage, 2000);

    gameFlow.hasWon = true;
    gameFlow.moveCount = 0;
    clearGrid();
  };

  // Random victory messages
  let sendMessage = () => {
    let message = document.getElementById("message");
    let number = Math.round(Math.random() * 10);

    let clearMessage = () => {
      message.innerHTML = "";
    };

    let randomMessage = (() => {
      if (gameFlow.moveCount % 2 === 0) {
        if (number < 2) {
          message.innerHTML = `${gameFlow.players[1].name}'s point!`;
        } else if (number >= 2 && number < 4) {
          message.innerHTML = `${gameFlow.players[1].name} got that one.`;
        } else if (number >= 4 && number < 6) {
          message.innerHTML = `Woo, ${gameFlow.players[1].name}!`;
        } else if (number >= 6 && number < 8) {
          message.innerHTML = `${gameFlow.players[1].name}! ${gameFlow.players[1].name}!`;
        } else if (number >= 8 && number < 10) {
          message.innerHTML = `${gameFlow.players[1].name} nailed it.`;
        }
      } else {
        if (number < 2) {
          message.innerHTML = `${gameFlow.players[0].name}'s point!`;
        } else if (number >= 2 && number < 4) {
          message.innerHTML = `${gameFlow.players[0].name} got that one.`;
        } else if (number >= 4 && number < 6) {
          message.innerHTML = `Woo, ${gameFlow.players[0].name}!`;
        } else if (number >= 6 && number < 8) {
          message.innerHTML = `${gameFlow.players[0].name}! ${gameFlow.players[0].name}!`;
        } else if (number >= 8 && number < 10) {
          message.innerHTML = `${gameFlow.players[0].name} nailed it.`;
        }
      }
      setTimeout(clearMessage, 2000);
    })();
  };

  return {
    moveCount,
    players,
    checkMoves,
    win,
    tie,
    clearGrid,
    hasWon,
  };
})();

// Form modal
let formHandler = (() => {
  let form = document.getElementById("form");
  let modal = document.getElementById("myModal");
  let p2Human = document.getElementById("human");

  p2Human.checked = true;

  function handleForm(event) {
    modal.style.display = "none";
    event.preventDefault();
  }

  function getPlayers() {
    let p1 = document.getElementsByName("p1")[0].value;

    let p2 = document.getElementsByName("p2")[0].value;

    let player1 = Player(p1);
    let player2 = Player(p2);

    if (p2Human.checked === false) {
      player2.isBot = true;
    }

    gameFlow.players.push(player1);
    gameFlow.players.push(player2);
  }

  function showScore() {
    let player1Scoreboard = document.getElementById("p1-score");
    let player1Score = document.createTextNode(
      `${gameFlow.players[0].name}: ${gameFlow.players[0].winCount}`
    );
    player1Scoreboard.appendChild(player1Score);

    let player2Scoreboard = document.getElementById("p2-score");
    let player2Score = document.createTextNode(
      `${gameFlow.players[1].name}: ${gameFlow.players[1].winCount}`
    );
    player2Scoreboard.appendChild(player2Score);
  }

  function updateScore() {
    let player1Scoreboard = document.getElementById("p1-score");
    player1Scoreboard.innerHTML = `${gameFlow.players[0].name}: ${gameFlow.players[0].winCount}`;

    let player2Scoreboard = document.getElementById("p2-score");

    player2Scoreboard.innerHTML = `${gameFlow.players[1].name}: ${gameFlow.players[1].winCount}`;
  }

  function setBot() {
    let bot = document.getElementById("bot");
    let p2Name = document.getElementById("p2");

    if (bot.checked === true) {
      gameFlow.players[1].name = "Bot";
      gameFlow.players[1].isBot = true;
    }
  }

  let botSelect = (() => {
    let bot = document.getElementById("bot");
    let p2Name = document.getElementById("p2");

    bot.addEventListener("click", function () {
      if (bot.checked === true) {
        p2Name.disabled = true;
        p2Name.value = "";
      }
    });

    p2Human.addEventListener("click", function () {
      p2Name.disabled = false;
    });
  })();

  function removeBlur() {
    document.getElementById("blurred-header").id = "header";
  }

  function coinFlip() {
    let number = Math.floor(Math.random() * 2);

    if (number === 0) {
      gameFlow.moveCount = 0;
    } else {
      gameFlow.moveCount = 1;
      computer.randomCorner();
    }
  }

  form.addEventListener("submit", handleForm);
  form.addEventListener("submit", getPlayers);
  form.addEventListener("submit", setBot);
  form.addEventListener("submit", showScore);
  form.addEventListener("submit", removeBlur);
  form.addEventListener("submit", coinFlip);

  return {
    showScore,
    updateScore,
  };
})();

// handle computer behavior
let computer = (() => {
  // check if computer's turn
  let isComputerTurn = () => {
    if (gameFlow.players[1].isBot && gameFlow.moveCount % 2 !== 0) {
      return true;
    } else {
      return false;
    }
  };

  // function for computer's (random) moves
  let randomMove = () => {
    let squares = document.getElementsByClassName("grid-item");

    while (computer.isComputerTurn() === true) {
      let randomNumber = Math.floor(Math.random() * 9);
      if (
        gameFlow.players[0].playerMoves.includes(randomNumber + 1) ||
        gameFlow.players[1].playerMoves.includes(randomNumber + 1)
      ) {
        // do nothing
      } else {
        squares[randomNumber].click();
      }
    }
  };

  // function for computer's deliberate moves
  let makeMove = () => {
    let squares = document.getElementsByClassName("grid-item");

    if (gameFlow.players[1].playerMoves.length === 0) {
      computer.randomCorner();
    } else if (
      gameFlow.players[1].playerMoves.length < 2 &&
      gameFlow.players[0].playerMoves.length === 1
    ) {
      computer.randomCorner();
    } else if (
      gameFlow.players[0].playerMoves.length === 2 &&
      gameFlow.players[1].playerMoves.length === 1
    ) {
      let x = gameFlow.players[0].playerMoves.sort()[0];
      let y = gameFlow.players[0].playerMoves.sort()[1];
      let z = gameFlow.players[0].playerMoves.sort()[2];

      if (Number.isInteger((x + y) / 2)) {
        squares[(x + y) / 2 - 1].click();
      } else {
        computer.randomMove();
      }
    } else {
      computer.randomMove();
    }
  };

  let checkOpponent = () => {
    let block = 0;
    let opponentMoves = gameFlow.players[0].playerMoves.sort();
    let cpuMoves = gameFlow.players[1].playerMoves.sort();
    for (i = 0; i < opponentMoves.length; i++) {
      let difference = opponentMoves[i + 1] - opponentMoves[i];
      if (
        !opponentMoves.includes(opponentMoves[i + 1] + difference) &&
        !cpuMoves.includes(opponentMoves[i + 1] + difference)
      ) {
        block = opponentMoves[i + difference];
        return block;
      }
    }
  };

  let randomCorner = () => {
    let squares = document.getElementsByClassName("grid-item");
    let corners = [0, 2, 6, 8];

    while (computer.isComputerTurn()) {
      let randomNumber = Math.floor(Math.random() * 4);

      if (
        !gameFlow.players[0].playerMoves.includes(corners[randomNumber] + 1) &&
        !gameFlow.players[1].playerMoves.includes(corners[randomNumber] + 1)
      ) {
        squares[corners[randomNumber]].click();
        break;
      }
    }
  };

  return {
    randomMove,
    isComputerTurn,
    makeMove,
    checkOpponent,
    randomCorner,
  };
})();
