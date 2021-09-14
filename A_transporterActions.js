// workerActions 참조해서 많은 수정 필요

const {
    _actionChanger,
    _actionChangeByCanHarvest,
    _interval,
    _findCloseStorage,
} = require('./utils')

const transporterActions = {
    common: (creep) => {
        if (creep.ticksToLive < 100 && creep.memory.action != 'renew') actionChanger.renew(creep)
    },
    withdraw: (creep) => {
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'transfer')

        const cachedSource = creep.room
            .find(FIND_SOURCES)
            .find((source) => source.id === creep.memory.target)
        if (cachedSource != undefined) {
            if (creep.harvest(cachedSource) == ERR_NOT_IN_RANGE) creep.moveTo(cachedSource)
        } else _actionChangeByCanHarvest(creep)
    },
    transfer: (creep) => {
        creep.store[RESOURCE_ENERGY] === 0 && _actionChanger(creep, 'harvest')

        const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (obj) =>
                ['container', 'storage'].includes(obj.structureType) &&
                obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        })
        if (target)
            creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE && creep.moveTo(target)
        else _actionChanger(creep, 'wait')
    },
    wait: (creep) => {
        creep.moveTo(
            creep.room.find(FIND_FLAGS, {
                filter: (flag) => flag.color === 10,
            })
        )
        _interval(() => {
            _findCloseStorage(creep) && _actionChanger(creep, 'transfer')
            _actionChangeByCanHarvest(creep)
        }, 10)
    },
    renew: (creep) => {
        // Action
        if (actions.renew(creep))
            // Action change
            _actionChanger(creep, 'harvest')
    },
}

module.exports = transporterActions
