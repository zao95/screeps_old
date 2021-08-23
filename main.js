const { _interval, _memoryUpdate, _garbageCollecter, _dashBoard } = require('./utils')
const spawnControl = require('./C_spawnControl')
const creepControl = require('./C_creepControl')
const roleChange = require('./M_roleChange')

module.exports.loop = () => {
    _interval(_memoryUpdate, 1)
    roleChange()
    spawnControl()
    creepControl()
    _garbageCollecter()
    _interval(_dashBoard, 20)
}

// const a = Object.values(Game.structures)
// console.log(JSON.stringify(a))

// 스폰 크립
// spawn.spawnCreep([WORK, CARRY, MOVE], `Test${Math.floor(Math.random() * 10000)}`)
