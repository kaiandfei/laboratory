<template>
  <div>
    <el-dialog title="查看详情" custom-class="detail-dialog" v-model="detailState" width="50%">
      <div class="top">
        <div class="nav">{{ '仪器编号：' + detailList.number }}</div>
        <div class="nav">{{ '名称：' + detailList.name }}</div>
        <div class="nav">{{ '规格型号：' + detailList.specification }}</div>
        <div class="imgArea">
          <div class="title">仪器图片：</div>
          <div v-for="(item, index) in detailList.picture" :key="index">
            <img :src="item.url_path" />
          </div>
        </div>
        <div class="nav">{{ '学校编号：' + detailList.asset_number }}</div>
        <div class="nav">{{ '类型：' }} {{ detailList.cost_type === 1 ? '低值易耗' : '非低值易耗' }}</div>
        <div class="nav">{{ '实验类型：' }}{{ detailList.is_group === 1 ? '分组' : '演示' }}</div>
        <div class="nav">{{ '配备类型：' }} {{ detailList.is_must === 1 ? '必配' : '选配' }}</div>
        <div class="nav">{{ '仪器描述：' + detailList.info }}</div>
        <div class="nav">{{ '仪器标准：' + detailList.norm }}</div>
        <div class="nav" style="width: 65%; justify-content: left; margin-left: 8%">
          {{ '使用年限：' + detailList.number_year }}{{ detailList.number_year_unit }}
        </div>
        <div class="nav">{{ '采购批次：' + detailList.bacth }}</div>
        <div class="nav">{{ '到期时间：' + detailList.end_time }}</div>
      </div>
      <div class="middle">
        <div class="area">
          <div :id="'qrCode'">
            <qrcode-vue class="qr-img" :value="detailList.qr_code" :size="80" level="H" />
          </div>
          <div style="color: green; float: right; height: 20%; margin-top: 30%; cursor: pointer" @click="downLoad()">
            <a href="" id="qrCodeDownLoad"></a>
            下载
          </div>
        </div>
        <div class="nav" v-show="!editShow">{{ '资产编号：' + detailList.asset_number }}</div>
        <div
          class="nav"
          v-show="!editShow"
          style="margin-top: 40px; margin-left: -25%"
          v-for="item in detailList.head"
          :key="item.user_id"
        >
          {{ '责任人：' + item.user_name }}
        </div>
        <div class="nav2" v-show="editShow">
          <span style="width: 100px; margin-left: 10%; text-align: left">
            {{ '资产编号' }}
          </span>
          <el-input v-model="detailList.asset_number"></el-input>
        </div>
        <div v-show="editShow">
          <div class="nav2" v-for="n in detailList.head" :key="n.user_id">
            <span style="width: 100px; margin-left: 10%; text-align: left">
              {{ '责任人：' }}
            </span>
            <el-select v-model="n.user_name">
              <el-option
                v-for="item in optionsResponse"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="bottom">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        >
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="使用人" prop="user"></el-table-column>
          <el-table-column label="归还时间" prop="back_time"></el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div class="buttonArea">
          <el-button type="primary" v-show="editShow === false" @click="edit">编辑</el-button>
          <el-button type="primary" v-show="editShow === true" @click="submit">保存</el-button>
          <el-button type="primary" @click="back">返回</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, watch } from 'vue'
import { getInstrumentDetail, editDetail } from '@/service/instrument-manage/instrument-numebr-manage/index'
import { instrumentDetailData } from '@/service/instrument-manage/instrument-numebr-manage/types'
import QrcodeVue from 'qrcode.vue'

let props = defineProps({ detailShow: Boolean, selectDetailId: { type: Number, required: true } })
let { detailShow, selectDetailId } = toRefs(props)
let emit = defineEmits(['back'])
let detailState = ref(false)
let editShow = ref(false)
detailState.value = detailShow.value

const dataMap = reactive({
  detailList: instrumentDetailData,
  tableData: [
    {
      status: '',
      user: '',
      back_time: ''
    }
  ],
  optionsResponse: [
    {
      label: '张老师',
      value: '张老师'
    },
    {
      label: '李老师',
      value: '李老师'
    },
    {
      label: '王老师',
      value: '王老师'
    }
  ],
  sendData: {
    id: 1,
    asset_number: '',
    user: [
      {
        id: 1,
        name: ''
      }
    ]
  }
})

let { detailList, tableData, optionsResponse, sendData } = toRefs(dataMap)

getInstrumentDetail({ id: selectDetailId.value }).then((res) => {
  detailList.value = res.data
  tableData.value = []
  console.log(res.data.list)
  for (const key in res.data.list.lend) {
    tableData.value.push({
      status: '出借',
      user: res.data.list.lend[key].lender,
      back_time: res.data.list.lend[key].plan_end_time
    })
  }

  for (const n in res.data.list.maintain) {
    tableData.value.push({
      status: '维修',
      user: res.data.list.maintain[n].lender,
      back_time: res.data.list.maintain[n].plan_end_time
    })
  }
})

watch(detailState, (val) => {
  if (val === false) {
    back()
  }
})

const downLoad = () => {
  let canvas = document.getElementById('qrCode')?.getElementsByTagName('canvas')[0]
  let url = canvas?.toDataURL('image/png')
  let downloadLink = document.getElementById('qrCodeDownLoad')
  downloadLink?.setAttribute('href', url || '')
  downloadLink?.setAttribute('download', '二维码.png')
  downloadLink?.click()
  console.log('下载')
}

const back = () => {
  emit('back')
}

const edit = () => {
  editShow.value = true
  console.log('编辑')
}

const submit = () => {
  editShow.value = false
  sendData.value.id = detailList.value.id
  sendData.value.asset_number = detailList.value.asset_number
  sendData.value.user = []
  for (const key in detailList.value.head) {
    sendData.value.user.push({
      id: detailList.value.head[key].user_id,
      name: detailList.value.head[key].user_name
    })
  }

  editDetail(sendData.value)
}
</script>
<style lang="scss" scoped>
:deep(.detail-dialog) {
  margin-top: 50px;
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    .title-box {
      display: flex;
      justify-content: space-evenly;
      height: 60px;
      .edit-title {
        width: 24%;
        height: 40px;
        line-height: 40px;
        color: #848484;
        border: #b5b5b5 1px solid;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 5px;
        cursor: pointer;
      }
      .active-item {
        color: #05c65d;
      }
    }
    .top {
      width: 90%;
      margin-left: 5%;
      height: 200px;
      float: left;
      background-color: rgb(242, 242, 242);
      .nav {
        width: 25%;
        height: 20%;
        float: left;
        justify-content: center;
        align-items: center;
        display: flex;
      }
      .imgArea {
        width: 24%;
        float: right;
        height: 100%;
        .title {
          float: left;
          width: 60%;
          height: 25%;
          display: flex;
          align-items: center;
        }
        img {
          width: 60%;
          float: left;
        }
      }
    }
    .middle {
      width: 90%;
      height: 100px;
      margin-left: 5%;
      float: left;
      margin-top: 20px;
      margin-bottom: 20px;
      background-color: rgb(242, 242, 242);
      .nav {
        width: 25%;
        height: 40%;
        float: left;
        justify-content: center;
        align-items: center;
        display: flex;
      }
      .nav2 {
        width: 50%;
        height: 40%;
        float: left;
        justify-content: center;
        align-items: center;
        display: flex;
      }
      .area {
        width: 15%;
        height: 100%;
        float: right;
        display: flex;
        align-items: center;
      }
    }
    .bottom {
      width: 90%;
      margin-left: 5%;
      margin-bottom: 20px;
    }
    .buttonArea {
      width: 10%;
      float: right;
      border: 1px solid green;
    }
  }
}
</style>
