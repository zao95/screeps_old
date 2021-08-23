const utils = require('./utils')

module.exports.harvesterAction = {
    harvest: (creep, creepMemory) => {
        if (creep.store.getFreeCapacity() === 0) {
            utils.actionChanger(creepMemory, 'upgrade')
        }
        const source = creep.room
            .find(FIND_SOURCES)
            .find((source) => source.id === creepMemory.target)
        if (source === undefined) {
            utils.findCloseSource(creep)
        } else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    },
}
