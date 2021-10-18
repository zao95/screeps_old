const {
    _doNotAnything,
    _actionChangeByCanHarvest,
    _alertMessage,
    _actionChanger,
} = require('./utils')
const actionChanger = require('./A__actionChanger')

const actions = {
    common: (creep) => {
        // if (
        //     creep.ticksToLive < 200 &&
        //     creep.memory.action != 'renew' &&
        //     creep.room.energyAvailable === creep.room.energyCapacityAvailable &&
        //     !Object.values(Memory.creeps).filter(
        //         (creepMemory) =>
        //             creepMemory.room === creep.memory.room && creepMemory.action === 'renew'
        //     ).length
        // )
        //     actionChanger.renew(creep)
    },
    harvest: (creep) => {
        // 변수 선언
        const target = Game.getObjectById(creep.memory.target)
        const error = creep.harvest(target)

        // Action
        if (error === OK)
            creep.say(`${creep.store.getUsedCapacity()} / ${creep.store.getCapacity()}`, true)
        else if (error === ERR_NOT_IN_RANGE) creep.moveTo(target)
        else if (
            error === ERR_NOT_FOUND ||
            error === ERR_NOT_ENOUGH_RESOURCES ||
            error === ERR_INVALID_TARGET
        )
            _actionChangeByCanHarvest(creep)
        else if (error === ERR_BUSY) _doNotAnything()
        else
            _alertMessage(
                `Role: ${creep.memory.role}\nAction: ${creep.memory.action}\ndo: creep.harvest()\nerror: ${error}`
            )
    },
    pickup: (creep) => {
        // 변수 선언
        const target = Game.getObjectById(creep.memory.target)
        const error = creep.pickup(target)

        // Action
        if (error === OK)
            creep.say(`${creep.store.getUsedCapacity()} / ${creep.store.getCapacity()}`, true)
        else if (error === ERR_NOT_IN_RANGE) creep.moveTo(target)
        else if (error === ERR_INVALID_TARGET) _actionChanger(creep, 'wait')
        else if (error === ERR_BUSY) _doNotAnything()
        else
            _alertMessage(
                `Role: ${creep.memory.role}\nAction: ${creep.memory.action}\ndo: creep.harvest()\nerror: ${error}`
            )
    },
    wait: (creep) => {
        if (checkPicking(creep)) return true
        else return false
    },
    renew: (creep) => {
        if (
            creep.ticksToLive > 1490 ||
            Memory.rooms[creep.room.name].workerCount !=
                Memory.rooms[creep.room.name].workerMaxCount
        )
            return true
        else {
            const target = Game.getObjectById(creep.memory.target)
            if (target) {
                if (creep.pos.findInRange([target], 1).length) {
                    const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS)
                    creep.transfer(spawn, RESOURCE_ENERGY)
                } else {
                    creep.moveTo(target)
                }
            } else return false
        }
    },
}

const checkPicking = (creep) => {
    const droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType === 'energe',
    })
    if (droppedResource) {
        const isSomeonePickingItUpNow = Object.values(Memory.creeps).find(
            (creep) => creep.action === 'pickup' && creep.target === droppedResource.id
        )
        if (!isSomeonePickingItUpNow) {
            creep.memory.target = droppedResource.id
            _actionChanger(creep, 'pickup')
            return true
        }
    }
    return false
}

module.exports = actions
