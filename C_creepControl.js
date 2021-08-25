const { _actionChanger, _roleChanger } = require('./utils')
const upgraderActions = require('./A_upgraderActions')
const builderActions = require('./A_builderActions')
const workerActions = require('./A_workerActions')
const setting = require('./setting')

const creepActions = {
    upgrader: upgraderActions,
    builder: builderActions,
    worker: workerActions,
}

const creepControl = () => {
    const creeps = Object.values(Game.creeps)
    const workers = creeps.filter((creep) => creep.name.startsWith('Worker'))
    for (let creep of workers) {
        if (!(creep.memory.role in setting.roles)) _roleChanger(creep, setting.defaultRole)
        if (!setting.roles[creep.memory.role].actions.includes(creep.memory.action))
            _actionChanger(creep, setting.roles[creep.memory.role].defaultAction)
        else creepActions[creep.memory.role][creep.memory.action](creep)
    }
}

module.exports = creepControl
