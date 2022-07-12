CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    // console.log("x: " + x + ", y: " + y + ", w:n " + w + ", h: " + h + ", r: " + r);
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  }

function grassBlocks(x, y, sizeX, sizeY) {
    for (var sX = 0; sX < sizeX; sX++) {
        for (var sY = 0; sY < sizeY; sY++) {
            new tile(x + 32 * sX, y + 32 * sY, "Outside", sX % 5 + 1, 0, 0);
        }
    }
}


function createWildGrass(x, y, sizeX, sizeY) {
    for (var sX = 0; sX < sizeX; sX++) {
        for (var sY = 0; sY < sizeY; sY++) {
            new tile(x + 32 * sX, y + 32 * sY, "Outside", 6, 0, 1);
        }
    }
}

function tree(x, y) {
    drawObject(x, y + 64, "Outside", 4, 54, 2, 1, 1);
    drawObject(x, y, "Outside", 4, 52, 2, 1, 3);
    drawObject(x, y + 32, "Outside", 4, 53, 2, 1, 3);
}

function pokemonCenter(x, y) {
    //pcTop(x, y);
    drawObject(x, y + 64, "Outside", 0, 328, 5, 2, 1);
    drawObject(x, y + 128, "Outside", 0, 330, 5, 1, 1);
    drawObject(x, y, "Outside", 0, 326, 5, 1, 3);
    drawObject(x, y + 32, "Outside", 0, 327, 5, 1, 3);
}

function drawObject(x, y, sheet, startX, startY, sizeX, sizeY, layer) {
    for (var sX = 0; sX < sizeX; sX++) {
        for (var sY = 0; sY < sizeY; sY++) {
            new tile(x + 32 * (sX), y + 32 * (sY), sheet, startX + (sX), startY + (sY), layer);
        }
    }
}

function backGrass(x, y, sizeX, sizeY) {
    for (var sX = 0; sX < sizeX; sX++) {
        for (var sY = 0; sY < sizeY; sY++) {
            new tile(x + 32 * (sX), y + 32 * (sY), "Outside", 1, 0, 0, 0);
        }
    }
}
