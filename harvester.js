const { _actionChanger, _findCloseSource, _interval } = require('./utils')

module.exports.harvesterAction = {
    harvest: (creep) => {
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'upgrade')

        const source = creep.room
            .find(FIND_SOURCES)
            .find((source) => source.id === creep.memory.target)
        if (source === undefined) {
            _findCloseSource(creep)
        } else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    },
    wait: (creep) => {
        creep.moveTo(Game.flags.waitingFlag)
        _interval(() => _findCloseSource(creep), 10)
    },
}
