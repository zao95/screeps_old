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
    let message = ''
    message += '\n===================='
    for (let room in Memory.rooms) {
        message += `\n${room} 현황\n${JSON.stringify(Memory.rooms[room].role)}`
    }
    message += '\n====================\n'
    _infoMessage(message)
}

const _findCloseSource = (creep) => {
    const sources = Object.values(Memory.rooms[creep.room.name].sources)
        .filter((source) => source._energy)
        .filter((source) => source.targets - source.availableHarvest < 0)
        .sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))
    return sources
}

const _actionChangeByCanHarvest = (creep) => {
    const sources = _findCloseSource(creep)
    if (sources.length) {
        _actionChanger(creep, 'harvest')
        creep.memory.target = sources[0].id
    } else {
        _actionChanger(creep, 'wait')
    }
}

const _findCloseStorage = (creep, targetTypes) => {
    let minimumFreeCapacity = targetTypes.includes('tower') ? 500 : 0
    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (obj) =>
            targetTypes.includes(obj.structureType) &&
            obj.store.getFreeCapacity(RESOURCE_ENERGY) > minimumFreeCapacity,
    })
    return target
}

const _garbageCollecter = () => {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name]
        }
    }
}

const _makeBody = (energyCapacityAvailable, purpose) => {
    const body = []
    let pricing = 0
    let index = 0

    const bodyCost = {
        tough: 10,
        move: 50,
        work: 100,
        carry: 50,
        attack: 80,
        ranged_attack: 150,
        heal: 250,
    }

    const bodyByPurpose = {
        worker: ['move', 'work', 'carry'],
    }

    while (pricing <= energyCapacityAvailable && body.length < 50) {
        if (index === bodyByPurpose[purpose].length) index = 0
        pricing += bodyCost[bodyByPurpose[purpose][index]]
        body.push(bodyByPurpose[purpose][index++])
    }

    body.pop()
    return body
}

const _transfer = (creep, targetTypes) => {
    let target = _findCloseStorage(creep, targetTypes)
    if (target) {
        creep.memory.target = target.id
        creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE && creep.moveTo(target)
        return true
    }
    return false
}

module.exports = {
    _alertMessage: _alertMessage,
    _infoMessage: _infoMessage,
    _roleChanger: _roleChanger,
    _actionChanger: _actionChanger,
    _interval: _interval,
    _dashBoard: _dashBoard,
    _findCloseSource: _findCloseSource,
    _actionChangeByCanHarvest: _actionChangeByCanHarvest,
    _findCloseStorage: _findCloseStorage,
    _garbageCollecter: _garbageCollecter,
    _makeBody: _makeBody,
    _transfer: _transfer,
}
