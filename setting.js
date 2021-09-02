const setting = {
    defaultRole: 'worker',
    roles: {
        worker: {
            role: 'worker',
            ratio: 5,
            defaultAction: 'harvest',
            actions: ['harvest', 'pickup', 'transfer', 'wait'],
        },
        upgrader: {
            role: 'upgrader',
            ratio: 1,
            defaultAction: 'harvest',
            actions: ['harvest', 'pickup', 'upgrade', 'wait'],
        },
        builder: {
            role: 'builder',
            ratio: 2,
            defaultAction: 'harvest',
            actions: ['harvest', 'pickup', 'build', 'wait'],
        },
    },
    waitCreepIntervalCalcTime: 3,
    minimumFreeCapacity: {
        tower: 500,
        storage: 700000,
        extension: 0,
        spawn: 0,
        container: 0,
    },
}

module.exports = setting
