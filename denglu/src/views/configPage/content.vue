<template>
  <div class="content">
    <div class="content-box">
      <div class="content-item" v-for="(item, index) in list" :key="index">
        <div class="item-header">
          <div class="title">
            <div class="icon"></div>
            <div class="tem-name">
              {{ item.name }}
            </div>
          </div>
          <div class="temType" :style="{ backgroundColor: !item.isCustom ? '#EE9A59' : '#05c65d' }">
            {{ item.isCustom ? '系统模板' : '自定义模板' }}
          </div>
        </div>
        <div class="item-main" @click="jumpTemplate(item)">
          <img class="itemImg" v-if="item.menu_url === 'dataCenter'" src="@/assets/images/bigData/dataCenter.png" />
          <img
            class="itemImg"
            v-if="item.menu_url === 'schoolBeginsCenter'"
            src="@/assets/images/bigData/schoolBegins.png"
          />
          <img class="itemImg" v-if="item.menu_url === 'equipmentData'" src="@/assets/images/bigData/equipment.png" />
          <img class="itemImg" v-if="item.menu_url === 'functionRoom'" src="@/assets/images/bigData/functionRoom.png" />
          <img class="itemImg" v-if="item.url" :src="item.url" />
          <!-- <component :is="item.component"></component> -->
        </div>
        <div class="item-footer">
          <div class="footer-switch" :style="{ color: item.is_active ? '#60A5DB' : '#B5B5B5' }">
            <el-switch
              v-model="item.is_active"
              style="--el-switch-on-color: #60a5db; --el-switch-off-color: #b5b5b5"
              @change="switchValueChange(item)"
            />
            {{ item.is_active ? '使用中' : '未使用' }}
          </div>
          <div class="footer-info" v-if="!item.isCustom">
            <span>{{ LocalCache.getCache('areaLevel') }}&nbsp;</span>
            <span>{{ LocalCache.getCache('areaName') }}</span>
            <span>创建人：{{ item.user_info.username }}</span>
            <span class="footer-del" @click="handleDel(item)">
              <img class="delImg" src="@/assets/images/bigData/del.png" alt="" />
              删除
            </span>
          </div>
        </div>
      </div>
      <div class="custom" @click="jumpTemplate(0)">
        <div class="add">+</div>
        <div class="custom-template">新增模板</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { diagramTemplateList, activeTemplate, deleteDiagramTemplate, rankTemplate } from '@/service/dataPage/index'
import LocalCache from '@/utils/localCache'
import Sortable from 'sortablejs'
// import { routes } from '@/router/index.ts'
const router = useRouter()
const props = defineProps({
  isActive: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: [String, Number],
    default: ''
  },
  userId: {
    type: [String, Number],
    default: ''
  }
})
const list = ref<any>([])
const reg1 = /&quot;/g
const getTemplateList = async () => {
  // console.log('zzzzz', props)
  try {
    let params: any = {}
    if (typeof props.isActive !== 'string') {
      params['is_active'] = props.isActive
    }
    if (typeof props.type !== 'string') {
      params['type'] = props.type
    }
    if (typeof props.userId !== 'string') {
      params['user_id'] = props.userId
    }
    const { data, code } = await diagramTemplateList(params)
    if (code === 10) {
      list.value = data.map((item: any) => {
        if (item.extra_data) {
          let str = item.extra_data.replace(reg1, '"')
          item.url = JSON.parse(str).url
        }
        item.is_active = item.is_active === 1 ? true : false
        item.isCustom = item.type === 1 ? true : false
        return item
      })
      // console.log('getTemplateList', list.value)
    }
  } catch (error) {
    console.log('err', error)
  }
}
// getTemplateList()
const switchValueChange = async (val: any) => {
  // console.log(val)
  try {
    let params = {
      id: val.id
    }
    const { code } = await activeTemplate(params)
    if (code === 10) {
      ElMessage({
        message: '使用状态切换成功',
        type: 'success'
      })
      getTemplateList()
    }
  } catch (error) {
    console.log('err', error)
  }
}
const jumpTemplate = (item: any) => {
  if (item === 0) {
    router.push({ path: '/templateAdd', query: { isEdit: 0 } })
  } else {
    if (!item.isCustom) {
      router.push({ path: '/templateAdd', query: { temList: JSON.stringify(item), isEdit: 1 } })
    } else {
      ElMessage({
        message: '系统模版不可编辑',
        type: 'warning'
      })
    }
  }
  // console.log('添加模板', router)
}
const handleDel = async (_item: any) => {
  if (_item.switchValue) {
    ElMessage({
      message: '已被启用，无法直接删除！！！',
      type: 'warning'
    })
  } else {
    //删除模板接口
    try {
      let params = {
        id: _item.id
      }
      const { code } = await deleteDiagramTemplate(params)
      if (code === 10) {
        ElMessage({
          message: '模板删除成功',
          type: 'success'
        })
        getTemplateList()
      }
    } catch (error) {
      console.log('err', error)
    }
  }
}
const dropTable = () => {
  const el = document.querySelector('.content-box')
  Sortable.create(el, {
    animation: 1000,
    onEnd(evt: any) {
      const { newIndex, oldIndex } = evt
      let arr = JSON.parse(JSON.stringify(list.value))
      const currRow = arr.splice(oldIndex, 1)[0]
      arr.splice(newIndex, 0, currRow)
      list.value = []
      nextTick(() => {
        list.value = JSON.parse(JSON.stringify(arr))
        const ids = list.value.map((item: any, i: number) => {
          return {
            id: item.id,
            rank: i + 1
          }
        })
        //调后台接口映射列表
        rankTemplate({ rank_arr: ids })
      })
    }
  })
}
onMounted(() => {
  dropTable()
})
watch(
  props,
  (newValue, oldValue) => {
    // console.log('12312', newValue)
    getTemplateList()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.content {
  .content-box {
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
  }
  .content-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 32%;
    height: 400px;
    background-color: #fff;
    box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    margin: 0 12px 20px;
    cursor: pointer;
    transition: 0.2s;
  }
  .custom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32%;
    height: 400px;
    color: #60a5db;
    background: #d9d9d9;
    box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    margin: 0 12px 20px;
    transition: 0.2s;
    cursor: pointer;
    .add {
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      border-radius: 50%;
      border: 8px solid #60a5db;
      font-size: 100px;
    }
    .custom-template {
      margin-top: 20px;
      font-size: 40px;
    }
  }
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 5px;
  box-sizing: border-box;
  .title {
    flex: 1;
    display: flex;
    font-size: 20px;
    color: #60a5db;
    font-weight: bold;
    > .icon {
      width: 11px;
      height: 25px;
      background: #5fafe4;
      border-radius: 13px;
      margin-right: 10px;
    }
  }
  .temType {
    color: #fff;
    // background-color: #05c65d;
    padding: 2px 8px;
    box-sizing: border-box;
    border-radius: 15px;
  }
}
.item-main {
  flex: 1;
  min-height: 0;
  background-color: #04061c;
}
.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  // color: #60a5db;
  .footer-switch {
    font-weight: bold;
    margin-right: 30px;
  }
  .footer-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 10px;
    .footer-del {
      display: flex;
      align-items: center;
    }
    .delImg {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }
}
.itemImg {
  width: 100%;
  height: 100%;
}
.tem-name {
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
