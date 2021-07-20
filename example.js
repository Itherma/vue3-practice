/*
 * @Description: 实验
 * @Author: xujian
 * @Date: 2021-07-19 10:17:56
 */
import { reactive, shallowReactive, readonly, shallowReadonly, effect, ref } from './reactivity/index'
// import { reactive, shallowReactive, readonly, shallowReadonly, effect } from '@vue/reactivity'

// 使用 reactive() 函数定义响应式数据
// const obj = reactive({ text: 'hello1' })
const obj = reactive({ text: 'hello1', text1: 'hello2', text2: 'hello3' })
// 使用 effect() 函数定义副作用函数

effect(() => {
  console.log(obj.text);
})
effect(()=>{
  console.log(obj.text1);
})
effect(()=>{
  console.log(obj.text2);
})



// 一秒后修改响应式数据，这会触发副作用函数重新执行
setTimeout(() => {
  obj.text += ' world'
  obj.text1 += ' world'
  obj.text2+= ' world'
}, 1000)


// const refVal = ref(0)

// effect(() => {
//   refVal.value
// })

// setTimeout(() => {

//   refVal.value += 1
// }, 1000);