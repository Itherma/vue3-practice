/*
 * @Description: feature name
 * @Author: xujian
 * @Date: 2021-07-19 10:07:01
 */

export function isObject(val) {
  return typeof val == 'object' && val !== null;
}
// ...

export function hasChanged(oldValue, newValue) {
  return oldValue !== newValue
}

export let isArray = Array.isArray;

export let extend = Object.assign;


export const isIntegerKey = (key) => {
  return parseInt(key) + '' === key
}

export const hasOwn = (target,key)=> Object.prototype.hasOwnProperty.call(target,key)