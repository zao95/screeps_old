const {
    _actionChanger,
    _actionChangeByCanHarvest,
    _interval,
    _findCloseStorage,
    _transfer,
} = require('./utils')
const setting = require('./setting')

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

        const cachedTarget = creep.room
            .find(FIND_STRUCTURES)
            .find((structure) => structure.id === creep.memory.target)
        if (cachedTarget != undefined)
            if (creep.transfer(cachedTarget) == ERR_NOT_IN_RANGE) creep.moveTo(cachedTarget)

        _transfer(creep, ['container', 'storage']) ||
            _transfer(creep, ['tower']) ||
            _transfer(creep, ['extension', 'spawn']) ||
            _actionChanger(creep, 'wait')
    },
    wait: (creep) => {
        creep.moveTo(Game.flags.waitingFlag)
        _interval(() => {
            // _findCloseStorage(creep, ['container', 'storage']) ||
            _findCloseStorage(creep, ['container', 'storage', 'tower', 'extension', 'spawn']) ||
                _actionChanger(creep, 'transfer')
            _actionChangeByCanHarvest(creep)
        }, setting.waitCreepIntervalCalcTime)
    },
}

module.exports = workerActions
