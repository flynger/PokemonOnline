class userMovement {
    constructor(parent, pos, img) {
        this.parent = parent;
        this.pos = pos;
        this.img = img;
        this.speed = 120 / playerData.FPS;
        this.facing = 0;
        playerData.speed = this.speed;
        this.target = {
            x: this.pos.x,
            y: this.pos.y
        }
        this.moving = false;
        this.canMove = false;
        this.keys = {
            UP: 38,
            DOWN: 40,
            RIGHT: 39,
            LEFT: 37,
            W: 87,
            A: 65,
            S: 83,
            D: 68,
            T: 84,
            C: 67,
            ENTER: 13,
            1: 49,
            2: 50,
            3: 51,
            4: 52,
            "/": 191
        };
        this.inputs = {
            up: {
                facing: 3,
                x: 0,
                y: -32
            },
            down: {
                facing: 0,
                x: 0,
                y: 32
            },
            left: {
                facing: 1,
                x: -32,
                y: 0
            },
            right: {
                facing: 2,
                x: 32,
                y: 0
            }
        }
        if (this.parent.hasController) {
            this.chatCooldown = 0;
        }
    }
    step() {
        if (this.parent.hasController) {
            if (this.chatCooldown > 0) this.chatCooldown--;
            //if (!this.parent.idle || this.parent.idleCounter == 8 * playerData.FPS / 30) {
            var realX = this.pos.x + 16;
            var realY = this.pos.y + 24;
            if (playerData.loaded) {
                // camera x
                let map = getMap();
                if (map.width <= Screen.canvas.width) {
                    camera.position.x = map.startX + map.width / 2;
                }
                else {
                    if (realX <= map.startX + Screen.canvas.width / 2) {
                        camera.position.x = map.startX + Screen.canvas.width / 2;
                    } else if (realX >= map.startX + map.width - Screen.canvas.width / 2) {
                        camera.position.x = map.startX + map.width - Screen.canvas.width / 2;
                    } else {
                        camera.position.x = realX;
                    }
                }
                // camera y
                if (map.height <= Screen.canvas.height) {
                    camera.position.y = map.startY + map.height / 2;
                }
                else {
                    if (realY <= map.startY + Screen.canvas.height / 2) {
                        camera.position.y = map.startY + Screen.canvas.height / 2;
                    } else if (realY >= map.startY + map.height - Screen.canvas.height / 2) {
                        camera.position.y = map.startY + map.height - Screen.canvas.height / 2;
                    } else {
                        camera.position.y = realY;
                    }
                }
            }
        }
        if (this.moving) {
            this.img.animateX(30 / playerData.FPS);
            var distX = this.target.x - this.pos.x;
            var distY = this.target.y - this.pos.y;
            var dx = Math.sign(distX) * this.speed;
            var dy = Math.sign(distY) * this.speed;
            // if (playerData.speed == 0 && this.parent == players[client.socket.id]){
            //      this.pos.x = playerData.x;
            //      this.pos.y = playerData.y;
            //      this.moving = false;
            //     playerData.speed = this.speed;
            //     this.target.x = this.pos.x;
            //     this.target.y = this.pos.y;
            //  }
            //  else {
            // if (Math.sign(distX) >= 64 || Math.sign(distY) >= 64) {
            //     if (this.img.cellX % 2 == 1) this.img.shiftX(1);
            //     this.pos.x = this.target.x;
            //     this.pos.y = this.target.y;
            //     this.moving = false;
            // }
            // 4 for 120 fps
            // if (this.parent == players[client.socket.id] && (Math.abs(distX) == 4 || Math.abs(distY) == 4)) {
            // }
            if ((!this.parent.idle && (Math.abs(distX) == this.speed && Math.abs(distY) == 0) || (Math.abs(distY) == this.speed && Math.abs(distX) == 0)) || this.parent.idleCounter == 0) {
                if (this.parent.idleCounter == 0) {
                    this.target.x = this.parent.idleX;
                    this.target.y = this.parent.idleY;
                    this.pos.x = this.parent.idleX;
                    this.pos.y = this.parent.idleY;
                    this.speed = 120 / playerData.FPS;
                    this.parent.idle = false;
                    this.parent.idleCounter = 8 * playerData.FPS / 30;
                } else {
                    this.pos.x = this.target.x;
                    this.pos.y = this.target.y;
                }
                if (this.img.cellX % 2 == 1) this.img.shiftX(1);
                this.moving = false;
                this.canMove = !warpCheck(this.pos.x, this.pos.y);
            }
            else {
                if (!this.parent.idle) {
                    this.pos.x += dx;
                    this.pos.y += dy;
                } else {
                    if (this.parent.idleCounter == 8 * playerData.FPS / 30) {
                        playerData.sounds.bump.setVolume(0.1);
                        playerData.sounds.bump.play();
                    }
                    //console.log(this.parent.idle);
                    this.parent.idleCounter--;
                }
            }
            //}
        }
        if (this.parent.hasController) {
            // if(keyIsDown(this.keys.W)){
            //     camera.position.y -= 8;
            // }
            // if(keyIsDown(this.keys.A)){
            //     camera.position.x -= 8;
            // }
            // if(keyIsDown(this.keys.S)){
            //     camera.position.y += 8;
            // }
            // if(keyIsDown(this.keys.D)){
            //     camera.position.x += 8;
            // }
            if (!this.moving && this.canMove && (playerData.joystick || chat.input != document.activeElement)) {
                if (playerData.inBattle) {
                    if (keyWentDown(this.keys[1])) {
                        if (document.getElementById("battleOptions").style.display == "block") {
                            moveSelector();
                        } else if (document.getElementById("moveOptions").style.display == "block") {
                            selectMove(1);
                        }
                    }
                    if (keyWentDown(this.keys[2])) {
                        if (document.getElementById("battleOptions").style.display == "block") {
                            //openInv();
                        }
                        else if (document.getElementById("moveOptions").style.display == "block") {
                            selectMove(2);
                        }
                    }
                    if (keyWentDown(this.keys[3])) {
                        if (document.getElementById("battleOptions").style.display == "block") {
                            //switchPokemon();
                        }
                        else if (document.getElementById("moveOptions").style.display == "block") {
                            selectMove(3);
                        }
                    }
                    if (keyWentDown(this.keys[4])) {
                        if (document.getElementById("battleOptions").style.display == "block") {
                            fleeBattle();
                        }
                        else if (document.getElementById("moveOptions").style.display == "block") {
                            selectMove(4);
                        }
                    }
                }
                else {
                    if (playerData.joystick) {
                        playerData.joystickX = playerData.joystick.GetX();
                        playerData.joystickY = playerData.joystick.GetY();
                        playerData.joystickVerticalInput = Math.abs(playerData.joystickY) > Math.abs(playerData.joystickX);
                        playerData.joystickHorizontalInput = Math.abs(playerData.joystickX) > Math.abs(playerData.joystickY);
                    }
                    if (keyIsDown(this.keys.UP) || keyIsDown(this.keys.W) || (playerData.joystick && playerData.joystickY > 0 && playerData.joystickVerticalInput))
                        movePlayer(this, "up");
                    else if (keyIsDown(this.keys.DOWN) || keyIsDown(this.keys.S) || (playerData.joystick && playerData.joystickY < 0 && playerData.joystickVerticalInput))
                        movePlayer(this, "down");
                    else if (keyIsDown(this.keys.RIGHT) || keyIsDown(this.keys.D) || (playerData.joystick && playerData.joystickX > 0 && playerData.joystickHorizontalInput))
                        movePlayer(this, "right")
                    else if (keyIsDown(this.keys.LEFT) || keyIsDown(this.keys.A) || (playerData.joystick && playerData.joystickX < 0 && playerData.joystickHorizontalInput))
                        movePlayer(this, "left")
                }
            }
            if (keyWentDown(this.keys.C) && chat.input != document.activeElement) {
                toggleChat();
            }
            if ((keyWentDown(this.keys.T) || keyWentDown(this.keys["/"])) && chat.input != document.activeElement && chat.input.style.display == "block") {
                selectChat();
            }
            if (keyIsDown(this.keys.ENTER) && chat.input == document.activeElement && chat.input.value != "" && this.chatCooldown == 0) {
                sendChat(chat.input.value);
                chat.input.value = "";
                this.chatCooldown = playerData.FPS;
            }
        }
    }
}

function sendInput(type) {
    //console.log("sending packet '" + type + "'");
    client.send({
        id: client.socket.id,
        movementInput: type
    }, "playerInput");
}

function movePlayer(player, direction) {
        player.moving = true;
        player.facing = player.inputs[direction].facing;
        var x = player.pos.x + player.inputs[direction].x;
        var y = player.pos.y + player.inputs[direction].y;
        var steps = ledgeCheck(x, y, direction);
        if (typeof steps == "number" && steps > 1) {
            x += (steps - 1) * player.inputs[direction].x;
            y += (steps - 1) * player.inputs[direction].y;
        }
        player.parent.moveTo(idleCheck(x, y) || steps === false, x, y); // idle if idleCheck passes or ledgeCheck returns false
        if (player.parent == playerData.player) {
            playerData.x = player.pos.x;
            playerData.y = player.pos.y;
            sendInput(direction);
        }
}


/* if (this.parent.hasController) {
            if (keyIsDown(this.keys.UP) && !this.moving) {
                this.img.setY(3);
                this.moving = true;
                this.target.y -= 32;
                playerData.x = this.pos.x;
                playerData.y = this.pos.y;
                sendPos("up");
            }
            if (keyIsDown(this.keys.DOWN) && !this.moving) {
                this.img.setY(4);
                this.moving = true;
                this.target.y += 32;
                playerData.input = "down";
                playerData.x = this.pos.x;
                playerData.y = this.pos.y;
                //sendPos("Input");
            }
            if (keyIsDown(this.keys.RIGHT) && !this.moving) {
                this.img.setY(2);
                this.moving = true;
                this.target.x += 32;
                playerData.x = this.pos.x;
                playerData.y = this.pos.y;
                //sendPos("Input");
            }
            if (keyIsDown(this.keys.LEFT) && !this.moving) {
                this.img.setY(1);
                this.moving = true;
                this.target.x -= 32;
                playerData.x = this.pos.x;
                playerData.y = this.pos.y;
                //sendPos("Input");
            }
        } */