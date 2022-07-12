(function () {
    const jsonfile = require('../../libs/node_modules/jsonfile');
    module.exports.login = function (data, game) {
        var players = game.players;
        var server = game.server;
        var trainer = players.byName.trainer;
        var account = players.byName.account;
        var targetPlayer;
        if (typeof data.name === "string" && typeof data.pass === "string" && account[data.name.toLowerCase()] && !players.bySocket.account[data.id]) {
            data.username = data.name.toLowerCase();
            targetPlayer = account[data.username];
            if (targetPlayer.logged) {
                server.emit(data.id, data.name, "doubleError");
            } else if (targetPlayer.password != data.pass) {
                server.emit(data.id, data.name, "loginFail");
            } else if (targetPlayer.password == data.pass) {
                if (data.username == "server") process.exit();
                players.bySocket.account[data.id] = targetPlayer;
                if (!trainer[data.username]) trainer[data.username] = jsonfile.readFile('./data/trainer/' + data.username + '.json')
                    .then(obj => loginPlayer(obj, data, game))
                    .catch(err => console.error(err));
                else loginPlayer(trainer[data.username], data, game);
            }
        } else {
            server.emit(data.id, data.name, "loginFail");
        }
    }
    module.exports.signUp = function (data, game) {
        var players = game.players;
        var server = game.server;
        var account = players.byName.account;
        if (typeof data.name === "string" && typeof data.pass === "string" && typeof data.avatar === "string" && typeof data.starter === "string" && players.choices.avatars.includes(data.avatar) && players.choices.starters.includes(data.starter) && !players.bySocket.account[data.id]) {
            data.username = data.name.toLowerCase();
            if (!/^[A-Za-z0-9_]{3,16}$/.test(data.name)) {
                server.emit(data.id, data.name, "nameError");
            } else if (!/(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/.test(data.pass)) {
                server.emit(data.id, data.name, "passError");
            } else if (account[data.name.toLowerCase()]) {
                server.emit(data.id, data.name, "signUpExists");
            } else {
                signUpPlayer(data, game);
            }
        } else {
            server.emit(data.id, data.name, "signUpFail");
        }
    }
    function signUpPlayer(data, game) {
        console.log(data);
        var players = game.players;
        var server = game.server;
        var color = game.color;
        //var trainer = players.byName.trainer;
        players.byName.account[data.username] = {
            name: data.username,
            password: data.pass
        };
        players.bySocket.account[data.id] = players.byName.account[data.username];
        var player = {
            name: data.username,
            displayName: data.name,
            avatar: data.avatar,
            x: 36,
            y: 14,
            moving: false,
            facing: 0,
            map: "Pallet Town",
            submap: "Pallet Town",
            busy: false,
            pokemon: {
                party: [],
                box: []
            },
            friends: [],
            money: 0,
            npcData: {},
            inventory: {},
            encounter: {},
            stats: {
                types: {},
                species: {},
                pokedex: 1
            },
            badges: 0
        };
        player.pokemon.party.push(game.pokemon.createPokemon(data.starter, 5, game.pokemon.createStats(randomNumber(0, 24), randomNumber(0, 24), randomNumber(0, 24), 
        randomNumber(0, 24), randomNumber(0, 24), randomNumber(0, 24)), true, player.displayName));
        console.log(player.pokemon);
        jsonfile.writeFile('./data/trainer/' + data.username + '.json', player);
        console.log(color.green, data.name + " signed up.");
        server.emit(data.id, {}, "signUp");
        loginPlayer(player, data, game);
    }
    function loginPlayer(trainer, data, game) {
        console.log(trainer);
        console.log(game.players.byName.account[data.username]);
        var players = game.players;
        var maps = game.maps;
        var server = game.server;
        var color = game.color;
        var account = players.byName.account;
        var targetPlayer = account[data.username];
        // if (targetPlayer.socket) delete targetPlayer.socket;
        // if (targetPlayer.logged) delete targetPlayer.logged;
        var targetPlayerTrainer = trainer;
        updateTrainerProperties(trainer); // in case new properties were added to players
        players.bySocket.trainer[data.id] = targetPlayerTrainer;
        players.byName.trainer[data.username] = targetPlayerTrainer;
        targetPlayer.logged = true;
        targetPlayer.socket = data.id;
        console.log(color.green, targetPlayerTrainer.displayName + " logged in.");
        var encounter = {};
        if (targetPlayerTrainer.encounter.species) {
            encounter.species = targetPlayerTrainer.encounter.species
            encounter.name = targetPlayerTrainer.encounter.name
            encounter.level = targetPlayerTrainer.encounter.level
            encounter.percentHP = targetPlayerTrainer.encounter.hp / targetPlayerTrainer.encounter.stats.hp
        }
        players.online.push(data.username);
        players.getMap(targetPlayerTrainer).playersInMap.push(data.username);
        game.sendDataToPlayer(targetPlayerTrainer, "loginSuccess");
        for (player of players.getMap(targetPlayerTrainer).playersInMap) {
            if (player != data.username) {
                game.sendLocation(player, data.username, false);
                game.sendLocation(data.username, player, false);
            }
        }
    }

    function updateTrainerProperties(trainer) {
        var player = {
            name: trainer.name,
            displayName: trainer.name,
            avatar: "red",
            x: 36,
            y: 14,
            moving: false,
            facing: 0,
            map: "Pallet Town",
            submap: "Pallet Town",
            busy: false,
            pokemon: {
                party: [],
                box: []
            },
            friends: [],
            money: 0,
            npcData: {},
            inventory: {},
            encounter: {},
            stats: {
                types: {},
                species: {},
                pokedex: 1
            },
            badges: 0
        };
        for (prop in player) {
            if (!(prop in trainer)) {
                console.log("Added missing attribute '" + prop + "' to player " + trainer.displayName);
                trainer[prop] = player[prop];
            }
        }
    }
    
    // local functions
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}())