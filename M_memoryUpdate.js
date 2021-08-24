const setting = require('./setting')

const memoryUpdate = () => {
    if (Memory.rooms === undefined) Memory.rooms = {}

    for (let room of Object.values(Game.rooms)) {
        const sources = Game.rooms[room.name].find(FIND_SOURCES)

        if (Memory.rooms[room.name] === undefined) Memory.rooms[room.name] = {}
        if (Memory.rooms[room.name].role === undefined) Memory.rooms[room.name].role = {}
        if (Memory.rooms[room.name].sources === undefined) Memory.rooms[room.name].sources = {}

        // roles
        for (let { role } of Object.values(setting.roles)) {
            const count = Object.values(Game.creeps).filter(
                (creep) => creep.memory.role === role
            ).length
            Memory.rooms[room.name].role[role] = count
        }

        // sources
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
