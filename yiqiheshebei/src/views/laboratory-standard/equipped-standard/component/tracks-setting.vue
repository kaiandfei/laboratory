<template>
  <div>
    <template v-if="!noData">
      <div v-for="(baseItem, index) in baseData" :key="index" class="content-box">
        <div class="title" :class="[index % 2 === 0 ? 'green-bg' : 'yellow-bg']">
          {{ baseItem.category.title }}
          <div class="fr">
            <span v-if="![1, 2].includes(store.state.login.userInfo.role_id)" @click="showSchool(baseItem)">
              <img src="@assets/images/laboratory-standard/school.png" alt="" />
              适用学校
            </span>
            <span v-if="![1, 2].includes(store.state.login.userInfo.role_id)" @click="showEdit(baseItem)">
              <img src="@assets/images/laboratory-standard/edit.png" alt="" />
              编辑
            </span>
            <span v-if="![1, 2].includes(store.state.login.userInfo.role_id)" @click="deleteTracks(baseItem)">
              <img src="@assets/images/laboratory-standard/delete-green.png" alt="" />
              删除
            </span>
          </div>
        </div>
        <div class="content">
          <p>轨数配置列表</p>
          <el-table
            :data="baseItem.tpls"
            style="width: 100%"
            :header-cell-style="{ background: '#fff', color: '#000', borderBottom: '1px solid #05c65d' }"
            :cell-style="{ background: '#fff', borderBottom: '1px solid #d9d9d9' }"
          >
            <el-table-column prop="" label="学校轨数范围" align="left">
              <template #default="scope">
                <div>
                  <span>{{ scope.row.rail_min }}~{{ scope.row.rail_max }}轨</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="learning_info[0].title" label="学段" align="left" />
            <el-table-column prop="" label="操作" width="400" align="center">
              <template #default="scope">
                <span class="click-text green" @click="getDetail(scope.row)">
                  标准配备列表
                  <!-- {{ meta.type === 1 ? meta.name + '数量详情' : meta.name }} -->
                </span>
                <span
                  v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
                  class="click-text green"
                  @click="editItem(baseItem, scope.row)"
                >
                  编辑
                </span>
                <span
                  v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
                  class="click-text green"
                  @click="deleteItem(scope.row)"
                >
                  删除
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="![1, 2].includes(store.state.login.userInfo.role_id)" class="add-btn" @click="editItem(baseItem)">
          新增轨数范围
        </div>
      </div>
    </template>
    <el-empty v-else type="primary" />
    <el-dialog
      custom-class="ts-edit-dialog"
      :model-value="editShow !== ''"
      title="编辑or新增"
      width="30%"
      @close="editShow = ''"
    >
      <p>轨数范围：</p>
      <el-form ref="editForm" :model="editFormData" label-width="120px" :key="editShow">
        <el-form-item label="最小值：" class="numberCss">
          <el-input-number v-model.number="editFormData.rail_min" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="最大值：" class="numberCss">
          <el-input-number v-model.number="editFormData.rail_max" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="适用学段：">
          <el-select
            v-model="editFormData.learning_period_id"
            placeholder="请选择"
            :disabled="editShow === 'edit' && meta.type === 2"
          >
            <el-option
              v-for="item in sectionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <span v-show="true">*提示：与现有轨数配置发生冲突，无法保存</span> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editShow = ''">取消</el-button>
          <el-button type="primary" @click="sureClick()">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogTableVisible" title="是否应用该条数据作为该区域标准" :close-on-click-modal="false">
      <el-table :data="initTableData">
        <el-table-column v-for="(item, index) in columns" :key="index" :property="item.prop" :label="item.label" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, reactive, toRefs, h, watch } from 'vue'

import { ElMessageBox, ElMessage } from 'element-plus'

import {
  getConfig,
  addTracks,
  delTracks,
  delConfig,
  initStandard,
  equInitStandard
} from '@service/laboratory-standard/equipped-standard/index'
import { RequestDataTplType, RequestData, RequestDataType } from '@service/laboratory-standard/equipped-standard/types'

import { useStore } from '@/store'

const store = useStore()

const props = defineProps({
  changeKey: Boolean,
  meta: {
    type: Object,
    default: function () {
      return { name: '', type: 0 }
    }
  }
})
const emit = defineEmits(['showSchool', 'getDetail', 'showEdit'])

let { changeKey, meta } = toRefs(props)
watch(changeKey, () => {
  console.log('🚀 ~ file: tracks-setting.vue ~ line 95 ~ meta', meta)
  getData()
})

const showSchool = (item: RequestDataType) => {
  emit('showSchool', item, meta.value.type)
}
const showEdit = (item: any) => {
  emit('showEdit', item, '编辑')
}

const dialogTableVisible = ref(false)
const initTableData: any = ref([
  {
    range: '1~15轨',
    period: '小学'
  },
  {
    range: '1~15轨',
    period: '初中'
  },
  {
    range: '1~15轨',
    period: '高中'
  }
])
const columns = [
  {
    label: '学校轨数范围',
    prop: 'range'
  },
  {
    label: '学段',
    prop: 'period'
  }
]
const dataMap = reactive({
  baseData: [] as any,
  editBaseItem: RequestData
})
let { baseData, editBaseItem } = toRefs(dataMap)
let noData = ref(false)

const getInitTableData = async (_val: number) => {
  try {
    const { code } = await (_val === 1 ? initStandard : equInitStandard)()
    if (code === 10) {
      ElMessage({
        type: 'success',
        message: '应用成功'
      })
      dialogTableVisible.value = false
      getData()
    }
  } catch (error) {
    console.log(error)
  }
}
const confirm = () => {
  getInitTableData(meta.value.type)
}

const getData = () => {
  getConfig({ type: meta.value.type }).then((res) => {
    baseData.value = res.data
    if (baseData.value.length === 0) {
      noData.value = true
      console.log('111', res)
      dialogTableVisible.value = true
    } else {
      noData.value = false
    }
  })
}
getData()

const getDetail = (item: RequestDataTplType) => {
  emit('getDetail', item)
}

const deleteTracks = (item: RequestDataType) => {
  console.log('删除', item.category.id)
  ElMessageBox.confirm('是否确认删除(' + item.category.title + ')配备标准?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delConfig({
        id: item.category.id
      }).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getData()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

let editShow = ref('')
let editId = ref(0)
let editFormData = reactive({
  rail_min: 0,
  rail_max: 0,
  learning_period_id: 2
})
let sectionOptions = reactive([
  {
    value: 1,
    label: '小学'
  },
  {
    value: 2,
    label: '初中'
  },
  {
    value: 3,
    label: '高中'
  }
])
const editItem = (baseItem?: RequestDataType, item?: RequestDataTplType) => {
  if (!item) {
    editFormData.rail_min = 0
    editFormData.rail_max = 0
    editFormData.learning_period_id = 2
    editBaseItem.value = baseItem || RequestData
    editShow.value = 'add'
  } else {
    editFormData.rail_min = item.rail_min
    editFormData.rail_max = item.rail_max
    editFormData.learning_period_id = item.learning_info[0] ? item.learning_info[0].id : 1
    editId.value = item.id
    editBaseItem.value = baseItem || RequestData
    editShow.value = 'edit'
  }
}

const sureClick = () => {
  if (editFormData.rail_min > editFormData.rail_max) {
    ElMessage({
      type: 'warning',
      message: '最小轨数必须小于等于最大轨数'
    })
    return
  }
  if (editShow.value === 'add') {
    addTracks({
      ...editFormData,
      rail_category_id: editBaseItem?.value?.category?.id,
      type: meta.value.type
    }).then((res) => {
      if (res.code === 10) {
        editShow.value = ''
        getData()
      }
    })
  } else {
    addTracks({
      id: editId.value,
      rail_category_id: editBaseItem?.value?.category?.id,
      type: meta.value.type,
      ...editFormData
    }).then((res) => {
      if (res.code === 10) {
        editShow.value = ''
        getData()
      }
    })
  }
}

const deleteItem = (item: RequestDataTplType) => {
  ElMessageBox({
    title: '提示',
    message: h('p', null, [
      h('span', null, '请问您是否需要删除这个轨数范围'),
      h('p', { style: 'color: #ec8c42' }, '*提示：删除后无法恢复！')
    ]),
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    dangerouslyUseHTMLString: true,
    type: 'warning'
  })
    .then(() => {
      delTracks({
        id: item.id
      }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '已成功删除'
          })
          getData()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}
</script>

<style scoped lang="scss">
.content-box {
  margin-top: 20px;
  padding-bottom: 10px;
  width: 100%;
  background: #ffffff;
  .title {
    padding-left: 34px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    text-align: left;
    box-sizing: border-box;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.16);
    .fr {
      span {
        display: flex;
        align-items: center;
        margin: 10px 40px;
        color: #404040;
        font-weight: 400;
        float: left;
        cursor: pointer;
        height: 40px;
        padding: 0 10px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 10px;
        // background: red;
        img {
          margin-right: 6px;
        }
      }
    }
  }
  .content {
    padding: 7px 34px;
    p {
      margin-left: 0px;
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      text-align: left;
    }
    .click-text {
      margin: 0 20px;
      cursor: pointer;
    }
  }
  .add-btn {
    margin: 10px 36px 0;
    width: 100px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    font-weight: 400;
    color: #05c65d;
    text-align: left;
    cursor: pointer;
  }
  .btn {
    margin: 16px 34px;
    width: 126px;
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
  .green-bg {
    background: #dcece3;
    color: #05c65d;
  }
  .yellow-bg {
    background: #f9e0cc;
    color: #ec8c42;
  }
  .green {
    color: #05c65d;
  }
  .yellow {
    color: #ec8c42;
  }
}
:deep(.ts-edit-dialog) {
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    div {
      margin-bottom: 10px;
    }
    p {
      padding-bottom: 20px;
      width: 120px;
      font-size: 16px;
      text-align: right;
    }
    .el-form {
      width: 100%;
    }
    .el-form-item__content {
      text-align: left;
      .el-input {
        width: 80%;
        .el-input__inner {
          width: 100%;
        }
      }
      .el-select {
        width: 80%;
        .el-input {
          width: 100%;
          .el-input__inner {
            width: 100%;
          }
        }
      }
    }
    span {
      color: #ec8c42;
    }
  }
}
::v-deep .el-input-number {
  width: 100%;
}
::v-deep .el-input-number__decrease {
  display: none;
}
::v-deep .el-input-number__increase {
  display: none;
}
.numberCss {
  ::v-deep .el-input__inner {
    height: 30px;
  }
}
.el-empty {
  width: 100%;
  height: 100%;
}
</style>
