const setting = require('./setting')
const { _interval, _maxWorkerCreeps } = require('./utils')

const memoryUpdate = () => {
    if (Memory.rooms === undefined) Memory.rooms = {}

    for (let room of Object.values(Game.rooms)) {
        if (!room.energyCapacityAvailable) continue

        if (Memory.rooms[room.name] === undefined) Memory.rooms[room.name] = {}
        if (Memory.rooms[room.name].role === undefined) Memory.rooms[room.name].role = {}
        if (Memory.rooms[room.name].sources === undefined) Memory.rooms[room.name].sources = {}

        _interval(saveRoleCounts, 1, [room])
        _interval(saveCreepRoomName, 1)
        _interval(saveSourceData, 1, [room])
        _interval(saveTargetedSources, 1, [room])
        _interval(saveWorkerCount, 1, [room])
        _interval(saveSpawnState, 1, [room])
        _interval(saveSpawnWorker, 1, [room])
    }
}

const saveRoleCounts = (room) => {
    for (let { role } of Object.values(setting.roles)) {
        const count = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === role && creep.pos.roomName === room.name
        ).length
        Memory.rooms[room.name].role[role] = count
    }
}

const saveCreepRoomName = () => {
    for (let creep of Object.values(Game.creeps)) {
        creep.memory.room = creep.room.name
    }
}

const saveSourceData = (room) => {
    const sources = Game.rooms[room.name].find(FIND_SOURCES)
    for (let source of Object.values(sources)) {
        const availableHarvest = room
            .lookAtArea(
                source.pos.y - 1,
                source.pos.x - 1,
                source.pos.y + 1,
                source.pos.x + 1,
                true
            )
            .filter((object) => object.type === 'terrain' && object.terrain != 'wall').length

        Memory.rooms[room.name].sources[source.id] = {
            ...source,
            availableHarvest,
        }
    }
}

const saveTargetedSources = (room) => {
    const sources = Game.rooms[room.name].find(FIND_SOURCES)
    for (let source of Object.values(sources)) {
        const targets = Memory.creeps
            ? Object.values(Memory.creeps).filter((creep) => creep.target === source.id).length
            : 0

        Memory.rooms[room.name].sources[source.id].targets = targets
    }
}

const saveWorkerCount = (room) => {
    const creeps = Game.rooms[room.name].find(FIND_MY_CREEPS, {
        filter: (creep) => creep.name.startsWith('Worker'),
    })
    Memory.rooms[room.name].workerCount = creeps.length
    Memory.rooms[room.name].workerMaxCount = _maxWorkerCreeps(Game.rooms[room.name])
}

const saveSpawnState = (room) => {
    const spawns = Game.rooms[room.name].find(FIND_MY_SPAWNS)
    Memory.rooms[room.name].spawns === undefined && (Memory.rooms[room.name].spawns = {})
    for (let spawn of spawns) {
        Memory.rooms[room.name].spawns[spawn.name] === undefined &&
            (Memory.rooms[room.name].spawns[spawn.name] = {})
        Memory.rooms[room.name].spawns[spawn.name].id = spawn.id
        Memory.rooms[room.name].spawns[spawn.name].name = spawn.name
        Memory.rooms[room.name].spawns[spawn.name].energy = spawn.energy
        Memory.rooms[room.name].spawns[spawn.name].energyCapacity = spawn.energyCapacity
        Memory.rooms[room.name].spawns[spawn.name].spawning = spawn.spawning
    }
}

const saveSpawnWorker = (room) => {
    const spawns = Game.rooms[room.name].find(FIND_MY_SPAWNS, {
        filter: (spawn) => spawn.spawning && spawn.spawning.name.startsWith('Worker'),
    })
    !spawns.length && (Memory.rooms[room.name].spawnWorker = false)
}

module.exports = memoryUpdate
