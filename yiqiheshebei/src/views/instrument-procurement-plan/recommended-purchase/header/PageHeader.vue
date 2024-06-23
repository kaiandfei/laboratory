<template>
  <div class="recommend">
    <p>仪器设备采购计划推荐列表</p>
    <p>
      <span>统计截止时间：</span>
      <span>{{ timeObj?.create_time }}</span>
    </p>
    <p>
      <span>上次修改时间：</span>
      <span>{{ timeObj?.update_time }}</span>
    </p>
    <div class="btn-box">
      <div v-if="[1, 2].includes(store.state.login.userInfo.role_id)" class="btn" @click="exportExcel()">导出</div>
      <div class="btn" @click="getNewRecommend(1)">点击获取最新推荐清单</div>
    </div>
  </div>
  <div class="filter-box">
    <!-- <BaseFilter :config-data="filterData" @change-filter="changeFilter" /> -->
    <div class="select">
      <p>学校：</p>
      <el-select v-model="fliterForm.school_id" placeholder="全部" @change="changeFilter">
        <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="select">
      <p>学段：</p>
      <el-select
        v-model="fliterForm.level"
        placeholder="全部"
        :disabled="schoolTimeIds.length < 2"
        @change="changeFilter"
      >
        <el-option v-for="item in sectionOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="select">
      <p>学科：</p>
      <el-select
        v-model="fliterForm.subject_id"
        clearable
        placeholder="全部"
        :disabled="[2, 3, 4].includes(store.state.login.userInfo.role_id)"
        @change="changeFilter"
      >
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="select">
      <p>类型：</p>
      <el-select v-model="fliterForm.type" clearable placeholder="全部" @change="changeFilter">
        <el-option v-for="item in filterData[0].list" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, reactive } from 'vue'
import { useStore } from '@/store'

import { ConfigDataType } from '@/components/base-filter/src/types'
// import { BaseFilter } from '@/components/base-filter'

let store = useStore()

let props = defineProps({
  timeObj: {
    type: Object
  }
})

let { timeObj } = toRefs(props)

let dataMap = reactive({
  fliterForm: {
    subject_id: store.state.login.userInfo.subject_id || '',
    school_id: store.state.login.userInfo.school.id || '',
    level: '',
    type: ''
  },
  filterData: Array<ConfigDataType>(),
  schoolList: [],

  options: [...store.state.common.subjectArr],
  schoolTimeIds: store.state.login.userInfo.phase_study_id.split(',')
})
let { fliterForm, filterData, schoolList, options, schoolTimeIds } = toRefs(dataMap)

const getSchoolList = () => {
  // 模拟
  schoolList.value = [
    {
      id: store.state.login.userInfo.school.id,
      name: store.state.login.userInfo.school.name
    }
  ]
  // findSchool().then((res) => {
  //   schoolList.value = res.data
  // })
}
getSchoolList()
let sectionOptions = ref([
  {
    id: '1',
    name: '小学'
  },
  {
    id: '2',
    name: '初中'
  },
  {
    id: '3',
    name: '高中'
  }
])
fliterForm.value.level = schoolTimeIds.value[0]
sectionOptions.value = sectionOptions.value.filter((e: any) => schoolTimeIds.value.includes(e.id))

filterData.value = [
  {
    name: '筛选',
    list: [
      // {
      //   id: 0,
      //   name: '全部'
      // },
      {
        id: 1,
        name: '仪器'
      },
      {
        id: 2,
        name: '设备'
      }
    ],
    keyName: 'type'
  }
]

const emit = defineEmits(['getNewRecommend', 'exportExcel'])

const changeFilter = (form: { type: number }) => {
  // fliterForm.value.type = form.type || 0
  emit('getNewRecommend', fliterForm.value)
}
const getNewRecommend = (is_update?: number) => {
  emit('getNewRecommend', { ...fliterForm.value, is_update: is_update })
}
const exportExcel = () => {
  emit('exportExcel')
}
</script>

<style scoped lang="scss">
.recommend {
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  background: #dcece3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  p {
    font-size: 16px;
    span:nth-of-type(1) {
      margin-right: 30px;
      color: #848484;
    }
  }
  p:nth-of-type(1) {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #05c65d;
  }
}
.filter-box {
  padding: 0 30px;
  width: 100%;
  height: 73px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .select {
    width: 400px;
    display: flex;
    align-items: center;
    p {
      margin-right: 1vw;
    }
  }
}
.btn-box {
  display: flex;
}
.btn {
  margin: 0 10px;
  padding: 0 30px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  cursor: pointer;
}
</style>
