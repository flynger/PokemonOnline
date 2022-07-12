var canvas;
var img;
function setup(){
    canvas = createCanvas(500, 500);
    canvas.drop(function(file){
        img = createImg(file.data).hide();
        canvas.size(img.width, img.height);
        console.log(img.width/32, img.height/32);
    });
}
function draw(){
    background(0);
    if(img){
        image(img, 0, 0);
    }

    noFill();
    rect(mouseX - (mouseX % 32), mouseY - (mouseY % 32), 32, 32);
}
function mousePressed(){
    var x = mouseX - (mouseX % 32);
    var y = mouseY - (mouseY % 32);
    console.log(x/32, y/32);
}