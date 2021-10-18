const { _interval, _garbageCollecter, _dashBoard } = require('./utils')
const spawnControl = require('./C_spawnControl')
const creepControl = require('./C_creepControl')
const towerControl = require('./C_towerControl')
const workerRoleChange = require('./R_workerRoleChange')
const memoryUpdate = require('./M_memoryUpdate')
const constants = require('./constants')
const invade = require('./U_invade')
const attack = require('./U_attack')

module.exports.loop = () => {
    constants()
    _interval(memoryUpdate, 1)
    workerRoleChange()
    spawnControl()
    creepControl()
    towerControl()
    _garbageCollecter()
    _interval(_dashBoard, 10)
    // invade('W7N4')
    // buildAssist('')
    // attack('W5N1', 20, 'W5N2')
}

// const a = Object.values(Game.creeps)[0].ticksToLive
// console.log(JSON.stringify(a))

// 스폰 크립
// spawn.spawnCreep([WORK, CARRY, MOVE], `Test${Math.floor(Math.random() * 10000)}`)
