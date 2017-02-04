'use strict';

function hitDieCommand(msg) {
  // api message, starts with hitdie command
  return msg.type == "api" && msg.content.indexOf("!hitdie") === 0;
}

function getPlayerName(name) {
  // handle GM player case
  return name.lastIndexOf(' (GM)') === name.length - 5 ?
    name.substring(0, name.length - 5) :
    name;
}

function processChatMessage(msg) {
  if(hitDieCommand(msg)) {
    var name = msg.who;
    var character = findObjs({
        type: 'character',
        name: name
    })[0];

    var playerName = getPlayerName(name);
    var player = findObjs({
      type: 'player',
      displayname: playerName
    })[0];

    if (player) {
      sendChat(msg.who, '/w ' + playerName + ' !hitdie command must be used as a character');
      return false;
    } else if (character) {
      sendChat(msg.who, '/em uses a hit die');
      sendChat(msg.who, '/roll 1d6');
      return true;
    }
  }
  return null;
}

// Comment out on chat:message event handler for tests
on("chat:message", function(msg) {
  processChatMessage(msg);
});
