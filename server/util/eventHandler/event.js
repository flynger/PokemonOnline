module.exports = (game) => {
    var events = {
        battleEvents: require('./events/battleEvent')(game)
    }
    // module.exports.chatEvents = require('events/chatEvent');
    // module.exports.loginEvents = require('events/loginEvent');
    // module.exports.overworldEvents = require('events/overworldEvent');
    return game.event = events;
}