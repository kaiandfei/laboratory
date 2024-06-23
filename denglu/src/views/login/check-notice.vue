<template>
  <div class="noticeHeader">
    <div class="left">
      <img src="@/assets/images/login/tip.png" alt="" />
      <span class="notice" @click="goNotice">通知公告</span>
      > 查看通知
    </div>
    <div class="right" @click="back">
      <img src="@images/laboratory/laboratory-standard/cancel.png" alt="" />
      <span>返回</span>
    </div>
  </div>
  <div class="checkNotice">
    <div class="title">
      {{ infoData.title }}
    </div>
    <div class="baseinfo">
      <div class="left">
        <span class="time">
          <img src="@images/login/time.png" alt="" />
          {{ infoData.create_time }}
        </span>
        <span>来源：{{ infoData.create_user }}</span>
      </div>
      <div class="right">
        <span>浏览量：{{ infoData.see_count || 0 }}</span>
      </div>
    </div>
    <div class="infomain">
      <quill-editor
        v-model:content="infoData.content"
        content-type="html"
        ref="myQuillEditor"
        :options="editorOption"
      ></quill-editor>
    </div>
    <div class="footer">
      <span>附件：</span>
      <div class="item">
        <div v-for="(item, index) in infoData.fileList" :key="index" @click="download(item.url)">
          {{ item.file_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
//自定义样式一定要在原插件css下面引入
import '@/assets/css/vue-quill-editor.css'
import { ref, defineProps, defineEmits, toRefs } from 'vue'
// 自定义字体大小
var sizes = [false, '14px', '16px', '18px', '20px', '22px', '26px', '28px', '30px']
var Size = Quill.import('formats/size')
Size.whitelist = sizes
// 自定义字体
var fonts = ['Microsoft-YaHei', 'SimHei', 'SimSun', 'KaiTi', 'FangSong', 'Arial', 'sans-serif']
var Font = Quill.import('formats/font')
Font.whitelist = fonts
let editorOption = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
      [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
      [{ align: [] }], // 对齐方式
      [{ size: sizes }], // 字体大小
      // [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
      [{ font: fonts }], // 字体种类
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
      // [{ direction: 'ltl' }], // 文本方向
      // [{ direction: 'rtl' }], // 文本方向
      // [{ indent: '-1' }, { indent: '+1' }], // 缩进
      [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
      // [{ script: 'sub' }, { script: 'super' }], // 上标/下标
      ['blockquote', 'code-block'], // 引用  代码块
      ['clean'], // 清除文本格式
      ['image'] // 链接、图片
    ]
  }
}
const $props = defineProps(['detailNotice'])
const $emits = defineEmits(['toggleNotice'])
const refs = toRefs($props)
const infoData: any = ref({})
console.log('1111', refs.detailNotice.value)
infoData.value.title = refs.detailNotice.value.title
infoData.value.create_time = refs.detailNotice.value.create_time
infoData.value.create_user = refs.detailNotice.value.create_user
infoData.value.see_count = refs.detailNotice.value.see_count
infoData.value.content = refs.detailNotice.value.content
infoData.value.fileList = refs.detailNotice.value.notice_file
const download = (url: string) => {
  window.location.href = url
}
const goNotice = () => {
  window.open(process.env.VUE_APP_APP_LOGINURL + 'noticeList')
}
const back = () => {
  $emits('toggleNotice')
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/vue-quill-editor.css';
.noticeHeader {
  width: 1390px;
  height: 60px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;

  .left {
    img {
      width: 17px;
      height: 21px;
      position: relative;
      top: 5px;
      margin-right: 10px;
    }
    .notice {
      cursor: pointer;
    }
    .notice:hover {
      color: #05c65d;
      text-decoration: underline;
    }
  }

  .right {
    cursor: pointer;
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
}

.checkNotice {
  width: 1390px;
  height: 740px;
  text-align: left;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 2px;
  overflow: auto;

  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .baseinfo {
    display: flex;
    margin: 20px 0;
    justify-content: space-between;

    .left {
      .time {
        margin-right: 30px;

        img {
          width: 18px;
          height: 18px;
          position: relative;
          top: 5px;
          margin-right: 5px;
        }
      }
    }
  }

  ::v-deep .infomain {
    // max-height: 580px;
    // overflow: auto;
    word-wrap: break-word;
    .ql-editor {
      pointer-events: none;
    }
    .ql-toolbar.ql-snow {
      display: none;
    }
    .ql-container.ql-snow {
      border: none;
    }
    em {
      font-style: italic !important;
    }
  }

  .footer {
    display: flex;
    margin: 20px 0 0;
    // align-items: center;

    .item {
      color: #05c65d;
      cursor: pointer;

      div {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
