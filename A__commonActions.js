const {
    _doNotAnything,
    _actionChangeByCanHarvest,
    _alertMessage,
    _actionChanger,
} = require('./utils')

const actions = {
    harvest: (creep) => {
        // 변수 선언
        const target = Game.getObjectById(creep.memory.target)
        const error = creep.harvest(target)

        // Action
        if (error === OK)
            creep.say(`${creep.store.getUsedCapacity()} / ${creep.store.getCapacity()}`)
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
            creep.say(`${creep.store.getUsedCapacity()} / ${creep.store.getCapacity()}`)
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
        if (creep.ticksToLive >= 110) return true
        else {
            const target = Game.getObjectById(creep.memory.target)
            creep.move(target)
            return false
        }
    },
}

const checkPicking = (creep) => {
    const droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
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
