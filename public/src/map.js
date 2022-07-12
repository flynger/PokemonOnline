playerData.map = {};
var maps = {
   "Pallet Town": {
  //   // "Pallet Town": {
  //   //   startX: 32,
  //   //   startY: -128,
  //   //   width: 1408,
  //   //   height: 704,
  //   // }
   }
}

function toggleMap() {
  if(playerData.map.image.style.display == "block"){
      playerData.map.image.style.display = "none";
  } else {
    playerData.map.image.style.display = "block";
  }
}

function getMap() {
  return maps[playerData.map.name][playerData.submap];
}

function createMap(map, submap) {
  // if (submap == "Pallet Town") {
  //   grassBlocks(0, -160, 46, 24);
  //   tree(416, 32);
  //   tree(416, 128);
  //   tree(416, 224);
  //   tree(416, 320);
  //   tree(416, 416);
  //   pokemonCenter(1024, 256);
  //   createWildGrass(160, 32, 8, 12);
  // } else {
    var mapJSON = loadJSON("res/maps/" + map + "/" + submap + ".json", (data) => {
      //console.log(data);
      if (!maps[map]) maps[map] = {};
      maps[map][submap] = {
        startX: data.startX,
        startY: data.startY,
        width: data.width,
        height: data.height
      }
      for (layer in data.layers) {
        //console.log(layer);
        if (!data.layers[layer]) continue;
        for (obj of data.layers[layer]) {
          new tile(obj.x, obj.y, obj.img.tileset, obj.img.x, obj.img.y, layer);
        }
      }
      for (data of playersNotInMap) {
        handlePlayerData(data);
        playersNotInMap.splice(playersNotInMap.indexOf(data), 1);
      }
    });
  //}
}