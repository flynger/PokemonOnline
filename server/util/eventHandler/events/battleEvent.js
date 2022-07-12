module.exports = (game) => {
    var battleEvents = {
        turnInput: (data) => {
            if (data.id && typeof data.id == "string" && game.server.socketExists(data.id) && game.players.bySocket.trainer[data.id]) {
                var player = game.players.bySocket.trainer[data.id];
                if (data.moveSelected != null && typeof data.moveSelected == "number" && player.pokemon.party[player.activePokemon].moves[data.moveSelected] && player.busy && player.allowInput && player.activePokemon != null) {
                    player.allowInput = false;
                    userSpeed = Math.floor(player.pokemon.party[player.activePokemon].stats.spe * game.pokemon.getStageMultiplier("spe", player.pokemon.party[player.activePokemon].stages.spe));
                    opponentSpeed = Math.floor(player.encounter.stats.spe * game.pokemon.getStageMultiplier("spe", player.encounter.stages.spe));
                    console.log(userSpeed + " " + opponentSpeed);
                    player.pokemon.party[player.activePokemon].moveSelected = data.moveSelected;
                    player.encounter.moveSelected = randomNumber(0, player.encounter.moves.length - 1);
                    var speeder;
                    var slower;
                    var userPriority = game.pokemon.moves[player.pokemon.party[player.activePokemon].moves[data.moveSelected]].priority;
                    var opponentPriority = game.pokemon.moves[player.encounter.moves[player.encounter.moveSelected]].priority;
                    var userWentFirst = false;
                    if (userSpeed == opponentSpeed && userPriority == opponentPriority) {
                        var ran = randomNumber(0, 1);
                        if (ran == 0) {
                            userPriority += 1;
                        } else {
                            opponentPriority += 1;
                        }
                    }
                    if (userPriority > opponentPriority || (userSpeed > opponentSpeed && userPriority == opponentPriority)) {
                        userWentFirst = true;
                        speeder = player.pokemon.party[player.activePokemon];
                        slower = player.encounter;
                    } else {
                        speeder = player.encounter;
                        slower = player.pokemon.party[player.activePokemon];
                    }
                    var messages1 = game.battleHandler.useMove(speeder, slower, speeder.moveSelected);
                    var messages2;
                    var battleEnd = false;
                    if (slower.fainted) {
                        console.log(slower.name + " fainted!");
                        if (userWentFirst) {
                            game.battleHandler.awardXP(speeder, slower, messages1);
                        }
                        game.battleHandler.endBattle(player);
                        battleEnd = true;
                        player.encounter = {};
                    } else {
                        var messages2 = game.battleHandler.useMove(slower, speeder, slower.moveSelected);
                        if (speeder.fainted) {
                            console.log(speeder.name + " fainted!");
                            if (!userWentFirst) {
                                game.battleHandler.awardXP(slower, speeder, messages2);
                            }
                            game.battleHandler.endBattle(player);
                            battleEnd = true;
                            player.encounter = {};
                        } else {
                            setTimeout(function () {
                                player.allowInput = true;
                            }, calculateBattleTime(messages1) + calculateBattleTime(messages2));
                        }
                    }
                    game.server.emit(data.id, { userWentFirst: userWentFirst, move1: messages1, move2: messages2, battleEnd: battleEnd, party: player.pokemon.party }, "turnData");
                    delete speeder.moveSelected;
                    delete slower.moveSelected;
                }
            }
        },
        fleeBattle: (data) => {

        }
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function calculateBattleTime(messages) {
        var battleTime = 0;
        for (item of messages) {
            if (item.message) battleTime += messages.length * 30;
            if (item.damageHPTo) battleTime += 2000;
        }
        return battleTime;
    }

    return battleEvents;
}