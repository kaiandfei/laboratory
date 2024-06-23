//导入依赖项
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const getNowFormatDate = function () {
  const date = new Date(),
    year = date.getFullYear(), //获取完整的年份(4位)
    hour = date.getHours()
  let month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate = date.getDate() // 获取当前日(1-31)

  if (month < 10) month = `0${month}` as unknown as number // 如果月份是个位数，在前面补0
  if (strDate < 10) strDate = `0${strDate}` as unknown as number // 如果日是个位数，在前面补0

  return `-${year}-${month}-${strDate}-${hour}`
}
/**
 * @description: el-table数据导出为xlsx表格
 * @param {*} _targetId Element-UI el-table组件的id值
 * @param {*} fileName 导出的文件名称
 * @return {*}
 * @author: lihk
 */
export const exportTableAsXLSX = function (_targetId: string, fileName = 'test') {
  //根据table生成Book工作簿
  console.log('first', XLSX)
  const wb = XLSX.utils.table_to_book(document.getElementById(_targetId))
  //将Book工作簿作为输出
  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  //尝试将当前table内容保存为excel文件
  try {
    FileSaver.saveAs(
      //被导出的blob二进制对象
      new Blob([wbout], {
        type: 'application/octet-stream'
      }),
      //导出文件的名称+后缀名
      fileName + getNowFormatDate() + '.xlsx'
    )
  } catch (e) {
    if (typeof console != 'undefined') console.log(e, wbout)
  }
}

/**
 * @description: excel导入el-table数据
 * @param {*} file 导入的文件
 * @return {*} tableData返回的json数据
 * @author: lihk
 */
export const uploadFile = async (file: any) => {
  const files = file.raw
  if (files.length <= 0) {
    return false
  } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
    console.log('上传格式不正确，请上传xls或者xlsx格式')
    return false
  }
  // 读取表格返回promise
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    let tableData: any = []
    fileReader.onload = (ev: any) => {
      const workbook = XLSX.read(ev.target.result, {
        type: 'binary'
      })
      const wsname = workbook.SheetNames[0]
      tableData = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], { header: 1, defval: '' })
      console.log(tableData) // 转换成json的数据
      return resolve(tableData)
    }
    fileReader.readAsBinaryString(files)
  })
}
