(function() {
    const jsonfile = require('../../libs/node_modules/jsonfile');
    module.exports = jsonfile.readFileSync('./data/pokedex/pokedex.json');
}())