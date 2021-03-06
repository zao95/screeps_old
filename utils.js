const setting = require('./setting')

const _doNotAnything = () => true

const _alertMessage = (message) => {
    console.log(`!! Error λ°μ\n${message}`)
}
const _infoMessage = (message) => {
    console.log(`${message}`)
}

const emoji = (string) => {
    let newString = string
    if (string === 'harvest') newString += 'β'
    else if (string === 'repair') newString += 'π§'
    else if (string === 'upgrade') newString += 'β'
    else if (string === 'transfer') newString += 'π'
    else if (string === 'wait') newString += 'π€'
    else if (string === 'worker') newString += 'β'
    else if (string === 'upgrader') newString += 'π'
    else if (string === 'builder') newString += 'β'
    return newString
}

const _roleChanger = (creep, role) => {
    if (creep.memory.role === role) return false
    else if (!(role in setting.roles)) {
        _alertMessage(
            `μ μλμ§ μμ roleλ‘ λ³κ²½μ μλνμ΅λλ€.\nAllowed role: ${Object.keys(
                setting.roles
            )}\nTried role: ${creep.memory.role}, action: ${action}`
        )
        return false
    } else if (creep.memory) {
        creep.memory.role = role
        creep.say(`${emoji(role)}`, true)
        return true
    }
    _alertMessage(`\nν¬λ¦½μ λ©λͺ¨λ¦¬κ° μμ΅λλ€.\ncreep: ${JSON.stringify(creep)}`)
    return false
}

const _actionChanger = (creep, action) => {
    if (creep.memory.action === action) return false
    else if (!setting.roles[creep.memory.role].actions.includes(action)) {
        _alertMessage(
            `μ μλμ§ μμ actionμΌλ‘ λ³κ²½μ μλνμ΅λλ€.\nAllowed action: ${
                setting.roles[creep.memory.role].actions
            }\nTried role: ${creep.memory.role}, action: ${action}`
        )
        return false
    } else if (creep.memory) {
        creep.memory.action = action
        creep.say(`${emoji(action)}`, true)
        return true
    }
    _alertMessage(`\nν¬λ¦½μ λ©λͺ¨λ¦¬κ° μμ΅λλ€.\ncreep: ${JSON.stringify(creep)}`)
    return false
}

const _interval = (func, time, arguments = []) => {
    Game.time % time === 0 && func(...arguments)
}

const _maxWorkerCreeps = (room) => {
    const sources = Memory.rooms[room.name].sources
    const availableHarvest = Object.values(sources).reduce(
        (prev, curr) => prev + curr.availableHarvest,
        0
    )
    const maxWorkerCreeps = Math.max(
        room.energyCapacityAvailable > 1200
            ? Math.ceil(
                  (availableHarvest + 2) *
                      (room.energyCapacityAvailable / room.energyCapacityAvailable ** 1.15)
              )
            : 20,
        room.find(FIND_SOURCES).length * 2
    )
    return maxWorkerCreeps
}

const _dashBoard = () => {
    let message = ''
    message += '===================='
    for (let room in Memory.rooms) {
        if (!Memory.rooms[room].own) continue
        message += `\n[${room} νν©]`
        message += `\nEnergy: \t${Game.rooms[room].energyAvailable} / ${Game.rooms[room].energyCapacityAvailable}`
        message += `\nWorkers: \t${Memory.rooms[room].workerCount} / ${Memory.rooms[room].workerMaxCount}`
        message += `\nRole λ°°λΆ: \t${JSON.stringify(Memory.rooms[room].role)}`
    }
    message += '\n====================\n'
    _infoMessage(message)
}

const _findCloseSource = (creep) => {
    const sources = Object.values(Memory.rooms[creep.room.name].sources)
        .filter((source) => source._energy)
        .filter((source) => source.targets - source.availableHarvest < 0)
        .sort((a, b) => {
            if (a._energy === 3000) return -1
            else if (b._energy === 3000) return 1
            else b._energy - a._energy
        })
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
    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) =>
            targetTypes.includes(structure.structureType) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) >
                setting.minimumFreeCapacity[structure.structureType],
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
    _doNotAnything: _doNotAnything,
    _alertMessage: _alertMessage,
    _infoMessage: _infoMessage,
    _roleChanger: _roleChanger,
    _actionChanger: _actionChanger,
    _interval: _interval,
    _maxWorkerCreeps: _maxWorkerCreeps,
    _dashBoard: _dashBoard,
    _findCloseSource: _findCloseSource,
    _actionChangeByCanHarvest: _actionChangeByCanHarvest,
    _findCloseStorage: _findCloseStorage,
    _garbageCollecter: _garbageCollecter,
    _makeBody: _makeBody,
    _transfer: _transfer,
}
