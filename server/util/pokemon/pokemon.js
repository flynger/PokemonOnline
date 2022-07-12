(function () {
    const pokedex = require('../../util/pokemon/pokedex');
    const jsonfile = require('../../libs/node_modules/jsonfile');

    var pokemon = module.exports;

    var stageMultipliers = {
        base: [1 / 4, 2 / 7, 1 / 3, 2 / 5, 1 / 2, 2 / 3, 1, 3 / 2, 2, 5 / 2, 3, 7 / 2, 4],
        accuracy: [1 / 3, 3 / 8, 3 / 7, 1 / 2, 3 / 5, 3 / 4, 1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3],
        crit: [1, 1 / 3, 1 / 12, 1 / 24]
    }
    stageMultipliers.atk, stageMultipliers.def, stageMultipliers.spa, stageMultipliers.spd, stageMultipliers.spe = stageMultipliers.base;
    stageMultipliers.evasion = stageMultipliers.accuracy;

    pokemon.stats = {
        atk: "Attack",
        def: "Defense",
        spa: "Sp. Atk",
        spd: "Sp. Defense",
        spe: "Speed",
        evasion: "evasiveness",
        accuracy: "accuracy",
        crit: "critical-hit ratio"
    }

    pokemon.types = {
        NORMAL: {
            weakTo: ["FIGHTING"],
            resists: [],
            immuneTo: ["GHOST"]
        },
        FIRE: {
            weakTo: ["WATER", "GROUND", "ROCK"],
            resists: ["FIRE", "GRASS", "ICE", "BUG", "STEEL", "FAIRY"],
            immuneTo: []
        },
        WATER: {
            weakTo: ["GRASS", "ELECTRIC"],
            resists: ["FIRE", "WATER", "ICE", "STEEL"],
            immuneTo: []
        },
        ELECTRIC: {
            weakTo: ["GROUND"],
            resists: ["ELECTRIC", "FLYING", "STEEL"],
            immuneTo: []
        },
        GRASS: {
            weakTo: ["FIRE", "ICE", "POISON", "FLYING", "BUG"],
            resists: ["ELECTRIC", "WATER", "GRASS", "GROUND"],
            immuneTo: []
        },
        ICE: {
            weakTo: ["FIRE", "FIGHTING", "ROCK", "STEEL"],
            resists: ["ICE"],
            immuneTo: []
        },
        FIGHTING: {
            weakTo: ["FLYING", "PSYCHIC", "FAIRY"],
            resists: ["BUG", "ROCK", "DARK"],
            immuneTo: []
        },
        POISON: {
            weakTo: ["GROUND", "PSYCHIC"],
            resists: ["GRASS", "FIGHTING", "POISON", "BUG", "FAIRY"],
            immuneTo: []
        },
        GROUND: {
            weakTo: ["WATER", "GRASS", "ICE"],
            resists: ["POISON", "ROCK"],
            immuneTo: ["ELECTRIC"]
        },
        FLYING: {
            weakTo: ["ELECTRIC", "ICE", "ROCK"],
            resists: ["GRASS", "FIGHTING", "BUG"],
            immuneTo: ["GROUND"]
        },
        PSYCHIC: {
            weakTo: ["BUG", "GHOST", "DARK"],
            resists: ["FIGHTING", "PSYCHIC"],
            immuneTo: []
        },
        BUG: {
            weakTo: ["FIRE", "FLYING", "ROCK"],
            resists: ["GRASS", "FIGHTING", "GROUND"],
            immuneTo: []
        },
        ROCK: {
            weakTo: ["WATER", "GRASS", "FIGHTING", "GROUND", "STEEL"],
            resists: ["NORMAL", "FIRE", "POISON", "FLYING"],
            immuneTo: []
        },
        GHOST: {
            weakTo: ["GHOST", "DARK"],
            resists: ["POISON", "BUG"],
            immuneTo: ["NORMAL", "FIGHTING"]
        },
        DRAGON: {
            weakTo: ["ICE", "DRAGON", "FAIRY"],
            resists: ["FIRE", "WATER", "ELECTRIC", "GRASS"],
            immuneTo: []
        },
        DARK: {
            weakTo: ["FIGHTING", "BUG", "FAIRY"],
            resists: ["GHOST", "DARK"],
            immuneTo: ["PSYCHIC"]
        },
        STEEL: {
            weakTo: ["NORMAL", "GRASS", "ICE", "FLYING", "PSYCHIC", "BUG", "ROCK", "DRAGON", "STEEL", "FAIRY"],
            resists: ["FIRE", "WATER", "ELECTRIC", "GRASS"],
            immuneTo: ["POISON"]
        },
        FAIRY: {
            weakTo: ["POISON", "STEEL"],
            resists: ["FIGHTING", "BUG", "DARK"],
            immuneTo: ["DRAGON"]
        }
    }

    pokemon.natures = {
        ADAMANT: {
            effects: {
                atk: 1.1,
                spa: 0.9
            },
            likes: ["SPICY"],
            dislikes: ["DRY"]
        },
        ANCIENT: {
            effects: {
                atk: 1.05,
                def: 1.05,
                spa: 1.05,
                spd: 1.05,
                spe: 1.05
            },
            likes: [],
            dislikes: []
        },
        BASHFUL: {
            effects: {},
            likes: [],
            dislikes: []
        },
        BOLD: {
            effects: {
                atk: 0.9,
                def: 1.1
            },
            likes: ["SOUR"],
            dislikes: ["SPICY"]
        }
    }

    pokemon.moves = jsonfile.readFileSync('./data/pokedex/moves.json');
    pokemon.abilities = jsonfile.readFileSync('./data/pokedex/abilities.json');
    pokemon.growthRates = jsonfile.readFileSync('./data/pokedex/growthRates.json');
    pokemon.calculateStat = function (pkmn, stat) {
        var baseStat = pokedex[pkmn.species].baseStats[stat];
        var iv = pkmn.ivs[stat];
        var ev = pkmn.evs[stat];
        var level = pkmn.level;
        var natureBonus = 1;
        if (stat == "hp") {
            return Math.floor((2 * baseStat + iv + Math.floor(ev / 4)) * level / 100) + level + 10;
        } else {
            return Math.floor((Math.floor((2 * baseStat + iv + Math.floor(ev / 4)) * level / 100) + 5) * natureBonus);
        }
    }
    pokemon.getAbility = function (pokemon) {
        if (!pokedex[pokemon.species].abilities[pokemon.ability])
            return pokedex[pokemon.species].abilities["0"]
        return pokedex[pokemon.species].abilities[pokemon.ability];
    }
    pokemon.getXP = function (species, level) {
        return pokemon.growthRates[pokedex[species].growthRate][level];
    }
    pokemon.getRawXP = function (species, level) {
        var growthRate = pokedex[species].growthRate;
        if (growthRate == "Erratic") {
            if (level <= 50) {
                return Math.pow(level, 3) * (100 - level) / 50;
            } else if (level <= 68) {
                return Math.pow(level, 3) * (150 - level) / 100;
            } else if (level <= 98) {
                return Math.pow(level, 3) * Math.floor((1911 - 10 * level) / 3) / 500;
            } else {
                return Math.pow(level, 3) * (160 - level) / 100;
            }
        } else if (growthRate == "Fast") {
            return (Math.pow(level, 3) * 4) / 5;
        } else if (growthRate == "Medium") {
            return Math.pow(level, 3);
        } else if (growthRate == "Parabolic") {
            return (6 / 5 * Math.pow(level, 3)) - (15 * Math.pow(level, 2)) + (100 * level) - 140;
        } else if (growthRate == "Slow") {
            return (5 * Math.pow(level, 3)) / 4;
        } else if (growthRate == "Fluctuating") {
            if (level <= 15) {
                return Math.pow(level, 3) * ((Math.floor((level + 1) / 3) + 24) / 50);
            } else if (level <= 36) {
                return Math.pow(level, 3) * ((level + 14) / 50);
            } else {
                return Math.pow(level, 3) * ((Math.floor(level / 2) + 32) / 50);
            }
        }
    }
    pokemon.getXPGain = function (attacker, defender) {
        var tradedBonus = 1;
        var luckyEggBonus = 1;
        var exp1 = Math.floor((1 * pokedex[defender.species].experienceYield * defender.level) / (5 * 1));
        var exp2 = Math.floor(exp1 * Math.pow(2 * defender.level + 10, 2.5));
        var exp3 = Math.floor(exp2 / Math.pow(defender.level + attacker.level + 10, 2.5));
        var experience = Math.floor(Math.floor((exp3 + 1) * 1) * 1);
        return experience;
    }
    pokemon.getMove = function (moveName) {
        return moves[moveName];
    }
    pokemon.learnMove = function (mon) {
        return pokedex[mon.species].learnset.levelup[mon.level];
    }
    pokemon.addMoveToMoves = function (mon, moveToLearn, moveToReplace) {
        if (moveToReplace) mon.moves[mon.moves.indexOf(moveToReplace)] = moveToLearn;
        else mon.moves.push(moveToLearn);
        mon.learnMoves.splice(mon.learnMoves.indexOf(data.moveToLearn), 1);
    }
    pokemon.canEvolve = function (species, method, criteria) {
        if (pokedex[species].Evolutions && pokedex[species].Evolutions[method])
            return pokedex[species].Evolutions[method][criteria];
        else
            return false;
    }
    pokemon.createStats = function (hp, atk, def, spa, spd, spe) {
        return {
            hp: hp,
            atk: atk,
            def: def,
            spa: spa,
            spd: spd,
            spe: spe
        };
    }
    pokemon.getRandomAbility = function () {
        var ability = "" + randomNumber(0, 1);
        if (randomNumber(1, 64) == 1) {
            return "H";
        }
        return ability;
    }
    pokemon.getRandomGender = function (species) {
        if (pokedex[species].gender) return pokedex[species].gender;
        if ((pokedex[species].genderRatio && Math.random() < pokedex[species].genderRatio.M) || (!pokedex[species].genderRatio && Math.random() < 0.5)) {
            return "M";
        }
        return "F";
    }
    pokemon.createPokemon = function (species, level, ivs=pokemon.createStats(randomNumber(0, 31), randomNumber(0, 31), randomNumber(0, 31), randomNumber(0, 31), randomNumber(0, 31), randomNumber(0, 31)), shinylocked=false, owner) {
        //if (!ivs) ivs = ;
        //if (!shinylocked) shinylocked = false;
        var mon = {
            species: species,
            name: pokedex[species].name,
            gender: pokemon.getRandomGender(species),
            shiny: false,
            level: level,
            ability: pokemon.getRandomAbility(),
            ivs: ivs,
            evs: pokemon.createStats(0, 0, 0, 0, 0, 0),
        };
        mon.stats = {
            hp: pokemon.calculateStat(mon, "hp"),
            atk: pokemon.calculateStat(mon, "atk"),
            def: pokemon.calculateStat(mon, "def"),
            spa: pokemon.calculateStat(mon, "spa"),
            spd: pokemon.calculateStat(mon, "spd"),
            spe: pokemon.calculateStat(mon, "spe")
        };

        mon.hp = mon.stats.hp;
        if (owner) {
            mon.friendship = 0;
            mon.originalTrainer = owner;
            mon.xp = pokemon.getXP(species, level);
        }
        // shiny check
        if (!shinylocked && randomNumber(1, 8192) == 1) {
            mon.shiny = true;
        }
        // generate moves
        var possibleMoves = [];
        for (move in pokedex[mon.species].learnset.levelup) {
            if (parseInt(move) <= mon.level)
                possibleMoves.push(pokedex[mon.species].learnset.levelup[move]);
            else break;
        }
        while (possibleMoves.length > 4) {
            possibleMoves.splice(randomNumber(0, possibleMoves.length - 1), 1);
        }
        shuffleArray(possibleMoves);
        mon.moves = possibleMoves;
        return mon;
    }
    pokemon.getStageMultiplier = function (type, stage) {
        if (type != "crit") {
            stage += 6;
        }
        return stageMultipliers[type][stage];
    }

    // local functions
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomDigits(min, max) {
        return Math.random() * (max - min) + min;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

}())