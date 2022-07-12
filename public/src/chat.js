var chat = {};
var offsetMon = {
    id: 0,
    front: {
        offsetX: 0,
        offsetY: 0
    },
    back: {
        offsetX: 0,
        offsetY: 0
    }
};

function addChatMessage(data) {
    // var whitelist = ["harry", "flynger", "luminous_llama", "llama", "cloudz", "pokemon"];
    var whitelist = ["harry", "flynger", "llama"];
    if (!whitelist.includes(data.name.toLowerCase())) {
        chat.output.innerHTML += "<br><b>" + data.name + "</b>: " + data.message;
    } else {
        chat.output.innerHTML += "<br><b style=\"color: gold;\">[Developer]<text style=\"color: #333;\"> </text>" + data.name + "</b>: " + data.message;
    }
    chat.output.scrollTo(0, chat.output.scrollHeight);
}

function selectChat() {
    chat.input.select();
    chat.input.focus();
}

function openChat() {
    selectChat();
    chat.outputDiv.style.display = "block";
    chat.input.style.display = "block";
    chat.label.style.display = "block";
    chat.toggler.innerHTML = "Hide Chat";
    chat.toggler.style.left = "21%";
    chat.output.scrollTo(0, chat.output.scrollHeight);
}

function closeChat() {
    chat.outputDiv.style.display = "none";
    chat.input.style.display = "none";
    chat.label.style.display = "none";
    chat.toggler.innerHTML = "Show Chat";
    chat.toggler.style.left = 0;
}

function sendChat(message) {
    var args = message.split(" ");
    if (args[0] == "/ping") { // Gives Ping
        // /ping - gives ping
        addChatMessage({
            name: "Server",
            message: "Your ping is " + latency + " ms."
        });
        return;
    } else if (args[0] == "/set") {
        // /offset set [species] - sets what pokemon to offset
        offsetMon = {
            id: 0,
            front: {
                offsetX: 0,
                offsetY: 0
            },
            back: {
                offsetX: 0,
                offsetY: 0
            }
        };
        var species = parseInt(args[1]);
        offsetMon.id = species;
        document.getElementById("pokemon0").style.display = "none";
        document.getElementById("pokemon1").style.display = "none";
        document.getElementById("ghostmon0").style.display = "block";
        document.getElementById("ghostmon0").style.opacity = 0.6;
        document.getElementById("ghostmon0").style.zIndex = 1;
        document.getElementById("ghostmon0").style.position = "absolute";
        document.getElementById("ghostmon0").style.imageRendering = "pixelated";
        document.getElementById("ghostmon0").src = "res/pokemon/sprites/back/normal/" + species + ".png";
        document.getElementById("ghostmon1").style.display = "block";
        document.getElementById("ghostmon1").style.opacity = 0.6;
        document.getElementById("ghostmon1").style.zIndex = 1;
        document.getElementById("ghostmon1").style.position = "absolute";
        document.getElementById("ghostmon1").style.imageRendering = "pixelated";
        document.getElementById("ghostmon0").style.left = parseInt(document.getElementById("base0").style.left) + (parseInt(document.getElementById("base0").width) - parseInt(document.getElementById("ghostmon0").width)) / 2;
        document.getElementById("ghostmon1").style.left = parseInt(document.getElementById("base1").style.left) + (parseInt(document.getElementById("base1").width) - parseInt(document.getElementById("ghostmon1").width)) / 2;
        document.getElementById("ghostmon0").style.top = (window.displayHeight - 720) / 2 + 165;
        document.getElementById("ghostmon1").style.top = (window.displayHeight - 720) / 2 + 50;
        document.getElementById("ghostmon1").src = "res/pokemon/sprites/front/normal/" + species + ".png";
        return;
    } else if (args[0] == "/back") {
        // /offset back [x] [y] - sets offset for back sprite
        offsetMon.back.offsetX += parseInt(args[1]);
        offsetMon.back.offsetY += parseInt(args[2]);
        document.getElementById("ghostmon0").style.left = parseInt(document.getElementById("base0").style.left) + (parseInt(document.getElementById("base0").width) - parseInt(document.getElementById("ghostmon0").width)) / 2 + offsetMon.back.offsetX;
        document.getElementById("ghostmon0").style.top = (window.displayHeight - 720) / 2 + 165 + offsetMon.back.offsetY;
        return;
    } else if (args[0] == "/front") {
        // /offset front [x] [y] - sets offset for front sprite
        offsetMon.front.offsetX += parseInt(args[1]);
        offsetMon.front.offsetY += parseInt(args[2]);
        document.getElementById("ghostmon1").style.left = parseInt(document.getElementById("base1").style.left) + (parseInt(document.getElementById("base1").width) - parseInt(document.getElementById("ghostmon1").width)) / 2 + offsetMon.front.offsetX;
        document.getElementById("ghostmon1").style.top = (window.displayHeight - 720) / 2 + 50 + offsetMon.front.offsetY;
        return;
    } else if (args[0] == "/save") {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", '"' + getName(offsetMon.id) + '": ' + JSON.stringify(offsetMon) + ",");
        return;
    }
    client.socket.emit("chatMessage", { id: client.socket.id, message: message });
}

function toggleChat() {
    if (chat.input.style.display == "none") {
        openChat();
    } else {
        closeChat();
    }
}

function resizeChat() {
    chat.output.style.width = 0.4 * window.displayWidth;
    chat.output.style.height = 0.4 * window.displayHeight;
    chat.input.style.width = 0.4 * window.displayWidth + 5;
    chat.input.style.height = 0.05 * window.displayHeight;
    chat.toggler.style.width = 0.1 * window.displayWidth + 5;
    chat.toggler.style.height = 0.07 * window.displayHeight;
    chat.label.style.width = 0.3 * window.displayWidth;
    chat.label.style.height = chat.toggler.style.height;
    chat.label.style.fontSize = parseInt(chat.toggler.style.height) / 2;
    chat.toggler.style.fontSize = parseInt(chat.toggler.style.height) / 2.5;
    chat.output.style.fontSize = chat.label.style.fontSize;
    chat.input.style.fontSize = chat.label.style.fontSize;
}

// function positionChat() {
//     chat.output.style.left = 0;
//     chat.output.style.top = parseInt(chat.label.style.height);
//     chat.input.style.left = 0;
//     chat.input.style.top = parseInt(chat.label.style.height) + parseInt(chat.output.style.height);
//     chat.toggler.style.left = parseInt(chat.label.style.width);
//     chat.toggler.style.top = 0;
//     chat.label.style.left = 0;
//     chat.label.style.top = 0;
// }