<template>
  <div>
    <div class="title">
      <div class="text-box">
        <p>{{ props.item?.category.title }}适用学校列表</p>
        <p class="fr btn" @click="sureClick">保存</p>
      </div>
    </div>
    <p class="school-num">
      共选择
      <span>{{ schoolNumCom }}</span>
      所学校
    </p>
    <div class="content">
      <div class="area-box" v-for="(item, index) in tableData" :key="index">
        <p>{{ item.pro }}-{{ item.city }}-{{ item.area }}</p>
        <el-table
          :ref="setRef"
          :data="item.list"
          style="width: 100%"
          height="540"
          :header-row-style="{ height: 50 + 'px' }"
          :header-cell-style="{ background: '#EFEFEF', color: '#333333', padding: 0 + 'px' }"
          :row-style="{ height: 50 + 'px' }"
          :cell-style="{ padding: 0 + 'px' }"
        >
          <el-table-column type="index" label="序号" prop="" width="60" />
          <el-table-column type="" label="名称" prop="name" />
          <el-table-column type="" prop="" width="60">
            <template #header>
              <div class="my-checkbox-box">
                <input
                  class="my-checkbox"
                  type="checkbox"
                  v-model="checkAllList[index]"
                  @change="changeCheckAll(index)"
                />
              </div>
            </template>
            <template #default="scope">
              <div class="my-checkbox-box">
                <input class="my-checkbox" type="checkbox" v-model="scope.row.is_select" @change="changeCheck(index)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, reactive, toRefs, computed } from 'vue'

import { applSchool, saveSchoolSelect } from '@service/laboratory-standard/equipped-standard/index'
import { SchoolRequestData } from '@service/laboratory-standard/equipped-standard/types'
import { ElMessage } from 'element-plus'

const props = defineProps({ item: Object, mateType: Number })
console.log(props.item)
let dataMap = reactive({
  tableData: [SchoolRequestData],
  checkAllList: Array<boolean>()
})
let { tableData, checkAllList } = toRefs(dataMap)

const schoolNumCom = computed(() => {
  let num = 0
  tableData.value.forEach((body) => {
    body.list.forEach((i) => {
      if (i.is_select) {
        num = num + 1
      }
    })
  })
  return num
})

const changeCheckAll = (index: number) => {
  console.log('1111')
  if (checkAllList.value[index]) {
    tableData.value[index].list.forEach((e) => {
      e.is_select = true
    })
  } else {
    tableData.value[index].list.forEach((e) => {
      e.is_select = false
    })
  }
}

const changeCheck = (index: number) => {
  if (tableData.value[index].list.every((e) => e.is_select)) {
    checkAllList.value[index] = true
  } else {
    checkAllList.value[index] = false
  }
}

const getSchool = () => {
  applSchool({
    standard_id: props.item?.category.id
  }).then((res) => {
    if (res.code === 10) {
      tableData.value = res.data
      tableData.value.forEach((e) => {
        if (e.list.every((m) => m.is_select)) {
          checkAllList.value.push(true)
        } else {
          checkAllList.value.push(false)
        }
      })
    }
  })
}
getSchool()

// 存储dom数组
const myRef = ref([])
const setRef = (el: HTMLElement) => {
  ;(myRef.value as Array<HTMLElement>).push(el)
}

let clickArr: Array<any> = reactive([])
const sureClick = () => {
  clickArr = []
  tableData.value.forEach((body) => {
    body.list.forEach((i) => {
      if (i.is_select) {
        clickArr.push(i.id)
      }
    })
  })
  saveSchoolSelect({
    standard_id: props.item?.category.id,
    school_ids: clickArr,
    type: props.mateType
  }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      getSchool()
    }
  })
}
</script>

<style scoped lang="scss">
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  box-sizing: border-box;
  background: #dcece3;
  .text-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: #05c65d;
  }
}
.school-num {
  padding: 16px 30px;
  font-size: 20px;
  text-align: left;
  & > span {
    margin: 0 6px;
    color: #05c65d;
  }
}
.content {
  display: flex;
  flex-wrap: wrap;
  .area-box {
    margin: 0 1.2% 20px 0;
    width: 24%;
    background: #fff;
    p {
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      background: #d9d9d9;
    }
    .my-checkbox-box {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .area-box:nth-of-type(4n) {
    margin-right: 0;
  }
}
.btn {
  width: 78px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
.btn-white {
  color: #05c65d;
  border: 1px solid #05c65d;
  background: #f3f3f3;
}
.btn-gray {
  color: #fff;
  border: 1px solid #b5b5b5;
  background: #b5b5b5;
}
.green {
  color: #05c65d;
}
.yellow {
  color: #ec8c42;
}
input[type='checkbox'] {
  cursor: pointer;
  position: relative;
  width: 16px;
  height: 16px;
  font-size: 14px;
}

input[type='checkbox']::after {
  position: absolute;
  top: 0;
  color: #000;
  width: 16px;
  height: 16px;
  display: inline-block;
  visibility: visible;
  padding-left: 0px;
  text-align: center;
  content: ' ';
  border-radius: 3px;
}

input[type='checkbox']:checked::after {
  content: ' ';
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  background: #fff url('../../../../assets/images/common/check.png');
  background-size: cover;
}
</style>
