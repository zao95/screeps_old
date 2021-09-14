const { _interval, _actionChangeByCanHarvest, _actionChanger } = require('./utils')
const setting = require('./setting')
const actions = require('./A__commonActions')
const actionChanger = require('./A__actionChanger')

const upgraderActions = {
    common: (creep) => {
        if (creep.ticksToLive < 100 && creep.memory.action != 'renew') actionChanger.renew(creep)
    },
    harvest: (creep) => {
        // Action change
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'upgrade')

        // Action
        actions.harvest(creep)
    },
    pickup: (creep) => {
        // Action change
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'upgrade')

        actions.pickup(creep)
    },
    upgrade: (creep) => {
        creep.store[RESOURCE_ENERGY] === 0 && _actionChanger(creep, 'harvest')

        creep.memory.target = creep.room.controller.id
        creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE &&
            creep.moveTo(creep.room.controller)
    },
    wait: (creep) => {
        if (!actions.wait(creep)) {
            creep.moveTo(
                creep.room.find(FIND_FLAGS, {
                    filter: (flag) => flag.color === 10,
                })
            )
            _interval(() => _actionChangeByCanHarvest(creep), setting.waitCreepIntervalCalcTime)
        }
    },
    renew: (creep) => {
        // Action
        if (actions.renew(creep))
            // Action change
            _actionChanger(creep, 'harvest')
    },
}

module.exports = upgraderActions
