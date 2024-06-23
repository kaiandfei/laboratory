<template>
  <div class="electronicInfoContainer">
    <!-- 人脸识别 -->
    <div class="content">
      <div class="FaceRecognition" v-for="(item, index) in userBodyInfo" :key="index">
        <div class="title">{{ item.title }}</div>
        <div class="pic">
          <img
            :src="item.type === 1 ? item.electronicInfoData?.image_url : item.fingerprintInfoData?.image_url"
            alt=""
          />
        </div>
        <div class="info">
          <div class="formItem" v-for="ele in item.formItemList" :key="ele.id">
            <div class="label">{{ ele.label }}</div>
            <div class="value" v-if="ele.id === 1">
              {{
                JSON.stringify(item.electronicInfoData) === '{}' || JSON.stringify(item.fingerprintInfoData) === '{}'
                  ? '未录入'
                  : '已录入'
              }}
            </div>
            <div class="value" v-if="ele.id === 2">
              {{
                item.type === 1
                  ? JSON.stringify(item.electronicInfoData) === '{}'
                    ? '/'
                    : item.electronicInfoData?.create_time
                  : JSON.stringify(item.fingerprintInfoData) === '{}'
                  ? '/'
                  : item.fingerprintInfoData?.create_time
              }}
            </div>
            <div class="value" v-if="ele.id === 3">
              {{
                item.type === 1
                  ? JSON.stringify(item.electronicInfoData) === '{}'
                    ? '/'
                    : item.electronicInfoData?.position
                  : JSON.stringify(item.fingerprintInfoData) === '{}'
                  ? '/'
                  : item.fingerprintInfoData?.position
              }}
            </div>
            <div class="value" v-if="ele.id === 4">
              {{
                item.type === 1
                  ? JSON.stringify(item.electronicInfoData) === '{}'
                    ? '/'
                    : item.electronicInfoData?.device_id
                  : JSON.stringify(item.fingerprintInfoData) === '{}'
                  ? '/'
                  : item.fingerprintInfoData?.device_id
              }}
            </div>
          </div>
        </div>
        <div class="delInfo">
          <div
            class="btn green-btn"
            :class="
              JSON.stringify(item.electronicInfoData) === '{}' || JSON.stringify(item.fingerprintInfoData) === '{}'
                ? 'infoBtn'
                : ''
            "
            @click="delInfoBtn(item.type)"
          >
            删除信息
          </div>
        </div>
      </div>
    </div>
    <!-- back -->
    <div class="back">
      <div class="btn white-btn" @click="backBtn">返回</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserBodyInfo, deleteUserBodyInfo } from '@service/account/index'
import { ref, reactive, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
interface electronicInfoDataType {
  image_url: string
  create_time: string
  position: string
  device_id: string
}
interface formItemListType {
  id: number
  label: string
}
interface Item {
  type: number
  title: string
  formItemList: formItemListType[]
  electronicInfoData?: electronicInfoDataType
  fingerprintInfoData?: electronicInfoDataType
}
//定义一个对象数组
const userBodyInfo = ref<Item[]>([
  {
    type: 1,
    title: '人脸识别信息',
    formItemList: [
      {
        label: '状态：',
        id: 1
      },
      {
        label: '添加时间：',
        id: 2
      },
      {
        label: '添加地点：',
        id: 3
      },
      {
        label: '添加设备：',
        id: 4
      }
    ]
  }
  // {
  //   type: 2,
  //   title: '指纹信息',
  //   formItemList: [
  //     {
  //       label: '状态：',
  //       id: 1
  //     },
  //     {
  //       label: '添加时间：',
  //       id: 2
  //     },
  //     {
  //       label: '添加地点：',
  //       id: 3
  //     },
  //     {
  //       label: '添加设备：',
  //       id: 4
  //     }
  //   ]
  // }
])
const $emit = defineEmits(['back'])
const props = defineProps({
  detailFrom: {
    type: Object,
    default: () => ({})
  }
})
//获取人体征信息
const getUserBodyInfoData = async (count: number) => {
  let params = {
    // user_id: 1,
    user_id: props.detailFrom.id,
    type: count
  }
  try {
    const { code, data } = await getUserBodyInfo(params)
    if (code == 10) {
      if (count === 1) {
        userBodyInfo.value[0]['electronicInfoData'] = data.length === 0 ? {} : data
      } else {
        userBodyInfo.value[1]['fingerprintInfoData'] = data.length === 0 ? {} : data
      }
      console.log('1231231', data)
    }
  } catch (error: any) {
    console.log(error)
    // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
  }
}
getUserBodyInfoData(1)
// getUserBodyInfoData(2)
//删除信息按钮
const delInfoBtn = async (type: number) => {
  let params = {
    user_id: props.detailFrom.id,
    type
  }
  if (JSON.stringify(userBodyInfo.value[0]['electronicInfoData']) === '{}' && type === 1) return
  // if (JSON.stringify(userBodyInfo.value[1]?.fingerprintInfoData) === '{}' && type === 2) return
  try {
    const { code, msg } = await deleteUserBodyInfo(params)
    if (code == 200) {
      ElMessage({
        type: 'warning',
        message: '删除成功'
      })
      getUserBodyInfoData(1)
      // getUserBodyInfoData(2)
    }
    if (code == 500) {
      ElMessage({
        type: 'warning',
        message: `接口code:500，${msg}`
      })
    }
  } catch (error: any) {
    console.log(error)
    // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
  }
}
//返回按钮
const backBtn = (): void => {
  $emit('back')
}
</script>

<style scoped lang="scss">
.electronicInfoContainer {
  display: flex;
  justify-content: space-between;
  height: 640px;
  background-color: #fff;
  padding: 50px;
  box-sizing: border-box;
  text-align: left;
  .content {
    flex: 1;
    display: flex;
    justify-content: left;
    .FaceRecognition {
      width: 30%;
      box-sizing: border-box;
      &:not(:first-child) {
        width: 35%;
        border-left: 1px solid #05c65d;
        padding-left: 8%;
        box-sizing: border-box;
      }
    }
  }
  .back {
    width: 120px;
    position: relative;
    .btn {
      width: 100px;
      height: 36px;
      position: absolute;
      right: 0;
      text-align: center;
    }
  }
}
.title {
  color: #05c65d;
}
.pic {
  padding: 30px 0 60px;
  text-align: center;
  img {
    width: 148px;
    height: 148px;
    border-radius: 50%;
    border: 1px solid #05c65d;
  }
}
.info {
  .formItem {
    display: flex;
    margin-bottom: 20px;
    .label {
      width: 70px;
      margin-right: 20px;
    }
    .value {
      width: 250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.delInfo {
  text-align: center;
  margin-top: 60px;
  .btn {
    width: 140px;
    height: 36px;
    margin: 0 auto;
  }
  .infoBtn {
    background-color: #848484;
    color: #fff;
  }
  .infoBtn:hover {
    background-color: #999999;
  }
}
</style>
