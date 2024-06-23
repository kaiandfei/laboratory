<template>
  <div class="tabsHeader">
    <div class="tabs">
      <div
        class="tabItem"
        v-for="(item, index) in tabItemList"
        :class="isActive === index ? 'acitive' : ''"
        :key="index"
        @click="handleTabItemClick(index)"
      >
        <div class="tabItemImg">
          <img :src="isActive === index ? item.activeImg : item.img" alt="" />
        </div>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <div class="btnBox">
      <div class="btn green-btn edit" @click="handleClick(isActive)" v-if="isActive !== 3">
        {{
          isActive === 2 && isClose
            ? '一键关闭'
            : isActive === 2 && !isClose
            ? '一键开启'
            : !isEdit && isActive === 0
            ? '编辑'
            : !isNoteEdit && isActive === 1
            ? '编辑'
            : '取消编辑'
        }}
      </div>
      <div
        class="btn green-btn edit"
        @click="handleSaveClick(isActive)"
        v-if="(isActive === 0 && isEdit) || (isActive === 1 && isNoteEdit)"
      >
        保存
      </div>
    </div>
  </div>
  <div class="tabsMain">
    <keep-alive>
      <component
        :is="currentComp"
        :isEdit="isEdit"
        v-model:isNoteEdit="isNoteEdit"
        v-bind="$attrs"
        :ref="handleRef"
        @isNoLaboratorySwitch="isNoLaboratorySwitch"
      />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import { controlAirSwitch } from '@/service/laboratory-manage/overview/index'
import BaseInfo from './base-info.vue'
import Note from './note.vue'
import Infrastructure from './infrastructure.vue'
import Intelligent from './intelligent.vue'
import { reactive, ref, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
//tabs数据
const tabItemList = [
  {
    label: '基础信息',
    activeImg: require('@/assets/images/laboratory-manage/info-active.png'),
    img: require('@/assets/images/laboratory-manage/info.png')
  },
  {
    label: '注意事项',
    activeImg: require('@/assets/images/laboratory-manage/note-active.png'),
    img: require('@/assets/images/laboratory-manage/note.png')
  },
  {
    label: '智能化设备',
    activeImg: require('@/assets/images/laboratory-manage/Intelligent-active.png'),
    img: require('@/assets/images/laboratory-manage/Intelligent.png')
  },
  {
    label: '基础设备',
    activeImg: require('@/assets/images/laboratory-manage/infrastructure-active.png'),
    img: require('@/assets/images/laboratory-manage/infrastructure.png')
  }
]
//当前tab
let currentComp = shallowRef()
currentComp.value = BaseInfo
//处理tabs切换事件
let isActive = ref(0)
const handleTabItemClick = (_i: number): void => {
  switch (_i) {
    case 0:
      console.log('234')
      currentComp.value = BaseInfo
      break
    case 1:
      currentComp.value = Note
      break
    case 2:
      currentComp.value = Intelligent
      break
    case 3:
      currentComp.value = Infrastructure
      break
  }
  isActive.value = _i
}
//动态ref
let itemRefs: any = []
const handleRef = (el: any) => {
  // console.log(2222222, el)
  itemRefs = []
  if (el) {
    itemRefs.push(el)
  }
}
//处理编辑点击事件
let isEdit = ref(false)
let isNoteEdit = ref(false)
let isClose = ref(true)
let noLaboratorySwitch = ref(false)
let device_id = ref('')
const isNoLaboratorySwitch = async (_val: any) => {
  if (_val === 1) {
    noLaboratorySwitch.value = true
  } else {
    device_id.value = _val.device_no
  }
}
const handleClick = async (_i: number) => {
  if (_i === 0) {
    isEdit.value = !isEdit.value
    if (isEdit.value) {
      itemRefs.forEach((item: any) => {
        item.initForm()
      })
    } else {
      itemRefs.forEach((item: any) => {
        item.upload && item.upload.abort()
        item.files = item.filesList
      })
    }
  } else if (_i === 1) {
    isNoteEdit.value = !isNoteEdit.value
  } else if (_i === 2) {
    if (noLaboratorySwitch.value) {
      ElMessage({
        type: 'warning',
        message: '抱歉！该实验室没有绑定设备！'
      })
      return
    }
    ElMessageBox.confirm(`一键${isClose.value ? '关闭' : '开启'}所有设备?`, `一键${isClose.value ? '关闭' : '开启'}`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        let isSwitch = isClose.value ? 1 : 2
        try {
          let params = {
            switch: isSwitch,
            device_id: device_id.value
          }
          console.log(134, params)
          const { code } = await controlAirSwitch(params)
          if (code === 10) {
            isClose.value = !isClose.value
            ElMessage({
              type: 'success',
              message: isClose.value ? '关闭成功' : '开启成功'
            })
            console.log('123')
            itemRefs.forEach((item: any) => {
              item.getStuTerminalListData()
              item.labPeripheralListData()
            })
          }
        } catch (error: any) {
          console.log(error)
          // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消关闭'
        })
      })
  }
}
//基本信息保存
const handleSaveClick = (i: number): void => {
  if (i === 0) {
    for (let i = 0; i < itemRefs.length; i++) {
      const FLAG = itemRefs[i].files.some((ele: any) => ele.status === 'uploading')
      if (FLAG) {
        ElMessage.warning('正在上传图片，请稍等！')
        return
      } else {
        isEdit.value = !isEdit.value
        itemRefs[i].submitForm(itemRefs[i].ruleFormRef)
      }
    }
  } else {
    itemRefs.forEach((item: any) => {
      item.save()
    })
  }
}
</script>

<style scoped lang="scss">
.tabsHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  .tabs {
    display: flex;
    .tabItem {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 80px;
      background-color: #f3f3f3;
      cursor: pointer;
      &.acitive {
        color: #05c65d;
        background-color: #f8ffff;
        border-bottom: 8px solid #05c65d;
        box-sizing: border-box;
        .tabItemImg {
          background-color: #05c65d;
        }
        .tabItemImg,
        span {
          position: relative;
          top: 4px;
        }
      }
      .tabItemImg {
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        // background-color: red;
        margin-right: 10px;

        img {
          width: 24px;
          height: 24px;
        }
      }
      span {
        font-size: 16px;
      }
    }
  }
  .btnBox {
    display: flex;
    .edit {
      width: 110px;
      height: 36px;
      line-height: 36px;
      border-radius: 10px;
      cursor: pointer;
      margin-right: 10px;
    }
  }
}
.tabsMain {
  background-color: #fff;
  height: calc(100vh - 270px);
  overflow-y: auto;
}
</style>
<style>
.el-message-box__title {
  text-align: center;
}
</style>
