<template>
  <div class="filter">
    <el-form :inline="true" :model="configForm" class="demo-form-inline" label-width="80px">
      <el-form-item label="所属级别">
        <el-select v-model="configForm.level" class="m-2" placeholder="请选择所属级别" @change="handleLevelChange">
          <!-- <el-option label="全部" value=""></el-option> -->
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="区域">
        <el-select v-model="configForm.region" class="m-2" placeholder="请选择区域" @change="handleRegionChange">
          <!-- <el-option label="全部" value=""></el-option> -->
          <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="模板类型">
        <el-select
          v-model="configForm.type"
          class="m-2"
          placeholder="请选择模板类型"
          @change="handleTemplateTypeChange"
        >
          <el-option v-for="item in templateTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="configForm.is_active" class="m-2" placeholder="请选择状态" @change="handleStatusChange">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人">
        <el-select v-model="configForm.user_id" class="m-2" placeholder="请选择创建人" @change="handleCreateUserChange">
          <el-option label="全部" value=" "></el-option>
          <el-option v-for="item in createUserOptions" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from 'vue'
import { useStore } from '@store/index'
import { selectUser } from '@/service/dataPage/index'
const $emit = defineEmits(['getIsActive', 'getType', 'getUserId'])
const store = useStore()
const configForm: any = ref({
  level: store.state.login?.userInfo.area_level,
  region: '',
  type: '',
  is_active: '',
  user_id: store.state.login?.userInfo.id
})
if (store.state.login?.userInfo.role_id === 1) {
  configForm.value.level = 3
  configForm.value.region = store.state.login?.userInfo.school_id
} else {
  configForm.value.level = store.state.login?.userInfo.area_level === 2 ? 1 : 2
  configForm.value.region =
    store.state.login?.userInfo.area_level === 2 ? store.state.login?.userInfo.city : store.state.login?.userInfo.area
}
//所属级别列表
let levelOptions = ref<any>([])
let regionOptions = ref<any>([])

const getAreaLevel = () => {
  if (store.state.login?.userInfo.role_id === 1) {
    levelOptions.value = [
      {
        label: '校级',
        value: 3
      }
    ]
    regionOptions.value = [
      {
        label: store.state.login?.userInfo.school.name,
        value: store.state.login?.userInfo.school_id
      }
    ]
  } else {
    switch (store.state.login?.userInfo.area_level) {
      case 2:
        levelOptions.value = [
          {
            label: '市级',
            value: 1
          }
        ]
        regionOptions.value = [
          {
            label: store.state.login?.userInfo.cityname,
            value: store.state.login?.userInfo.city
          }
        ]
        break
      case 3:
        levelOptions.value = [
          {
            label: '区级',
            value: 2
          }
        ]
        regionOptions.value = [
          {
            label: store.state.login?.userInfo.areaname,
            value: store.state.login?.userInfo.area
          }
        ]
        break
    }
  }
}
getAreaLevel()
//模板类型列表
const templateTypeOptions = ref([
  {
    label: '全部',
    value: ' '
  },
  {
    label: '系统模板',
    value: 1
  },
  {
    label: '自定义模板',
    value: 2
  }
])
//状态列表
const statusOptions = ref([
  {
    label: '全部',
    value: ' '
  },
  {
    label: '使用中',
    value: 1
  },
  {
    label: '未使用',
    value: 0
  }
])
//创建人列表
const createUserOptions = ref<any>([])
const getUser = async () => {
  try {
    let params: any = {
      subject_id: '',
      role_id: store.state.login?.userInfo.role_id
    }
    if (configForm.value.level === 1) {
      params['city'] = store.state.login?.userInfo.city
      params['area_level'] = 2
    }
    if (configForm.value.level === 2) {
      params['area'] = store.state.login?.userInfo.area
      params['area_level'] = 3
    }
    if (configForm.value.level === 3) {
      params['school_id'] = store.state.login?.userInfo.school_id
    }
    const { data, code } = await selectUser(params)
    if (code === 10) {
      createUserOptions.value = data
      // console.log('selectUser', data)
    }
  } catch (error) {
    console.log(error)
  }
}
getUser()
//所属级别选择事件
const handleLevelChange = (val: any) => {
  console.log('112', val)
}
//区域选择事件
const handleRegionChange = (val: any) => {
  console.log('112', val)
}
//模板类型选择事件
const handleTemplateTypeChange = (val: any) => {
  $emit('getType', val)
}
//状态选择事件
const handleStatusChange = (val: any) => {
  $emit('getIsActive', val)
}
//创建人选择事件
const handleCreateUserChange = (val: any) => {
  $emit('getUserId', val)
}
defineExpose({ configForm })
</script>

<style lang="scss" scoped>
.filter {
  display: flex;
  align-items: center;
  height: 60px;
  background-color: #fff;
  ::v-deep .el-form-item {
    margin: 10px 0;
  }
  ::v-deep .el-select {
    width: 140px;
  }
}
</style>
