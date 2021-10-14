const attack = (roomName, attackerCount = 5, waitingRoomName = null) => {
    // attacker
    const creepArray = []
    for (let i = 1; i <= attackerCount; i++) {
        creepArray.push(i)
    }
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
                    HEAL,
                    HEAL,
                    HEAL,
                    HEAL,
                    HEAL,
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
        if (Game.creeps[creepName]) {
            const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function (object) {
                    return object.hits < object.hitsMax
                },
            })
            if (target && creep.pos.inRangeTo(target, 1)) {
                if (creep.heal(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            } else {
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
                        if (waitingRoomName) {
                            creep.moveTo(new RoomPosition(25, 25, waitingRoomName))
                        } else {
                            creep.moveTo(new RoomPosition(25, 25, roomName))
                        }
                    }
                }
            }
        }
    }
}

module.exports = attack
