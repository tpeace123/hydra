module.exports = {
  tictactoe: tictactoe
}

var options = [
  "0 0",
  "0 1",
  "0 2",
  "1 0",
  "1 1",
  "1 2",
  "2 0",
  "2 1",
  "2 2"
];


function tictactoe(message, client) {
  var color = Math.ceil(Math.random() * 16777215);
  var board = [["--", "--", "--"], ["--", "--", "--"], ["--", "--", "--"]];
  var filter = m => m.author.id === message.author.id && options.indexOf(m.content) > -1;
  _sendEmbed(message, client, color, board);
  _awaitMessages(message, client, board, color, filter);
}

function _awaitMessages(message, client, board, color, filter) {
  var collector = message.channel.createMessageCollector(filter, {time: 20000, max: 1, maxMatches: 1});
  collector.on('collect', function(m) {
    collector.stop();
    _player(m.content.split(' '), message, client, color, board, filter);
  });
  collector.on('end', function(collected) {});
}

async function _sendEmbed(message, client, color, board) {
  await message.channel.send({
    embed: {
      color: color,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      title: "Tic tac toe",
      thumbnail: {url: message.author.displayAvatarURL()},
      fields: [
        {
          name: "0 0",
          value: board[0][0],
          inline: true
        },
        {
          name: "0 1",
          value: board[0][1],
          inline: true
        },
        {
          name: "0 2",
          value: board[0][2],
          inline: true
        },
        {
          name: "1 0",
          value: board[1][0],
          inline: true
        },
        {
          name: "1 1",
          value: board[1][1],
          inline: true
        },
        {
          name: "1 2",
          value: board [1][2],
          inline: true
        },
        {
          name: "2 0",
          value: board[2][0],
          inline: true
        },
        {
          name: "2 1",
          value: board[2][1],
          inline: true
        },
        {
          name: "2 2",
          value: board[2][2],
          inline: true
        },
        {
          name: "Enter a coordinate. EG: 1 0",
          value: "You have 20 seconds to answer.",
          inline: false
        }
      ],
      timestapm: new Date(),
      footer: {
        icon_url: message.author.displayAvatarURL(),
        text: message.author.tag
      }
    }
  });
}

function _player(m, message, client, color, board, filter) {
  if (board[m[0]][m[1]] !== "--") {
    message.channel.send("That space is not available. You have 20 seconds to enter a valid space.");
    _awaitMessages(message, client, board, color, filter);
  }
  else {
    board[m[0]][m[1]] = "X";
    if (_check(board, message, client, color) === "") {
      _AI(board);
      if (_check(board, message, client, color) === "") {
        _sendEmbed(message, client, color, board);
        _awaitMessages(message, client, board, color, filter);
      }
    }
  }
}

function _check(board, message, client, color) {
  let winner = "";
  if (board[0][0] === "X" && board[0][1] === "X" && board[0][2] === "X") winner = "Player";
  if (board[1][0] === "X" && board[1][1] === "X" && board[1][2] === "X") winner = "Player";
  if (board[2][0] === "X" && board[2][1] === "X" && board[2][2] === "X") winner = "Player";
  if (board[0][0] === "X" && board[1][0] === "X" && board[2][0] === "X") winner = "Player";
  if (board[0][1] === "X" && board[1][1] === "X" && board[2][1] === "X") winner = "Player";
  if (board[0][2] === "X" && board[1][2] === "X" && board[2][2] === "X") winner = "Player";
  if (board[0][0] === "X" && board[1][1] === "X" && board[2][2] === "X") winner = "Player";
  if (board[0][2] === "X" && board[1][1] === "X" && board[2][0] === "X") winner = "Player";

  if (board[0][0] === "O" && board[0][1] === "O" && board[0][2] === "O") winner = "AI";
  if (board[1][0] === "O" && board[1][1] === "O" && board[1][2] === "O") winner = "AI";
  if (board[2][0] === "O" && board[2][1] === "O" && board[2][2] === "O") winner = "AI";
  if (board[0][0] === "O" && board[1][0] === "O" && board[2][0] === "O") winner = "AI";
  if (board[0][1] === "O" && board[1][1] === "O" && board[2][1] === "O") winner = "AI";
  if (board[0][2] === "O" && board[1][2] === "O" && board[2][2] === "O") winner = "AI";
  if (board[0][0] === "O" && board[1][1] === "O" && board[2][2] === "O") winner = "AI";
  if (board[0][2] === "O" && board[1][1] === "O" && board[2][0] === "O") winner = "AI";

  if (winner === "") {
    let cat = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === "--") {
          cat = false;
          break;
        }
      }
      if (cat === false) break;
    }
    if (cat === true) winner = "Tie";
  }
  if (winner !== "") _endEmbed(board, winner, message, client, color);
  return winner;
}

function _AI(board) {
  let num1;
  let num2;
  do {
    num1 = Math.floor(Math.random() * 3);
    num2 = Math.floor(Math.random() * 3);
  } while (board[num1][num2] !== "--");
  board[num1][num2] = "O";
}

function _endEmbed(board, winner, message, client, color) {
  message.channel.send({
    embed: {
      color: color,
      author: {
        name: client.user.tag,
        icon_url: client.user.displayAvatarURL()
      },
      title: "Tic tac toe",
      thumbnail: {url: message.author.displayAvatarURL()},
      fields: [
        {
          name: "0 0",
          value: board[0][0],
          inline: true
        },
        {
          name: "0 1",
          value: board[0][1],
          inline: true
        },
        {
          name: "0 2",
          value: board[0][2],
          inline: true
        },
        {
          name: "1 0",
          value: board[1][0],
          inline: true
        },
        {
          name: "1 1",
          value: board[1][1],
          inline: true
        },
        {
          name: "1 2",
          value: board [1][2],
          inline: true
        },
        {
          name: "2 0",
          value: board[2][0],
          inline: true
        },
        {
          name: "2 1",
          value: board[2][1],
          inline: true
        },
        {
          name: "2 2",
          value: board[2][2],
          inline: true
        },
        {
          name: "Winner:",
          value: winner,
          inline: false
        }
      ],
      timestapm: new Date(),
      footer: {
        icon_url: message.author.displayAvatarURL(),
        text: message.author.tag
      }
    }
  });
}