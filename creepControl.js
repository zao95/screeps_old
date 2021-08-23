const { _actionChanger, _roleChanger } = require('./utils')
const { upgraderActions } = require('./R_upgraderActions')
const { builderActions } = require('./R_builderActions')
const { setting } = require('./setting')

const creepActions = {
    upgrader: upgraderActions,
    builder: builderActions,
}

const creepControl = () => {
    for (let creep of Object.values(Game.creeps)) {
        if (!(creep.memory.role in setting.roles)) _roleChanger(creep, setting.defaultRole)
        if (!setting.roles[creep.memory.role].actions.includes(creep.memory.action))
            _actionChanger(creep, setting.roles[creep.memory.role].defaultAction)
        else creepActions[creep.memory.role][creep.memory.action](creep)
    }
}

module.exports = creepControl
