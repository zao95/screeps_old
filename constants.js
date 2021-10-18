const addConstants = () => {
    global.CREEP_MINING_MODE = 'creepMiningMode'
    global.CONTAINER_MINING_MODE = 'containerMiningMode'
    global.LINK_MINING_MODE = 'linkMiningMode'
    // role
    global.WORKER = 'worker'
    global.UPGRADER = 'upgrader'
    global.BUILDER = 'builder'
    global.ENERGY_CONTAINER_MINER = 'energyContainerMiner'
    global.ENERGY_TRANSPOTER = 'energyTranspoter'
    global.MINERAL_CONTAINER_MINER = 'mineralContainerMiner'
    global.MINERAL_TRANSPOTER = 'mineralTranspoter'
    // action
    global.COMMON = 'common'
    global.HARVEST = 'harvest'
    global.WAIT = 'wait'
    global.PICKUP = 'pickup'
    global.RENEW = 'renew'
    global.UPGRADE = 'upgrade'
    global.WITHDRAW = 'withdraw'
    global.TRANSFER = 'transfer'
    global.REPAIR = 'repair'
}

module.exports = addConstants
