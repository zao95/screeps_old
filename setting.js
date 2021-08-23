const setting = {
    defaultRole: 'upgrader',
    roles: {
        worker: {
            role: 'worker',
            ratio: 1,
            defaultAction: 'harvest',
            actions: ['harvest', 'transfer', 'wait'],
        },
        upgrader: {
            role: 'upgrader',
            ratio: 2,
            defaultAction: 'harvest',
            actions: ['harvest', 'upgrade', 'wait'],
        },
        builder: {
            role: 'builder',
            ratio: 1,
            defaultAction: 'harvest',
            actions: ['harvest', 'build', 'wait'],
        },
    },
    actions: ['harvest', 'upgrade', 'build', 'transfer', 'wait'],
}

module.exports = setting
