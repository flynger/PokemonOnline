(function (game) {
    var entity = {
        type: 'NPC',
        battler: false,
        name: 'Professor Oak',
        look: 'oak',
        facing: 0,
        dialogue: ["Hey there trainer, welcome to the world of Pokemon!", "I'm Professor Oak, a Pokemon researcher.", "Here, take a Pokedex!"],
        dialogue1: ["Wow, PLAYER. You've collected over 100 species of Pokemon!", "Here, take this extremely rare Mew."],
        dialogue2: ["You don't have 100 species of Pokemon yet.", "Come back later when you do."],
        x: 10,
        y: 10,
        onInteract: function (player) {
            'if PLAYER has item POKEDEX: if PLAYER.stats.POKEDEX > 99: if PLAYER.badges = 8: set dialogue to dialogue1 onconfirm give PLAYER pokemon {MEW, L5, noshiny}; else: receive 1 POKEDEX replace 1-3 by "How much have you completed your Pokedex?"'
        }
    }
    module.exports = {
        giveItem: function (player, item, quantity) {
            game.players.addItemToInventory(player, item, quantity)
        }
    }
}())    