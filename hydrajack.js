const cards = {
  '1': "A♠",
  '2': "2♠",
  '3': "3♠",
  '4': "4♠",
  '5': "5♠",
  '6': "6♠",
  '7': "7♠",
  '8': "8♠",
  '9': "9♠",
  '10': "10♠",
  '11': "J♠",
  '12': "Q♠",
  '13': "K♠",
  '14': "A♥",
  '15': "2♥",
  '16': "3♥",
  '17': "4♥",
  '18': "5♥",
  '19': "6♥",
  '20': "7♥",
  '21': "8♥",
  '22': "9♥",
  '23': "10♥",
  '24': "J♥",
  '25': "Q♥",
  '26': "K♥",
  '27': "A♣",
  '28': "2♣",
  '29': "3♣",
  '30': "4♣",
  '31': "5♣",
  '32': "6♣",
  '33': "7♣",
  '34': "8♣",
  '35': "9♣",
  '36': "10♣",
  '37': "J♣",
  '38': "Q♣",
  '39': "K♣",
  '40': "A♦",
  '41': "2♦",
  '42': "3♦",
  '43': "4♦",
  '44': "5♦",
  '45': "6♦",
  '46': "7♦",
  '47': "8♦",
  '48': "9♦",
  '49': "10♦",
  '50': "J♦",
  '51': "Q♦",
  '52': "K♦",
}

const imageURLs = {
  1: 'https://i.imgur.com/rh7ySUB.png',
  2: 'https://i.imgur.com/3mUQb1z.png',
  3: 'https://i.imgur.com/EBXh3oB.png'
}

module.exports = {
  blackjack: blackjack
}

function blackjack(message, client) {
  let color = Math.ceil(Math.random() * 16777215);
  let image = imageURLs[Math.ceil(Math.random() * 3)];
  const filter = m => m.author.id === message.author.id && (m.content.toLowerCase() === "hit" || m.content.toLowerCase() === "miss");
  let player = [];
  let ai = [];
  let cardsUsed = _init();
  _start();

  function _start(num = 0) {
    let card = Math.ceil(Math.random() * 52);
    while (cardsUsed[card] === true) card = Math.ceil(Math.random() * 52);
    cardsUsed[card] = true;
    player.push(card);
    card = Math.ceil(Math.random() * 52);
    while (cardsUsed[card] === true) card = Math.ceil(Math.random() * 52);
    cardsUsed[card] = true;
    ai.push(card);
    if (num === 0) _start(1);
    else {
      message.channel.send({
        embed: {
          color: color,
          author: {
            name: client.user.tag,
            icon_url: client.user.displayAvatarURL(),
          },
          title: "Blackjack",
          thumbnail: {
            url: image,
          },
          fields: [
            {
              name: `${message.author.tag}'s hand`,
              value: `\`${cards[player[0]]}, ${cards[player[1]]}\``,
              inline: true,
            },
            {
              name: `Sum`,
              value: `\`${_calculate()}\``,
              inline: true,
            },
            {
              name: "AI's hand",
              value: `\`**********\``,
              inline: false,
            },
            {
              name: `Type \`hit\` for hit`,
              value: 'You have 10 seconds to reply',
              inline: true,
            },
            {
              name: `Type \`miss\` to pass`,
              value: '\u200b',
              inline: true,
            },
          ],
          timestamp: new Date(),
          footer: {
            icon_url: message.author.displayAvatarURL(),
            text: message.author.tag,
          }
        }
      }).then(function(sentMessage) {        
        _awaitMessages();
      });
    }

    function _player(collected = _awaitMessages()) {
      if (collected === "miss") _playerEnd();
      else {
        let card = Math.ceil(Math.random() * 52);
        while (cardsUsed[card] === true) card = Math.ceil(Math.random() * 52);
        cardsUsed[card] = true;
        player.push(card);
        let total = _calculate();
        let bust = false;
        let win = false;
        if (total[0] > 21) {
          bust = true;
          win = false;
        }
        else {
          for (let i = 0; i < total.length; i++) {
            if (total[i] === 21) {
              win = true;
              bust = false;
              break;
            } else {
              win = false;
              bust = false;
            }
          }
        }
        if (win === true) _playerEnd(1);
        else if (bust === true) _playerEnd(2);
        else {
          _sendEmbed();
          _awaitMessages();
        }
      }
    }

    function _playerEnd(win = 0) {
      if (win === 1) _sendEmbed(true, 1);
      else if (win === 2) _sendEmbed(true, 2);
      else _ai();
    }

    function _awaitMessages() {
      let collector = message.channel.createMessageCollector(filter, {time: 10000, max: 1, maxMatches: 1});
      collector.on('collect', function(m) {
        collector.stop();
        _player(m.content.toLowerCase());
      });
      collector.on('end', function(collected) {
      });
    }

    function _ai() {
      let total = _calculate(ai);
      if (total[0] > 21) _sendEmbed(true, 5);
      else {
        let win = false;
        for (let i = 0; i < total.length; i++) {
          if (total[i] === 21) {
            win = true;
            _sendEmbed(true, 4);
            break;
          }
          else win = false;
        }
        if (win === false) {
          let num = total.length - 1;
          for (let i = 0; i < total.length; i++) {
            if (total[i] > 21) {
              num = i - 1;
              break;
            }
          }
          let dealt = false;
          for (let i = num; i > 0; i--) {
            if (total[i] < 15) {
              let card = Math.ceil(Math.random() * 52);
              while (cardsUsed[card] === true) card = Math.ceil(Math.random() * 52);
              cardsUsed[card] = true;
              ai.push(card);
              dealt = true;
              break;
            }
            else dealt = false;
          }
          if (dealt === false) {
            let playerHigh = _calculatePlayerHigh();
            if (playerHigh === total[num]) _sendEmbed(true, 3);
            else if (playerHigh > total[num]) _sendEmbed(true, 1);
            else if (playerHigh < total[num]) _sendEmbed(true, 4);
          }
          else _ai();
        }
      }
    }
  }

  function _calculatePlayerHigh() {
    let total = _calculate();
    // let num = total.length - 1;
    for (let i = 0; i < total.length; i++) {
      if (total[i] > 21) {
        return total[total.length - 2];
      }
    }
    return total[total.length - 1];
  }
   
  function _getMessage(user = player) {
    let message = `${cards[user[0]]}`;
    for (let i = 1; i < user.length; i++) message = `${message}, ${cards[user[i]]}`;
    return message;
  }

  function _sendEmbed(val = false, num = 0) {
    if (val === false) {
      message.channel.send({
        embed: {
          color: color,
          author: {
            name: client.user.tag,
            icon_url: client.user.displayAvatarURL(),
          },
          title: "Blackjack",
          thumbnail: {
            url: image,
          },
          fields: [
            {
              name: `${message.author.tag}'s hand`,
              value: `\`${_getMessage()}\``,
              inline: true,
            },
            {
              name: `Sum`,
              value: `\`${_calculate()}\``,
              inline: true,
            },
            {
              name: "AI's hand",
              value: `\`**********\``,
              inline: false,
            },
            {
              name: `Type \`hit\` for hit`,
              value: 'You have 10 seconds to reply',
              inline: true,
            },
            {
              name: `Type \`miss\` to pass`,
              value: '\u200b',
              inline: true,
            },
          ],
          timestamp: new Date(),
          footer: {
            icon_url: message.author.displayAvatarURL(),
            text: message.author.tag,
          }
        }
      });
    }
    else {
      message.channel.send({
        embed: {
          color: color,
          author: {
            name: client.user.tag,
            icon_url: client.user.displayAvatarURL(),
          },
          title: "Blackjack",
          thumbnail: {
            url: image,
          },
          fields: [
            {
              name: `${message.author.tag}'s hand`,
              value: `\`${_getMessage()}\``,
              inline: true,
            },
            {
              name: `Sum`,
              value: `\`${_calculate()}\``,
              inline: true,
            },
            {
              name: '\u200b',
              value: '\u200b',
              inline: true,
            },
            {
              name: "AI's hand",
              value: `\`${_getMessage(ai)}\``,
              inline: true,
            },
            {
              name: `${_getEndMessage(num)}`,
              value: `AI's Sum: \`${_calculate(ai)}\``,
              inline: true,
            },
            {
              name: '\u200b',
              value: '\u200b',
              inline: true,
            },
            {
              name: `Type \`hit\` for hit`,
              value: '\u200b',
              inline: true,
            },
            {
              name: `Type \`miss\` to pass`,
              value: '\u200b',
              inline: true,
            },
          ],
          timestamp: new Date(),
          footer: {
            icon_url: message.author.displayAvatarURL(),
            text: message.author.tag,
          }
        }
      });
    }
  }

  function _getEndMessage(num) {
    if (num === 1) return "Player Win!";
    else if (num === 2) return "Player Bust!";
    else if (num === 3) return "Tie!";
    else if (num === 4) return "AI Win!";
    else return "AI Bust!";
  }

  function _calculate(user = player) {
    let sum = [0];
    let aceCount = 0;
    for (let i = 0; i < user.length; i++) {
      switch (user[i]) {
        case 2:
        case 15:
        case 28:
        case 41: sum[0] += 2; break;
        case 3:
        case 16:
        case 29:
        case 42: sum[0] += 3; break;
        case 4:
        case 17:
        case 30:
        case 43: sum[0] += 4; break;
        case 5:
        case 18:
        case 31:
        case 44: sum[0] += 5; break;
        case 6:
        case 19:
        case 32:
        case 45: sum[0] += 6; break;
        case 7:
        case 20:
        case 33:
        case 46: sum[0] += 7; break;
        case 8:
        case 21:
        case 34:
        case 47: sum[0] += 8; break;
        case 9:
        case 22:
        case 35:
        case 48: sum[0] += 9; break;
        case 10:
        case 11:
        case 13:
        case 23:
        case 24:
        case 25:
        case 26:
        case 36:
        case 37:
        case 38:
        case 39:
        case 49:
        case 50:
        case 51:
        case 52: sum[0] += 10; break;
        default: aceCount += 1;
      }
    }
    for (let i = 0; i < aceCount; i++) sum.push(sum[0]);
    switch (aceCount) {
      case 1: sum[0] += 1; sum[1] += 11; break;
      case 2: sum[0] += 2; sum[1] += 12; sum[2] += 22; break;
      case 3: sum[0] += 3; sum[1] += 13; sum[2] += 23; sum[3] += 33; break;
      case 4: sum[0] += 4; sum[1] += 14; sum[2] += 24; sum[3] += 34; sum[4] += 44; break;
    }
    return sum;
  }
}

function _init(length = 52) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(false);
  }
  return arr;
}