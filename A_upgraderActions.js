const { _interval, _actionChangeByCanHarvest, _actionChanger } = require('./utils')
const setting = require('./setting')

const upgraderActions = {
    harvest: (creep) => {
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'upgrade')

        const cachedSource = creep.room
            .find(FIND_SOURCES_ACTIVE)
            .find((source) => source.id === creep.memory.target)
        if (cachedSource != undefined) {
            if (creep.harvest(cachedSource) == ERR_NOT_IN_RANGE) creep.moveTo(cachedSource)
        } else _actionChangeByCanHarvest(creep)
    },
    upgrade: (creep) => {
        creep.store[RESOURCE_ENERGY] === 0 && _actionChanger(creep, 'harvest')

        creep.memory.target = creep.room.controller.id
        creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE &&
            creep.moveTo(creep.room.controller)
    },
    wait: (creep) => {
        creep.moveTo(Game.flags.waitingFlag)
        _interval(() => _actionChangeByCanHarvest(creep), setting.waitCreepIntervalCalcTime)
    },
}

module.exports = upgraderActions
