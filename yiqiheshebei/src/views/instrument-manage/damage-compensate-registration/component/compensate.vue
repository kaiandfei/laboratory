<template>
  <div>
    <el-dialog
      custom-class="compensate-dialog"
      v-model="compensateState"
      width="50%"
      title="损坏赔偿登记卡详情"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="topArea">
        <div class="titleArea">
          损坏赔偿状态:
          <span style="margin-left: 20%; color: #eea359">
            {{ damageRegistrationList.status === 1 ? '未赔偿' : '已赔偿' }}
          </span>
        </div>
        <div class="detailArea">
          <div class="nav" style="width: 50%">
            <div class="name">损坏人：</div>
            <div>{{ damageRegistrationList.damage_man }}</div>
          </div>
          <div class="nav" style="float: right">
            <div class="name">损耗报废单号：</div>
            <div>{{ damageRegistrationList.record_number }}</div>
          </div>
          <div class="nav" style="width: 50%">
            <div class="name">损坏情况与原因：</div>
            <div>
              {{ damageRegistrationList.desc }}
            </div>
          </div>
          <div class="nav" style="float: right">
            <div class="name">登记时间：</div>
            <div>{{ damageRegistrationList.create_time }}</div>
          </div>
          <div class="nav" style="width: 50%">
            <div class="name">赔偿人：</div>
            <div>
              <!-- <el-input v-model="damageInfo.repay_man"></el-input> -->
              <el-select v-model="damageInfo.repay_id">
                <el-option
                  v-for="item in optionUser"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                  @click="payerSel(item)"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="nav" style="float: right; margin-bottom: 240px">
            <div class="name">登记人：</div>
            <div>{{ damageRegistrationList.user_name }}</div>
          </div>
          <div class="nav" style="width: 50%">
            <div class="name">赔偿金额：</div>
            <div>
              <el-input v-model="damageInfo.repay_price"></el-input>
            </div>
          </div>
          <div class="nav" style="width: 50%">
            <div class="name">赔偿时间</div>
            <div>
              <el-date-picker
                type="date"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
                v-model="damageInfo.repay_time"
              ></el-date-picker>
            </div>
          </div>
          <div class="nav" style="width: 50%; height: 80px">
            <div class="name">赔偿说明</div>
            <div>
              <el-input type="textarea" :row="2" v-model="damageInfo.repay_desc"></el-input>
            </div>
          </div>
          <div class="nav" style="width: 50%; height: 30%; display: block">
            <div class="name" style="width: 60%; height: 20%">损坏赔偿仪器位置及数量清单：</div>
            <div v-for="item in damageRegistrationList.list" :key="item.id" class="valueArea">
              {{ item.name }}
              {{ '(' + item.asset_number + ')' }}
              {{ item.laboratory_name }}
              {{ item.store_name }}
              {{ '第' + item.number_plies + '层' }}
              {{ item.total + '个' }}
            </div>
          </div>
        </div>
      </div>
      <div class="buttonArea">
        <el-button type="primary" @click="back()">返回</el-button>
        <el-button type="primary" @click="submit()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { compensateInfoData, instrumnetDetailData } from '@/service/instrument-manage/damageRegistration/types'
import {
  postCompensateInfo,
  getInstrumentDetail,
  getTeacherList
} from '@/service/instrument-manage/damageRegistration/index'
import { ElMessage } from 'element-plus'

let props = defineProps({ compensateShow: Boolean, selectID: { type: Number, required: true } })
let { compensateShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let compensateState = ref(false)
const optionUser: any = ref([])
let school_id = ref(1)

compensateState.value = compensateShow.value
school_id.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.school_id
const dataMap = reactive({
  damageRegistrationList: instrumnetDetailData,
  damageInfo: compensateInfoData
})
let { damageRegistrationList } = toRefs(dataMap)
const damageInfo: any = ref({})

const initData = () => {
  getInstrumentDetail({ id: selectID.value }).then((res) => {
    damageRegistrationList.value = res.data
  })
  getTeacherList({ id: school_id.value }).then((res) => {
    optionUser.value = res.data
  })
}

initData()

// 赔偿人切换时获取赔偿人用户名
const payerSel = (data: any) => {
  damageInfo.value.repay_man = data.username
}

const submit = () => {
  console.log(damageInfo.value)
  if (damageInfo.value.repay_man === '' || !damageInfo.value.repay_man) {
    ElMessage('赔偿人不能为空')
    return
  }

  if (damageInfo.value.repay_time === '' || !damageInfo.value.repay_time) {
    ElMessage('赔偿时间不能为空')
    return
  }
  damageInfo.value.type = 1
  damageInfo.value.status = 2
  damageInfo.value.id = selectID.value
  damageInfo.value.list = damageRegistrationList.value.list
  damageInfo.value.damage_man = damageRegistrationList.value.damage_man
  damageInfo.value.list.forEach((e: any) => {
    e.school_instrument_id = e.instrument_id
  })

  postCompensateInfo(damageInfo.value).then((res) => {
    if (res.code === 10) {
      ElMessage('保存成功')
      emit('back')
    }
  })
}

const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
:deep(.el-input__inner) {
  width: 200px;
}
:deep(.el-textarea) {
  width: 200px;
}

:deep(.compensate-dialog) {
  margin-top: 50px;
  height: 650px;
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
    .titleArea {
      width: 40%;
      height: 5%;
      float: left;
      margin-left: 8%;
      justify-content: left;
      display: flex;
      font-weight: 600;
    }
    .detailArea {
      width: 90%;
      float: left;
      margin-left: 5%;
      padding: 0;
      border: 1px solid #05c65d;
      .nav {
        width: 50%;
        height: 40px;
        float: left;
        align-items: center;
        display: flex;
        .name {
          float: left;
          width: 40%;
          margin-left: 20px;
          align-items: center;
          display: flex;
          font-weight: 600;
        }
        .value {
          display: flex;
          height: 20px;
          width: 100%;
          align-items: left;
        }
        .valueArea {
          margin: 6px 10px;
          float: left;
          width: 80%;
        }
        .imgArea {
          margin-top: 20px;
          width: 80px;
          height: 80px;
          float: left;
        }
      }
    }
    .buttonArea {
      height: 50px;
      margin: 20px 5% 10px 0;
      float: right;
    }
  }
}
</style>
