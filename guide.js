// Screeps 기본 가이드

// 기본 개념
// creep은 자원을 채취하거나, 공격, 수리, 점령 등을 할 수 있는 게임 상의 유일한 유닛입니다.
// spawn은 creep을 생산할 수 있는 건물입니다.
// room는 월드 맵에서 선택할 수 있는 하나의 방을 의미합니다.
// source는 room마다 1~2개 씩 있는 무한히 생성되는 자원입니다.
// controller는 room마다 1개씩 있는 room의 핵심 요소입니다. 레벨 업 시 room에 지을 수 있는 건물이 해금됩니다.

// loop 함수는 매초마다 실행됩니다.
// 대부분의 코드가 여기 작성됩니다.
module.exports.loop = () => {
    // creep의 행동을 지정한 코드입니다.
    for (let creep of Object.values(Game.creeps)) {
        if (creep.memory.role === 'harvest') {
            // creep이 더 이상 적재할 수 있는 공간이 없으면 creep의 role 데이터를 upgrade로 변경합니다.
            if (creep.store.getFreeCapacity() === 0) {
                creep.memory.role = 'upgrade'
            }

            // pos.findClosestByPath Method로 가까이 있는 활성화된 source를 찾기
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            // creep이 source 채취를 시도해보고, 만약 옆에 source가 없어 채취가 불가능하면 source를 향해서 이동합니다.
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source)
            }
        } else if (creep.memory.role === 'upgrade') {
            // creep이 가지고 있는 에너지가 creep의 role 데이터를 harvest로 변경합니다.
            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.role = 'harvest'
            }

            // creep이 upgrade를 시도해보고, 만약 근처에 controller가 없어 upgrade가 불가능하면 controller를 향해서 이동합니다.
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller)
            }
        } else {
            // creep에게 role이 저장되어있지 않으면, harvest로 지정합니다.
            creep.memory.role = 'harvest'
        }
    }
    // spawn이 creep을 생산하는 코드입니다.
    for (let spawn of Object.values(Game.spawns)) {
        // 이름은 중복이 불가능합니다.
        if (!Memory.creepNumber) {
            Memory.creepNumber = 1
        }
        const body = [MOVE, WORK, CARRY]
        const number = Memory.creepNumber
        const name = `worker${number}`
        // spawnCreep method를 통해 creep을 생산합니다.
        // 첫번째 매개변수에서 creep의 능력을 구성하고, 두번째 매개변수에서 이름을 지어줍니다.
        if (spawn.spawnCreep(body, name) === 0) {
            Memory.creepNumber = number + 1
        }
    }
}

// 그 외에는 코드가 변경될 때 1회만 실행됩니다.
// 테스트 외에는 거의 사용하지 않습니다.

// 대부분의 객체가 담겨있는 Game 객체입니다.
// 객체에서 정보를 조회하거나, method를 통해 행동을 할 수도 있습니다.
// Object 형태이므로, JSON.stringify를 통해 확인해야 합니다.
// console.log는 게임 내부 Console 탭에 출력됩니다.
// console에 찍힌 객체를 보기좋게 확인하려면 http://jsoneditoronline.org/ 사이트를 이용하세요.
console.log(JSON.stringify(Game))

// 내부에서 저장을 할 수 있는 공간입니다.
// DB나 브라우저의 localStorage와 유사한 공간입니다.
// 또한 creep.memory는 Memory.creeps.해당크립이름 과 같은 의미의 축약어입니다.
Memory.test = 1
console.log(JSON.stringify(Memory))

// 게임 상에서 사용되는 객체들의 정보나 행동 메서드, 그에 대한 리턴 등 모든 것들은 아래 사이트에 명시되어있습니다.
// https://docs.screeps.com/api

// module을 불러오는 방식은 Node의 기본사양인 CommonJS 방식을 따르고 있습니다.
// 아래는 CommonJS에 대한 설명입니다.
// https://www.daleseo.com/js-module-require/
