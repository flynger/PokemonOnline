// imports
var game = {
    server: require("./libs/server"),
    color: require("./libs/color"),
    pokedex: require("./util/pokemon/pokedex"),
    chat: require("./util/chat/chat"),
    loginHandler: require("./util/login/loginHandler"),
    inputHandler: require("./util/players/input"),
    pokemon: require("./util/pokemon/pokemon"),
    showdown: require('pokemon-showdown')
}

// shorthands
var server = game.server;
var color = game.color;
var pokedex = game.pokedex;
var chat = game.chat;
var players = require("./util/players/players")(game);
var maps = require("./util/maps/maps")(game);

var loginHandler = game.loginHandler;
var inputHandler = game.inputHandler;
var pokemon = game.pokemon;
var battleHandler = require("./util/battleHandler/battle")(game);
var event = require("./util/eventHandler/event")(game);

const jsonfile = require("./libs/node_modules/jsonfile");
const fs = require("./libs/node_modules/graceful-fs/graceful-fs");

const backupFile = './data/login/backup.json';
var trainer = players.byName.trainer;
var account = players.byName.account;

// stream = new game.showdown.BattleStream();

// (async () => {
//     for await (const output of stream) {
//         console.log("output: " + output);
//     }
// })();

// stream.write(`>start {"formatid":"gen7randombattle"}`);
// stream.write(`>player p1 {"name":"Alice"}`);
// stream.write(`>player p2 {"name":"Bob"}`);
// stream.write(`>p1 default`);
// stream.write(`>p2 move 1`);
// stream.write(`>p1 move 1`);
// stream.write(`>p2 move 1`);
// stream.write(`>p1 move 1`);
// stream.write(`>p2 move 1`);
// var Pokedex = require('pokedex-promise-v2');
// var P = new Pokedex();

// expDex = [0];

// for (poke in pokedex) {
//     if (pokedex[poke].id > 0 && pokedex[poke].id < 100) {
//         P.resource('https://pokeapi.co/api/v2/pokemon/' + pokedex[poke].id + '/')
//             .then(function (response) {
//                 expDex[response.id] = response.base_experience;
//                 //console.log(pokedex[response.name.toUpperCase()]);
//             })
//     }
// }

// setTimeout(function () {
//     for (poke in pokedex) {
//         if (pokedex[poke].id > 0 && pokedex[poke].id < 100)
//             pokedex[poke].experienceYield = expDex[pokedex[poke].id];
//     }
//     jsonfile.writeFileSync('./data/pokedex/pokedex test.json', pokedex);
//     // console.log(pokedex["BULBASAUR"]);
// }, 10000);

server.init(3000, "Pokemon");

// var totalXP = {
//     Erratic: [],
//     Fast: [],
//     Medium: [],
//     Parabolic: [],
//     Slow: [],
//     Fluctuating: []
// }

// for (var i = 1; i <= 100; i++) {
//     var xp = Math.floor(pokemon.getXP("FEEBAS", i));
//     if (i == 1) totalXP.Erratic[i] = 0;
//     else totalXP.Erratic[i] = xp;
// }
// for (var i = 1; i <= 100; i++) {
//     var xp = Math.floor(pokemon.getXP("AIPOM", i));
//     if (i == 1) totalXP.Fast[i] = 0;
//     else totalXP.Fast[i] = xp;
// }
// for (var i = 1; i <= 100; i++) {
//     var xp = Math.floor(pokemon.getXP("DITTO", i));
//     if (i == 1) totalXP.Medium[i] = 0;
//     else totalXP.Medium[i] = xp;
// }
// for (var i = 1; i <= 100; i++) {
//     var xp = Math.floor(pokemon.getXP("BULBASAUR", i));
//     if (i == 1) totalXP.Parabolic[i] = 0;
//     else totalXP.Parabolic[i] = xp;
// }
// for (var i = 1; i <= 100; i++) {
//     var xp = Math.floor(pokemon.getXP("ARON", i));
//     if (i == 1) totalXP.Slow[i] = 0;
//     else totalXP.Slow[i] = xp;
// }
// for (var i = 1; i <= 100; i++) {
//     var xp = Math.floor(pokemon.getXP("DRIFLOON", i));
//     if (i == 1) totalXP.Fluctuating[i] = 0;
//     else totalXP.Fluctuating[i] = xp;
// }

//console.log(pokemon.getXP("FEEBAS", 70));
// jsonfile.writeFileSync('./data/pokedex/growthRates.json', totalXP);

//every 5 mins
setInterval( () => {
    jsonfile.writeFile(backupFile, players.byName.account);
    console.log(color.yellow, "saving a backup of server data");
}, 300000);

// // ping event
// server.on('ping', function () {
//     server.emit('pong');
// });

// login event
server.on("login", (data) => {
    if (data.id && typeof data.id == "string" && server.socketExists(data.id)) {
        //console.log(color.pink, data.id);
        loginHandler.login(data, game);
    }
});

server.on("signUp", (data) => {
    if (data.id && typeof data.id == "string" && server.socketExists(data.id)) {
        //console.log(color.pink, data.id);
        loginHandler.signUp(data, game);
    }
});

// input event
server.on("playerInput", (data) => {
    if (data.id && typeof data.id == "string" && server.socketExists(data.id) && players.bySocket.trainer[data.id] && data.movementInput && typeof data.movementInput == "string") {
        inputHandler.process(data, game);
    }
});

/* const validInput = {
    input: ["left", "right", "up", "down"], 
}*/

server.on("battleInput", game.event.battleEvents.turnInput);
// server.on("battleInput", (data) => {
//     if (data.id && typeof data.id == "string" && server.socketExists(data.id) && players.bySocket.trainer[data.id]) {
//         var player = players.bySocket.trainer[data.id];
//         if (data.moveSelected != null && typeof data.moveSelected == "number" && player.pokemon.party[player.activePokemon].moves[data.moveSelected] && player.busy && player.allowInput && player.activePokemon != null) {
//             player.allowInput = false;
//             userSpeed = Math.floor(player.pokemon.party[player.activePokemon].stats.spe * pokemon.getStageMultiplier("spe", player.pokemon.party[player.activePokemon].stages.spe));
//             opponentSpeed = Math.floor(player.encounter.stats.spe * pokemon.getStageMultiplier("spe", player.encounter.stages.spe));
//             console.log(userSpeed + " " + opponentSpeed);
//             player.pokemon.party[player.activePokemon].moveSelected = data.moveSelected;
//             player.encounter.moveSelected = randomNumber(0, player.encounter.moves.length - 1);
//             var speeder;
//             var slower;
//             var userPriority = pokemon.moves[player.pokemon.party[player.activePokemon].moves[data.moveSelected]].priority;
//             var opponentPriority = pokemon.moves[player.encounter.moves[player.encounter.moveSelected]].priority;
//             var userWentFirst = false;
//             if (userSpeed == opponentSpeed && userPriority == opponentPriority) {
//                 var ran = randomNumber(0, 1);
//                 if (ran == 0) {
//                     userPriority += 1;
//                 } else {
//                     opponentPriority += 1;
//                 }
//             }
//             if (userPriority > opponentPriority || (userSpeed > opponentSpeed && userPriority == opponentPriority)) {
//                 userWentFirst = true;
//                 speeder = player.pokemon.party[player.activePokemon];
//                 slower = player.encounter;
//             } else {
//                 speeder = player.encounter;
//                 slower = player.pokemon.party[player.activePokemon];
//             }
//             var messages1 = battleHandler.useMove(speeder, slower, speeder.moveSelected, game);
//             var messages2;
//             var battleEnd = false;
//             if (slower.fainted) {
//                 console.log(slower.name + " fainted!");
//                 if (userWentFirst) {
//                     battleHandler.awardXP(speeder, slower, messages1, pokemon);
//                 }
//                 battleHandler.endBattle(player);
//                 battleEnd = true;
//                 player.encounter = {};
//             } else {
//                 var messages2 = battleHandler.useMove(slower, speeder, slower.moveSelected, game);
//                 if (speeder.fainted) {
//                     console.log(speeder.name + " fainted!");
//                     if (!userWentFirst) {
//                         battleHandler.awardXP(slower, speeder, messages2, pokemon);
//                     }
//                     battleHandler.endBattle(player);
//                     battleEnd = true;
//                     player.encounter = {};
//                 } else {
//                     setTimeout(function () {
//                         player.allowInput = true;
//                     }, calculateBattleTime(messages1) + calculateBattleTime(messages2));
//                 }
//             }
//             server.emit(data.id, { userWentFirst: userWentFirst, move1: messages1, move2: messages2, battleEnd: battleEnd, party: player.pokemon.party }, "turnData");
//             delete speeder.moveSelected;
//             delete slower.moveSelected;
//         }
//     }
// });

server.on("fleeBattle", (data) => {
    let targetPlayerTrainer = players.bySocket.trainer[data.id];
    if (targetPlayerTrainer && targetPlayerTrainer.inBattle && targetPlayerTrainer.inBattle == "wild" && targetPlayerTrainer.allowInput === true) {
        targetPlayerTrainer.encounter = {};
        battleHandler.endBattle(targetPlayerTrainer);
    }
});

server.on("learnMove", (data) => {
    var player = players.bySocket.trainer[data.id];
    if (data.id && typeof data.id == "string" && server.socketExists(data.id) && player && !player.busy && typeof data.mon === "number" && data.mon in player.pokemon.party && typeof data.learnMove === "boolean" && typeof data.moveToLearn === "string" && (data.replace === "" || typeof data.replace === "string")) {
        if (!player.pokemon.party[data.mon].learnMoves || !player.pokemon.party[data.mon].learnMoves.includes(data.moveToLearn) || (data.replace !== "" && !player.pokemon.party[data.mon].moves.includes(data.replace)) || (data.replace === "" && player.pokemon.party[data.mon].moves.length == 4))
            return;

        if (data.learnMove)
            pokemon.addMoveToMoves(player.pokemon.party[data.mon], data.moveToLearn, data.replace);
        else if (!data.learnMove)
            player.pokemon.party[data.mon].learnMoves.splice(player.pokemon.party[data.mon].learnMoves.indexOf(data.moveToLearn), 1);
    }
});

// server.on("playerInput", function (data) {
//     if (data.id && typeof data.id == "string" && server.socketExists(data.id) && players.bySocket.trainer[data.id] && data.movementInput && typeof data.movementInput == "string") {
//         inputHandler.process(data, game);
//     }
// });

server.on("chatMessage", (data) => {
    if (data.id && data.message && typeof data.id == "string" && typeof data.message == "string" && players.bySocket.trainer[data.id]) {
        var player = players.bySocket.trainer[data.id].name;
        data.message = chat.filterMessage(data.message, player);
        chat.sendChatToAllPlayers(data, game);
    }
});

// connect event
server.onConnect = (socket) => {
    socket.emit("onConnect", { id: socket.id });
}

// disconnect event
server.onDisconnect = (socket) => {
    //console.log(color.red, socket.i
    if (socket && socket.id && typeof socket.id == "string") {
        // console.log(players.bySocket);
        var targetPlayer = players.bySocket.account[socket.id];
        var targetPlayerTrainer = players.bySocket.trainer[socket.id];
        if (targetPlayer) {
            console.log(color.red, targetPlayerTrainer.displayName + " disconnected.");
            server.send({ id: targetPlayerTrainer.displayName }, "sendDisconnect");
            targetPlayer.logged = false;
            var targetPlayerMap = players.getMap(targetPlayerTrainer);
            players.online.splice(players.online.indexOf(targetPlayer.name), 1);
            targetPlayerMap.playersInMap.splice(targetPlayerMap.playersInMap.indexOf(targetPlayer.name), 1);
            delete targetPlayer.socket;
            delete targetPlayerTrainer.lastPacket;
            delete players.bySocket.account[socket.id];
            delete players.bySocket.trainer[socket.id];
            delete targetPlayer;
            delete targetPlayerTrainer;
            //console.log(players.byName);
            //console.log(players.bySocket);
        }
    }
}

// code run on server termination
process.on("SIGINT", () => process.exit(0));

process.on('exit', (code) => {
    server.send({}, "serverDown");
    for (player in trainer) {
        if (player != "server" && account[player] && trainer[player] && trainer[player].displayName) {
            console.log("Writing data for " + trainer[player].displayName + "...");
            delete account[player].logged;
            delete account[player].socket;
            delete trainer[player].moving;
            if (trainer[player].inBattle) trainer[player].allowInput = true;
            jsonfile.writeFileSync('./data/trainer/' + player + '.json', trainer[player]);
            console.log(color.blue, "done!");
        }
    }
    jsonfile.writeFileSync(backupFile, account);
    jsonfile.writeFileSync('./data/login/players.json', account);
    console.log(color.green, 'Successfully saved login data');
    console.log('Process exit event with code: ', code);
});

game.sendLocationToAllPlayers = function (playerName, idle) {
    var targetPlayer = trainer[playerName];
    for (player of players.getMap(targetPlayer).playersInMap) {
        game.sendLocation(playerName, player, idle);
    }
}

game.sendWarpToAllPlayers = function (targetPlayer, map) {
    for (player of map.playersInMap) {
        if (server.socketExists(account[player].socket)) {
            // console.log(trainer[player].name + " should see " + targetPlayer.name + " disconnect");
            server.emit(account[player].socket, { id: targetPlayer.displayName }, "sendDisconnect");
        } else {
            console.log("error! could not find socket for " + player);
        }
    }
    game.sendDataToPlayer(targetPlayer, "warpEvent");
}

game.sendLocation = function (player, playerToSend, idle) {
    if (trainer[player].map == trainer[playerToSend].map && trainer[player].submap == trainer[playerToSend].submap) {
        console.log(trainer[playerToSend].name + " should see " + trainer[player].name + " move");
        server.emit(account[playerToSend].socket, { id: trainer[player].displayName, map: trainer[player].map, submap: trainer[player].submap, x: trainer[player].x, y: trainer[player].y, facing: trainer[player].facing, idle: idle, avatar: trainer[player].avatar }, "playerMovement");
    }
    // createData("position",{hello: "b1"})


    // player:{
    //     positon:{

    //     }

    //     tariner:{

    //     }

    // }    
        // else
        // console.log("should not get here");
}

// send all of a player's data to the player
game.sendDataToPlayer = function (targetPlayer, event) {
    server.emit(account[targetPlayer.name].socket, { name: targetPlayer.displayName, x: targetPlayer.x, y: targetPlayer.y, facing: targetPlayer.facing, map: targetPlayer.map, submap: targetPlayer.submap, busy: targetPlayer.busy, inventory: targetPlayer.inventory, money: targetPlayer.money, encounter: targetPlayer.encounter, party: targetPlayer.pokemon.party, collidables: players.getMap(targetPlayer).collidables, ledges: players.getMap(targetPlayer).ledges, avatar: targetPlayer.avatar, warpTiles: players.getMap(targetPlayer).warpTiles }, event);
}

// game.sendWarp = function (player, playerToSend) {

// }

// local functions
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateBattleTime(messages) {
    var battleTime = 0;
    for (item of messages) {
        if (item.message) battleTime += messages.length * 30;
        if (item.damageHPTo) battleTime += 2000;
    }
    return battleTime;
}