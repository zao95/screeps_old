const spawnControl = () => {
    for (let spawn of Object.values(Game.spawns)) {
        if (spawn.store[RESOURCE_ENERGY] === 300) {
            const maxNaming = Math.max(
                ...Object.values(Game.creeps)
                    .map((creep) => +creep.name.replace('Worker', ''))
                    .filter((name) => !isNaN(name))
            )
            spawn.spawnCreep([WORK, CARRY, MOVE], `Worker${maxNaming + 1}`)
        }
    }
}

module.exports = spawnControl
