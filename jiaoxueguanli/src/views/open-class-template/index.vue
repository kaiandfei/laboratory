<template>
  <div class="box-div">
    <div class="header">
      <p @click="back()">公开课评价管理</p>
      <div v-if="!editShow && !detailShow" class="fr">
        <button class="commonbtn no-print" @click="addNewTemplate({})">+ 新增</button>
      </div>
      <div v-else>
        <div v-show="detailShow"><i class="el-icon-arrow-right"></i>详情</div>
        <div v-show="editShow">
          <i class="el-icon-arrow-right"></i>{{ clickItem.id ? '新增' : '编辑' }}
        </div>
      </div>
    </div>
    <div v-show="!editShow && !detailShow">
      <top-filter
        ref="filterRef"
        :options="['template_type', 'create_user']"
        @change="getData"
      />
      <div class="module-box">
        <div
          class="module"
          v-for="(item, index) in list"
          :style="{ '--color': item.type === 1 ? '#05C65D' : '#5FAFE4' }"
          :key="index"
          @click="showDetail(item)"
        >
          <div class="row">
            <div class="title name">{{ item.name }}</div>
            <div class="type">{{ item.type === 1 ? '系统模板' : '自定义模板' }}</div>
          </div>
          <div class="over-hide">
            <div class="row" v-for="(m, n) in item.evaluation_project" :key="n">
              <div class="name">{{ m.project }}</div>
              <div class="value">{{ m.score }}</div>
            </div>
          </div>
          <div
            v-if="item.type !== 1"
            class="el-icon-delete-solid"
            @click.stop="deleteRow(item)"
          ></div>
        </div>
      </div>
    </div>
    <detail-vue v-if="detailShow" :propsData="clickItem" @back="back" />
    <edit-vue v-if="editShow" :propsData="clickItem" @back="saveBack" />
    <!-- <Footer/> -->
  </div>
</template>

<script>
import TopFilter from '@components/top-filter.vue'
import DetailVue from './components/detail.vue'
import EditVue from './components/edit.vue'

import { getPageData, deleteTemplate } from '@/network/open-class'

// import axios from 'axios'
// import localCache from '@/utils/localCache'

export default {
  name: '',
  components: {
    TopFilter,
    DetailVue,
    EditVue,
  },
  data() {
    return {
      detailShow: false,
      editShow: false,
      clickItem: {},
      list: [],
    }
  },
  created() {},
  beforeDestroy() {},
  computed: {},
  watch: {},
  methods: {
    getData(form) {
      console.log('🚀 ~ file: index.vue:49 ~ getData ~ form:', form)
      getPageData({
        type: form.template_type,
        create_user_id: form.create_user,
      }).then((res) => {
        console.log('🚀 ~ file: index.vue:87 ~ getPageData ~ res:', res)
        this.list = res.data
      })
    },
    addNewTemplate(item) {
      console.log(12)
      this.clickItem = item
      this.editShow = true
    },
    showDetail(item) {
      console.log('🚀 ~ file: index.vue:72 ~ showDetail ~ item:', item)
      this.clickItem = item
      this.detailShow = true
    },
    deleteRow(item) {
      console.log('🚀 ~ file: index.vue:68 ~ deleteRow ~ item:', item)
      this.$confirm('是否确认删除此模版?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteTemplate({
            id: item.id,
          }).then((res) => {
            if (res.code === 10) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.$refs.filterRef.changeValue()
            }
          })
        })
        .catch(() => {
          console.log('🚀 ~ file: index.vue:83 ~ deleteRow ~ 已取消删除:')
        })
    },
    back(item) {
      this.editShow = false
      this.detailShow = false
      this.clickItem = {}

      if (item) {
        this.clickItem = item
        this.editShow = true
      }
    },
    saveBack(item) {
      console.log('🚀 ~ file: index.vue:121 ~ saveBack ~ item:', item)
      this.editShow = false
      this.clickItem = item
      if (item.id) {
        this.detailShow = true
      }

      this.$refs.filterRef.changeValue()
    },
  },
}
</script>

<style lang="scss" scoped>
.box-div {
  box-sizing: border-box;
  padding: 8px 28px 10px 28px;
  width: 100%;
  .header {
    height: 44px;
    line-height: 44px;
    width: 100%;
    font-size: 16px;
    color: #626572;

    // box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    // background-color: #fff;
    text-align: left;

    span:nth-of-type(1):hover {
      color: #05c65d;
    }
    .commonbtn {
      margin: 6px 0 6px 20px;
      padding: 4px 18px;
      min-width: 0px;
      box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
    }

    p {
      float: left;
      cursor: pointer;
      // padding-left: 16px;
      // font-size: 16px;
    }
    p:hover {
      color: #05c65d;
    }
    button {
      float: left;
      margin: 6px 12px;
    }
    .graybtn {
      float: right;
    }
    .edit-button {
      float: right;
    }
    .selectInput {
      width: 276px;
      height: 30px;
      float: right;
      margin: 8px 0px 0 0;
      & input {
        padding: 0 12px 0 12px;
        width: 236px;
        height: 30px;
        box-sizing: border-box;
        transform: translate(0, -10px);
        border: 1px solid #c9c7c7;
        font-size: 14px;
      }
      div {
        display: inline-block;
        cursor: pointer;
        height: 30px;
        background-color: #05c65d;
        img {
          margin: 5px 10px;
          width: 20px;
          height: 20px;
          background: #05c65d;
          opacity: 1;
        }
      }
    }
  }
  .module-box {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    .module {
      position: relative;
      margin-bottom: 18px;
      padding: 20px 32px 36px;
      width: 32.5%;
      // border-bottom: 22px solid #fff;
      background: #ffffff;
      box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
      box-sizing: border-box;
      font-size: 14px;
      .over-hide {
        height: 300px;
        overflow: hidden;
      }
      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        text-align: left;
        .title {
          font-weight: bold;
          font-size: 18px;
          color: var(--color);
        }
        .type {
          width: 100px;
          height: 23px;
          line-height: 23px;
          background: var(--color);
          border-radius: 13px;
          color: #ffffff;
          text-align: center;
        }
        .name {
          width: calc(100% - 120px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .value {
          padding-right: 10px;
          width: 100px;
          text-align: right;
          box-sizing: border-box;
        }
      }
      .el-icon-delete-solid {
        position: absolute;
        right: 34px;
        bottom: 8px;
        font-size: 22px;
        color: #de4747;
        cursor: pointer;
      }
    }
    .module:nth-of-type(3n + 2) {
      margin: 0 1.25% 18px;
    }
  }
}
</style>
