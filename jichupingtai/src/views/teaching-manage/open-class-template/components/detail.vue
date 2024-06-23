<template>
  <div>
    <div class="header">
      <div class="title">
        模版名称：
        <div class="details">{{ forms.name }}</div>
      </div>
      <div class="button-box">
        <div class="btn green-btn" @click="back(forms)">编辑</div>
        <div class="btn green-btn" @click="exportItem()">导出</div>
        <div class="btn white-btn" @click="back()">返回</div>
      </div>
    </div>
    <div class="box">
      <div class="line-box">
        <div class="line line-title">
          <div class="lb">列表</div>
          <div class="rb">分值</div>
        </div>
        <div class="line border-b" v-for="(item, index) in forms.evaluation_project" :key="index">
          <div class="lb">{{ item.project }}</div>
          <div class="rb">
            {{ item.score }}
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
import { findEvaluationProjectTemplate } from '@service/teaching/open-class'
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      forms: {}
    }
  },

  created() {
    this.getData()
    // this.forms = this.propsData
  },
  // mounted() {},
  methods: {
    getData() {
      findEvaluationProjectTemplate({
        id: this.propsData.id
      }).then((res) => {
        this.forms = res.data
      })
    },
    back(item) {
      this.$emit('back', item)
    },
    exportItem() {
      const token = localCache.getCookie('swr_token')
      axios
        .post(
          process.env.VUE_APP_BASE_URL + '/teach/EvaluationProjectTemplate/downloadEvaluationProject',
          { id: this.forms.id, token },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName = this.forms.name + '-' + '公开课评价模版导出.xlsx'
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
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
    align-items: flex-start;
    margin: 0 0 10px 0;
    // height: 30px;
    line-height: 30px;
    text-align: left;
    font-size: 14px;
    .lb {
      flex: 2;

      // text-align: right;
    }
    .rb {
      flex: 1;
      text-align: center;
      ::v-deep .el-input {
        margin-right: 10px;
        width: 240px;
        .el-input__inner {
          width: 100% !important;
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
