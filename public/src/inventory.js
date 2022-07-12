var changeInvIcon = false;

function toggleInv() {
    if (document.getElementById("inventory").style.display == "none") document.getElementById("inventory").style.display = "block";
    else document.getElementById("inventory").style.display = "none";
    changeInvIcon = true;
}

function switchInvIcon() {
    if (document.getElementById("invBtn").src.slice(document.getElementById("invBtn").src.indexOf("res/")) == "res/gui/icons/backpack_sprite_closed.png") document.getElementById("invBtn").src = "res/gui/icons/backpack_sprite_open.png";
    else document.getElementById("invBtn").src = "res/gui/icons/backpack_sprite_closed.png";
}

function mouseOverInv() {
    if (!changeInvIcon) {
        switchInvIcon();
    } else {
        changeInvIcon = false;
    }
}