var interactables = {
    item: {
        tileset: "Outside",
        tileX: 4,
        tileY: 118,
        layer: 2
    }
}
class interactable {
    constructor(x, y, type){
        this.pos = new position(this, x, y);
        this.tileset = interactables[type].tileset;
        this.img = new animator(this, this.pos, this.tileset, tilesets[this.tileset].x, tilesets[this.tileset].y);
        this.type = type;
        this.img.setX(interactables[type].tileX);
        this.img.setY(interactables[type].tileY);
        this.properties = [
            this.pos,
            this.img
        ];
        objects.layers[interactables[type].layer].push(this);
    }
    step(){
        // if(playerData.exists && players[client.socket.id].pos.x < this.pos.x + 32 && players[client.socket.id].pos.x + 32 > this.pos.x && players[client.socket.id].pos.y < this.pos.y + 16 && players[client.socket.id].pos.y + 48 > this.pos.y && players[client.socket.id].controller.moving) {
        //     var random = Math.ceil(Math.random()*300);
        //     if(random == 1){
        //         //encounter(this.area);
        //         //client.send({id : client.socket.id}, "encounter");
        //         //console.log("info");
        //     }
        // }
    }
}