const {
    _actionChanger,
    _actionChangeByCanHarvest,
    _interval,
    _findCloseStorage,
    _transfer,
} = require('./utils')
const setting = require('./setting')
const actions = require('./A_commonActions')

const workerActions = {
    harvest: (creep) => {
        // Action change
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'transfer')

        // Action
        actions.harvest(creep)
    },
    pickup: (creep) => {
        // Action change
        creep.store.getFreeCapacity() === 0 && _actionChanger(creep, 'upgrade')

        actions.pickup(creep)
    },
    transfer: (creep) => {
        creep.store[RESOURCE_ENERGY] === 0 && _actionChanger(creep, 'harvest')

        const cachedTarget = creep.room
            .find(FIND_STRUCTURES)
            .find((structure) => structure.id === creep.memory.target)
        if (cachedTarget != undefined)
            if (creep.transfer(cachedTarget) == ERR_NOT_IN_RANGE) creep.moveTo(cachedTarget)

        const transporters = creep.room
            .find(FIND_MY_CREEPS)
            .filter((creep) => creep.memory.role === 'transporter')
        if (transporters.length) {
            _transfer(creep, ['extension', 'spawn']) || _actionChanger(creep, 'wait')
        } else {
            _transfer(creep, ['container', 'storage']) ||
                _transfer(creep, ['tower']) ||
                _transfer(creep, ['extension', 'spawn']) ||
                _actionChanger(creep, 'wait')
        }
    },
    wait: (creep) => {
        if (!actions.wait(creep)) {
            creep.moveTo(Game.flags.waitingFlag)
            _interval(() => {
                if (creep.store.getUsedCapacity() != 0) {
                    const transporters = creep.room
                        .find(FIND_MY_CREEPS)
                        .filter((creep) => creep.memory.role === 'transporter')
                    if (transporters.length) {
                        _findCloseStorage(creep, ['container', 'storage'])
                            ? _actionChanger(creep, 'transfer')
                            : _actionChangeByCanHarvest(creep)
                    } else {
                        _findCloseStorage(creep, ['container', 'storage', 'extension', 'spawn'])
                            ? _actionChanger(creep, 'transfer')
                            : _actionChangeByCanHarvest(creep)
                    }
                } else {
                    _actionChangeByCanHarvest(creep)
                }
            }, setting.waitCreepIntervalCalcTime)
        }
    },
}

module.exports = workerActions
