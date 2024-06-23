export const myIsNaN = (n: unknown) => {
  if (typeof n === 'number' && isNaN(n)) {
    return true
  } else {
    return false
  }
}
// 输入框数字检验 例如：0000 || a-z  -> 0， 0001 -> 1 el-inpt 使用 keyup事件 原生input input
export const inputAdjust = (e: Event) => {
  const target = e.target as HTMLInputElement
  //替换非数字字符
  let temp_amount = target.value
    .replace(/[^\d.]/g, '')
    // .replace(/^0/g, '')
    .replace(/^\./g, '0.')
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
  if (temp_amount.length > 1 && temp_amount.charAt(0) === '0' && temp_amount.charAt(1) !== '.') {
    temp_amount = temp_amount.substring(1, temp_amount.length)
  }

  // const rightNum = temp_amount.split('.')[1]
  // if (rightNum && rightNum.length > 2) {
  //   temp_amount = Number(temp_amount).toFixed(2)
  // }

  target.value = temp_amount
}
