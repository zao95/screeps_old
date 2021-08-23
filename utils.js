const { setting } = require('./setting')

const alertMessage = (message) => {
    console.log(`! ${message}`)
}
const _roleChanger = (creep, role) => {
    if (!(role in setting.roles))
        alertMessage(
            `정의되지 않은 role로 변경을 시도했습니다.\nAllowed role: ${Object.keys(
                setting.roles
            )}\nTried role: ${role}`
        )
    else if (creep.memory) creep.memory.role = role
    else alertMessage(`\n크립의 메모리가 없습니다.\ncreep: ${JSON.stringify(creep)}`)
}

const _actionChanger = (creep, action) => {
    if (!setting.roles[creep.memory.role].actions.includes(action))
        alertMessage(
            `정의되지 않은 action으로 변경을 시도했습니다.\nAllowed action: ${
                setting.roles[creep.memory.role].actions
            }\nTried action: ${action}`
        )
    else if (creep.memory) creep.memory.action = action
    else alertMessage(`\n크립의 메모리가 없습니다.\ncreep: ${JSON.stringify(creep)}`)
}

const _interval = (func, time) => {
    Game.time % time === 0 && func()
}

const _findCloseSource = (creep) => {
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

const _memoryUpdate = () => {
    if (Memory.rooms === undefined) Memory.rooms = {}

    for (let room of Object.values(Game.rooms)) {
        const sources = Game.rooms[room.name].find(FIND_SOURCES)

        if (Memory.rooms[room.name] === undefined) Memory.rooms[room.name] = {}
        if (Memory.rooms[room.name].role === undefined) Memory.rooms[room.name].role = {}
        if (Memory.rooms[room.name].sources === undefined) Memory.rooms[room.name].sources = {}

        // roles
        for (let role of Object.values(setting.roles)) {
            Memory.rooms[room.name].role[role] = Object.values(Game.creeps).filter(
                (creep) => creep.memory.role === role
            ).length
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

const _garbageCollecter = () => {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name]
        }
    }
}

module.exports = {
    _roleChanger: _roleChanger,
    _actionChanger: _actionChanger,
    _interval: _interval,
    _findCloseSource: _findCloseSource,
    _memoryUpdate: _memoryUpdate,
    _garbageCollecter: _garbageCollecter,
}
