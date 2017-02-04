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
        log(character);
        sendChat(msg.who, '/em uses a hit die');
        sendChat(msg.who, '/roll 1d6');
        log(character.get('HP'));
        return true;
      }
    }
    return null;
  }


// on("chat:message", function(msg) {
//   processChatMessage(msg);
// });
