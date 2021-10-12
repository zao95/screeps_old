const attack = (roomName, waitingPosition = null) => {
    // attacker
    const creepArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    for (let index of creepArray) {
        for (let spawn of Object.values(Game.spawns)) {
            spawn.spawnCreep(
                [
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    TOUGH,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    MOVE,
                    ATTACK,
                    ATTACK,
                    ATTACK,
                    ATTACK,
                    ATTACK,
                ],
                `Attacker${index}`
            )
        }
    }
    for (let creepNumber of creepArray) {
        const creepName = `Attacker${creepNumber}`
        const creep = Game.creeps[creepName]
        if (waitingPosition) {
            creep.moveTo(waitingPosition)
        } else if (Game.creeps[creepName]) {
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            if (target) {
                creep.say('Yeah😆', { public: true })
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            } else {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES)
                if (target) {
                    creep.say('Yeah🧨', { public: true })
                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target)
                    }
                } else if (creep.pos.roomName != roomName) {
                    creep.say('Yeah🎈', { public: true })
                    creep.moveTo(new RoomPosition(25, 25, roomName))
                }
            }
        }
    }
}

module.exports = attack
