//防抖
export function debounce(fn, time) {
  let timer
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, time)
  }
}
