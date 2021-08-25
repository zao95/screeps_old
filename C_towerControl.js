const attack = (tower) => {
    const target =
        tower.pos.findClosestByRange(FIND_HOSTILE_POWER_CREEPS) ||
        tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if (target) {
        tower.attack(target)
        return true
    }
    return false
}

const heal = (tower) => {
    const target =
        tower.pos.findClosestByRange(FIND_MY_POWER_CREEPS, {
            filter: (creep) => creep.hits != creep.hitsMax,
        }) ||
        tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (creep) => creep.hits != creep.hitsMax,
        })
    if (target) {
        tower.heal(target)
        return true
    }
    return false
}
const repair = (tower) => {
    const target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hitsMax - structure.hits > 500,
    })
    if (target) {
        tower.repair(target)
        return true
    }
    return false
}

const towerControl = () => {
    const towers = Object.values(Game.structures).filter(
        (structure) => structure.structureType === 'tower'
    )
    for (let tower of towers) {
        attack(tower) || heal(tower) || repair(tower)
    }
}

module.exports = towerControl
