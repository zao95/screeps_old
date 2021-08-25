const setting = require('./setting')

const workerRoleChange = () => {
    for (let room of Object.keys(Memory.rooms)) {
        // 가중치 계산
        const hasConstructionSite = Game.rooms[room].find(FIND_CONSTRUCTION_SITES).length
        const hasStorage = Game.rooms[room].find(FIND_STRUCTURES, {
            filter: (obj) =>
                ['container', 'storage', 'extension', 'spawn', 'tower'].includes(
                    obj.structureType
                ) && obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        })

        // 변수 선언
        const roles = {}
        let maxRole
        let minRole
        let maxValue = Math.max()
        let minValue = Math.min()

        // role별 creep * 가중치 계산 및 예외계산
        for (let role in setting.roles) {
            roles[role] = Memory.rooms[room].role[role] / setting.roles[role].ratio
            if (role === 'builder' && !hasConstructionSite && roles[role] != 0)
                roles[role] = Math.min()
            if (role === 'worker') {
                if (!hasStorage.length) roles[role] = Math.min()
                else if (roles[role] === 0) roles[role] = Math.max()
            }
        }

        // 최대 role, 최소 role 계산
        for (let role in roles) {
            if (roles[role] > maxValue) {
                maxValue = roles[role]
                maxRole = role
            }
            if (roles[role] < minValue) {
                if (role === 'builder' && !hasConstructionSite) continue
                if (role === 'worker' && !hasStorage.length) continue
                minValue = roles[role]
                minRole = role
            }
        }

        // 변경 로직
        if (maxValue - minValue > 1) {
            const creeps = Object.values(Game.creeps).filter((creep) => creep.room.name === room)
            const creep = creeps.find((creep) => creep.memory.role === maxRole)
            creep && (creep.memory.role = minRole)
        }
    }
}

module.exports = workerRoleChange
