const utils = require('./utils')

module.exports.upgraderAction = {
    upgrade: (creep, creepMemory) => {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            utils.actionChanger(creepMemory, 'harvest')
        }
        if (
            creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
        ) {
            creep.moveTo(creep.room.controller)
        }
    },
}
