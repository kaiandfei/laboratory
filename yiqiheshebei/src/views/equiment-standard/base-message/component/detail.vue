<template>
  <div>
    <el-drawer custom-class="bm-detail-dialog" v-model="detailStatus" title="详情" width="50%">
      <div class="left-box">
        <p>
          <span>分类编号：</span>
          <span>{{ tableData.number }}</span>
        </p>
        <p>
          <span>名称：</span>
          <span>{{ tableData.name }}</span>
        </p>
        <p>
          <span>规格型号：</span>
          <span>{{ tableData.specification }}</span>
        </p>
        <p>
          <span>分类：</span>
          <span>{{ categoryComputed }}&nbsp;&nbsp;</span>
        </p>
        <p>
          <span>价值分类：</span>
          <span>{{ tableData.cost_type.content }}</span>
        </p>
        <p>
          <span>单位：</span>
          <span>{{ tableData.unit }}</span>
        </p>
        <p>
          <span>功能描述：</span>
          <span>{{ tableData.info }}</span>
        </p>
        <p>
          <span>使用期限：</span>
          <span>{{ tableData.number_year }}</span>
        </p>
        <p>
          <span>参考价格：</span>
          <span>{{ tableData.unit_price }}</span>
        </p>
        <p>
          <span>执行标准代号：</span>
          <span>{{ tableData.norm }}</span>
        </p>
      </div>
      <div class="right-box">
        <p>
          <span>照片：</span>
          <img v-for="(item, index) in tableData.url_path" :key="index" :src="item.url_path" alt="" />
        </p>
        <p>
          <span>上次编辑时间：</span>
          <span>{{ tableData.update_time }}</span>
        </p>
        <p>
          <span>上次编辑人：</span>
          <span>{{ tableData.user_name }}</span>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="back()">取消</el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, watch, computed } from 'vue'

import { getInstrumentSingle } from '@service/equiment-standard/base-message/index'
import { detailData } from '@service/equiment-standard/base-message/types'

import { useStore } from '@store/index'

let props = defineProps({ detailShow: Boolean, itemId: { type: String, required: true } })
let { detailShow, itemId } = toRefs(props)

let dataMap = reactive({
  detailStatus: false,
  tableData: detailData
})

let { detailStatus, tableData } = toRefs(dataMap)

const categoryComputed = computed(() => {
  let arr = tableData.value.categorys.map((e) => {
    return e.title
  })
  return arr.join(',')
})

const getData = (number: string) => {
  getInstrumentSingle({
    number
  }).then((res) => {
    tableData.value = res.data
  })
}

getData(itemId.value)

const store = useStore()
let options = [...store.state.common.subjectArr]

console.log(options)

let emit = defineEmits(['back'])

const back = () => {
  emit('back')
}

detailStatus.value = detailShow.value

watch(detailStatus, (val) => {
  if (val === false) {
    back()
  }
})
</script>

<style lang="scss" scoped>
:deep(.bm-detail-dialog) {
  .el-drawer__body {
    overflow: auto;
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    // display: flex;
    text-align: left;
    .left-box,
    .right-box {
      flex: 1;
      & > p {
        font-size: 16px;
        padding: 10px 0 10px 50px;
        span {
          display: inline-block;
        }
        span:nth-of-type(1) {
          width: 120px;
          color: #848484;
        }
        img {
          margin-bottom: 20px;
          vertical-align: top;
          width: 200px;
          height: 114px;
        }
      }
    }
    .right-box {
      flex: 1;
    }
  }
}
</style>
