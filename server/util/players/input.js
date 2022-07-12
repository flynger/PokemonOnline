(function () {
    const validInput = {
        id: () => {},
        movementInput: ["up", "down", "left", "right"]
    };
    module.exports.validInput = validInput;
    
    module.exports.process = function (data, game) {
        var players = game.players;
        var maps = game.maps;
        var server = game.server;
        var targetPlayer = players.bySocket.trainer[data.id];
        var idle = false;
        var date = new Date();
        //console.log("received packet '" + data.movementInput + "' for " + targetPlayer.displayName + " at " + date.getTime() + " ms");
        if (targetPlayer && !targetPlayer.moving && !targetPlayer.busy && (!targetPlayer.lastPacket || date.getTime() - targetPlayer.lastPacket >= 0)) {
            var playerMap = players.getMap(targetPlayer);
            targetPlayer.lastPacket = date.getTime();
            if (data.movementInput === "up") {
                // console.log(players.bySocket.account[data.id].name + " is moving up");
                targetPlayer.moving = true;
                targetPlayer.facing = 3;
                var steps = maps.ledgeCheck(targetPlayer, 0, -1, data.movementInput);
                if (maps.collideCheck(targetPlayer, 0, -1) && steps && targetPlayer.y > playerMap.startY) {
                    targetPlayer.y -= steps;
                    maps.grassCheck(targetPlayer, game);
                } else {
                    idle = true;
                }
            } else if (data.movementInput === "down") {
                // console.log(players.bySocket.account[data.id].name + " is moving down");
                targetPlayer.moving = true;
                targetPlayer.facing = 0;
                var steps = maps.ledgeCheck(targetPlayer, 0, 1, data.movementInput);
                if (maps.collideCheck(targetPlayer, 0, 1) && steps && targetPlayer.y < playerMap.startY + playerMap.height - 1) {
                    targetPlayer.y += steps;
                    maps.grassCheck(targetPlayer, game);
                } else {
                    idle = true;
                }
            } else if (data.movementInput === "left") {
                // console.log(players.bySocket.account[data.id].name + " is moving left");
                targetPlayer.moving = true;
                targetPlayer.facing = 1;
                var steps = maps.ledgeCheck(targetPlayer, -1, 0, data.movementInput);
                if (maps.collideCheck(targetPlayer, -1, 0) && steps && targetPlayer.x > playerMap.startX) {
                    targetPlayer.x -= steps;
                    maps.grassCheck(targetPlayer, game);
                } else {
                    idle = true;
                }
            } else if (data.movementInput === "right") {
                // console.log(players.bySocket.account[data.id].name + " is moving right");
                targetPlayer.moving = true;
                targetPlayer.facing = 2;
                var steps = maps.ledgeCheck(targetPlayer, 1, 0, data.movementInput);
                if (maps.collideCheck(targetPlayer, 1, 0) && steps && targetPlayer.x < playerMap.startX + playerMap.width - 1) {
                    targetPlayer.x += steps;
                    maps.grassCheck(targetPlayer, game);
                } else {
                    idle = true;
                }
            } else {
                return;
            }
            //console.log(players.bySocket[data.id].name + " is at " + players.bySocket[data.id].x + ", " + players.bySocket[data.id].y);
            game.sendLocationToAllPlayers(targetPlayer.name, idle);

            var warpCheck = maps.warpCheck(targetPlayer);
            if (warpCheck) {
                playerMap.playersInMap.splice(playerMap.playersInMap.indexOf(targetPlayer.name), 1);
                if (warpCheck.map) targetPlayer.map = warpCheck.map;
                if (warpCheck.submap) targetPlayer.submap = warpCheck.submap;
                else targetPlayer.submap = warpCheck.map;
                targetPlayer.x = warpCheck.x;
                targetPlayer.y = warpCheck.y;
                players.getMap(targetPlayer).playersInMap.push(targetPlayer.name);
                game.sendWarpToAllPlayers(targetPlayer, playerMap);
                for (player of players.getMap(targetPlayer).playersInMap) {
                    if (player != targetPlayer.name) {
                        game.sendLocation(player, targetPlayer.name, true);
                        game.sendLocation(targetPlayer.name, player, false);
                    }
                }
            }
            
            // change this timeout to anticheat like method
            targetPlayer.moving = false;
        } else {
            //console.log("ditching packet...");
            server.emit(data.id, { input: data.movementInput }, "adjustMovement");
        }
    }
}())