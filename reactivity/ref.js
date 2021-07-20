/*
 * @Description: feature name
 * @Author: xujian
 * @Date: 2021-07-19 10:09:57
 */

import { hasChanged, isObject } from "../shared/utlils";
import { reactive } from "./reactive";
import { track, trigger } from "./effect";

export function ref(value) {
  return createRef(value, false)
}


export function shallowRef(value) {
  return createRef(value, true)
}


function createRef(value, shallow) {
  return new RefImpl(value, shallow); // 借助类的属性访问器 
}

function convert(shallow, value) {
  return !shallow && isObject(value) ? reactive(value) : value
}

class RefImpl {
  constructor(value, shallow) {
    this.__v_isRef = true
    this.rawValue = value
    this.shallow = shallow
    this._value = convert(shallow, value)
  }

  get value() {
    track(this, 'get', 'value')
    return this._value
  }

  set value(newValue) {
    // 当值发生变化 触发依赖收集
    if (newValue !== this.rawValue) {
      this.rawValue = newValue
      this._value = convert(this.shallow, newValue)
      // 触发更新
      trigger(this, 'set', 'value', newValue)
    }
  }
}