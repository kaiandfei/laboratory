<template>
  <div>
    <header>
      <div class="fl">
        <span>{{ route.meta.type === 1 ? route.meta.name + '标准' : '仪器设备标准' }}</span>
        <el-icon><arrow-right /></el-icon>
        <span :class="{ 'title-cancel': status !== 0 }" @click="cancel">
          {{ route.meta.type === 1 ? route.meta.name + '配备标准' : route.meta.name }}
        </span>
        <el-icon v-show="status"><arrow-right /></el-icon>
        <span v-show="status === 1">适用学校</span>
        <span v-show="status === 2 && route.meta.type === 1">标准配备列表</span>
        <!-- <span v-show="status === 2 && route.meta.type === 1">轨数详情</span> -->
        <span v-show="status === 2 && route.meta.type === 2">配置详情</span>
      </div>
      <div
        v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
        v-show="status === 0"
        class="btn"
        @click="addClick('新建')"
      >
        新建区域类{{ route.meta.type === 1 ? route.meta.name + '配备标准' : route.meta.name }}
      </div>
      <div v-show="status !== 0" class="fr" @click="cancel">
        <img src="@assets/images/laboratory-standard/cancel.png" alt="" />
        <span class="cancel">返回</span>
      </div>
    </header>
    <!-- <div v-if="false" v-show="status === 0" class="recommend">
      <p>{{ route.meta.name }}配备标准</p>
      <div class="btn" @click="addShow = true">新建区域类{{ route.meta.name }}配备标准</div>
    </div> -->
    <el-dialog
      custom-class="add-dialog"
      v-model="addShow"
      :title="`${dialogTitle}区域类${route.meta.type === 1 ? route.meta.name + '配备标准' : route.meta.name}`"
      width="30%"
    >
      <div>
        区域类型命名：
        <el-input v-model="addName" maxlength="25" placeholder="请输入区域类型" show-word-limit></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addShow = false">取消</el-button>
          <el-button type="primary" @click="addTracksSetting()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <TracksSetting
      v-show="status === 0"
      :change-key="changeKey"
      :meta="route.meta"
      @get-detail="getDetail"
      @show-school="showSchool"
      @show-edit="showEdit"
    />
    <ApplicableSchool v-if="status === 1" :item="applicableSchool" :mateType="mateType" />
    <TracksDetail v-if="status === 2 && route.meta.type === 1" :item="detailItem" />
    <ConfigDetail v-if="status === 2 && route.meta.type === 2" :item="detailItem" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'

import TracksSetting from './component/tracks-setting.vue'
import ApplicableSchool from './component/applicable-school.vue'
import TracksDetail from './component/tracks-detail.vue'
import ConfigDetail from '@/views/equiment-standard/equipped-standard/config-detail.vue'

import { ElMessage } from 'element-plus'

import { addConfig, editRailCateName } from '@service/laboratory-standard/equipped-standard/index'
import {
  RequestDataTpl,
  RequestDataTplType,
  RequestData,
  RequestDataType
} from '@service/laboratory-standard/equipped-standard/types'
import { useStore } from '@store/index'

let store = useStore()

// 0：首页 1：适用学校 2：详情
let status = ref(0)
let route = useRoute()

let dataMap = reactive({
  detailItem: RequestDataTpl,
  applicableSchool: RequestData
})

let { detailItem, applicableSchool } = toRefs(dataMap)

let cancel = () => {
  detailItem.value = RequestDataTpl
  status.value = 0
}

let addShow = ref(false)

let changeKey = ref(false)
watch(
  () => {
    return route.meta.type
  },
  () => {
    changeKey.value = !changeKey.value
    status.value = 0
  }
)
let addName = ref('')
let editId = ref(0)
let addTracksSetting = async () => {
  if (dialogTitle.value === '编辑') {
    try {
      const params = {
        id: editId.value,
        title: addName.value
      }
      const { code } = await editRailCateName(params)
      if (code === 10) {
        ElMessage({
          message: '修改成功',
          type: 'success'
        })
        addShow.value = false
      }
    } catch (error) {
      console.log('err', error)
    }
  } else {
    addConfig({
      type: route.meta.type as number,
      title: addName.value
    }).then((res) => {
      if (res.code === 10) {
        ElMessage({
          message: res.msg,
          type: 'success'
        })
        changeKey.value = !changeKey.value
        addShow.value = false
        addName.value = ''
      }
    })
  }
}
let mateType = ref<number>(0)
let showSchool = (item: RequestDataType, type: number) => {
  applicableSchool.value = item
  mateType.value = type
  status.value = 1
}

let getDetail = (item: RequestDataTplType) => {
  detailItem.value = item
  status.value = 2
}
let dialogTitle = ref('')
const addClick = (val: any) => {
  dialogTitle.value = val
  addShow.value = true
  addName.value = ''
}
const showEdit = (item: any, val: string) => {
  console.log('123', item)
  dialogTitle.value = val
  addShow.value = true
  addName.value = item.category.title
  editId.value = item.category.id
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;
  opacity: 1;
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    .title-cancel {
      cursor: pointer;
    }
    .cancel {
      margin-left: 10px;
    }
  }
  .fr {
    cursor: pointer;
  }
  .btn {
    float: right;
  }
}
.recommend {
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  // height: 60px;
  // background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  p:nth-of-type(1) {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }
}

footer {
  margin: 16px;
  display: flex;
  justify-content: right;
  p {
    margin-right: 30px;
    height: 36px;
    line-height: 36px;
    span {
      font-size: 16px;
      font-weight: bold;
      line-height: 21px;
      color: #05c65d;
      opacity: 1;
    }
  }
}
:deep(.add-dialog) {
  div {
    .el-input {
      width: 300px;
    }
  }
}
.btn {
  padding: 0 20px;
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
