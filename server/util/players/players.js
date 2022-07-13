module.exports = function (game) {
    const jsonfile = require('../../libs/node_modules/jsonfile');
    var players = {

        llama: "dfg3333",
        dfg3333: "llama"
        
        // player: {
        //     acc: {
        //         asidhasi
        //         aduiashd
                
        //     },

        //     trainer: {


        //     }

        //     sockId: 

        // },
        // socketIdToUsername: {
        //     id: username
        // }

        // players[]

        // byName: {
        //     account: require('../../data/login/players.json'),
        //     trainer: {}
        // },
        // bySocket: {
        //     account: {},
        //     trainer: {}
        // },
        // online: [],
        // choices: {
        //     starters: ["BULBASAUR", "CHARMANDER", "SQUIRTLE"],
        //     avatars: ["red", "green", "brendan", "may", "blue", "oak", "bug_catcher", "biker"]
        // }
    };
    for (player in account) {
        if (account[player].logged) {
            delete account[player].logged;
        }
    }

    // create server account and socket for server messages
    players.byName.trainer["server"] = {
        name: "server",
        displayName: "Server"
    };
    players.byName.account["server"].socket = "Derpser2516";
    players.bySocket.trainer["Derpser2516"] = players.byName.trainer["server"];


    players.addItemToInventory = function (player, item, quantity) {
        var inventory = players.byName.trainer[player].inventory;
        if (!inventory[item]) {
            inventory[item] = {
                quantity: 0
            }
        }
        inventory[item].quantity += quantity;
        game.server.emit(players.byName.account[player].socket, { inventory: inventory, itemFound: item, itemCount: quantity }, "itemReceived");
    }
    players.getMap = function (player) {
        return game.maps[player.map][player.submap];
    }

    return game.players = players;
};