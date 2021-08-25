const setting = {
    defaultRole: 'worker',
    maxCreeps: 12,
    roles: {
        worker: {
            role: 'worker',
            ratio: 2,
            defaultAction: 'harvest',
            actions: ['harvest', 'transfer', 'wait'],
        },
        upgrader: {
            role: 'upgrader',
            ratio: 1,
            defaultAction: 'harvest',
            actions: ['harvest', 'upgrade', 'wait'],
        },
        builder: {
            role: 'builder',
            ratio: 3,
            defaultAction: 'harvest',
            actions: ['harvest', 'build', 'wait'],
        },
    },
    waitCreepIntervalCalcTime: 3,
    actions: ['harvest', 'upgrade', 'build', 'transfer', 'wait'],
}

module.exports = setting
