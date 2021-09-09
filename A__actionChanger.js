const { _actionChanger } = require('./utils')

const actionChanger = {
    renew: (creep) => {
        const target = creep.pos.findClosestByPath(FIND_MY_SPAWNS)
        if (target) {
            creep.memory.target = target
            _actionChanger(creep, 'renew')
            return true
        } else {
            return false
        }
    },
}

module.exports = actionChanger
