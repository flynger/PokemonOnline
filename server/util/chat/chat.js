(function () {
    const jsonfile = require('../../libs/node_modules/jsonfile');
    const filters = jsonfile.readFileSync('./data/filters/filters.json');
    module.exports.sendChatToAllPlayers = function (data, game) {
        var players = game.players;
        var pokemon = game.pokemon;
        data.name = players.bySocket.trainer[data.id].displayName;
        if (chatIsCommand(data.message, data.name)) {
            var server = game.server;
            var account = players.byName.account;
            var trainer = players.byName.trainer;
            if (data.message == "/stop") {
                process.exit();
            } else if (data.message.substring(0, 5) == "/kick") {
                var playerToKick = data.message.substring(6, data.message.length + 1).toLowerCase();
                if (account[playerToKick].socket) {
                    var socketToKick = account[playerToKick].socket;
                    server.emit(socketToKick, { kicked: true, name: data.name }, "kickEvent");
                }
                //server.kick(socketToKick);
            } else if (data.message.substring(0, 3) == "/tp") {
                // var args = data.message.split(" ");
                // var player1 = args[1];
                // var player2 = args[2];
                // trainer[player1].x = trainer[player2].x;
                // trainer[player1].y = trainer[player2].y;
                // sendLocationToAllPlayers(trainer[player1].name, false);
            } else if (data.message == "/pokedex") {
                console.log(game.pokedex);
            } else if (data.message.substring(0, 6) == "/money") {
                var args = data.message.split(" ");
                if (args.length != 4 || isNaN(args[2]) || !trainer[args[3].toLowerCase()]) {
                    server.emit(data.id, { name: "Server", message: "Invalid arguments for command '/money'" }, "chatMessage");
                    return;
                }
                var action = args[1];
                var amount = +args[2];
                var player = args[3].toLowerCase();
                if (action == "add") {
                    console.log("Adding $" + amount + " to " + trainer[player].displayName + "'s money...");
                    trainer[player].money += amount;
                    console.log(trainer[player].displayName + "'s money is now $" + trainer[player].money);
                } else if (action == "remove") {
                    console.log("Removing $" + amount + " from " + trainer[player].displayName + "'s money...");
                    trainer[player].money -= amount;
                    console.log(trainer[player].displayName + "'s money is now $" + trainer[player].money);
                } else if (action == "set") {
                    console.log("Setting " + trainer[player].displayName + "'s money to $" + amount + "...");
                    trainer[player].money = amount;
                    console.log(trainer[player].displayName + "'s money is now $" + trainer[player].money);
                } else {
                    server.emit(data.id, { name: "Server", message: "Invalid arguments for command '/money'" }, "chatMessage");
                    return;
                }
                server.emit(account[player].socket, { money: trainer[player].money }, "moneyUpdate");
                // var player2 = args[2];
                // trainer[player1].x = trainer[player2].x;
                // trainer[player1].y = trainer[player2].y;
                // sendLocationToAllPlayers(trainer[player1].name, false);
            } else if (data.message.substring(0, 5) == "/hack" && data.message.split(" ").length == 2) {
                // var playerToHack = data.message.split(" ")[1].toLowerCase();
                // if (trainer[playerToHack] && account[playerToHack].socket) {
                //     server.emit(data.id, { name: "Server", message: "You have hacked into " + trainer[playerToHack].displayName + "'s session." }, "chatMessage");
                //     server.emit(account[playerToHack].socket, { name: "Server", message: "Someone has hijacked your session!" }, "chatMessage");
                //     server.emit(data.id, { id: account[playerToHack].socket }, "hackPlayer");
                // } else {
                //     server.emit(data.id, { name: "Server", message: "Invalid arguments for command '/hack'" }, "chatMessage");
                // }
            } else if (data.message.substring(0, 5) == "/heal") {
                var playerToHeal = data.message.split(" ")[1];
                if (!playerToHeal) playerToHeal = players.bySocket.account[data.id].name;
                else playerToHeal = playerToHeal.toLowerCase();
                if (trainer[playerToHeal] && account[playerToHeal].socket) {
                    for (pkmn of trainer[playerToHeal].pokemon.party) {
                        pkmn.hp = pkmn.stats.hp;
                        if (pkmn.fainted) delete pkmn.fainted;
                    }
                    server.emit(data.id, { name: "Server", message: "You have healed " + trainer[playerToHeal].displayName + "'s pokemon." }, "chatMessage");
                    server.emit(account[playerToHeal].socket, { name: "Server", message: "Successfully healed your pokemon!" }, "chatMessage");
                } else {
                    server.emit(data.id, { name: "Server", message: "Invalid arguments for command '/heal'" }, "chatMessage");
                }
            } else if (data.message.substring(0, 7) == "/reload") {
                server.send({}, "reloadGame");
            } else if (data.message.substring(0, 6) == "/party") {
                var args = data.message.split(" ");
                var player = trainer[args[1].toLowerCase()];
                var partyToAdd = player.pokemon.party;
                var species = args[2].toUpperCase();
                var level = parseInt(args[3]);
                partyToAdd[0] = pokemon.createPokemon(species, level, undefined, false, player.displayName);
                server.emit(data.id, { name: "Server", message: "You have given " + player.displayName + " a Level " + level + " " + species + "." }, "chatMessage");
                server.emit(account[player.name].socket, { name: "Server", message: "Received Level " + level + " " + species + " from " + data.name + "." }, "chatMessage");
            }
        }
        else for (player of players.online) {
            module.exports.sendChatTo(data, player, game);
        }
    }
    module.exports.sendChatTo = function (data, player, game) {
        var server = game.server;
        var players = game.players;
        var account = players.byName.account;
        data.name = players.bySocket.trainer[data.id].displayName;
        if (account[player].socket) {
            server.emit(account[player].socket, { name: data.name, message: data.message }, "chatMessage");
        }
    }
    module.exports.filterMessage = function (message, player) {
        if (!hasPerms(player)) {
            if (message.length <= 256) {
                return message.split(" ")
                    .filter(letter => !filters.single.includes(letter)).join(" ").split(".")
                    .filter(term => !filters.sites.includes(term)).join(".").split(" ")
                    .filter(word => word.length <= 20 && !filters.words.includes(word)).join(" ");
            } else {
                return "[This message was filtered for being too long]";
            }
        } else {
            return message;
        }
    }
    function chatIsCommand(message, player) {
        return hasPerms(player) && message.charAt(0) == '/';
    }
    function hasPerms(player) {
        var whitelist = ["harry", "flynger", "llama", "luminous_llama", "cloudz", "oak"];
        return whitelist.includes(player.toLowerCase());
    }
}())