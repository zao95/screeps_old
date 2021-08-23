const _roleChanger = (creep, role) => {
    const roleChangeFunc = {
        harvester: () => {
            creep.memory.role = 'harvester'
        },
        upgrader: () => {
            creep.memory.role = 'upgrader'
        },
        waiter: () => {
            creep.memory.role = 'waiter'
        },
    }
    roleChangeFunc[role]()
}
module.exports._roleChanger = _roleChanger

const _actionChanger = (creep, action) => {
    const actionChangeFunc = {
        harvest: () => {
            creep.memory.action = 'harvest'
        },
        upgrade: () => {
            creep.memory.action = 'upgrade'
        },
        wait: () => {
            creep.memory.action = 'wait'
        },
    }
    creep.memory && actionChangeFunc[action]()
}
module.exports._actionChanger = _actionChanger

module.exports._interval = (func, time) => {
    Game.time % time === 0 && func()
}

module.exports._findCloseSource = (creep) => {
    const sources = Object.values(Memory.rooms[creep.room.name].sources)
        .filter((source) => source._energy)
        .sort((a, b) => b.availableHarvest - b.targets - (a.availableHarvest - a.targets))
    if (sources.length) {
        _actionChanger(creep, 'harvest')
        creep.memory.target = sources[0].id
    } else {
        _actionChanger(creep, 'wait')
    }
}

module.exports._memoryUpdate = () => {
    for (let room of Object.values(Game.rooms)) {
        const sources = Game.rooms[room.name].find(FIND_SOURCES)

        if (Memory.rooms === undefined) Memory.rooms = {}
        if (Memory.rooms[room.name] === undefined) Memory.rooms[room.name] = {}
        if (Memory.rooms[room.name].sources === undefined) Memory.rooms[room.name].sources = {}

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
            const targets = Object.values(Memory.creeps).filter(
                (creep) => creep.target === source.id
            ).length

            Memory.rooms[room.name].sources[source.id] = {
                ...source,
                availableHarvest,
                targets,
            }
        }
    }
}

module.exports._garbageCollecter = () => {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name]
        }
    }
}
