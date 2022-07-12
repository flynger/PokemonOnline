class block {
    constructor(x, y, sheet, totalX, totalY, reqX, reqY, layer){
        this.pos = new position(this, x, y);
        this.img = new animator(this, this.pos, sheet, totalX, totalY);
        this.layer = layer;
        var x = totalX - reqX;
        var y = totalY - reqY;
         for(;x < totalX; x++){
             this.img.animateX();
         }
         for(;y < totalY; y++){
             this.img.animateY();
         }
        this.properties = [
            this.pos,
            this.img
        ];
        objects.layers[this.layer].push(this);
    }
    step() {

    }
}