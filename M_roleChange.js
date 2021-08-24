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
        let maxValue = Math.max()
        let minValue = Math.min()

        for (let role in setting.roles) {
            roles[role] = Math.floor(Memory.rooms[room].role[role] / setting.roles[role].ratio)
            if (role === 'builder' && !hasConstructionSite && roles[role] != 0)
                roles[role] = Math.min()
        }
        for (let role in roles) {
            // if (role === 'builder') {
            //     console.log()
            //     console.log(role)
            //     console.log(roles[role])
            //     console.log('roles[role] > maxValue', roles[role] > maxValue)
            // }
            if (roles[role] > maxValue) {
                maxValue = roles[role]
                maxRole = role
            }
            if (roles[role] < minValue) {
                if (role === 'builder' && !hasConstructionSite) continue
                minValue = roles[role]
                minRole = role
            }
        }
        // console.log()
        // console.log('maxValue', maxValue)
        // console.log('minValue', minValue)
        // console.log('minRole', minRole)
        // console.log('minValue', minValue)

        // 변경 로직
        if (maxValue - minValue > 1) {
            const creeps = Object.values(Game.creeps).filter((creep) => creep.room.name === room)
            const creep = creeps.find((creep) => creep.memory.role === maxRole)
            creep && (creep.memory.role = minRole)
        }
    }
}

module.exports = roleChange
