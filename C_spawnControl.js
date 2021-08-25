const setting = require('./setting')
const { _makeBody } = require('./utils')

const spawnWorker = (spawn, energy) => {
    const defaultName = 'Worker'
    const creepNames = Object.values(Game.creeps)
        .map((creep) => creep.name.replace(defaultName, ''))
        .filter((name) => !isNaN(name))
    const maxNaming = creepNames.length ? Math.max(...creepNames) : 0

    const name = `${defaultName}${maxNaming + 1}`
    const body = _makeBody(energy, 'worker')
    const memory = { role: 'worker' }
    spawn.spawnCreep(body, name, { memory })
}

const spawnControl = () => {
    for (let spawn of Object.values(Game.spawns)) {
        const creepCount = Memory.creeps ? Object.keys(Memory.creeps).length : 0
        const availableHarvest = Object.values(Memory.rooms[spawn.room.name].sources).reduce(
            (prev, curr) => prev + curr.availableHarvest,
            0
        )
        const maxWorkerCreeps =
            spawn.room.energyCapacityAvailable > 700
                ? Math.ceil(
                      availableHarvest *
                          (spawn.room.energyCapacityAvailable /
                              spawn.room.energyCapacityAvailable ** 1.05)
                  )
                : 30
        if (
            spawn.room.energyAvailable === spawn.room.energyCapacityAvailable &&
            creepCount < maxWorkerCreeps
        ) {
            spawnWorker(spawn, spawn.room.energyCapacityAvailable)
        }
        if (spawn.room.find(FIND_MY_CREEPS).length === 0) {
            spawnWorker(spawn, spawn.room.energyAvailable)
        }
    }
}

module.exports = spawnControl
