const setting = require('./setting')

const memoryUpdate = () => {
    if (Memory.rooms === undefined) Memory.rooms = {}

    for (let room of Object.values(Game.rooms)) {
        if (!room.energyCapacityAvailable) continue

        const sources = Game.rooms[room.name].find(FIND_SOURCES)

        if (Memory.rooms[room.name] === undefined) Memory.rooms[room.name] = {}
        if (Memory.rooms[room.name].role === undefined) Memory.rooms[room.name].role = {}
        if (Memory.rooms[room.name].sources === undefined) Memory.rooms[room.name].sources = {}

        // Renew waiting
        Memory.rooms[room.name].renewWaiting = Object.values(Game.creeps).filter(
            (creep) => creep.memory.action === 'renew'
        ).length

        // Roles
        for (let { role } of Object.values(setting.roles)) {
            const count = Object.values(Game.creeps).filter(
                (creep) => creep.memory.role === role && creep.pos.roomName === room.name
            ).length
            Memory.rooms[room.name].role[role] = count
        }

        // Remember creep's Room
        for (let creep of Object.values(Game.creeps)) {
            creep.memory.room = creep.room.name
        }

        // Sources
        for (let source of Object.values(sources)) {
            const availableHarvest = room
                .lookAtArea(
                    source.pos.y - 1,
                    source.pos.x - 1,
                    source.pos.y + 1,
                    source.pos.x + 1,
                    true
                )
                .filter((object) => object.type === 'terrain' && object.terrain != 'wall').length
            const targets = Memory.creeps
                ? Object.values(Memory.creeps).filter((creep) => creep.target === source.id).length
                : 0

            Memory.rooms[room.name].sources[source.id] = {
                ...source,
                availableHarvest,
                targets,
            }
        }
    }
}

module.exports = memoryUpdate
