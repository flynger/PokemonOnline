var players = {};
var playersNotInMap = [];
class player {
  constructor(name, hasController, avatar) {
    this.pos = new position(this, 256, 240);
    this.avatar = avatar;
    this.img = new animator(this, this.pos, avatar + "_walk", 4, 4, .25);
    this.hasController = hasController;
    this.controller = new userMovement(this, this.pos, this.img);
    this.properties = [
      this.pos,
      this.img
    ];
    this.realWidth = this.img.img.img.width / this.img.width;
    this.realHeight = this.img.img.img.height / this.img.height;
    //if(hasController) this.properties.push(this.controller);
    this.properties.push(this.controller);
    this.name = name;
    this.idle = false;
    this.idleCounter = 8 * playerData.FPS / 30;
    this.idleX = this.pos.x;
    this.idleY = this.pos.y;
    players[name] = this;
    objects.layers[2].unshift(this);
  }
  step() {
    // if(this.idleCounter == 0){
    //   this.controller.target.x = this.idleX;
    //   this.controller.target.y = this.idleY;
    //   this.pos.x = this.idleX;
    //   this.pos.y = this.idleY;
    //   this.moving = false;
    //   this.speed = 4;
    //   this.idle = false;
    //   this.idleCounter = 8;
    // }
    // if(this.name == client.socket.id){
    //   client.send({
    //     posX: this.pos.x,
    //     posY: this.pos.y,
    //     id: client.socket.id,
    //     dir: this.img.realY,
    //     isAnimating: this.controller.moving
    //   }, "playerMovement");
    // }
  }
  info() {
    return { x: this.pos.x, y: this.pos.y };
  }
  moveTo(idle, x, y) {
    if (idle) {
      this.idleX = this.pos.x;
      this.idleY = this.pos.y;
      this.speed = 0;
      this.idle = true;
      var newX = x;
      var newY = y;
      newX++;
      newY++;
      this.moveTo(false, newX, newY);
    } else {
      this.controller.target.x = x;
      this.controller.target.y = y;
      // console.log("move to x: " + this.controller.target.x + ", y: " + this.controller.target.y);
      this.img.setY(this.controller.facing);
      //console.log(frameCount);
      //this.controller.animationStartFrame = frameCount;
      this.controller.moving = true;
    }
  }
}

var i = 0;
var f = (x, y) => {console.log(x, y)}
f("g", "z")

function f(){

}