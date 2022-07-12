function startEncounter(pokemon) {
    playerData.inBattle = true;
    playerData.sentPokemon = playerData.pokemon.party[0];
    var shinyText = "";
    if (pokemon.shiny) shinyText = "Shiny ";
    playBattleMusic();
    playerData.sounds.backgroundMusic.pause();
    document.getElementById("dialogueBox").style.display = "block";
    document.getElementById("battleGUI").style.display = "block";
    showDialogue("A wild " + shinyText + pokemon.name + " appeared!");
    playerData.yourName.innerHTML = playerData.sentPokemon.name;
    playerData.enemyName.innerHTML = shinyText + pokemon.name;
    playerData.yourLevel.innerHTML = playerData.sentPokemon.level;
    playerData.enemyLevel.innerHTML = pokemon.level;
    playerData.yourHP.label.innerHTML = playerData.sentPokemon.hp + " / " + playerData.sentPokemon.stats.hp;
    playerData.yourHP.bar.width = 192 * playerData.sentPokemon.hp / playerData.sentPokemon.stats.hp;
    playerData.enemyHP.bar.width = 192 * playerData.encounter.percentHP;
    updateXPBar((playerData.sentPokemon.xp - growthRates[pokedex[playerData.sentPokemon.species].growthRate][playerData.sentPokemon.level]) / (growthRates[pokedex[playerData.sentPokemon.species].growthRate][playerData.sentPokemon.level + 1] - growthRates[pokedex[playerData.sentPokemon.species].growthRate][playerData.sentPokemon.level]));
    setTimeout(showBattleOptions, 1500);
    updatePokemon();
    updateMoveButtons();
}

function fleeBattle() {
    endBattle();
    playerData.sounds.flee.setVolume(0.1);
    playerData.sounds.flee.play();
    var data = {
        id: client.socket.id
    }
    client.send(data, "fleeBattle");
}

function updatePokemon() {
    var directory = "normal";
    if (playerData.sentPokemon.shiny) directory = "shiny";
    document.getElementById("pokemon0").src = "res/pokemon/sprites/back/" + directory + "/" + spriteData[playerData.sentPokemon.species].id + ".png";
    document.getElementById("pokemon0").style.left = parseInt(document.getElementById("base0").style.left) + (parseInt(document.getElementById("base0").width) - parseInt(document.getElementById("pokemon0").width)) / 2 + spriteData[playerData.sentPokemon.species].back.offsetX;
    document.getElementById("pokemon0").style.top = (window.displayHeight - 720) / 2 + 165 + spriteData[playerData.sentPokemon.species].back.offsetY;

    directory = "normal";
    if (playerData.encounter.shiny) directory = "shiny";
    document.getElementById("pokemon1").src = "res/pokemon/sprites/front/" + directory + "/" + spriteData[playerData.encounter.species].id + ".png";
    document.getElementById("pokemon1").style.left = parseInt(document.getElementById("base1").style.left) + (parseInt(document.getElementById("base1").width) - parseInt(document.getElementById("pokemon1").width)) / 2;
    document.getElementById("pokemon1").style.top = (window.displayHeight - 720) / 2 + 50 + spriteData[playerData.encounter.species].front.offsetY;
}

function playBattleMusic() {
    if (playerData.sounds.battleMusic.isLoaded()) {
        playerData.sounds.battleMusic.setVolume(0.025);
        playerData.sounds.battleMusic.setLoop(true);
        playerData.sounds.battleMusic.play();
    }
    else setTimeout(function () {
        if (playerData.sounds.battleMusic.isLoaded() && !playerData.sounds.battleMusic.isPlaying()) {
            playerData.sounds.battleMusic.setVolume(0.025);
            playerData.sounds.battleMusic.setLoop(true);
            playerData.sounds.battleMusic.play();
        } else if (playerData.sounds.battleMusic.isPlaying()) {
            console.log("battle music already playing, exiting...");
            return;
        } else {
            console.log("battle music not loaded, retrying...");
            playBattleMusic();
        }
    }, 100);
}