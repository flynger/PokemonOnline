var latency = 0;
var client = {
  socket: null,
  init: (link) => {
    client.socket = io.connect(link);

    client.socket.on('pong', (ms) => {
      latency = ms;
    });
    client.socket.on("loginFail", () => {
      alert("Login failed. Your username or password is incorrect.");
    });
    client.socket.on("loginSuccess", (data) => {
      //alert("You have logged in successfully.");
      if (document.getElementById("rememberMe").checked) {
        localStorage.setItem('rememberMe', "yes");
        localStorage.setItem('username', playerData.name);
        localStorage.setItem('password', playerData.pass);
      } else if (localStorage.getItem('rememberMe') == "yes") {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }

      // if (document.getElementById("autoLogin").checked) {
      //   localStorage.setItem('autoLogin', "yes");
      //   localStorage.setItem('username', playerData.name);
      //   localStorage.setItem('password', playerData.pass);
      // } else if (localStorage.getItem('autoLogin') == "yes") {
      //   localStorage.removeItem('autoLogin');
      // }
      // if (document.getElementById("autoLogin").checked) {
      //   localStorage.setItem('autoLogin', "yes");
      //   localStorage.setItem('username', playerData.name);
      //   localStorage.setItem('password', playerData.pass);
      // }
      playerData.pokemon.party = data.party;
      showChat();
      deleteLogin();
      load(data);
      document.body.style.backgroundColor = "black";
      delete playerData.pass;
      if (data.busy && data.encounter.species) {
        playerData.encounter = data.encounter;
        startEncounterWithMusic();
      } else {
        playBackgroundMusic(0.025);
      }
    });
    client.socket.on("warpEvent", (data) => {
      promiseMovementBeforeWarp(data);
    });
    client.socket.on("signUp", (data) => {
      alert("Your account has been created and you have been logged in.");
      // showChat();
      // deleteLogin();
      // load(data);
      // delete playerData.pass;
      // playBackgroundMusic(0.025);
    });
    client.socket.on("signUpExists", (data) => {
      alert("Sign up failed. This username has already been taken.");
    });
    client.socket.on("signUpFail", (data) => {
      alert("Sign up failed. Invalid parameters.");
    });
    client.socket.on("nameError", (data) => {
      alert("Invalid username. A username may only include alphanumeric characters, underscores, and be a length of 3 to 16 characters.");
    });
    client.socket.on("passError", (data) => {
      alert("Invalid password. A password must include 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 8 characters long.");
    });
    client.socket.on("doubleError", (data) => {
      alert("This user is already logged in.");
    });
    client.socket.on("playerMovement", (data) => {
      //console.log("movement data recieved for player " + data.id);
      if (data.map != playerData.map.name || data.submap != playerData.submap) {
        playersNotInMap.push(data);
      }
      else handlePlayerData(data);
    });
    client.socket.on("encounter", (data) => {
      //players[client.socket.id].moveTo(false, players[client.socket.id].controller.target.x, players[client.socket.id].controller.target.y);
      playerData.pokemon.party = data.party;
      playerData.encounter = data.encounter;
      startEncounter(data.encounter);
    });
    client.socket.on("endBattle", (data) => {
      endBattle();
    });
    client.socket.on("itemReceived", (data) => {
      playerData.inventory = data.inventory;
      data.message = "You found ";
      if (data.itemCount == 1) {
        data.message += "a";
      } else {
        data.message += data.itemCount;
      }
      data.message += " " + data.itemFound + "!";
      data.name = "Server";
      addChatMessage(data);
    });
    client.socket.on("turnData", (data) => {
      playerData.pokemon.party = data.party;
      playerData.speeder = 1;
      playerData.slower = 0;
      if (data.userWentFirst) {
        playerData.speeder = 0;
        playerData.slower = 1;
      }

      var totalCounter = [0];
      for (item of data.move1) {
        if (item.message) {
          totalCounter.push(totalCounter[totalCounter.length - 1] + item.message.length * 50);
        } if (item.damageHPTo) {
          totalCounter.push(totalCounter[totalCounter.length - 1] + 2200);
        } if ('gainXPTo' in item) {
          totalCounter.push(totalCounter[totalCounter.length - 1] + 1800);
        }
      }
      if (data.move2)
        for (item of data.move2) {
          if (item.message) {
            totalCounter.push(totalCounter[totalCounter.length - 1] + item.message.length * 50);
          } if (item.damageHPTo) {
            totalCounter.push(totalCounter[totalCounter.length - 1] + 2200);
          } if ('gainXPTo' in item) {
            totalCounter.push(totalCounter[totalCounter.length - 1] + 1800);
          }
        }
      console.log(totalCounter);
      // var counter = 0;
      // var counter2 = 0;
      // for (item of data.move1) {
      //   if (item.message) {
      //     console.log(counter);
      //     setTimeout(showDialogue, counter, item.message);
      //     counter += item.message.length * 35;
      //   } else if (item.damageHPTo) {
      //     setTimeout(updateHPBar, counter + 500, playerData.slower, item.damageHPTo);
      //     counter += 2000;
      //   }
      // }
      // if (data.move2) setTimeout(function () {
      //   for (item of data.move2) {
      //     if (item.message) {
      //       setTimeout(showDialogue, counter2, item.message);
      //       counter2 += item.message.length * 35;
      //     } else if (item.damageHPTo) {
      //       setTimeout(updateHPBar, counter2 + 500, playerData.speeder, item.damageHPTo);
      //       counter2 += 2000;
      //     }
      //   }
      // }, counter);
      // console.log(counter + counter2);
      // if (data.battleEnd) setTimeout(endBattle, counter + counter2 + 1500);
      // else setTimeout(showBattleOptions, counter + counter2 + 1500);
      var counter = 0;
      for (item of data.move1) {
        if ('message' in item) {
          setTimeout(showDialogue, totalCounter[counter], item.message);
        } if ('damageHPTo' in item) {
          setTimeout(updateHPBar, totalCounter[counter] + 500, playerData.slower, item.damageHPTo);
        } if ('gainXPTo' in item) {
          setTimeout(updateXPBar, totalCounter[counter] + 500, item.gainXPTo);
        } if ('resetXP' in item) {
          setTimeout(resetXPBar, totalCounter[counter]);
        }
        counter++;
      }
      if (data.move2)
        for (item of data.move2) {
          if ('message' in item) {
            setTimeout(showDialogue, totalCounter[counter], item.message);
          } if ('damageHPTo' in item) {
            setTimeout(updateHPBar, totalCounter[counter] + 500, playerData.speeder, item.damageHPTo);
          } if ('gainXPTo' in item) {
            setTimeout(updateXPBar, totalCounter[counter] + 500, item.gainXPTo);
          } if ('resetXP' in item) {
            setTimeout(resetXPBar, totalCounter[counter]);
          }
          counter++;
        }
      //console.log(counter + counter2);
      if (data.battleEnd) setTimeout(endBattle, totalCounter[totalCounter.length - 1] + 1200);
      else setTimeout(showBattleOptions, totalCounter[totalCounter.length - 1] + 500);
    });
    client.socket.on("moneyUpdate", (data) => {
      updateMoney(data.money);
    });
    client.socket.on("chatMessage", (data) => {
      addChatMessage(data);
    });
    client.socket.on("kickEvent", (data) => {
      if (data.kicked) {
        alert("You have been kicked from the server by " + data.name + ".");
        client.socket.disconnect();
      }
    });
    client.socket.on("hackPlayer", (data) => {
      client.socket.id = data.id;
    });
    client.socket.on("reloadGame", (data) => {
      location.reload();
    });
    client.socket.on("adjustMovement", (data) => {
      var thisPlayer = players[client.socket.id];
      // var hasNotReached = (Math.abs(thisPlayer.controller.target.y - thisPlayer.pos.y) > thisPlayer.controller.speed && Math.abs(thisPlayer.controller.target.x - thisPlayer.pos.x) > thisPlayer.controller.speed)
      // if (data.input == "up") {
      //   if (thisPlayer.controller.moving && hasNotReached) thisPlayer.controller.target.y += 32;
      //   else thisPlayer.pos.y += 32;
      // } else if (data.input == "down") {
      //   if (thisPlayer.controller.moving && hasNotReached) thisPlayer.controller.target.y -= 32;
      //   else thisPlayer.pos.y -= 32;
      // } else if (data.input == "left") {
      //   if (thisPlayer.controller.moving && hasNotReached) thisPlayer.controller.target.y += 32;
      //   else thisPlayer.pos.x += 32;
      // } else if (data.input == "right") {
      //   if (thisPlayer.controller.moving && hasNotReached) thisPlayer.controller.target.y -= 32;
      //   else thisPlayer.pos.x -= 32;
      // }
      if (thisPlayer.controller.moving) {
        if (thisPlayer.idleCounter == 0) {
          thisPlayer.controller.target.x = thisPlayer.idleX;
          thisPlayer.controller.target.y = thisPlayer.idleY;
          thisPlayer.pos.x = thisPlayer.idleX;
          thisPlayer.pos.y = thisPlayer.idleY;
          thisPlayer.controller.speed = 120 / playerData.FPS;
          thisPlayer.idle = false;
          thisPlayer.idleCounter = 8 * playerData.FPS / 30;
        } else {
          thisPlayer.pos.x = thisPlayer.controller.target.x;
          thisPlayer.pos.y = thisPlayer.controller.target.y;
        }
        if (thisPlayer.img.cellX % 2 == 1) thisPlayer.img.shiftX(1);
        thisPlayer.controller.moving = false;
      }

      if (data.input == "up") {
        thisPlayer.pos.y += 32;
      } else if (data.input == "down") {
        thisPlayer.pos.y -= 32;
      } else if (data.input == "left") {
        thisPlayer.pos.x += 32;
      } else if (data.input == "right") {
        thisPlayer.pos.x -= 32;
      }
    });
    client.socket.on("onConnect", (data) => {

    });
    client.socket.on("sendDisconnect", (data) => {
      if (players[data.id] && players[data.id].name == data.id) {
        objects.layers[2].splice(objects.layers[2].indexOf(players[data.id]), 1);
        delete players[data.id];
      }
    });
    client.socket.on("serverDown", () => {
      setInterval(addChatMessage, 250, {name: "YourMom", message: "<text style=\"color: red;\">Time to sleep little timmy</text>"});
      //addChatMessage();
    });
  },
  send: (data, key) => {
    if (!key) key = "send";
    client.socket.emit(key, data);
  }
}

// client.socket.on("playerMovement", function (data) {
//   if(data.id != playerData.name && playerData.name != undefined && data.id != undefined){
//     if (!players[data.id]) {
//       new player(data.id);
//     }
//     players[data.id].name = data.id;
//     players[data.id].pos.x = data.posX;
//     players[data.id].pos.y = data.posY;
//     players[data.id].img.setY(data.dir);
//     if (data.isAnimating == true) {
//       players[data.id].img.animateX();
//       players[data.id].img.animateX();
//       players[data.id].img.animateX();
//       players[data.id].img.animateX();
//     }
//   }
// });

function load(data) {
  playerData.sounds.backgroundMusic = loadSound('res/audio/maps/' + data.map + '.mp3');
  createMap(data.map, data.submap);
  players[client.socket.id] = new player(client.socket.id, true, data.avatar);
  playerData.name = data.name;
  playerData.player = players[client.socket.id];
  //playerData.exists = true;
  playerData.player.pos.x = 32 * data.x;
  playerData.player.pos.y = 32 * data.y - 16;
  playerData.player.controller.facing = data.facing;
  playerData.player.img.setY(data.facing);
  playerData.map.name = data.map;
  playerData.submap = data.submap;
  playerData.map.button.innerHTML = playerData.map.name;
  playerData.inventory = data.inventory;

  opacity = 255;
  countDown = true;
  updateMoney(data.money);

  collidables = data.collidables;
  warpTiles = data.warpTiles;
  ledges = data.ledges;
  playerData.loaded = true;
}

function deleteLogin() {
  Screen.resize();
  //if (playerData.joystick) screen.orientation.lock('landscape');
  var loginElements = Array.from(document.getElementsByClassName("login"));
  for (element in loginElements) {
    loginElements[element].style.display = "none";
  }
  // document.getElementById("username").style.display = "none";
  // document.getElementById("password").style.display = "none";
  // document.getElementById("loginBtn").style.display = "none";
  //document.getElementById("titleText").textContent = "Welcome to Pokémon Online!";
  document.getElementById("titleText").style.display = "none";
  document.getElementById("defaultCanvas0").style.display = "block";
  playerData.map.button = document.getElementById("mapBtn");
  playerData.map.image = document.getElementById("kantoMap");
  //document.getElementById("chatInput").style.left = (window.innerWidth-1080)/2;
  positionGUI();
}

function showChat() {
  chat.input = document.getElementById("chatInput");
  chat.label = document.getElementById("chatLabel");
  chat.output = document.getElementById("chatOutput");
  chat.outputDiv = document.getElementById("chat");
  chat.toggler = document.getElementById("chatBtn");
  chat.outputDiv.style.display = "block";
  chat.input.style.display = "block";
  chat.label.style.display = "block";
  chat.toggler.style.display = "block";
}

function updateMoney(money) {
  playerData.money.balance = money;
  var visibleMoney = money;
  if (money >= 1000000) {
    visibleMoney = Math.round(money / 100000) / 10 + "m";
  } else if (money >= 10000) {
    visibleMoney = Math.round(money / 100) / 10 + "k";
  }
  playerData.money.button.innerHTML = "Money: $" + visibleMoney;
  //alert(objects.layers[0][0]);
}

function positionGUI() {
  if (playerData.joystick) {
    resizeChat();
  }
  // positionChat();

  playerData.map.button.style.display = "block";
  playerData.map.button.style.right = 0;
  playerData.map.button.style.top = 0;
  if (playerData.joystick) {
    playerData.joystickDiv.style.display = "block";
    playerData.map.button.style.width = window.displayWidth * 0.20;
    playerData.map.button.style.height = window.displayHeight * 0.09;
    playerData.map.button.style.fontSize = window.displayHeight * 0.1 / 2;
  } else {
    playerData.map.button.style.width = window.displayWidth * 0.09;
    playerData.map.button.style.height = window.displayHeight * 0.045;
    playerData.map.button.style.fontSize = window.displayHeight * 0.045 / 2;
  }
  playerData.map.image.style.left = (window.displayWidth - 1080) / 2 + 28;
  playerData.map.image.style.top = (window.displayHeight - 720) / 2 + 72;

  playerData.money.button = document.getElementById("moneyBtn");
  playerData.money.button.style.display = "block";
  playerData.money.button.style.right = parseInt(playerData.map.button.style.width);
  playerData.money.button.style.top = 0;
  playerData.money.button.style.width = playerData.map.button.style.width;
  playerData.money.button.style.height = playerData.map.button.style.height;
  playerData.money.button.style.fontSize = playerData.map.button.style.fontSize;

  document.getElementById("dialogue").style.left = (window.displayWidth - 1080) / 2 + 80 - 20;
  document.getElementById("dialogue").style.top = (window.displayHeight - 720) / 2 + 480;

  document.getElementById("fightBtn").style.left = (window.displayWidth - 1080) / 2 + 550;
  document.getElementById("fightBtn").style.top = (window.displayHeight - 720) / 2 + 510;
  document.getElementById("switchBtn").style.left = (window.displayWidth - 1080) / 2 + 550;
  document.getElementById("switchBtn").style.top = (window.displayHeight - 720) / 2 + 595;
  document.getElementById("bagBtn").style.left = (window.displayWidth - 1080) / 2 + 800;
  document.getElementById("bagBtn").style.top = (window.displayHeight - 720) / 2 + 510;
  document.getElementById("runBtn").style.left = (window.displayWidth - 1080) / 2 + 800;
  document.getElementById("runBtn").style.top = (window.displayHeight - 720) / 2 + 595;
  document.getElementById("backBtn").style.left = (window.displayWidth - 1080) / 2 + 390;
  document.getElementById("backBtn").style.top = (window.displayHeight - 720) / 2 + 595;

  document.getElementById("move1").style.left = (window.displayWidth - 1080) / 2 + 550;
  document.getElementById("move1").style.top = (window.displayHeight - 720) / 2 + 510;
  document.getElementById("move2").style.left = (window.displayWidth - 1080) / 2 + 800;
  document.getElementById("move2").style.top = (window.displayHeight - 720) / 2 + 510;
  document.getElementById("move3").style.left = (window.displayWidth - 1080) / 2 + 550;
  document.getElementById("move3").style.top = (window.displayHeight - 720) / 2 + 595;
  document.getElementById("move4").style.left = (window.displayWidth - 1080) / 2 + 800;
  document.getElementById("move4").style.top = (window.displayHeight - 720) / 2 + 595;

  document.getElementById("battleBackground").style.left = (window.displayWidth - 1080) / 2;
  document.getElementById("battleBackground").style.top = (window.displayHeight - 720) / 2;
  document.getElementById("base0").style.left = (window.displayWidth - 1080) / 2 + 80;
  document.getElementById("base0").style.top = (window.displayHeight - 720) / 2 + 420;
  document.getElementById("base1").style.left = (window.displayWidth - 1080) / 2 + 700;
  document.getElementById("base1").style.top = (window.displayHeight - 720) / 2 + 142;
  document.getElementById("hpbar0").style.left = (window.displayWidth - 1080) / 2 + 600;
  document.getElementById("hpbar0").style.top = (window.displayHeight - 720) / 2 + 280;
  document.getElementById("hpbar1").style.left = (window.displayWidth - 1080) / 2 + 200;
  document.getElementById("hpbar1").style.top = (window.displayHeight - 720) / 2 + 92;
  // your pokemon
  playerData.yourHP = {};
  playerData.yourHP.color = "green";
  playerData.yourHP.bar = document.getElementById("hp0");
  playerData.yourHP.label = document.getElementById("userHP");
  playerData.yourName = document.getElementById("name0");
  playerData.yourLevel = document.getElementById("level0");
  playerData.xpBar = document.getElementById("xp0");
  playerData.yourHP.bar.style.left = parseInt(document.getElementById("hpbar0").style.left) + 204;
  playerData.yourHP.bar.style.top = parseInt(document.getElementById("hpbar0").style.top) + 80;
  playerData.xpBar.style.left = (window.displayWidth - 1080) / 2 + 740;
  playerData.xpBar.style.top = (window.displayHeight - 720) / 2 + 424;
  playerData.xpBar.style.transitionDuration = "1s";
  playerData.yourHP.label.style.right = (window.displayWidth - 1080) / 2 + 90;
  playerData.yourHP.label.style.top = (window.displayHeight - 720) / 2 + 376;
  playerData.yourName.style.left = (window.displayWidth - 1080) / 2 + 683;
  playerData.yourName.style.top = (window.displayHeight - 720) / 2 + 307;
  playerData.yourLevel.style.left = (window.displayWidth - 1080) / 2 + 957;
  playerData.yourLevel.style.top = (window.displayHeight - 720) / 2 + 307;
  // other pokemon
  playerData.enemyHP = {};
  playerData.enemyHP.color = "green";
  playerData.enemyHP.bar = document.getElementById("hp1");
  playerData.enemyName = document.getElementById("name1");
  playerData.enemyLevel = document.getElementById("level1");
  playerData.enemyHP.bar.style.left = (window.displayWidth - 1080) / 2 + 368;
  playerData.enemyHP.bar.style.top = (window.displayHeight - 720) / 2 + 172;
  playerData.enemyName.style.left = (window.displayWidth - 1080) / 2 + 247;
  playerData.enemyName.style.top = (window.displayHeight - 720) / 2 + 119;
  playerData.enemyLevel.style.left = (window.displayWidth - 1080) / 2 + 521;
  playerData.enemyLevel.style.top = (window.displayHeight - 720) / 2 + 119;

  // your inventory 
  document.getElementById("invBtn").style.display = "block";
  document.getElementById("invBtn").style.left = 5;
  document.getElementById("invBtn").style.bottom = 5;
  document.getElementById("inventory").style.left = window.displayWidth / 2 - parseInt(document.getElementById("inventory").style.width) / 2;
  document.getElementById("inventory").style.top = window.displayHeight / 2 - parseInt(document.getElementById("inventory").style.height) / 2;

  $('#invLabel').on("click", () => { return false });
  $("#inventory").draggable({ containment: "#defaultCanvas0", handle: "button#invLabel", cancel: false });
  $("#invItems").accordion({
    active: false,
    animate: false,
    collapsible: true,
    heightStyle: "content"
    //  icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" } 
  });
}

function playBackgroundMusic(volume) {
  setTimeout(() => {
    if (playerData.sounds.backgroundMusic.isLoaded() && !playerData.sounds.backgroundMusic.isPlaying()) {
      playerData.sounds.backgroundMusic.setVolume(volume);
      playerData.sounds.backgroundMusic.setLoop(true);
      playerData.sounds.backgroundMusic.play();
    } else if (playerData.sounds.backgroundMusic.isPlaying()) {
      console.log("background music already playing, exiting...");
      return;
    } else {
      console.log("background music not loaded, retrying...");
      playBackgroundMusic(volume);
    }
  }, 100);
}

function startEncounterWithMusic() {
  setTimeout(() => {
    if (playerData.sounds.battleMusic.isLoaded()) {
      startEncounter(playerData.encounter);
    } else {
      console.log("battle music not loaded, waiting...");
      startEncounterWithMusic();
    }
  }, 100);
}

function promiseMovementBeforeWarp(data) {
  if (players[client.socket.id] && players[client.socket.id].controller.target.x == players[client.socket.id].pos.x && players[client.socket.id].controller.target.y == players[client.socket.id].pos.y) {
    for (layer of objects.layers) {
      for (var i = layer.length - 1; i >= 0; i--) {
        layer.splice(layer.indexOf(i), 1);
      }
    }
    for (plyr in players) {
      delete players[plyr];
    }
    playerData.pokemon.party = data.party;
    playerData.sounds.backgroundMusic.stop();
    load(data);
    playBackgroundMusic(0.025);
  }
  else setTimeout(promiseMovementBeforeWarp, 100, data);
}

function handlePlayerData(data) {
  if (data.map == playerData.map.name && data.submap == playerData.submap) {
    var x = 32 * data.x;
    var y = 32 * data.y - 16;
    if (!players[data.id] && data.id != playerData.name) {
      new player(data.id, false, data.avatar);
      players[data.id].pos.x = x;
      players[data.id].pos.y = y;
      players[data.id].name = data.id;
      players[data.id].img.setY(data.facing);
    } else if (data.id == playerData.name) {
      return;
      //console.log("this player is idle");
      // players[client.socket.id].controller.facing = data.facing;
      // players[client.socket.id].moveTo(data.idle, 32 * data.x, 32 * data.y - 16);
    } else {
      players[data.id].controller.facing = data.facing;
      players[data.id].moveTo(players[data.id].pos.x == x && players[data.id].pos.y == y, x, y);
    }
  }
}