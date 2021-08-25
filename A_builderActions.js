const { _interval, _actionChangeByCanHarvest, _actionChanger } = require('./utils')
const setting = require('./setting')

const builderActions = {
    harvest: (creep) => {
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'build')

        const cachedSource = creep.room
            .find(FIND_SOURCES)
            .find((source) => source.id === creep.memory.target)
        if (cachedSource != undefined) {
            if (creep.harvest(cachedSource) == ERR_NOT_IN_RANGE) creep.moveTo(cachedSource)
        } else _actionChangeByCanHarvest(creep)
    },
    build: (creep) => {
        creep.store[RESOURCE_ENERGY] === 0 && _actionChanger(creep, 'harvest')

        const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
        if (target) {
            creep.memory.target = target.id
            creep.build(target) == ERR_NOT_IN_RANGE && creep.moveTo(target)
        } else _actionChanger(creep, 'wait')
    },
    wait: (creep) => {
        creep.moveTo(Game.flags.waitingFlag)
        _interval(() => _actionChangeByCanHarvest(creep), setting.waitCreepIntervalCalcTime)
    },
}

module.exports = builderActions
