const { _interval, _actionChangeByCanHarvest, _actionChanger } = require('./utils')
const setting = require('./setting')
const actions = require('./A_commonActions')

const builderActions = {
    harvest: (creep) => {
        // Action change
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'build')

        // Action
        actions.harvest(creep)
    },
    pickup: (creep) => {
        // Action change
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'build')

        actions.pickup(creep)
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
        if (!actions.wait(creep)) {
            creep.moveTo(Game.flags.waitingFlag)
            _interval(() => _actionChangeByCanHarvest(creep), setting.waitCreepIntervalCalcTime)
        }
    },
}

module.exports = builderActions
