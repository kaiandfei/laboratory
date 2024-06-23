//base64转图片
export function getFileFromBase64(data) {
  let _base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgAB...'
  let fileName = '图片1.jpg' // 文件名
  let opType = _base64.split(';base64')[0].slice(5)
  const dataArr = data.split(',')
  const byteString = atob(dataArr[1])
  const options = {
    type: opType,
    endings: 'native',
  }
  const u8Arr = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    u8Arr[i] = byteString.charCodeAt(i)
  }
  let _fileObj = new File([u8Arr], fileName, options)
  return _fileObj
}
