const { _actionChanger, _roleChanger } = require('./utils')
const { upgraderAction } = require('./upgrader')

const creepRole = {
    upgrader: (creep, action) => {
        if (!upgraderAction[action]) _actionChanger(creep, 'wait')
        else upgraderAction[action](creep)
    },
}

const creepControl = () => {
    for (let creep of Object.values(Game.creeps)) {
        if (!creepRole[creep.memory.role]) _roleChanger(creep, 'upgrader')
        else creepRole[creep.memory.role](creep, creep.memory.action)
    }
}

module.exports = creepControl
