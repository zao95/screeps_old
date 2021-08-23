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
        const roles = setting.roles.map((role) => role.role)
        if (!roles.includes(creep.memory.role)) _roleChanger(creep, setting.defaultRole)
        const actions = setting.roles.find((role) => role.role === creep.memory.role).actions
        const defaultAction = setting.roles.find(
            (role) => role.role === creep.memory.role
        ).defaultAction
        if (!actions.includes(creep.memory.action)) _actionChanger(creep, defaultAction)
        else creepActions[creep.memory.role][creep.memory.action](creep)
    }
}

module.exports = creepControl
