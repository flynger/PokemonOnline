module.exports = (game) => {
    var battleHandler = {
        createWildBattle: (player, wildEncounter) => {
            player.activePokemon = 0;
            player.busy = true;
            player.allowInput = true;
            player.inBattle = "wild";
            player.pokemon.party[player.activePokemon].stages = {
                atk: 0,
                def: 0,
                spa: 0,
                spd: 0,
                spe: 0,
                accuracy: 0,
                evasion: 0,
                crit: 0
            };
            player.pokemon.party[player.activePokemon].flags = {};
            wildEncounter.stages = {
                atk: 0,
                def: 0,
                spa: 0,
                spd: 0,
                spe: 0,
                accuracy: 0,
                evasion: 0,
                crit: 0
            };
            wildEncounter.flags = {};
        },
        endBattle: (player) => {
            for (pokemon of player.pokemon.party) {
                if (pokemon.stages) {
                    delete pokemon.stages;
                }
                if (pokemon.flags) {
                    delete pokemon.flags;
                }
                pokemon.hp = pokemon.stats.hp;
            }
            delete player.activePokemon;
            player.busy = false;
            player.allowInput = false;
            player.inBattle = false;
        },
        useMove: (attacker, defender, moveId) => {
            var battleMessages = [];
            var pokemon = game.pokemon;
            var pokedex = game.pokedex;
            var moveName = attacker.moves[moveId];
            var move = pokemon.moves[moveName];
            var userAtk;
            var opponentDef;
            var attackerAbility = pokemon.getAbility(attacker);
            var defenderAbility = pokemon.getAbility(defender);
            battleMessages.push({
                message: attacker.name + " used " + move.name + "!"
            });
            if (move.category == "SPECIAL") {
                //console.log("SPECIAL move activated!");
                userAtk = attacker.stats.spa * pokemon.getStageMultiplier("spa", attacker.stages.spa);
                opponentDef = defender.stats.spd * pokemon.getStageMultiplier("spd", defender.stages.spd);
            } else if (move.category == "PHYSICAL") {
                //console.log("PHYSICAL move activated!");
                userAtk = attacker.stats.atk * pokemon.getStageMultiplier("atk", attacker.stages.atk);
                opponentDef = defender.stats.def * pokemon.getStageMultiplier("def", defender.stages.def);
            } else {
                //console.log("STATUS move activated - no damage!");
            }
            var trueAccuracy;
            if (typeof move.accuracy == "number") trueAccuracy = move.accuracy * pokemon.getStageMultiplier("evasion", defender.stages.evasion) * pokemon.getStageMultiplier("accuracy", attacker.stages.accuracy);
            if (typeof move.accuracy == "number" && randomDigits(0, 100) > trueAccuracy) {
                battleMessages.push({
                    message: attacker.name + "'s attack missed!"
                });
                //console.log("Move missed!");
                return battleMessages;
            } else if (move.category == "STATUS") {
                if (move.boosts) {
                    var targets = [];
                    if (move.target == "SELF" || move.target == "ALLYSIDE") {
                        targets.push(attacker);
                    } else if (move.target == "ALL") {
                        targets.push(attacker);
                        targets.push(defender);
                    } else {
                        targets.push(defender);
                    }
                    for (target of targets) {
                        if (move.boosts) {
                            for (boost in move.boosts) {
                                var boostAmount = move.boosts[boost];
                                if (boost == "crit" && move.id == "FOCUSENERGY") {
                                    if (target.flags.FOCUSENERGY || target.stages.crit >= 6) {
                                        battleMessages.push({
                                            message: "But it failed!"
                                        });
                                        continue;
                                    } else {
                                        target.flags.FOCUSENERGY = true;
                                        target.stages.crit += 2;
                                        if (target.stages.crit > 6) target.stages.crit = 6;
                                        battleMessages.push({
                                            message: target.name + " is getting pumped!"
                                        });
                                    }
                                }
                                else if (target.stages[boost] < 6 && target.stages[boost] > -6) {
                                    var statText = target.name + "'s " + pokemon.stats[boost];
                                    target.stages[boost] += boostAmount;
                                    if (boostAmount == 1) {
                                        statText += " rose!";
                                    } else if (boostAmount == 2) {
                                        statText += " sharply rose!";
                                    } else if (boostAmount >= 3) {
                                        statText += " rose drastically!";
                                    } else if (boostAmount == -1) {
                                        statText += " fell!";
                                    } else if (boostAmount == -2) {
                                        statText += " harshly fell!";
                                    } else if (boostAmount <= -3) {
                                        statText += " severely fell!";
                                    }
                                    if (target.stages[boost] > 6) {
                                        target.stages[boost] = 6;
                                    } else if (target.stages[boost] < -6) {
                                        target.stages[boost] = -6;
                                    }
                                    battleMessages.push({
                                        message: statText
                                    });
                                } else if (boostAmount > 0) {
                                    battleMessages.push({
                                        message: target.name + "'s " + pokemon.stats[boost] + " won't go higher!"
                                    });
                                } else {
                                    battleMessages.push({
                                        message: target.name + "'s " + pokemon.stats[boost] + " won't go lower!"
                                    });
                                }
                            }
                        } else {
                            battleMessages.push({
                                message: "This status move has not been implemented yet!"
                            });
                        }
                    }
                }
                //console.log("Status move!");
                return battleMessages;
            } else {
                battleMessages.push({
                    damageHPTo: defender.hp / defender.stats.hp
                });
                var damage = Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5) + 2) * move.basePower * userAtk / opponentDef) / 50) + 2;
                // critical
                if (defenderAbility != "BATTLEARMOR" && defenderAbility != "SHELLARMOR" && (randomNumber(1, 24 * pokemon.getStageMultiplier("crit", attacker.stages.crit)) == 1 || (attackerAbility == "MERCILESS" && defender.status == "PSN"))) {
                    if (move.category == "SPECIAL") {
                        if (attacker.stages.spa < 0)
                            userAtk = attacker.stats.spa;
                        if (defender.stages.spd > 0)
                            opponentDef = defender.stats.spd;
                    }
                    else if (move.category == "PHYSICAL") {
                        if (attacker.stages.atk < 0)
                            userAtk = attacker.stats.atk;
                        if (defender.stages.def > 0)
                            opponentDef = defender.stats.def;
                    }
                    damage = Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5) + 2) * move.basePower * userAtk / opponentDef) / 50) + 2;
                    battleMessages.push({
                        message: "A critical hit!"
                    });
                    //console.log("CRITCAL HIT STAGE " + attacker.stages.crit + " ACTIVATED!");
                    damage = Math.floor(damage * 1.5);
                    if (attackerAbility == "SNIPER") damage = Math.floor(damage * 1.5);
                }
                // random
                damage = Math.floor(damage * (randomNumber(85, 100) / 100));
                // STAB
                if (pokedex[attacker.species].types.includes(move.type)) {
                    if (attackerAbility == "ADAPTABILITY") {
                        //console.log("ADAPTABILITY STAB activated!");
                        damage = Math.floor(damage * 2);
                    } else {
                        //console.log("STAB activated!");
                        damage = Math.floor(damage * 1.5);
                    }
                }
                // type
                var typeEffectiveness = 1;
                for (type of pokedex[defender.species].types) {
                    if (pokemon.types[type].weakTo.includes(move.type)) {
                        typeEffectiveness *= 2;
                    } else if (pokemon.types[type].resists.includes(move.type)) {
                        typeEffectiveness *= 0.5;
                    } else if (pokemon.types[type].immuneTo.includes(move.type)) {
                        battleMessages.push({
                            message: "It doesn't affect " + defender.name + "..."
                        });
                        typeEffectiveness *= 0;
                        break;
                    }
                }

                if (typeEffectiveness > 1) {
                    battleMessages.push({
                        message: "It's super effective!"
                    });
                } else if (typeEffectiveness > 0 && typeEffectiveness < 1) {
                    battleMessages.push({
                        message: "It's not very effective..."
                    });
                }

                if (typeEffectiveness)
                    //console.log(typeEffectiveness + "x effectiveness!");
                    damage = Math.floor(damage * typeEffectiveness);
                // burn
                if (attacker.status == "BRN" && move.category == "PHYSICAL" && pokemon.getAbility(attacker) != "GUTS" && move.id != "FACADE") {
                    console.log("BURN damage reduction activated!");
                    damage = Math.floor(damage * 0.5);
                }
                if (damage <= 0) damage = 1;
                defender.hp -= damage;
                //if (defender.hp < 0) defender.hp = 0;
                battleMessages[1].damageHPTo = defender.hp / defender.stats.hp;
                if (checkForFainted(attacker, defender, battleMessages)) {
                    console.log(battleMessages);
                    return battleMessages;
                }
                // if (defender.hp == 0) {
                //     battleMessages.push({
                //         message: defender.name + " fainted!",
                //     });
                //     battleMessages.defenderFainted = true;
                // }
            }
            console.log(battleMessages);
            return battleMessages;
        },

        awardXP: (winner, loser, battleMessages) => {
            var pokemon = game.pokemon;
            var xpGain = pokemon.getXPGain(winner, loser);
            winner.xp += xpGain;
            battleMessages.push({
                message: winner.name + " gained " + xpGain + " Exp. Points!"
            });
            battleMessages.push({
                gainXPTo: (winner.xp - pokemon.getXP(winner.species, winner.level)) / (pokemon.getXP(winner.species, winner.level + 1) - pokemon.getXP(winner.species, winner.level))
            });
            while (winner.level < 100 && winner.xp >= pokemon.getXP(winner.species, winner.level + 1)) {
                winner.level++;
                if (pokemon.learnMove(winner)) {
                    if (!winner.learnMoves) winner.learnMoves = [];
                    winner.learnMoves.push(pokemon.learnMove(winner));
                    //console.log(winner.parent.parent.parent);
                }
                if (pokemon.canEvolve(winner.species, "Level", winner.level)) {
                    winner.canEvolve = true;
                    //console.log(winner.parent.parent.parent);
                }

                winner.stats = {
                    hp: pokemon.calculateStat(winner, "hp"),
                    atk: pokemon.calculateStat(winner, "atk"),
                    def: pokemon.calculateStat(winner, "def"),
                    spa: pokemon.calculateStat(winner, "spa"),
                    spd: pokemon.calculateStat(winner, "spd"),
                    spe: pokemon.calculateStat(winner, "spe")
                };
                battleMessages.push({
                    message: winner.name + " grew to Lv. " + winner.level + "!",
                    resetXP: true
                });
                battleMessages.push({
                    gainXPTo: (winner.xp - pokemon.getXP(winner.species, winner.level)) / (pokemon.getXP(winner.species, winner.level + 1) - pokemon.getXP(winner.species, winner.level))
                });
            }
        }
    }

    // local functions
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomDigits(min, max) {
        return Math.random() * (max - min) + min;
    }

    function checkForFainted(attacker, defender, battleMessages) {
        if (defender.hp <= 0) {
            defender.hp = 0;
            defender.fainted = true;
            battleMessages.push({
                message: defender.name + " fainted!",
            });
            return true;
        }
        if (attacker.hp <= 0) {
            attacker.hp = 0;
            attacker.fainted = true;
            battleMessages.push({
                message: attacker.name + " fainted!",
            });
            return true;
        }
        return false;
    }
    return game.battleHandler = battleHandler;
}