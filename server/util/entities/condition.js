(function (game) {
    module.exports = {
        hasItem: function (player, item) {
            return game.players.byName.trainer[player].inventory[item];
        },
        hasPokemon: function (player, mon) {
            return false;
        },
        hasBadges: function (player, badges) {
            return game.players.byName.trainer[player].badges >= badges;
        },
        hasRegistered: function (player, number) {
            return game.players.byName.trainer[player].stats.pokedex >= number;
        }
    }
}())