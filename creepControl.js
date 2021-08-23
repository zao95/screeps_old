const utils = require('./utils')

const creepAction = {
    harvest: (creep, creepMemory) => {
        if (creep.store.getFreeCapacity() === 0) {
            utils.actionChanger(creepMemory, 'upgrade')
        }
        const source = creep.room
            .find(FIND_SOURCES)
            .find((source) => source.id === creepMemory.target)
        if (source === undefined) {
            utils.findCloseSource(creep)
        } else {
            const errorMsg = creep.harvest(source)
            if (errorMsg === ERR_NOT_IN_RANGE) {
                creep.moveTo(source)
            } else if (errorMsg === ERR_NOT_ENOUGH_RESOURCES) {
                utils.findCloseSource(creep)
            }
        }
    },
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
    wait: (creep, creepMemory) => {
        creep.moveTo(Game.flags.waitingFlag)
        utils.interval(() => utils.findCloseSource(creep), 10)
    },
}

const creepRole = {
    harvester: (creep, creepMemory, action) => {
        harvesterAction[action](creep, creepMemory)
    },
    upgrader: (creep, creepMemory, action) => {
        upgraderAction[action](creep, creepMemory)
    },
    waiter: (creep, creepMemory, action) => {
        waiterAction[action](creep, creepMemory)
    },
}

const creepControl = () => {
    for (let creep of Object.values(Game.creeps)) {
        const creepMemory = Memory.creeps[creep.name]
        if (creepMemory && creepMemory.action) {
            creepAction[creepMemory.action](creep, creepMemory)
        } else {
            utils.actionChanger(creepMemory, 'wait')
        }
    }
}

module.exports = creepControl
