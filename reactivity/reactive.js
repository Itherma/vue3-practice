/*
 * @Description: feature name
 * @Author: xujian
 * @Date: 2021-07-19 10:09:23
 */
import { isObject } from '../shared/index'
import { reactiveHandler, shallowReactiveHandlers, readonlyHandlers, shallowReadonlyHanlders } from "./handlers";

// weakMap(key只能是对象) map(key可以是其他类型)
// 声明缓存对象，避免重复代理同一个对象，用weakmap性能更好。
const reactiveMap = new WeakMap(); // 响应式对象缓存map
const readonlyMap = new WeakMap(); // 只读对象缓存map

function createReactiveObject(target, isReadonly, handlers) {
  console.log('active');
  // 如果值不是对象或者数组，name就直接返回该值
  if (!isObject) return target

  const proxyMap = isReadonly ? readonlyMap : reactiveMap

  const existProxy = proxyMap.get(target)
  // 已代理的对象，直接返回即可
  if (existProxy) return existProxy

  // 没有代理过，就用Proxy API进行代理
  const proxy = new Proxy(target, handlers)
  // 将代理的结果加到缓存
  proxyMap.set(target, proxy)
  return proxy
}

export function reactive(target) {
  return createReactiveObject(target, false, reactiveHandler)
}
export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers)
}
export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers)
}
export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHanlders)
}