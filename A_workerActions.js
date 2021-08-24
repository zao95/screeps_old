const { _actionChanger, _findCloseSource, _interval, _findCloseStorage } = require('./utils')

const workerActions = {
    harvest: (creep) => {
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'transfer')

        const source = creep.room
            .find(FIND_SOURCES)
            .find((source) => source.id === creep.memory.target)
        if (source === undefined) {
            _findCloseSource(creep)
        } else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    },
    transfer: (creep) => {
        creep.store[RESOURCE_ENERGY] === 0 && _actionChanger(creep, 'harvest')

        const target = _findCloseStorage(creep)
        if (target)
            creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE && creep.moveTo(target)
        else _actionChanger(creep, 'wait')
    },
    wait: (creep) => {
        creep.moveTo(Game.flags.waitingFlag)
        _interval(() => {
            _findCloseStorage(creep) && _actionChanger(creep, 'transfer')
            _findCloseSource(creep)
        }, 10)
    },
}

module.exports = workerActions
