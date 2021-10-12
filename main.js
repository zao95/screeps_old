const { _interval, _garbageCollecter, _dashBoard } = require('./utils')
const spawnControl = require('./C_spawnControl')
const creepControl = require('./C_creepControl')
const towerControl = require('./C_towerControl')
const workerRoleChange = require('./R_workerRoleChange')
const memoryUpdate = require('./M_memoryUpdate')
const invade = require('./U_invade')
const attack = require('./U_attack')

module.exports.loop = () => {
    _interval(memoryUpdate, 1)
    workerRoleChange()
    spawnControl()
    creepControl()
    towerControl()
    _garbageCollecter()
    _interval(_dashBoard, 10)
    // invade('W7N4')
    // attack('W5N1')
}

// const a = Object.values(Game.creeps)[0].ticksToLive
// console.log(JSON.stringify(a))

// 스폰 크립
// spawn.spawnCreep([WORK, CARRY, MOVE], `Test${Math.floor(Math.random() * 10000)}`)
