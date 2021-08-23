const utils = require('./utils')

module.exports.waiterAction = {
    wait: (creep, creepMemory) => {
        creep.moveTo(Game.flags.waitingFlag)
        utils.findCloseSource(creep)
    },
}
