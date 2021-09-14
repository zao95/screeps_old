const {
    _actionChanger,
    _actionChangeByCanHarvest,
    _interval,
    _findCloseStorage,
    _transfer,
} = require('./utils')
const setting = require('./setting')
const actions = require('./A__commonActions')
const actionChanger = require('./A__actionChanger')

const workerActions = {
    common: (creep) => {
        if (creep.ticksToLive < 100 && creep.memory.action != 'renew') actionChanger.renew(creep)
    },
    harvest: (creep) => {
        if (creep.store.getFreeCapacity() === 0) {
            // Action change
            _actionChanger(creep, 'transfer')
        } else {
            // Action
            actions.harvest(creep)
        }
    },
    pickup: (creep) => {
        if (creep.store.getFreeCapacity() === 0) {
            // Action change
            _actionChanger(creep, 'transfer')
        } else {
            // Action
            actions.pickup(creep)
        }
    },
    transfer: (creep) => {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            // Action change
            _actionChanger(creep, 'harvest')
        } else {
            // Action
            const cachedTarget = creep.room
                .find(FIND_STRUCTURES)
                .find((structure) => structure.id === creep.memory.target)
            if (cachedTarget != undefined)
                if (creep.transfer(cachedTarget) == ERR_NOT_IN_RANGE) creep.moveTo(cachedTarget)

            const transporters = creep.room
                .find(FIND_MY_CREEPS)
                .filter((creep) => creep.memory.role === 'transporter')
            if (transporters.length) {
                _transfer(creep, ['container', 'storage']) || _actionChanger(creep, 'wait')
            } else {
                _transfer(creep, ['tower']) ||
                    _transfer(creep, ['extension', 'spawn']) ||
                    _transfer(creep, ['container', 'storage']) ||
                    _actionChanger(creep, 'wait')
            }
        }
    },
    wait: (creep) => {
        if (!actions.wait(creep)) {
            creep.moveTo(
                creep.room.find(FIND_FLAGS, {
                    filter: (flag) => flag.color === 10,
                })
            )
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
    renew: (creep) => {
        // Action
        if (actions.renew(creep))
            // Action change
            _actionChanger(creep, 'harvest')
    },
}

module.exports = workerActions
