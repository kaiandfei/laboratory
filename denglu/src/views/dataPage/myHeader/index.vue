<template>
  <div class="header-container">
    <div class="header-left">
      <el-select v-model="city" class="m-2" placeholder="请选择市" @change="handleCity">
        <el-option v-for="item in cityOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-select v-model="area" class="m-2" placeholder="请选择区" @change="handleArea">
        <el-option v-for="item in areaOptions" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-select v-model="school" class="m-2" placeholder="请选择学校">
        <el-option v-for="item in schoolOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select
        v-if="menuItemTitle !== '开课数据中心' || LocalCache.getCache('comType') == 2"
        v-model="standardLevel"
        class="m-2"
        placeholder="请选择"
        @change="handleMeasurementChange"
      >
        <el-option v-for="item in measurementList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select
        v-if="menuItemTitle === '开课数据中心' || LocalCache.getCache('comType') == 2"
        v-model="laboratoryUseFrequency"
        class="m-2"
      >
        <el-option
          v-for="(item, index) in laboratoryUseFrequencyList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="header-right">
      <div class="home" @click="jumpHome">
        <!-- <el-icon><House /></el-icon> -->
        <img src="@/assets/images/bigData/home.png" alt="" />
        首页
      </div>
      <div class="config" @click="jumpConfig">
        <!-- <el-icon><Setting /></el-icon> -->
        <img src="@/assets/images/bigData/config.png" alt="" />
        配置中心
      </div>
      <div class="moreData" @click="jumpMoreData">
        <!-- <el-icon><More /></el-icon> -->
        <img src="@/assets/images/bigData/more-data.png" alt="" />
        更多数据
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { findArea, getSchoolList } from '@service/login/login'
import LocalCache from '@/utils/localCache'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index'
//仓库
const store = useStore()
//路由
const router = useRouter()
//获取用户信息
const props = defineProps(['menuItemTitle', 'schoolyearList', 'areaCode'])
//市区学校列表
const $emit = defineEmits(['getCity', 'getArea', 'getSchool', 'getStandardLevel', 'getSchoolyear'])
let city = ref(store.state.login?.userInfo.city || '')
let area = ref(store.state.login?.userInfo.area_level === 3 ? store.state.login?.userInfo.area : '')
let school = ref(store.state.login?.userInfo.role_id === 1 ? store.state.login?.userInfo.school_id : '')
let standardLevel = ref(2)
let cityOptions = ref<any>([])
let areaOptions = ref<any>([])
let schoolOptions = ref<any>([])
let laboratoryUseFrequencyList = ref(props.schoolyearList)
let measurementList = ref([
  {
    label: '按照省级标准测算',
    value: 1
  },
  {
    label: '按照市级标准测算',
    value: 2
  },
  {
    label: '按照区级标准测算',
    value: 3
  }
])

//获取市、区
const getFindArea = async (level: any, id: number) => {
  try {
    let params: any = {
      area_level: level,
      p_id: id
    }
    const { data, code } = await findArea(params)
    if (code === 10) {
      switch (level) {
        case 2:
          cityOptions.value = data
          break
        case 3:
          areaOptions.value = data
          break
      }
    }
  } catch (error) {
    console.log(error)
  }
}
//获取学校
const getSchoolListData = async (val: any) => {
  try {
    const params = {
      area: val
    }
    const { data, code } = await getSchoolList(params)
    if (code === 10) {
      schoolOptions.value = data
      // console.log('1', data)
    }
  } catch (error) {
    console.log(error)
  }
}
if (store.state.login?.userInfo.role_id === 1) {
  cityOptions.value = [
    {
      name: store.state.login?.userInfo.cityname,
      code: store.state.login?.userInfo.city
    }
  ]
  areaOptions.value = [
    {
      name: store.state.login?.userInfo.areaname,
      code: store.state.login?.userInfo.area
    }
  ]
  schoolOptions.value = [
    {
      name: store.state.login?.userInfo.school.name,
      id: store.state.login?.userInfo.school_id
    }
  ]
} else {
  switch (store.state.login?.userInfo.area_level) {
    case 2:
      cityOptions.value = [
        {
          name: store.state.login?.userInfo.cityname,
          code: store.state.login?.userInfo.city
        }
      ]
      getFindArea(3, city.value)
      break
    case 3:
      cityOptions.value = [
        {
          name: store.state.login?.userInfo.cityname,
          code: store.state.login?.userInfo.city
        }
      ]
      areaOptions.value = [
        {
          name: store.state.login?.userInfo.areaname,
          code: store.state.login?.userInfo.area
        }
      ]
      getSchoolListData(area.value)
      break
  }
}
//选择测算方式
const handleMeasurementChange = (val: any) => {
  console.log(val)
  $emit('getStandardLevel', val)
}
let laboratoryUseFrequency = ref(
  new Date().getMonth() + 1 <= 8 && new Date().getMonth() + 1 > 2
    ? new Date().getFullYear() - 1 + ',' + 2
    : new Date().getFullYear() + ',' + 1
)

//去首页
const jumpHome = () => {
  window.location.href = process.env.VUE_APP_APP_LOGINURL as string
  LocalCache.setCache('menuItemI', 0)
  LocalCache.setCache('menuItemTitle', '数据中心')
  store.commit('router/setHasPermission', false)
  // router.push('/dataPage')
}
//去配置中心
const jumpConfig = () => {
  router.push('/configPage')
}
//去更多数据
const jumpMoreData = () => {
  router.push('/moreData')
}
const handleCity = (val: any) => {
  area.value = ''
  school.value = ''
  schoolOptions.value = []
  getFindArea(3, val)
}
const handleArea = (val: any) => {
  school.value = ''
  schoolOptions.value = []
  getSchoolListData(val)
}
watch(
  () => laboratoryUseFrequency.value,
  (newValue, oldValue) => {
    $emit('getSchoolyear', newValue)
  },
  { immediate: true }
)
//监听市、区变化
watch(
  () => city.value,
  (newValue, oldValue) => {
    $emit('getCity', newValue)
  },
  { immediate: true }
)
watch(
  () => area.value,
  (newValue, oldValue) => {
    $emit('getArea', newValue)
  },
  { immediate: true }
)
watch(
  () => props.areaCode,
  (newValue, oldValue) => {
    if (store.state.login?.userInfo.area_level === 2) {
      area.value = newValue
      school.value = ''
      schoolOptions.value = []
      getSchoolListData(newValue)
    }
  }
)
watch(
  () => school.value,
  (newValue, oldValue) => {
    $emit('getSchool', newValue)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
img {
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  .header-right {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-style: italic;
    z-index: 1;
    .home,
    .config,
    .moreData {
      display: flex;
      align-items: center;
      margin-left: 20px;
      color: #fff;
      cursor: pointer;
      .el-icon {
        margin-right: 5px;
      }
    }
    .home:hover,
    .config:hover,
    .moreData:hover {
      color: #00adff;
    }
  }
}
.header-left {
  display: flex;
}
::v-deep .el-select {
  width: 120px;
  margin-right: 5px;
  .el-select__wrapper {
    background-color: #001e3d;
    box-shadow: unset !important;
    // border: 1px solid #12cbf1;
    .el-select__icon {
      color: #00adff;
    }
  }
  .el-select__placeholder {
    color: #fff !important;
  }
}
</style>
