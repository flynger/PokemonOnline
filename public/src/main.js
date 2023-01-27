client.init(window.location.host);

var playerData = {
  exists: false,
  delete: false,
  input: "none",
  writeNames: () => {
    Screen.canvas.drawingContext.font = "16px Power Clear";
    //Screen.canvas.drawingContext. = "bold";
    Screen.canvas.drawingContext.textAlign = "center";
    for (plyr in players) {
      var Player = players[plyr];
      if (Player.name != client.socket.id) {
        Screen.canvas.drawingContext.fillStyle = "rgba(32, 32, 32, 0.5)";
        Screen.canvas.drawingContext.roundRect(Player.pos.x - 0.5 * (Screen.canvas.drawingContext.measureText(Player.name).width + 10) + 16, Player.pos.y - 13, Screen.canvas.drawingContext.measureText(Player.name).width + 10, 16, 4).fill();
        Screen.canvas.drawingContext.fillStyle = "#FFFFFF";
        Screen.canvas.drawingContext.fillText(Player.name, Player.pos.x + 16, Player.pos.y);
      } else {
        
      }
    }
    var text = playerData.name + " (" + latency + " ms)";
    Screen.canvas.drawingContext.fillStyle = "rgba(32, 32, 32, 0.5)";
    Screen.canvas.drawingContext.roundRect(playerData.player.pos.x - 0.5 * (Screen.canvas.drawingContext.measureText(text).width + 10) + 16, playerData.player.pos.y - 13, Screen.canvas.drawingContext.measureText(text).width + 10, 16, 4).fill();
    Screen.canvas.drawingContext.fillStyle = "#FFFFFF";
    Screen.canvas.drawingContext.fillText(text, playerData.player.pos.x + 16, playerData.player.pos.y);
  },
  money: {
    balance: 0,
    button: null
  },
  sounds: {

  },
  pokemon: {

  },
  FPS: 30
}
var isMobile = {
  Android: () => {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: () => {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: () => {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: () => {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: () => {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: () => {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};
var avatars = ["red", "green", "brendan", "may", "blue", "oak", "bug_catcher"];
var otherAvatars = ["boulder", "cloudz", "flynger"];
function setup() {
  //var fs = new FileReader();
  Screen.init();
  //frameRate(30);
  playerData.FPS = 30;
  if (isMobile.any()) {
    playerData.joystickDiv = document.getElementById('joyDiv');
    playerData.joystickDiv.style.width = window.displayWidth / 3;
    playerData.joystickDiv.style.height = parseInt(playerData.joystickDiv.style.width);
    playerData.joystickDiv.style.bottom = window.displayHeight / 4 - parseInt(document.getElementById('joyDiv').style.height) / 2;
    playerData.joystickDiv.style.left = window.displayWidth / 6 - parseInt(document.getElementById('joyDiv').style.width) / 2;
    playerData.joystick = new JoyStick('joyDiv');
    playerData.useAnimationFrames = true;
    playerData.joystickDiv.style.display = "none";
    playerData.setup = true;
  }
  else {
    document.getElementById('joyDiv').style.zIndex = -2;
      playerData.FPS = 120;
      frameRate(120);
      console.log("Movement FPS: " + playerData.FPS);
      console.log("Drawing FPS: " + frameRate());
      setInterval(stepProperties, 1000 / playerData.FPS);
      playerData.setup = true;
    //}, 500);
  }
  for (avatar of avatars) {
    new rawImage("characters", avatar + "_walk");
  }
  for (avatar of otherAvatars) {
    new rawImage("characters", avatar + "_walk");
  }
  new rawImage("characters", "red_run");
  new imageSet("tilesets", "Outside", 8, 502);
  new imageSet("tilesets", "Pokemon Center", 8, 40);
  new imageSet("tilesets/grass", "16x16");
  playerData.sounds.bump = loadSound('res/audio/events/bump.wav');
  playerData.sounds.flee = loadSound('res/audio/events/flee.wav');
  playerData.sounds.battleMusic = loadSound('res/audio/events/encounter.mp3');
  //playerData.pokedex = fs.readAsText();
  //playerData.moves = fs.readAsText();
  if (localStorage.getItem('rememberMe') == "yes") {
    document.getElementById("rememberMe").checked = true;
    document.getElementById("username").value = localStorage.getItem('username');
    document.getElementById("password").value = localStorage.getItem('password');
  }
  // if (localStorage.getItem('autoLogin') == "yes") {
  //   document.getElementById("autoLogin").checked = true;
  //   login();
  // }
  camera.on();
}
function step() {
  if (playerData.inBattle) {
    var hpBarWidth = parseInt(playerData.yourHP.bar.width);
    if (hpBarWidth >= 96 && playerData.yourHP.color != "green") {
      playerData.yourHP.bar.src = "res/gui/battle/hpbargreen.png";
      playerData.yourHP.color = "green";
    } else if (hpBarWidth < 96 && hpBarWidth > 38.4 && playerData.yourHP.color != "yellow") {
      playerData.yourHP.bar.src = "res/gui/battle/hpbaryellow.png";
      playerData.yourHP.color = "yellow";
    } else if (hpBarWidth <= 38.4 && playerData.yourHP.color != "red") {
      playerData.yourHP.color = "red";
    }

    hpBarWidth = parseInt(playerData.enemyHP.bar.width);
    if (hpBarWidth > 96 && playerData.enemyHP.color != "green") {
      playerData.enemyHP.bar.src = "res/gui/battle/hpbargreen.png";
      playerData.enemyHP.color = "green";
    } else if (hpBarWidth <= 96 && hpBarWidth > 38.4 && playerData.enemyHP.color != "yellow") {
      playerData.enemyHP.bar.src = "res/gui/battle/hpbaryellow.png";
      playerData.enemyHP.color = "yellow";
    } else if (hpBarWidth <= 38.4 && playerData.enemyHP.color != "red") {
      playerData.enemyHP.bar.src = "res/gui/battle/hpbarred.png";
      playerData.enemyHP.color = "red";
    }

    if (playerData.sounds.backgroundMusic.isPlaying()) {
      playerData.sounds.backgroundMusic.pause();
    }
  }
}

function login() {
  if (playerData.setup) {
    playerData.name = document.getElementById("username").value;
    playerData.pass = document.getElementById("password").value;
    client.send({ id: client.socket.id, name: playerData.name, pass: playerData.pass }, "login");
  }
}

function signUp() {
  if (playerData.setup) {
    playerData.name = document.getElementById("signUpUsername").value;
    playerData.pass = document.getElementById("signUpPassword").value;
    for (element of document.getElementsByName("starter")) {
      if (element.checked) {
        playerData.starter = element.value;
        break;
      }
    }
    client.send({ id: client.socket.id, name: playerData.name, pass: playerData.pass, avatar: playerData.avatar, starter: playerData.starter }, "signUp");
  }
}

function openSignUp() {
  document.getElementById("login").style.display = "none";
  document.getElementById("signUp").style.display = "block";
  playerData.avatar = "red";
}

function previousAvatar() {
  playerData.avatar = avatars[(avatars.indexOf(playerData.avatar) + (avatars.length - 1)) % avatars.length];
  document.getElementById("avatarSelect").src = "res/characters/" + playerData.avatar + ".gif";
}

function nextAvatar() {
  playerData.avatar = avatars[(avatars.indexOf(playerData.avatar) + 1) % avatars.length];
  document.getElementById("avatarSelect").src = "res/characters/" + playerData.avatar + ".gif";
}

function randomNumber(min, max) {
  return Math.floor(random(min, max + 1));
}

function getName(id) {
  for (entry in pokedex) {
    if (pokedex[entry].id === id) {
      return pokedex[entry].species;
    }
  }
}