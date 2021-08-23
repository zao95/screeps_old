module.exports.setting = {
    defaultRole: 'upgrader',
    roles: [
        {
            role: 'worker',
            defaultAction: 'harvest',
            actions: ['harvest', 'transfer', 'wait'],
        },
        {
            role: 'upgrader',
            defaultAction: 'harvest',
            actions: ['harvest', 'upgrade', 'wait'],
        },
        {
            role: 'builder',
            defaultAction: 'harvest',
            actions: ['harvest', 'build', 'wait'],
        },
    ],
    actions: ['harvest', 'upgrade', 'build', 'transfer', 'wait'],
}
