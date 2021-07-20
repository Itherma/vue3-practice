# Vue3 Reactivity API


## effect() 和 reactive()

```js
import { effect, reactive } from '@vue/reactivity'
// 使用 reactive() 函数定义响应式数据
const obj = reactive({ text: 'hello' })
// 使用 effect() 函数定义副作用函数
effect(() => {
     document.body.innerText = obj.text
})

// 一秒后修改响应式数据，这会触发副作用函数重新执行
setTimeout(() => {
  obj.text += ' world'
}, 1000)
```

## shallowReactive()
定义浅响应数据：
```javascript
import { effect, shallowReactive } from '@vue/reactivity'
// 使用 shallowReactive() 函数定义浅响应式数据
const obj = shallowReactive({ foo: { bar: 1 } })
effect(() => {
  console.log(obj.foo.bar)
})
obj.foo.bar = 2  // 无效
obj.foo = { bar: 2 }  // 有效
```

## readonly()
有些数据，我们要求对用户是只读的，此时可以使用 `readonly()` 函数，它的用法如下：
```javascript
import { readonly } from '@vue/reactivity'
// 使用 reactive() 函数定义响应式数据
const obj = readonly({ text: 'hello' })
obj.text += ' world' // Set operation on key "text" failed: target is readonly.
```

## shallowReadonly()
类似于浅响应，shallowReadonly() 定义浅只读数据，这意味着，深层次的对象值是可以被修改的，在 `Vue` 内部 `props` 就是使用 `shallowReadonly()` 函数来定义的，用法如下：
```javascript
import { effect, shallowReadonly } from '@vue/reactivity'
// 使用 shallowReadonly() 函数定义浅只读数据
const obj = shallowReadonly({ foo: { bar: 1 } })
obj.foo = { bar: 2 }  // Warn
obj.foo.bar = 2 // OK
```