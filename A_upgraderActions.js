const { _interval, _findCloseSource, _actionChanger } = require('./utils')

const upgraderActions = {
    harvest: (creep) => {
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'upgrade')

        const source = creep.room
            .find(FIND_SOURCES)
            .find((source) => source.id === creep.memory.target)
        if (source === undefined) _findCloseSource(creep)
        else if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source)
    },
    upgrade: (creep) => {
        creep.store[RESOURCE_ENERGY] === 0 && _actionChanger(creep, 'harvest')

        creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE &&
            creep.moveTo(creep.room.controller)
    },
    wait: (creep) => {
        creep.moveTo(Game.flags.waitingFlag)
        _interval(() => _findCloseSource(creep), 10)
    },
}

module.exports = upgraderActions
