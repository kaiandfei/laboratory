<template>
  <div class="box">
    <div class="header">
      <div class="title">
        *模版名称：
        <div class="details">
          <el-input
            class="border-b"
            v-model="forms.name"
            type="text"
            maxlength="12"
            show-word-limit
            placeholder="请输入模版名称"
          ></el-input>
        </div>
      </div>
      <div class="button-box">
        <div class="btn green-btn" @click="save(forms)">保存</div>
        <div class="btn green-btn" @click="exportTemplate()">下载模版</div>

        <el-upload
          :show-file-list="false"
          class="upload-demo"
          action=""
          :auto-upload="false"
          :multiple="false"
          :on-change="uploadChange"
          accept=".xls,.xlsx"
        >
          <div class="btn green-btn">导入</div>
        </el-upload>

        <div class="btn white-btn" @click="back(forms)">返回</div>
      </div>
    </div>
    <div class="box">
      <div class="line-box">
        <div class="line line-title">
          <div class="lb">列表</div>
          <div class="rb">分值</div>
        </div>
        <div class="line" v-for="(item, index) in forms.evaluation_project" :key="index">
          <div class="lb">
            <el-input
              v-model="item.project"
              type="textarea"
              autosize
              placeholder="请填写评价条目"
              maxlength="256"
              show-word-limit
            ></el-input>
          </div>
          <div class="rb">
            <el-select v-model="item.score" filterable placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :value="item.value"></el-option>
            </el-select>
            <i class="el-icon-close" v-if="forms.evaluation_project.length > 1" @click="deleteLine(index)"></i>
            <i class="el-icon-plus" @click="add(index)"></i>
          </div>
        </div>
        <div class="line line-title">
          <div class="lb">建议</div>
        </div>
        <div class="line">
          <div class="lb">
            <el-input type="textarea" placeholder="请输入建议" disabled></el-input>
          </div>
        </div>
      </div>
      <!-- <div class="type-title">建议</div> -->
    </div>
  </div>
</template>

<script>
import { saveTemplate, uploadEvaluationProjectTemplate } from '@service/teaching/open-class'

import axios from 'axios'
import localCache from '@/utils/localCache'

export default {
  name: '',
  props: {
    propsData: {
      type: Object,
      default: () => {
        return {}
      }
      // reportname, reportTempletData
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      forms: {
        name: '',
        evaluation_project: [
          {
            project: '',
            score: 1
          }
        ],
        type: 1 // 自定义模版
      },
      options: []
    }
  },

  created() {
    if (this.propsData.id) {
      this.forms = this.propsData
    }
  },
  mounted() {
    this.options = []
    for (let i = 0; i < 50; i++) {
      this.options.push({
        value: i + 1
      })
    }
  },
  methods: {
    back(item) {
      this.$emit('back', item)
    },
    add(index) {
      this.forms.evaluation_project.splice(index + 1, 0, { project: '', score: 1 })
    },
    deleteLine(index) {
      this.forms.evaluation_project.splice(index, 1)
    },
    uploadChange(file) {
      console.log('🚀 ~ file: edit.vue:135 ~ uploadChange ~ file:', { image: file.raw })
      let formData = new FormData()
      formData.append('file', file.raw)
      uploadEvaluationProjectTemplate(formData).then((res) => {
        if (res.code === 10) {
          this.forms.evaluation_project = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    exportTemplate() {
      const token = localCache.getCookie('swr_token')

      axios
        .post(
          process.env.VUE_APP_BASE_URL + '/teach/EvaluationProjectTemplate/downloadEvaluationProjectTpl',
          { token },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName = '公开课评价模版.xlsx'
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        })
    },
    save() {
      if (this.forms.name.trim() === '') {
        this.$message.error('请填写模版名称')
        return
      }
      let nullFlag = false,
        sum = 0

      for (const item of this.forms.evaluation_project) {
        if (item.project.trim() === '') {
          nullFlag = true
        }
        sum += item.score
      }

      if (nullFlag) {
        this.$message.error('请填写评价条目')
        return
      }

      if (sum !== 100) {
        this.$message.error('总分值不是100分')
        return
      }
      console.log(this.forms)
      saveTemplate(this.forms).then((res) => {
        if (res.code === 10) {
          this.$message.success('保存成功')
          this.back(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .box {
  --el-disabled-fill-base: #f5f7fa !important;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 20px;
  padding: 12px 10px 12px 20px;
  background: #dcece3;
  box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
  .title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    color: #05c65d;
    .details {
      width: 280px;
      color: #333;
      font-size: 18px;
    }
  }
}
.button-box {
  display: flex;
  .btn {
    margin: 0 10px;
  }
  .cancel {
    background-color: #a1a1a1;
    color: #fff;
  }
}
.box {
  padding-bottom: 20px;
  text-align: left;
  background: #fff;
  min-height: calc(100vh - 260px);

  .type-title {
    display: inline-block;
    width: 230px;
    height: 46px;
    line-height: 48px;
    font-size: 16px;
    color: #05c65d;
    text-align: center;
    border-bottom: #05c65d 4px solid;
  }
}
.line-box {
  padding: 12px 20px 0 20px;
  .line {
    display: flex;
    align-items: center;
    align-items: flex-start;
    margin: 0 0 10px 0;
    // height: 30px;
    line-height: 30px;
    text-align: left;
    font-size: 14px;
    .lb {
      flex: 2.5;

      // text-align: right;
    }
    .rb {
      display: flex;
      align-items: center;
      margin-left: 30px;
      flex: 1;
      text-align: center;
      i {
        margin: 0 10px;
        cursor: pointer;
        font-size: 18px;
      }
      .el-select {
        flex: 1;
      }
    }
    ::v-deep .el-input {
      width: 100%;
      line-height: 30px !important;

      .el-input__inner {
        width: 100% !important;
        // line-height: 30px !important;
      }
    }
    ::v-deep .border-b {
      .el-input__inner {
        border: none;
        border-radius: 0;
        border-bottom: 1px solid #c9c7c7;
      }
    }
  }
  .line.line-title {
    font-size: 16px;
    color: #05c65d;
  }
  .line.border-b {
    border-bottom: 1px solid #c9c7c7;
  }
}
</style>
