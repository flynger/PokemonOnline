module.exports = (game) => {
    const jsonfile = require('../../libs/node_modules/jsonfile');
    var maps = {
        list: [
            ["Pallet Town", "Pokemon Center"]
        ]
    };
    for (map of maps.list) {
        maps[map[0]] = {
            list: map
        };
        for (submap of map) {
            console.log("Generating map for " + map[0] + ": " + submap + "...");
            var submaps = maps[map[0]];
            submaps[submap] = jsonfile.readFileSync('./data/maps/' + map[0] + "/" + submap + '.json');
            submaps[submap].playersInMap = [];
            if (submaps[submap].collidables) {
                var collidables = submaps[submap].collidables;
                delete submaps[submap].collidables;
                submaps[submap].collidables = [];
                for (obj of collidables) {
                    if (!submaps[submap].collidables[obj.x]) submaps[submap].collidables[obj.x] = [];
                    submaps[submap].collidables[obj.x].push(obj.y);
                    submaps[submap].collidables[obj.x].sort((a, b) => a - b);
                }
            }
            if (submaps[submap].grass) {
                var grass = submaps[submap].grass;
                delete submaps[submap].grass;
                submaps[submap].grass = [];
                for (obj of grass) {
                    if (!submaps[submap].grass[obj.x]) submaps[submap].grass[obj.x] = [];
                    submaps[submap].grass[obj.x].push(obj.y);
                    submaps[submap].grass[obj.x].sort((a, b) => a - b);
                }
            }
            if (submaps[submap].ledges) {
                var ledges = submaps[submap].ledges;
                delete submaps[submap].ledges;
                submaps[submap].ledges = [];
                for (obj of ledges) {
                    if (!submaps[submap].ledges[obj.x]) submaps[submap].ledges[obj.x] = [];
                    submaps[submap].ledges[obj.x].push({ y: obj.y, direction: obj.direction });
                    //submaps[submap].ledges[obj.x].sort((a, b) => a - b);
                }
            }
        }
        // jsonfile.writeFileSync('./data/maps/' + map + ' test.json', maps[map]);
        // for (obj of grass) {
        //     maps[maps].grass = []
        // }
        // for (obj of maps[map].collidables) {
        //     obj.x *= 32;
        //     obj.y *= 32;
        // }
        // for (obj of maps[map].grass) {
        //     obj.x *= 32;
        //     obj.y *= 32;
        // }
        //jsonfile.writeFileSync('./data/maps/' + map + '.json', maps[map]);
        // .then(obj => console.log("done!"))
        // .catch(err => console.error(err));

    }
    // maps["Pallet Town"] = {
    //     startX: 32,
    //     startY: -128,
    //     width: 44 * 32,
    //     height: 22 * 32
    // };
    // // maps["Doomed Dimension"] = {};
    // // maps["Pokemon Center"] = {};
    // maps["Pallet Town"].collidables = [{ x: 416, y: 96 }, { x: 448, y: 96 }, { x: 416, y: 192 }, { x: 448, y: 192 }, { x: 416, y: 288 }, { x: 448, y: 288 }, { x: 416, y: 384 }, { x: 448, y: 384 }, { x: 416, y: 480 }, { x: 448, y: 480 }, { x: 1024, y: 320 }, { x: 1024, y: 352 }, { x: 1056, y: 320 }, { x: 1056, y: 352 }, { x: 1088, y: 320 }, { x: 1088, y: 352 }, { x: 1120, y: 320 }, { x: 1120, y: 352 }, { x: 1152, y: 320 }, { x: 1152, y: 352 }, { x: 416, y: 64 }, { x: 448, y: 64 }, { x: 416, y: 160 }, { x: 448, y: 160 }, { x: 416, y: 256 }, { x: 448, y: 256 }, { x: 416, y: 352 }, { x: 448, y: 352 }, { x: 416, y: 448 }, { x: 448, y: 448 }, { x: 1024, y: 288 }, { x: 1056, y: 288 }, { x: 1088, y: 288 }, { x: 1120, y: 288 }, { x: 1152, y: 288 }];
    // // maps["Doomed Dimension"].collideables = [];
    // // maps["Pokemon Center"].collideables = [];
    // maps["Pallet Town"].grass = [];
    // for (var i = 1; i < 13; i++) {
    //     maps["Pallet Town"].grass.push({ x: 160, y: 32 * i }, { x: 192, y: 32 * i }, { x: 224, y: 32 * i }, { x: 256, y: 32 * i }, { x: 288, y: 32 * i }, { x: 320, y: 32 * i }, { x: 352, y: 32 * i }, { x: 384, y: 32 * i });
    // }
    // // maps["Doomed Dimension"].grass = [];
    // // maps["Pokemon Center"].grass = [];
    // maps["Pallet Town"].warpTiles = [{
    //     x: 1088, y: 368, destination: {
    //         map: "Pokemon Center",
    //         x: 0,
    //         y: 16
    //     }
    // }];
    // maps["Pallet Town"].interactables = [{
    //     x: 256, 
    //     y: 320, 
    //     type: "item",
    //     item: "Poke Ball"
    // }];
    // maps["Pallet Town"].encounters = {
    //     frequency: {
    //         grass: 8
    //     }
    // }
    // maps["Pallet Town"].encounters.grass = [
    //     {
    //         species: "Rattata",
    //         weight: 250
    //     },
    //     {
    //         species: "Pidgey",
    //         weight: 150
    //     },
    //     {
    //         species: "Pidgeotto",
    //         weight: 10
    //     },
    //     {
    //         species: "Raticate",
    //         weight: 8
    //     },
    //     {
    //         species: "Caterpie",
    //         weight: 50
    //     },
    //     {
    //         species: "Weedle",
    //         weight: 45
    //     },
    //     {
    //         species: "Pikachu",
    //         weight: 7
    //     },
    //     {
    //         species: "Mewtwo",
    //         weight: 1
    //     }
    // ]
    // maps["Doomed Dimension"].warpTiles = [];
    // maps["Pokemon Center"].warpTiles = [{x: 0, y: 0, destination: {
    //     map: "Pokemon Center",
    //     x: 0,
    //     y: 0
    // }}];
    maps.collideCheck = function (player, x, y) {
        //var collidables = game.players.getMap(player).collidables;
        // for (obj of collidables) {
        //     if (player.x + x == obj.x && player.y + y == obj.y) {
        //         return false;
        //     }
        // }
        var playerMap = game.players.getMap(player);
        // if (playerMap.ledges + playerMap.ledges[player.x + x])
        return !(playerMap.collidables[player.x + x] && playerMap.collidables[player.x + x].includes(player.y + y));
    };
    maps.ledgeCheck = function (player, x, y, input) {
        //var collidables = game.players.getMap(player).collidables;
        // for (obj of collidables) {
        //     if (player.x + x == obj.x && player.y + y == obj.y) {
        //         return false;
        //     }
        // }
        var playerMap = game.players.getMap(player);
        if (playerMap.ledges[player.x + x]) {
            for (i in playerMap.ledges[player.x + x]) {
                ledge = playerMap.ledges[player.x + x][i];
                if (ledge.y == player.y + y) {
                    if (ledge.direction == input) return 2;
                    return false;
                }
            }
        }
        return 1;
    };
    maps.warpCheck = function (player) {
        var warpTiles = game.players.getMap(player).warpTiles;
        for (obj of warpTiles) {
            if (player.x == obj.x && player.y == obj.y) {
                return obj.destination;
            }
        }
        //return !(game.players.getMap(player).collidables[player.x + x] && game.players.getMap(player).collidables[player.x + x].includes(player.y + y));
    };
    maps.grassCheck = function (player) {
        var playerMap = game.players.getMap(player);
        var grass = playerMap.grass;
        if (grass && grass[player.x] && grass[player.x].includes(player.y)) {
            console.log(player.displayName + " is in grass!");
            var temp = Math.floor(Math.random() * playerMap.encounters.frequency.grass);
            if (temp == 0 && !player.busy) {
                player.encounter = maps.createEncounter(playerMap.encounters.grass.day, game);
                game.battleHandler.createWildBattle(player, player.encounter);
                var shinyText = "";
                var encounter = {
                    species: player.encounter.species,
                    name: player.encounter.name,
                    level: player.encounter.level,
                    shiny: player.encounter.shiny,
                    percentHP: 1
                }
                game.server.emit(game.players.byName.account[player.name].socket, { party: player.pokemon.party, encounter: encounter }, "encounter");
                if (encounter.shiny) shinyText = "Shiny ";
                game.chat.sendChatToAllPlayers({ id: "Derpser2516", message: player.displayName + " has encountered a " + shinyText + encounter.name + "!" }, game);
            }
        }
    };
    maps.getTotalWeight = function (encounters) {
        var weight = 0;
        for (encounter of encounters) {
            weight += encounter.weight;
        }
        return weight;
    }
    maps.createEncounter = function (encounters) {
        var encounterWeight = maps.getTotalWeight(encounters);
        var rng = Math.floor(Math.random() * encounterWeight) + 1;
        var counter = 0;
        for (encounter of encounters) {
            counter += encounter.weight;
            if (counter >= rng) {
                var randomEncounter = game.pokemon.createPokemon(encounter.species, randomNumber(encounter.minLevel, encounter.maxLevel));
                console.log(randomEncounter);
                return randomEncounter;
            }
        }
    }
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return game.maps = maps;
}