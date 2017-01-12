function initialSetUp() {
  var player = 1;
  setBoxFunctions(player);
}

function setBoxFunctions(player) {
  var sign = player === 1 ? "X" : "O";
  var boxes = document.getElementsByClassName("blank-box");

  for (var i = 0; i < boxes.length ; i++) {
    var box = boxes[i];

    box.addEventListener("mouseover", function() {
      if ( this.className === "blank-box" ) {
        this.innerHTML = sign;       
      }
    });
    box.addEventListener("mouseout", function() {
      if ( this.className === "blank-box" ) {
        this.innerHTML = "";       
      }
    });

    box.addEventListener("click", function() {
      if ( player === 1 ) {
        this.innerHTML = sign;
        this.className = player;
        document.getElementById("current-player").innerHTML = "2";

        removeAllBoxListeners();
        if ( !playerWins(player) ) { setBoxFunctions(2) }

      } else {
        this.innerHTML = sign;
        this.className = player;
        document.getElementById("current-player").innerHTML = "1";

        removeAllBoxListeners();
        if ( !playerWins(player) ) { setBoxFunctions(1) }

      }
    });

  }
}

function removeAllBoxListeners() {
  // cloning to remove all listeners
  var boxes = document.getElementsByTagName("td");
  for (var i = 0; i < boxes.length ; i++) {
    var box = boxes[i];
    var clonedBox = box.cloneNode(true);
    box.parentNode.replaceChild(clonedBox, box);
    box = clonedBox;
  }
}

function playerWins(player) {
  if (document.getElementsByClassName("blank-box").length > 4) {return false}

  var playersBoxes = document.getElementsByClassName(player);
  var playersBoxLocations = [];
  for (var i = 0; i < playersBoxes.length; i++) {
    playersBoxLocations.push(playersBoxes[i].id);
  }

  if ( checkForVerticalWin(playersBoxLocations) || checkForHorizontalWin(playersBoxLocations) || checkForDiagonalWin(playersBoxLocations) ) {
    doWinFunctions(player);
    return true; 
  } else if ( playersBoxes.length === 5 ) { 
    doTieFunctions();
    return true;
  }

  // reminder: will not implicitly return truthy as in Ruby
 
}

function doWinFunctions(player) {
  document.getElementById("game-commentator").innerHTML = "PLAYER " + player + " WINS!";
  freezeBoardEndMessage();
}

function doTieFunctions() {
  document.getElementById("game-commentator").innerHTML = "That's a TIE!";
  freezeBoardEndMessage();
}

function freezeBoardEndMessage() {

 // cloning to remove listeners
  var boxes = document.getElementsByTagName("td");
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    var clonedBox = box.cloneNode(true);
    box.parentNode.replaceChild(clonedBox, box);
  }
  
  var message = document.createElement("h2");
  message.id = "after-game-message";
  message.innerHTML = "Click here to play again.";
  var thankYou = document.createElement("p");
  thankYou.id = "thank-you-message";
  thankYou.innerHTML = "Thanks for playing my tic tac toe app!";
  
  var theme = document.getElementsByTagName("body")[0].className;
  message.className = theme;
  thankYou.className = theme;

  var gameSpace = document.getElementById("game-space");
  gameSpace.appendChild(message);
  gameSpace.appendChild(thankYou);

  message.addEventListener("click", function() {
    gameSpace.removeChild(message);
    gameSpace.removeChild(thankYou);
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].className = "blank-box";
      boxes[i].innerHTML = "";
      document.getElementById("game-commentator").innerHTML = "Player <span id=\"current-player\">1</span>'s turn.";
      setBoxFunctions(1);
    }
  });

}

function colorWinningBoxes(boxes) {
  document.getElementById(boxes[0]).className = "winning-box";
  document.getElementById(boxes[1]).className = "winning-box";
  document.getElementById(boxes[2]).className = "winning-box";
}

function checkForHorizontalWin(boxLocations) {
  var columns = ["a","b","c"];
  for (var i = 0; i < columns.length; i++) {
    var boxesPerColumn = boxLocations.filter( function(location) { return location[0] === columns[i]} );
    if ( boxesPerColumn.length > 2 ) {
      colorWinningBoxes(boxesPerColumn);
      return true;
    }
  }
  return false;
}

function checkForVerticalWin(boxLocations) {
  var rows = [1,2,3];
  for (var i = 0; i < rows.length; i++) {
    var boxesPerRow = boxLocations.filter( function(location) { return +location[1] === rows[i]} );
    if ( boxesPerRow.length > 2 ) {
      colorWinningBoxes(boxesPerRow);
      return true;
    }
  }
  return false;
}

function checkForDiagonalWin(boxLocations) {
  if ( boxLocations.indexOf("b2") < 0 ) { return false }
  var firstCornerSet = ["a1", "c3"];
  var secondCornerSet = ["a3", "c1"];
  if ( boxLocations.indexOf(firstCornerSet[0]) > -1 && boxLocations.indexOf(firstCornerSet[1]) > -1 ) {
    firstCornerSet.push("b2")
    colorWinningBoxes(firstCornerSet);
    return true;
  }
  if ( boxLocations.indexOf(secondCornerSet[0]) > -1 && boxLocations.indexOf(secondCornerSet[1]) > -1 ) {
    secondCornerSet.push("b2")
    colorWinningBoxes(secondCornerSet);
    return true;
  }
}