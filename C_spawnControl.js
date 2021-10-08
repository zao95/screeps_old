const { _makeBody, _maxWorkerCreeps } = require('./utils')

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
        // renew
        if (
            spawn.pos.findInRange(FIND_MY_CREEPS, 1) &&
            Memory.rooms[spawn.room.name].workerCount ===
                Memory.rooms[spawn.room.name].workerMaxCount
        ) {
            spawn.renewCreep(
                spawn.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (creep) => creep.memory.action === 'renew',
                })
            )
        }

        // 일반적인 worker Spawn
        if (
            spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable &&
            Memory.rooms[spawn.room.name].workerCount <
                Memory.rooms[spawn.room.name].workerMaxCount &&
            !Memory.rooms[spawn.room.name].spawnWorker
        ) {
            spawnWorker(spawn, spawn.room.energyCapacityAvailable)
            Memory.rooms[spawn.room.name].spawnWorker = true
        }
        // 비상 creep Spawn
        if (spawn.room.find(FIND_MY_CREEPS).length === 0) {
            if (spawn.room.energyAvailable >= 300) {
                spawnWorker(spawn, spawn.room.energyAvailable)
            }
        }
    }
}

module.exports = spawnControl
