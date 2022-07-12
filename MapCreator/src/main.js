function setup() {
  Screen.init();
  frameRate(30);
  var tilesets = {
    BIKE_SHOP: {
      file: "https://i.ibb.co/3v4d5tV/Bike-shop.png",
      name: "Bike shop",
      width: 8,
      height: 10
    },
    BOAT: {
      file: "https://i.ibb.co/W0jGXY9/Boat.png",
      name: "Boat",
      width: 8,
      height: 502
    },
    CAVES: {
      file: "https://i.ibb.co/NSwFNQd/Caves.png",
      name: "Caves",
      width: 8,
      height: 502
    },
    FACTORY: {
      file: "https://i.ibb.co/C89WpQb/Factory.png",
      name: "Factory",
      width: 8,
      height: 502
    },
    GAME_CORNER: {
      file: "https://i.ibb.co/yNmKbcT/Game-Corner.png",
      name: "Game corner",
      width: 8,
      height: 502
    },
    OUTSIDE: {
      file: "https://i.ibb.co/PcdTHFM/Outside.png",
      name: "Outside",
      width: 8,
      height: 502
    }
  }
  for (image of tilesets) {
    new imageSet(image.file, image.name, image.width, image.height);
  }
  //new rawMap("maps", "startmap");
  camera.on();
}

function step() {
  // camera.position.x = players[client.socket.id].pos.x;
  // camera.position.y = players[client.socket.id].pos.y;
}