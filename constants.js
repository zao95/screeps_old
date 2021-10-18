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
    global.COMMON = 'worker'
    global.HARVEST = 'worker'
    global.WAIT = 'worker'
    global.PICKUP = 'worker'
    global.RENEW = 'worker'
    global.UPGRADE = 'worker'
    global.WITHDRAW = 'worker'
    global.TRANSFER = 'worker'
    global.REPAIR = 'worker'
}

module.exports = addConstants
