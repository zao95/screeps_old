const { _interval, _findCloseSource, _actionChanger, _roleChanger } = require('./utils')

module.exports.builderActions = {
    harvest: (creep) => {
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'build')

        const source = creep.room
            .find(FIND_SOURCES)
            .find((source) => source.id === creep.memory.target)
        if (source === undefined) _findCloseSource(creep)
        else if (creep.harvest(source) == ERR_NOT_IN_RANGE) creep.moveTo(source)
    },
    build: (creep) => {
        creep.store[RESOURCE_ENERGY] === 0 && _actionChanger(creep, 'harvest')

        const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
        if (target) creep.build(target) == ERR_NOT_IN_RANGE && creep.moveTo(target)
        else _roleChanger(creep, 'upgrader')
    },
    wait: (creep) => {
        creep.moveTo(Game.flags.waitingFlag)
        _interval(() => _findCloseSource(creep), 10)
    },
}
