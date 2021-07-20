/*
 * @Description: feature name
 * @Author: xujian
 * @Date: 2021-07-19 10:09:51
 */

import { isArray, isIntegerKey } from "../shared/utlils";

export function effect(fn, options = {}) {
  const effect = cereateReactiveEffect(fn, options)
  // 如果不是懒effect，就执行effect函数，针对computed设计
  if (!options.lazy) effect()
  console.log('effect');
  return effect;
}

export let activeEffect
const effectStack = []
let id = 0

// 当用户取值的时候需要将activeEffect 和 属性做关联
// 当用户更改的时候 要通过属性找到effect重新执行
function cereateReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    try {
      effectStack.push(effect)
      activeEffect = effect
      console.log(`cereateReactiveEffect:push =>【${effectStack.length}】`)
      return fn()
    } finally {
      effectStack.pop()
      console.log(`cereateReactiveEffect:pop =>【${effectStack.length}】`)
      activeEffect = effectStack[effectStack.length - 1]
      c
    }
  }
  effect.id = id++; // 构建的是一个id
  effect.__isEffect = true;
  effect.options = options;
  effect.deps = []; // effect用来收集依赖了那些属性
  return effect;
}

// 用于存储 target 和 effect 之间的关联关系的对象
const targetMap = new WeakMap()
/**
 * @description: 依赖收集
 * @param {*} target 要收集的对象
 * @param {*} type 收集类型
 * @param {*} key 属性
 * 
 * 要构建一种这样的结构:
 *  targetMap<Weakmap>: {
 *    target_A<Map>: {
 *      prop_1<Set>: [effect1, effect2, effect3],
 *      prop_2<Set>: [effect1, effect2, effect3] 
 *    },
 *    target_B<Map>: {
 *      prop_1<Set>: [effect1, effect2, effect3],
 *      prop_2<Set>: [effect1, effect2, effect3] 
 *    }
 * }
 * 上述结构可以看得出来，target的属性和 effect 是多对多的关系，跟vue2的 dep和 watcher 是类似的 
 */
export function track(target, type, key) {
  // console.log(`track: ${key}`);
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
  console.log(`track:end：【${effectStack.length}】`)
  console.log('activeEffect:',activeEffect.id)

}
// 触发 effect
export function trigger(target, type, key, newValue, oldValue) {
  // 去映射表 targetMap 里找到属性对应的 effect， 让它重新执行
  const depsMap = targetMap.get(target)
  if (!depsMap) return // 只是改了属性，这个属性并没有在effect中使用

  // 声明一个调用的effect唯一序列
  const effectSet = new Set()
  // 向 effectSet 里增加 新的effect
  const add = (effectsAdd) => {
    if (effectsAdd) {
      effectsAdd.forEach(effect => {
        effectSet.add(effect)
      });
    }
  }
  // 正对数组代理时的垫片函数：
  // 1.如果更改数组的长度小于依赖收集的长度 要触发重新渲染
  // 2.如果调用了其他增加数组长度的方法时，也要触发更新
  if (key === 'length' && isArray(target)) { // 当target是数组，并且改变的属性是 'length' 时
    depsMap.forEach((dep, key) => {
      if (key > newValue || key === 'length') {
        add(dep) // 改变的数组长度比收集的时候小，要重新触发effect
      }
    });
  } else {
    add(depsMap.get(key))
    switch (type) {
      case 'add':
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get('length')) // 增加属性 需要触发length的依赖收集
        }
    }
  }
  effectSet.forEach(effect => {
    effect()
  });
}