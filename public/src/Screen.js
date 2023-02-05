var PVersion = "1.0";

var objects = {};
objects.layers = [];
objects.layers.push([]);
objects.layers.push([]);
objects.layers.push([]);
objects.layers.push([]);

var Screen = {
  canvas: undefined,
  color: {
    r: 0,
    g: 0,
    b: 0
  },
  init: function () {
    // change game to 16:9 ratio
    // if (!playerData.joystick) Screen.canvas = createCanvas(960, 540);
    // else 
    Screen.canvas = createCanvas(960, 540);
    Screen.canvas.position((window.displayWidth - Screen.canvas.width) / 2, (window.displayHeight - Screen.canvas.height) / 2);
    document.getElementById("defaultCanvas0").style.display = "none";
    this.canvas.style.zIndex = -1;
    pixelDensity(1);
    window.onresize = Screen.resize;
  },
  resize: function () {
    if (playerData.joystick) {
      Screen.canvas.size(480, 270);
    }
    document.getElementById("defaultCanvas0").style.height = window.innerHeight;
    document.getElementById("defaultCanvas0").style.width = 16 / 9 * window.innerHeight;
    Screen.canvas.position((window.innerWidth - parseInt(document.getElementById("defaultCanvas0").style.width)) / 2, 0);
    document.getElementById("defaultCanvas0").style.imageRendering = "pixelated";
  },
  beginStep: function () {
    background(Screen.color.r, Screen.color.g, Screen.color.b, 255);
    // playerData.weirdbox = createSprite(200, 200, 500, 500);
  },
  fullscreen: function () {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
        .then(err => Screen.resize());
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen()
        .then(err => Screen.resize());
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen()
        .then(err => Screen.resize());
    }
  }
}

var GUI = {
  camera: {
    locked: true,
    create: function () {

    }
  }
}

function drawProperties() {
  for (layer of objects.layers) {
    for (object in layer) {
      if (layer[object].pos.x + layer[object].img.width < camera.position.x - 512 || layer[object].pos.x > camera.position.x + 512 || layer[object].pos.y < camera.position.y - 334 || layer[object].pos.y > camera.position.y + 302) {
        continue;
      }
      if (layer[object].draw) layer[object].draw();
      if (layer[object].properties) {
        for (property of layer[object].properties) {
          if (property.draw) property.draw();
        }
      }
    }
  }
}
function stepProperties() {
  // for (var i = 0; i < objects.length; i++) {
  //   if (objects[i].step) objects[i].step();
  //   if (objects[i].properties) {
  //     for (var j = 0; j < objects[i].properties.length; j++) {
  //       if (objects[i].properties[j].step) objects[i].properties[j].step();
  //     }
  //   }
  // }
  for (layer of objects.layers) {
    for (object in layer) {
      if (layer[object].step) layer[object].step();
      if (layer[object].properties) {
        for (property of layer[object].properties) {
          if (property.step) property.step();
        }
      }
    }
  }
}
var opacity = 255;
var countDown = false;

// stuff to run every frame
function draw() {
  Screen.beginStep();
  //step();
  if (playerData.useAnimationFrames) stepProperties();
  drawProperties();
  endStep();
  background(0, 0, 0, opacity);
  if (countDown) {
    opacity -= 8;
    if (opacity <= 0) {
      players[client.socket.id].controller.canMove = true;
      counter = 0;
      countDown = false;
    }
  }
  /* Day/night effect */
  // background(0, 0, 50, ((255-opacity)/255) * 120);
}
// function step() {

// }
function endStep() {
  if (players[client.socket.id]) {
    playerData.writeNames();
  }
}