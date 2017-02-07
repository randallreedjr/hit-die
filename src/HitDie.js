'use strict';

function processChatMessage(msg) {
  if(hitDieCommand(msg)) {
    return processHitDie(msg);
  } else if(rollCommand(msg)) {
    return processRoll(msg);
  } else {
    return null;
  }
}

function hitDieCommand(msg) {
  // api message, starts with hitdie command
  return msg.type === "api" && msg.content.indexOf("!hitdie") === 0;
}

function rollCommand(msg) {
  // message sent as hitdie with roll command
  return msg.who === 'hitdie' && msg.type === 'rollresult';
}

function getPlayerName(name) {
  // handle GM player case
  return name.lastIndexOf(' (GM)') === name.length - 5 ?
  name.substring(0, name.length - 5) :
  name;
}

function fullHp(characterId) {
  var currentHp = getAttrByName(characterId, 'HP');
  var maxHp = getAttrByName(characterId, 'HP', 'max');
  return currentHp === maxHp;
}

function availableHitDie(characterId) {
  if(getAttrByName(characterId, 'hd_d12') && getAttrByName(characterId, 'hd_d12').toNumber > 0) {
    return 'd12';
  } else if(getAttrByName(characterId, 'hd_d10') && getAttrByName(characterId, 'hd_d10').toNumber > 0) {
    return 'd10';
  } else if(getAttrByName(characterId, 'hd_d8') && getAttrByName(characterId, 'hd_d8').toNumber > 0) {
    return 'd8';
  } else if(getAttrByName(characterId, 'hd_d6') && getAttrByName(characterId, 'hd_d6').toNumber > 0) {
    return 'd6';
  }
  return '';
}

function processRoll(msg) {
  var content = JSON.parse(msg.content);
  // need to know who rolled
  var result = content.total;
  var name = content.rolls[1].text.trimLeft();
  var character = findObjs({
    type: 'character',
    name: name
  })[0];
  sendChat(name, '/em recovers ' + result + 'hp!');
  // update hp
  // update hit die current
  return true;
}

function processHitDie(msg) {
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

    var characterId = character.get('_id')
    if(fullHp(characterId)) {
      return false;
    }
    var dieToRoll = availableHitDie(characterId);
    sendChat(msg.who, '/em uses a hit die');
    sendChat('hitdie', '/roll 1' + dieToRoll + ' ' + msg.who);
    return true;
  }
  return null;
}

// Comment out on chat:message event handler for tests
on("chat:message", function(msg) {
  processChatMessage(msg);
});
