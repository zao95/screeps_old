const setting = require('./setting')
const { _makeBody } = require('./utils')

const spawnWorker = (spawn, energy) => {
    const creepNames = Object.values(Game.creeps)
        .map((creep) => creep.name.replace('Worker', ''))
        .filter((name) => !isNaN(name))
    const maxNaming = creepNames.length ? Math.max(...creepNames) : 0

    const name = `'Worker'${maxNaming + 1}`
    const body = _makeBody(energy, 'worker')
    const memory = { role: 'worker' }
    spawn.spawnCreep(body, name, { memory })
}

const spawnControl = () => {
    for (let spawn of Object.values(Game.spawns)) {
        const creepCount = Memory.creeps ? Object.keys(Memory.creeps).length : 0
        if (
            spawn.room.energyAvailable === spawn.room.energyCapacityAvailable &&
            creepCount < setting.maxCreeps
        ) {
            spawnWorker(spawn, spawn.room.energyCapacityAvailable)
        }
        if (spawn.room.find(FIND_MY_CREEPS).length === 0) {
            spawnWorker(spawn, spawn.room.energyAvailable)
        }
    }
}

module.exports = spawnControl
