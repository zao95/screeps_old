const roleChanger = (creepMemory, role) => {
    const roleChangeFunc = {
        harvest: () => {
            creepMemory.role = 'harvest'
        },
        upgrade: () => {
            creepMemory.role = 'upgrade'
        },
        wait: () => {
            creepMemory.role = 'wait'
        },
    }
    roleChangeFunc[role]()
}
module.exports.roleChanger = roleChanger

const actionChanger = (creepMemory, action) => {
    const actionChangeFunc = {
        harvest: () => {
            creepMemory.action = 'harvest'
        },
        upgrade: () => {
            creepMemory.action = 'upgrade'
        },
        wait: () => {
            creepMemory.action = 'wait'
        },
    }
    actionChangeFunc[action]()
}
module.exports.actionChanger = actionChanger

module.exports.interval = (func, time) => {
    Game.time % time === 0 && func()
}

module.exports.findCloseSource = (creep) => {
    const sources = Object.values(Memory.rooms[creep.room.name].sources)
        .filter((source) => source._energy)
        .sort(
            (a, b) =>
                b.availableHarvest -
                b.targets -
                (a.availableHarvest - a.targets)
        )

    if (sources.length) {
        actionChanger(Memory.creeps[creep.name], 'harvest')
        Memory.creeps[creep.name].target = sources[0].id
    } else {
        actionChanger(Memory.creeps[creep.name], 'wait')
    }
    // 잔여 에너지가 있어야 함.
    // 주변에 캘 수 있는 자리가 있어야 함
    // 캘 수 있는 자리 - 현재 해당 자원을 타겟으로 하고 있는 크립의 수 가 클 수록 우선
}

module.exports.memoryUpdate = () => {
    for (let room of Object.values(Game.rooms)) {
        const sources = Game.rooms[room.name].find(FIND_SOURCES)

        if (Memory.rooms === undefined) Memory.rooms = {}
        if (Memory.rooms[room.name] === undefined) Memory.rooms[room.name] = {}
        if (Memory.rooms[room.name].sources === undefined)
            Memory.rooms[room.name].sources = {}

        for (let source of Object.values(sources)) {
            const availableHarvest = room
                .lookAtArea(
                    source.pos.y - 1,
                    source.pos.x - 1,
                    source.pos.y + 1,
                    source.pos.x + 1,
                    true
                )
                .filter(
                    (object) =>
                        object.type === 'terrain' && object.terrain != 'wall'
                ).length
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

module.exports.garbageCollecter = () => {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name]
        }
    }
}
