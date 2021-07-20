/*
 * @Description: feature name
 * @Author: xujian
 * @Date: 2021-07-19 10:09:36
 */

import { hasOwn, isArray, isIntegerKey, isObject } from "../shared/index"
import { track, trigger } from "./effect";
import { reactive, readonly } from "./reactive"

function createGtter(isReadonly, shallow) {
  return function get(target, key, reciver) {
    const value = Reflect.get(target, key)
    // 如果不是只读，那么就要收集依赖
    if (!isReadonly) {
      console.log(`track属性: ${key}`);
      // console.log(target, key, reciver);
      track(target, 'get,', key)
    }
    // 如果是浅代理，直接返回值
    if (shallow) return value

    // 如果是对象类型的值，递归代理，又是懒代理，因为只有用到了这个属性，才会去触发代理，比vue2的性能好
    if (isObject(value)) {
      return isReadonly ? readonly(value) : reactive(value)
    }

    // 都不满足 直接返回value
    return value
  }
}

function createSetter(shallow) {
  return function set(target, key, value, reciver) {
    // 旧值
    const oldValue = target[key]
    // 判断时新增属性还是修改属性
    // 1. 当目标数数组时，如果下标小于之前的下标说明是修改，否则是新增
    // 2. 当目标是对象类型时候，如果属性已存在就是修改，否则就是新增
    // 3. 新增时要收集依赖，修改时要触发更新
    let isExistKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)
    
    // 先设置值
    const reslut = Reflect.set(target, key, value, reciver)

    // 然后出发更新
    if (!isExistKey) {
      console.log(`trigger 新属性：${key}`);
      trigger(target, 'add', key, value)
    } else {
      console.log(`trigger 旧属性：${key}的值`);
      trigger(target, 'set', key, value, oldValue)
    }

    return reslut
  }
}


const get = createGtter(false, false) // 【非仅读】 和 【非浅层】 的 getter
const shallowGet = createGtter(false, true) // 【非仅读】 和 【浅层】 的 getter
const readonlyGet = createGtter(true, false) // 【仅读】 和 【非浅层】 的 getter
const shallowReadonlyGet = createGtter(true, true) // 【仅读】 和 【浅层】 的 getter

const set = createSetter(false)
const shallowSet = createSetter(true)

// 仅读的setter
function readonlySet(target, key) {
  console.warn(`cannot set ${JSON.stringify(target)} on  key ${key} falied`)
}

export const reactiveHandler = {
  get,
  set
}

export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet
}

export const shallowReadonlyHanlders = {
  get: shallowReadonlyGet,
  set: readonlySet
}