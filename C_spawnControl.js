const setting = require('./setting')

const born = (spawn) => {
    const creepNames = Object.values(Game.creeps)
        .map((creep) => creep.name.replace(setting.creepName, ''))
        .filter((name) => !isNaN(name))
    const maxNaming = creepNames.length ? Math.max(...creepNames) : 0
    spawn.spawnCreep([WORK, CARRY, MOVE], `${setting.creepName}${maxNaming + 1}`)
}

const spawnControl = () => {
    for (let spawn of Object.values(Game.spawns)) {
        const creepCount = Memory.creeps ? Object.keys(Memory.creeps).length : 0
        if (spawn.store[RESOURCE_ENERGY] === 300 && creepCount < 12) {
            born(spawn)
        }
    }
}

module.exports = spawnControl
