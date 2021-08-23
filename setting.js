module.exports.setting = {
    defaultRole: 'upgrader',
    roles: {
        worker: {
            role: 'worker',
            defaultAction: 'harvest',
            actions: ['harvest', 'transfer', 'wait'],
        },
        upgrader: {
            role: 'upgrader',
            defaultAction: 'harvest',
            actions: ['harvest', 'upgrade', 'wait'],
        },
        builder: {
            role: 'builder',
            defaultAction: 'harvest',
            actions: ['harvest', 'build', 'wait'],
        },
    },
    actions: ['harvest', 'upgrade', 'build', 'transfer', 'wait'],
}
