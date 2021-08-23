const setting = require('./setting')

const _alertMessage = (message) => {
    console.log(`! ${message}`)
}
const _infoMessage = (message) => {
    console.log(`${message}`)
}

const _roleChanger = (creep, role) => {
    if (!(role in setting.roles))
        _alertMessage(
            `정의되지 않은 role로 변경을 시도했습니다.\nAllowed role: ${Object.keys(
                setting.roles
            )}\nTried role: ${creep.memory.role}, action: ${action}`
        )
    else if (creep.memory) creep.memory.role = role
    else _alertMessage(`\n크립의 메모리가 없습니다.\ncreep: ${JSON.stringify(creep)}`)
}

const _actionChanger = (creep, action) => {
    if (!setting.roles[creep.memory.role].actions.includes(action))
        _alertMessage(
            `정의되지 않은 action으로 변경을 시도했습니다.\nAllowed action: ${
                setting.roles[creep.memory.role].actions
            }\nTried role: ${creep.memory.role}, action: ${action}`
        )
    else if (creep.memory) creep.memory.action = action
    else _alertMessage(`\n크립의 메모리가 없습니다.\ncreep: ${JSON.stringify(creep)}`)
}

const _interval = (func, time) => {
    Game.time % time === 0 && func()
}

const _dashBoard = () => {
    _infoMessage('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
    _infoMessage('====================')
    for (let room in Memory.rooms) {
        _infoMessage(`${room} 현황\n${JSON.stringify(Memory.rooms[room].role)}`)
    }
    _infoMessage('====================')
    _infoMessage('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
}

const _findCloseSource = (creep) => {
    const sources = Object.values(Memory.rooms[creep.room.name].sources)
        .filter((source) => source._energy)
        .filter((source) => source.targets - source.availableHarvest < 0)
        .sort((a, b) => b.availableHarvest - b.targets - (a.availableHarvest - a.targets))
    if (sources.length) {
        _actionChanger(creep, 'harvest')
        creep.memory.target = sources[0].id
    } else {
        _actionChanger(creep, 'wait')
    }
}

const _findCloseStorage = (creep) => {
    const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {
        filter: (obj) => obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    })
    if (spawn) {
        creep.memory.target = spawn.id
        return spawn
    }
    const extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: (obj) =>
            obj.structureType === 'extension' && obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    })
    if (extension) {
        creep.memory.target = extension.id
        return extension
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
    _alertMessage: _alertMessage,
    _infoMessage: _infoMessage,
    _roleChanger: _roleChanger,
    _actionChanger: _actionChanger,
    _interval: _interval,
    _dashBoard: _dashBoard,
    _findCloseSource: _findCloseSource,
    _findCloseStorage: _findCloseStorage,
    _memoryUpdate: _memoryUpdate,
    _garbageCollecter: _garbageCollecter,
}
