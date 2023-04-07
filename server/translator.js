const jsonfile = require("./libs/node_modules/jsonfile");
var mainMap = "Pallet Town";
var submap = "Pallet Town";
var rawMap = jsonfile.readFileSync('./data/rawMaps/' + mainMap + ' ' + submap + '.json');
var map = {
    startX: 0,
    startY: 0,
    width: rawMap.width,
    height: rawMap.height,
    collidables: [],
    grass: [],
    ledges: [],
    warpTiles: [], // 38, 21 to 7, 9
    entities: [],
    water: []
};
var clientMap = {
    music: "Pallet Town",
    startX: 0,
    startY: 0,
    width: rawMap.width * 32,
    height: rawMap.height * 32,
    layers: []
};
var tilesets = {};
var tiles = [];
for (tileset of rawMap.tilesets) {
    tileset.source = tileset.source.replace(".tsx", "");
    tilesets[tileset.source] = jsonfile.readFileSync('./data/tilesets/' + tileset.source + '.json');
    tilesets[tileset.source].firstgid = tileset.firstgid;
    for (tile of tilesets[tileset.source].tiles) {
        for (property of tile.properties) {
            if (!tiles[tile.id + tileset.firstgid]) tiles[tile.id + tileset.firstgid] = {};
            tiles[tile.id + tileset.firstgid][property.name] = property.value;
        }
    }
}
for (layer of rawMap.layers) {
    if(!clientMap.layers[layer.id - 1]) clientMap.layers[layer.id - 1] = [];
    for (i in layer.data) {
        var thisLayer = clientMap.layers[layer.id - 1];
        var tile = layer.data[i];
        if (tile === 0)
            continue;
        var tileData = {
            x: i % layer.width,
            y: Math.floor(i / layer.width)
        }
        //console.log("Tile " + tile + " at x " + tileData.x + ", y " + tileData.y);
        if (tiles[tile]) {
            console.log("Tile " + tile + " at x " + tileData.x + ", y " + tileData.y);
            if (tiles[tile].isCollidable) {
                map.collidables.push(tileData);
            } if (tiles[tile].isGrass) {
                map.grass.push(tileData);
            } if (tiles[tile].ledge) {
                tileData.direction = tiles[tile].ledge;
                map.ledges.push(tileData);
            } if (tiles[tile].isWarp) {
                tileData.destination = {map:"",submap:submap,x:0,y:0};
                map.warpTiles.push(tileData);
            } if (tiles[tile].item) {
                tileData.item = "random";
                map.entities.push(tileData);
            }
        }
        var clientData = {
            x: i % layer.width * 32,
            y: Math.floor(i / layer.width) * 32,
            img: {
                tileset: getTileset(tile),
            }
        }
        clientData.img.x = (tile - tilesets[clientData.img.tileset].firstgid) % tilesets[clientData.img.tileset].columns;
        clientData.img.y = Math.floor((tile - tilesets[clientData.img.tileset].firstgid) / tilesets[clientData.img.tileset].columns)
        if (tiles[tile] && 'layer' in tiles[tile]) {
            if(!clientMap.layers[tiles[tile].layer]) clientMap.layers[tiles[tile].layer] = [];
            thisLayer = clientMap.layers[tiles[tile].layer];
        }
        thisLayer.push(clientData);
    }
}
jsonfile.writeFileSync('./data/maps/' + mainMap + '/' + submap + '.json', map);
jsonfile.writeFileSync('../public/res/maps/' + mainMap + '/' + submap + '.json', clientMap);
//console.log(tiles);

function getTileset(tile) {
    var previousTileset;
    for (var tileset in tilesets) {
        if (tile >= tilesets[tileset].firstgid) {
            previousTileset = tilesets[tileset].name;
            continue;
        } 
        break;
    }
    return previousTileset;
}