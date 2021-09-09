const setting = {
    defaultRole: 'worker',
    roles: {
        worker: {
            role: 'worker',
            ratio: 3,
            defaultAction: 'harvest',
            actions: ['harvest', 'pickup', 'transfer', 'wait', 'renew'],
        },
        upgrader: {
            role: 'upgrader',
            ratio: 1,
            defaultAction: 'harvest',
            actions: ['harvest', 'pickup', 'upgrade', 'wait', 'renew'],
        },
        builder: {
            role: 'builder',
            ratio: 2,
            defaultAction: 'harvest',
            actions: ['harvest', 'pickup', 'build', 'wait', 'renew'],
        },
    },
    waitCreepIntervalCalcTime: 3,
    minimumFreeCapacity: {
        tower: 500,
        storage: 10000,
        extension: 0,
        spawn: 0,
        container: 0,
    },
}

module.exports = setting
