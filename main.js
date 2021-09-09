const { _interval, _garbageCollecter, _dashBoard } = require('./utils')
const spawnControl = require('./C_spawnControl')
const creepControl = require('./C_creepControl')
const towerControl = require('./C_towerControl')
const workerRoleChange = require('./R_workerRoleChange')
const memoryUpdate = require('./M_memoryUpdate')

module.exports.loop = () => {
    _interval(memoryUpdate, 1)
    workerRoleChange()
    spawnControl()
    creepControl()
    towerControl()
    _garbageCollecter()
    _interval(_dashBoard, 20)
}

// const a = Object.values(Game.creeps)[0].ticksToLive
// console.log(JSON.stringify(a))

// 스폰 크립
// spawn.spawnCreep([WORK, CARRY, MOVE], `Test${Math.floor(Math.random() * 10000)}`)
