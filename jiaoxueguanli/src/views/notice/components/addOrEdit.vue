<template>
  <div class="addContainer">
    <div class="add">
      <span>创建通知</span>
      <div class="btns">
        <div
          class="btn green-btn btn-edit"
          :class="submitLoading ? 'isDisabled' : ''"
          @click="submitForm('ruleFormRef')"
        >
          提交
        </div>
      </div>
    </div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="新闻标题" prop="title" class="newTitle">
        <el-input
          v-model="ruleForm.title"
          maxlength="50"
          placeholder="请输入新闻标题"
          show-word-limit
          clearable
        />
        <span class="explain">
          说明：标题要准确反应文章的主要内容，不得歪曲文章原意、以偏概全、断章取义、无中生有、内容空洞
        </span>
      </el-form-item>
      <el-form-item label="作者" prop="create_user">
        <el-input
          v-model="ruleForm.create_user"
          maxlength="20"
          placeholder="请输入作者"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="通知正文" prop="content">
        <div class="ql-snow">
          <quill-editor
            v-model="ruleForm.content"
            ref="myQuillEditor"
            :options="editorOption"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item label="添加附件" prop="file" class="file">
        <el-upload
          :file-list="filesList"
          class="upload-demo"
          :data="fileData"
          ref="uploadRef"
          :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
          multiple
          accept=" .xlsx, .pdf, .doc, .docx, .xls, .png , .jpg, .jepg"
          :limit="10"
          :on-success="uploadSuccess"
          :on-remove="handleRemove"
          :before-upload="fileBeforeUpload"
          name="image"
        >
          <el-button plain class="upload-btn" :disabled="uploadRes"
            ><img src="@/assets/images/notice/upload.png" alt="" class="uploadFail" />
            上传文件</el-button
          >
          <!-- <div class="btn white-btn btn-upload">
            <img src="@/assets/images/notice/upload.png" alt="" />
            上传文件
          </div> -->
          <!-- <el-button type="primary">上传文件</el-button> -->
        </el-upload>
        <span class="tips"
          >支持扩展名：.doc 、.docx 、.pdf 、.jpg、.png 、.xlxs 、.xls</span
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { debounce } from '@/utils/debounce'
import { saveNotice } from '@/network/notice'
import { quillEditor, Quill } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)
//自定义样式一定要在原插件css下面引入
import '@/assets/css/vue-quill-editor.css'
// 自定义字体大小
var sizes = [false, '14px', '16px', '18px', '20px', '22px', '26px', '28px', '30px']
var Size = Quill.import('formats/size')
Size.whitelist = sizes
// 自定义字体
var fonts = [
  'Microsoft-YaHei',
  'SimHei',
  'SimSun',
  'KaiTi',
  'FangSong',
  'Arial',
  'sans-serif',
]
var Font = Quill.import('formats/font')
Font.whitelist = fonts
// toolbar标题
const titleConfig = [
  { Choice: '.ql-insertMetric', title: '跳转配置' },
  { Choice: '.ql-bold', title: '加粗' },
  { Choice: '.ql-italic', title: '斜体' },
  { Choice: '.ql-underline', title: '下划线' },
  { Choice: '.ql-header', title: '段落格式' },
  { Choice: '.ql-strike', title: '删除线' },
  { Choice: '.ql-blockquote', title: '块引用' },
  { Choice: '.ql-code', title: '插入代码' },
  { Choice: '.ql-code-block', title: '插入代码段' },
  { Choice: '.ql-font', title: '字体' },
  { Choice: '.ql-size', title: '字体大小' },
  { Choice: '.ql-list[value="ordered"]', title: '编号列表' },
  { Choice: '.ql-list[value="bullet"]', title: '项目列表' },
  { Choice: '.ql-direction', title: '文本方向' },
  { Choice: '.ql-header[value="1"]', title: 'h1' },
  { Choice: '.ql-header[value="2"]', title: 'h2' },
  { Choice: '.ql-align', title: '对齐方式' },
  { Choice: '.ql-color', title: '字体颜色' },
  { Choice: '.ql-background', title: '背景颜色' },
  { Choice: '.ql-image', title: '图像' },
  { Choice: '.ql-video', title: '视频' },
  { Choice: '.ql-link', title: '添加链接' },
  { Choice: '.ql-formula', title: '插入公式' },
  { Choice: '.ql-clean', title: '清除字体格式' },
  { Choice: '.ql-script[value="sub"]', title: '下标' },
  { Choice: '.ql-script[value="super"]', title: '上标' },
  { Choice: '.ql-indent[value="-1"]', title: '向左缩进' },
  { Choice: '.ql-indent[value="+1"]', title: '向右缩进' },
  { Choice: '.ql-header .ql-picker-label', title: '标题大小' },
  { Choice: '.ql-header .ql-picker-item[data-value="1"]', title: '标题一' },
  { Choice: '.ql-header .ql-picker-item[data-value="2"]', title: '标题二' },
  { Choice: '.ql-header .ql-picker-item[data-value="3"]', title: '标题三' },
  { Choice: '.ql-header .ql-picker-item[data-value="4"]', title: '标题四' },
  { Choice: '.ql-header .ql-picker-item[data-value="5"]', title: '标题五' },
  { Choice: '.ql-header .ql-picker-item[data-value="6"]', title: '标题六' },
  { Choice: '.ql-header .ql-picker-item:last-child', title: '标准' },
  { Choice: '.ql-size .ql-picker-item[data-value="small"]', title: '小号' },
  { Choice: '.ql-size .ql-picker-item[data-value="large"]', title: '大号' },
  { Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: '超大号' },
  { Choice: '.ql-size .ql-picker-item:nth-child(2)', title: '标准' },
  { Choice: '.ql-align .ql-picker-item:first-child', title: '居左对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="center"]', title: '居中对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="right"]', title: '居右对齐' },
  { Choice: '.ql-align .ql-picker-item[data-value="justify"]', title: '两端对齐' },
]
export default {
  name: 'add',
  components: {
    quillEditor,
  },
  props: ['detailNotice', 'isEdit', 'editId'],
  data() {
    return {
      baseUrl: process.env.VUE_APP_APP_BASEURL,
      fileData: {
        token: this.$store.state.userMsg.token,
      },
      ruleForm: {
        title: '',
        create_user: '',
        content: '',
      },
      rules: {
        title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
        create_user: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        content: [{ required: true, message: '请输入通知正文', trigger: 'blur' }],
      },
      editorOption: {
        placeholder: '请输入...',
        modules: {
          imageDrop: true, //图⽚拖拽
          imageResize: {
            //放⼤缩⼩
            // displaySize: true,
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white',
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
          },
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
            ['image'], // 链接、图片
          ],
        },
      },
      filesList: [],
      submitLoading: false,
      uploadRes: false,
    }
  },
  mounted() {
    this.initTitle()
    this.ruleForm.title = this.detailNotice.title
    this.ruleForm.create_user = this.detailNotice.create_user
    this.ruleForm.content = this.detailNotice.content
    this.detailNotice.notice_file?.forEach((item) => {
      let obj1 = {}
      obj1.name = item.file_name
      obj1.url = item.url
      this.filesList.push(obj1)
    })
  },
  methods: {
    initTitle() {
      for (let item of titleConfig) {
        let tip = document.querySelector('.quill-editor ' + item.Choice)
        if (!tip) continue
        tip.setAttribute('title', item.title)
      }
    },
    // beforeUpload(file) {
    //   console.log('上传前：', file)
    //   this.uploadRes = true
    // },
    uploadSuccess(response) {
      let obj1 = {}
      obj1.name = response.data.file_name
      obj1.url = response.data.file_url
      this.filesList.push(obj1)
      this.uploadRes = false
    },
    handleRemove(file, fileList) {
      if (this.uploadRes) {
        this.uploadRes = false
      }
      this.filesList = fileList
    },
    fileBeforeUpload(file) {
      if (!/\.(doc|docx|pdf|jpg|png|xlsx|xls)$/i.test(file.name)) {
        this.$message.error(
          '上传文件只能是 .doc、.docx、.pdf、.jpg、.png、.xlsx、.xls 格式!'
        )
        return false
      }
      this.uploadRes = true
      console.log('🚀 ~ file: ExperimentPlan.vue:1308 ~ fileBeforeUpload ~ file:', file)
    },
    submitForm: debounce(async function (formName) {
      if (this.uploadRes) {
        this.$message({
          type: 'warning',
          message: '请等图片上传结束在提交通知',
        })
        return
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            let notice_file = []
            this.filesList.forEach((item) => {
              let obj = {}
              obj.file_name = item.name
              obj.url = item.url
              notice_file.push(obj)
            })
            let params = {
              title: this.ruleForm.title,
              create_user: this.ruleForm.create_user,
              content: this.ruleForm.content,
              notice_file,
            }
            if (this.isEdit) {
              params['id'] = this.editId
            }
            const { code } = await saveNotice(params)
            if (code === 10) {
              this.$message({
                type: 'success',
                message: '保存成功',
              })
              setTimeout(() => {
                this.submitLoading = false
              }, 1000)
              this.$emit('back')
            } else {
              setTimeout(() => {
                this.submitLoading = false
              }, 1000)
            }
          } catch (error) {
            setTimeout(() => {
              this.submitLoading = false
            }, 1000)
            console.log(error)
            throw new Error('error')
          }
        }
      })
    }, 500),
  },
}
</script>

<style lang="scss" scoped>
.isDisabled {
  pointer-events: none;
}

.edit {
  width: 80px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 5px;
  cursor: pointer;
}

.addContainer {
  text-align: left;

  .add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #dcece3;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);

    span {
      font-size: 20px;
      font-weight: bold;
      color: #05c65d;
      margin-left: 20px;
    }

    .btn-edit {
      width: 80px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      cursor: pointer;
      margin-right: 20px;
    }
  }

  .demo-ruleForm {
    // border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
    padding: 20px;
  }

  .el-input {
    width: 45%;
  }
}

.newTitle ::v-deep .el-form-item__content {
  display: flex;

  .explain {
    flex: 1;
    color: #ee9a59;
    margin-left: 20px;
  }
}

:deep(.ql-toolbar) {
  text-align: left;
}

:deep(.ql-editor) {
  min-height: 300px;
}

:deep(.ql-formats) {
  height: 21px;
  line-height: 21px;
}

.file .el-form-item__content {
  position: relative;
}
::v-deep em {
  font-style: italic !important;
}
::v-deep.el-input .el-input__inner {
  width: 100% !important;
}
.tips {
  position: absolute;
  top: 0;
  left: 100px;
  font-size: 16px;
  color: #ee9a59;
  margin-left: 60px;
}
.btn-upload {
  width: 134px;
  height: 34px;
  line-height: 34px;
  border-radius: 5px;
  img {
    width: 20px;
    height: 20px;
    position: relative;
    top: 5px;
  }
}
::v-deep .upload-btn {
  padding: 4px 20px 10px;
  border-color: #05c65d;
}
.uploadFail {
  width: 20px;
  height: 20px;
  position: relative;
  top: 5px;
}
</style>
