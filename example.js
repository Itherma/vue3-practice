/*
 * @Description: 实验
 * @Author: xujian
 * @Date: 2021-07-19 10:17:56
 */
import { reactive, shallowReative, readonly, shallowReadonly } from './reactivity/index'
// import { reactive, shallowReative, readonly, shallowReadonly, effect } from '@vue/reactivity'

const proxy = shallowReadonly({ name: 'xiaomin', obj: { prop: 'hhh' } })

// effect(() => {
//   console.log(proxy);
// })

setTimeout(() => {
  proxy.obj.prop = { a: 1 }
}, 1000);

