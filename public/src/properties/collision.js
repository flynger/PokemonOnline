var collidables = [];
var warpTiles = [];
var ledges = [];

function idleCheck(x, y) {
    x /= 32;
    y += 16;
    y /= 32;
    var map = getMap();
    if (32 * x < map.startX || 32 * x >= map.startX + map.width || 32 * y < map.startY || 32 * y >= map.startY + map.height || (collidables[x] && collidables[x].includes(y))) {
        return true;
    }
    return false;
}

function ledgeCheck(x, y, input) {
    x /= 32;
    y += 16;
    y /= 32;
    if (ledges[x]) {
        for (i in ledges[x]) {
            ledge = ledges[x][i];
            if (ledge.y == y) {
                if (ledge.direction == input) return 2;
                return false;
            }
        }
    }
    return 1;
}

function warpCheck(x, y) {
    x /= 32;
    y += 16;
    y /= 32;
    for (warpTile of warpTiles) {
        if (warpTile.x === x && warpTile.y === y) {
            return true;
        }
    }
    return false;
}