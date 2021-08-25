const {
    _actionChanger,
    _actionChangeByCanHarvest,
    _interval,
    _findCloseStorage,
} = require('./utils')

const transfer = (creep, targetType) => {
    const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: (obj) =>
            targetType.includes(obj.structureType) &&
            obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    })
    if (target) {
        creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE && creep.moveTo(target)
        return true
    }
    return false
}
const workerActions = {
    harvest: (creep) => {
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'transfer')

        const cachedSource = creep.room
            .find(FIND_SOURCES)
            .find((source) => source.id === creep.memory.target)
        if (cachedSource != undefined) {
            if (creep.harvest(cachedSource) == ERR_NOT_IN_RANGE) creep.moveTo(cachedSource)
        } else _actionChangeByCanHarvest(creep)
    },
    transfer: (creep) => {
        creep.store[RESOURCE_ENERGY] === 0 && _actionChanger(creep, 'harvest')

        transfer(creep, ['container', 'storage']) ||
            transfer(creep, ['tower']) ||
            transfer(creep, ['extension', 'spawn']) ||
            _actionChanger(creep, 'wait')
    },
    wait: (creep) => {
        creep.moveTo(Game.flags.waitingFlag)
        _interval(() => {
            _findCloseStorage(creep) && _actionChanger(creep, 'transfer')
            _actionChangeByCanHarvest(creep)
        }, 10)
    },
}

module.exports = workerActions
