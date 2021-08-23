const born = (spawn) => {
    const maxNaming = Math.max(
        ...Object.values(Game.creeps)
            .map((creep) => +creep.name.replace('Worker', ''))
            .filter((name) => !isNaN(name))
    )
    spawn.spawnCreep([WORK, CARRY, MOVE], `Worker${maxNaming + 1}`)
}

const spawnControl = () => {
    for (let spawn of Object.values(Game.spawns)) {
        const creeps = Object.keys(Memory.creeps)
        if (spawn.store[RESOURCE_ENERGY] === 300 && creeps.length < 12) {
            born(spawn)
        }
    }
}

module.exports = spawnControl
