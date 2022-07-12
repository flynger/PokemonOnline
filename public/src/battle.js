var colors = {
    NORMAL: "#A9AA79",
    FIRE: "#F0812C",
    WATER: "#6891F0",
    ELECTRIC: "#F8D12C",
    GRASS: "#79C94F",
    ICE: "#99D9D9",
    FIGHTING: "#C12C23",
    POISON: "#A13EA1",
    GROUND: "#E1C168",
    FLYING: "#A991F0",
    PSYCHIC: "#F85789",
    BUG: "#A9B91A",
    ROCK: "#B9A135",
    GHOST: "#715799",
    DRAGON: "#7135F8",
    DARK: "#715746",
    STEEL: "#B9B9D1",
    FAIRY: "#F0AAB2"
}

function selectMove(number) {
    if (document.getElementById("move" + number).innerHTML != "") {
        document.getElementById("backBtn").style.display = "none";
        var data = {
            id: client.socket.id,
            moveSelected: number - 1
        }
        document.getElementById("moveOptions").style.display = "none";
        client.send(data, "battleInput");
    }
}

function moveSelector() {
    hideBattleOptions();
    showMoveOptions();
}

function hideBattleOptions() {
    document.getElementById("battleOptions").style.display = "none";
}

function showBattleOptions() {
    hideMoveOptions();
    showDialogue("What will " + playerData.sentPokemon.name + " do?");
    setTimeout(function(){
        document.getElementById("battleOptions").style.display = "block";
    }, 500);
}

function showMoveOptions() {
    document.getElementById("backBtn").style.display = "block";
    document.getElementById("moveOptions").style.display = "block";
}

function hideMoveOptions() {
    document.getElementById("backBtn").style.display = "none";
    document.getElementById("moveOptions").style.display = "none";
}

function updateMoveButtons() {
    document.getElementById("move1").innerHTML = "";
    document.getElementById("move2").innerHTML = "";
    document.getElementById("move3").innerHTML = "";
    document.getElementById("move4").innerHTML = "";
    if (playerData.sentPokemon)
        for (move in playerData.sentPokemon.moves) {
            var moveButton = document.getElementById("move" + (parseInt(move) + 1));
            var move = moves[playerData.sentPokemon.moves[move]];
            moveButton.innerHTML = move.name;
            moveButton.style.backgroundColor = colors[move.type];
        }
}

function showDialogue(message) {
    document.getElementById("dialogue").innerHTML = "";
    return runDialogue(message, 0, 25);
}

function runDialogue(message, index, interval) {
    if (index < message.length) {
        document.getElementById("dialogue").innerHTML += message[index++];
        setTimeout(function () { runDialogue(message, index, interval); }, interval);
    }
    return true;
}

function endBattle() {
    playerData.inBattle = false;
    playBackgroundMusic(0.025);
    delete playerData.sentPokemon;
    playerData.sounds.battleMusic.stop();
    document.getElementById("battleGUI").style.display = "none";
    document.getElementById("dialogueBox").style.display = "none";
    document.getElementById("backBtn").style.display = "none";
    hideBattleOptions();
    document.getElementById("moveOptions").style.display = "none";
    updateMoveButtons();
}

function updateHPBar(number, percentHP) {
    document.getElementById("hp" + number).width = 192 * percentHP;
    if (number === 0) {
        // setTimeout(function(){
        //     playerData.yourHP.label.innerHTML = percentHP * playerData.sentPokemon.stats.hp + " / " + playerData.sentPokemon.stats.hp;
        // }, 1400);
        var hpStart = parseInt(document.getElementById("userHP").innerHTML.split(" / ")[0]);
        var hpFinal = percentHP * playerData.sentPokemon.stats.hp;
        if (hpFinal < 0) hpFinal = 0;
        countHPDown(hpStart, hpFinal, 1400 / (hpStart - hpFinal + 1));
    }
}

function countHPDown(start, end, timer) {
    playerData.yourHP.label.innerHTML = start + " / " + playerData.sentPokemon.stats.hp;
    if (start == end) return;
    setTimeout(() => {
        countHPDown(start - 1, end, timer);
    }, timer);
}

function updateXPBar(percent) {
    if (percent > 1) percent = 1;
    playerData.xpBar.width = percent * 256;
}

function resetXPBar() {
    console.log("reset xp bar");
    playerData.xpBar.style.transitionDuration = "1ms";
    playerData.xpBar.style.width = 0;
    setTimeout(() => playerData.xpBar.style.transitionDuration = "1s", 50);
}