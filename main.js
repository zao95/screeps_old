const { _memoryUpdate, _garbageCollecter } = require('./utils')
const spawnControl = require('./spawnControl')
const creepControl = require('./creepControl')

module.exports.loop = function () {
    _memoryUpdate()
    spawnControl()
    creepControl()
    _garbageCollecter()
}

// const a = Game.flags.waitingFlag
// console.log(JSON.stringify(a))

// 스폰 크립
// spawn.spawnCreep([WORK, CARRY, MOVE], `Test${Math.floor(Math.random() * 10000)}`)
