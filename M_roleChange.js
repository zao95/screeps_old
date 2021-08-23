const setting = require('./setting')

const roleChange = () => {
    for (let room of Object.keys(Memory.rooms)) {
        // 가중치 계산
        const hasConstructionSite = Game.rooms[room].find(FIND_MY_CONSTRUCTION_SITES).length
        const hasStorage = Game.rooms[room].find(FIND_MY_STRUCTURES, {
            filter: (obj) =>
                obj.structureType === 'extension' && obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        })
        const roles = {}
        let maxRole
        let minRole
        let minValue = Math.min()
        let maxValue = Math.max()

        for (let role in setting.roles) {
            roles[role] = Math.floor(Memory.rooms[room].role[role] / setting.roles[role].ratio)
            if (role === 'builder' && !hasConstructionSite) roles[role] = Math.min()
        }
        for (let role in roles) {
            if (roles[role] > maxValue) {
                maxValue = roles[role]
                maxRole = role
            }
            if (roles[role] < minValue) {
                minValue = roles[role]
                minRole = role
            }
        }

        // 변경 로직
        if (maxValue - minValue > 1) {
            const creeps = Object.values(Game.creeps).filter((creep) => creep.room.name === room)
            const creep = creeps.find((creep) => creep.memory.role === maxRole)
            creep.memory.role = minRole
        }
    }
}

module.exports = roleChange
