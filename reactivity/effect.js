/*
 * @Description: feature name
 * @Author: xujian
 * @Date: 2021-07-19 10:09:51
 */

export function effect(fn, options) {
  const effect = cereateReactiveEffect(fn, options)
  // 如果不是懒effect，就执行effect函数，针对computed设计
  if (!options.lazy) effect()
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
      return fn()
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
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

}

export function trigger(target, type, key){

} 