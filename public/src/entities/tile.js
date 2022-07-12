var tilesets = {
    "Outside": {
        x: 8,
        y: 502
    },
    "Pokemon Center": {
        x: 8,
        y: 40
    }
}
class tile {
    constructor(x, y, sheet, tileX, tileY, layer){
        this.pos = new position(this, x, y);
        this.img = new animator(this, this.pos, sheet, tilesets[sheet].x, tilesets[sheet].y);
        this.layer = layer;
        this.img.setX(tileX);
        this.img.setY(tileY);
        this.properties = [
            this.pos,
            this.img
        ];
        this.realWidth = this.img.img.img.width / this.img.width;
        this.realHeight = this.img.img.img.height / this.img.height;
        objects.layers[this.layer].push(this);
        // this.type = "block";
        // if(reqX == 1 && reqY == 0){
        //     this.type = "backGrass";
        // }
    }
    step() {

    }
}