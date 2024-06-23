// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

// import printJS from 'print-js'

export default {
  install(Vue) {
    Vue.prototype.getPdf = function (title) {
      console.log('🚀 ~ file: htmlToPdf.js:9 ~ install ~ title:', title)
      let targetDom = document.querySelector('#print-dom')
      html2Canvas(targetDom, {
        scale: 2, //按比例增加分辨率 (2=双倍).
        dpi: window.devicePixelRatio * 2, //设备像素
        height: targetDom.scrollHeight,
        windowHeight: targetDom.scrollHeight,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#e8e8e9',
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = (contentWidth / 592.28) * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = (592.28 / contentWidth) * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        // printJS({
        //   printable: pageData,
        //   type: 'image',
        //   style: '@page{size:auto;margin: 0cm 1cm 0cm 1cm;}', //去除页眉页脚
        // })
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      })
    }
  },
}
