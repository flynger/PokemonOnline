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
    Screen.canvas = createCanvas(1080, 720);
    this.canvas.style.zIndex = -1;
    pixelDensity(1);
    //window.onresize = Screen.resize;
    Screen.resize();
  },
  resize: function () {
    //Screen.canvas.size(window.innerWidth, window.innerHeight);
    Screen.canvas.position((window.innerWidth - 1080) / 2, (window.innerHeight - 720) / 2);
  },
  beginStep: function () {
    background(Screen.color.r, Screen.color.g, Screen.color.b, 255);
  }
}

function drawProperties() {
  for (layer of objects.layers) {
    for (object of layer) {
      if (object.draw) object.draw();
      if (object.properties) {
        for (property of object.properties) {
          if (property.draw) property.draw();
        }
      }
    }
  }
}
function draw() {
  Screen.beginStep();
  drawProperties();
}
function step() {

}
function endStep() {

}