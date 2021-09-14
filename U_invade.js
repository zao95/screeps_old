const invade = (roomName) => {
    // Claimer
    if (!Game.rooms[roomName] || !Game.rooms[roomName].controller.my) {
        Game.spawns.Spawn1.spawnCreep([CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE], 'Claimer1')
        if (Game.creeps.Claimer1.room.name === roomName) {
            if (Game.creeps.Claimer1.room.controller) {
                if (
                    Game.creeps.Claimer1.claimController(Game.creeps.Claimer1.room.controller) ==
                    ERR_NOT_IN_RANGE
                ) {
                    Game.creeps.Claimer1.moveTo(Game.creeps.Claimer1.room.controller)
                }
            }
        } else {
            Game.creeps.Claimer1.moveTo(new RoomPosition(25, 25, roomName))
        }
    } else {
        Game.creeps.Claimer1 && Game.creeps.Claimer1.suicide()
    }

    // temp builder
    if (!Memory.rooms[roomName] || !Game.rooms[roomName].energyCapacityAvailable) {
        for (let index of [1, 2, 3, 4, 5]) {
            for (let spawn of Object.values(Game.spawns)) {
                spawn.spawnCreep(
                    [
                        MOVE,
                        MOVE,
                        MOVE,
                        WORK,
                        CARRY,
                        CARRY,
                        MOVE,
                        MOVE,
                        MOVE,
                        WORK,
                        CARRY,
                        CARRY,
                        MOVE,
                        MOVE,
                        MOVE,
                        WORK,
                        CARRY,
                        CARRY,
                    ],
                    `InvadeBuilder${index}`
                )
            }
        }
        for (let creepName of [
            'InvadeBuilder1',
            'InvadeBuilder2',
            'InvadeBuilder3',
            'InvadeBuilder4',
            'InvadeBuilder5',
        ]) {
            const creep = Game.creeps[creepName]
            if (Game.creeps[creepName]) {
                if (creep.pos.roomName != roomName) {
                    creep.moveTo(new RoomPosition(25, 25, roomName))
                } else {
                    if (creep.memory.action === 'harvest') {
                        if (!creep.store.getFreeCapacity(RESOURCE_ENERGY))
                            creep.memory.action = 'build'
                        else {
                            const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
                            if (target) {
                                if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target)
                                }
                            }
                        }
                    } else if (creep.memory.action === 'build') {
                        if (!creep.store.getUsedCapacity(RESOURCE_ENERGY))
                            creep.memory.action = 'harvest'
                        else {
                            const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
                            if (target) {
                                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target)
                                }
                            }
                        }
                    } else {
                        creep.memory.action = 'harvest'
                    }
                }
            }
        }
    } else {
        for (let creepName of [
            'InvadeBuilder1',
            'InvadeBuilder2',
            'InvadeBuilder3',
            'InvadeBuilder4',
            'InvadeBuilder5',
        ]) {
            const creep = Game.creeps[creepName]
            creep && creep.suicide()
        }
    }
}

module.exports = invade
