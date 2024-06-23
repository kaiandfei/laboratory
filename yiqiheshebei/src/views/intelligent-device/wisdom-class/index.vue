<template>
  <div v-show="page === 1">
    <header>
      <div class="fl">
        <span>智能设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>智慧班牌管理</span>
      </div>
    </header>
    <div class="sel-box">
      <div class="operation">
        <span>智慧班牌总览</span>
        <div class="button-box">
          <div class="btn green-btn" @click="goDetail(1)">
            <img src="@assets/images/intelligent-device/page-set.png" alt="" />
            页面配置
          </div>
          <div class="btn green-btn" @click="goDetail(2)">
            <img src="@assets/images/intelligent-device/icid.png" alt="" />
            ic/id卡
          </div>
          <!-- <div class="btn green-btn" @click="popState = true">+ 新增区域</div> -->
          <!-- <div class="btn white-btn">
          <img src="@assets/images/account-school/exp.png" alt="" />
          导出教师
        </div> -->
          <!-- <div class="btn green-btn" @click="addPurchase">新建危化品采购</div> -->
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>学校:</span>
            <span class="sel" style="text-align: left; color: #000000">
              {{ schoolName }}
            </span>
          </div>
          <div class="sel-item">
            <span>学科:</span>
            <div class="sel">
              <el-select v-model="selFrom.subject_id" placeholder="" @change="cateChange(1)">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="(item, index) in subject"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>状态:</span>
            <div class="sel">
              <el-select v-model="selFrom.status" placeholder="" @change="cateChange(2)">
                <el-option label="全部" value=""></el-option>
                <el-option label="在线" value="1"></el-option>
                <el-option label="离线" value="0"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <!--      <div class="set">-->
      <!--        <div class="sel-l">-->
      <!--          <span style="cursor:pointer" @click="goDetail(1)">页面设置</span>-->
      <!--          <span style="cursor:pointer" @click="goDetail(2)">ic/id卡</span>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div>
      <div class="content">
        <el-table
          :data="data"
          style="width: 100%"
          :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        >
          <el-table-column type="index" prop="" label="序号" width="60" align="left"></el-table-column>
          <el-table-column prop="school_name" label="学校" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="type_name" label="类型" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="device_no" label="设备号" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="labName" label="绑定实验室" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="LabNameSubject[0].subject_name"
            label="学科"
            align="left"
            show-overflow-tooltip
            sortable
          ></el-table-column>
          <el-table-column prop="status" label="状态" align="left" show-overflow-tooltip sortable>
            <template #default="scope">
              <span>
                {{ ['离线', '在线'][scope.row.status] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="添加时间"
            align="left"
            show-overflow-tooltip
            sortable
          ></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <div class="click-box">
                <span class="click-text green" style="cursor: pointer" @click="operate(scope.row)">查看</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-block">
        <!--        <el-pagination-->
        <!--            v-model:currentPage="currentPage"-->
        <!--            :page-size="10"-->
        <!--            @current-change="handleCurrentChange"-->
        <!--            background-->
        <!--            layout="total, prev, pager, next, jumper"-->
        <!--            :total="total"-->
        <!--        ></el-pagination>-->
      </div>
    </div>
  </div>
  <Card v-if="page === 3" :dataS="dataAll" @back="pageRetuen"></Card>
  <SetPage v-if="page === 2" @back="pageRetuen"></SetPage>
  <Detail v-if="page === 4" :detail="detail" @back="pageRetuen"></Detail>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, inject, computed, onMounted } from 'vue'
import { useStore } from '@/store'
import { ArrowRight } from '@element-plus/icons-vue'
import Card from '@views/intelligent-device/wisdom-class/card/index.vue'
import SetPage from '@views/intelligent-device/wisdom-class/set-page/index.vue'
import Detail from '@views/intelligent-device/wisdom-class/detail/index.vue'
import { PopCurrency } from '@components/pop-currency'
import router from '@/router'
import { getElectronicClassCard } from '@service/intelligent-device/wisdom-class/index'
import { ListItem } from '@service/intelligent-device/wisdom-class/types'
const store = useStore()
console.log(store)
const subject = store.state.common.subjectArr
const schoolName = store.state.login.userInfo.school.name
const page = ref(1)
const dataAll = ref<ListItem[]>([])
const data = ref<ListItem[]>([])
const detail = ref([])
let selFrom = reactive({
  school_id: '',
  subject_id: '',
  status: ''
})
const initData = (value: string) => {
  getElectronicClassCard().then((res) => {
    console.log(res)
    data.value = res.data
    dataAll.value = res.data
  })
}
initData('')

const cateChange = (type: number) => {
  if (selFrom.status !== '' && selFrom.subject_id !== '') {
    let arr = dataAll.value.filter(
      (item) =>
        item.status === Number(selFrom.status) &&
        item.LabNameSubject.length > 0 &&
        item.LabNameSubject[0].subject_id === Number(selFrom.subject_id)
    )
    data.value = arr
  } else if (selFrom.status !== '' && selFrom.subject_id === '') {
    let arr = dataAll.value.filter((item) => item.status === Number(selFrom.status))
    data.value = arr
  } else if (selFrom.status === '' && selFrom.subject_id !== '') {
    let arr = dataAll.value.filter(
      (item) => item.LabNameSubject.length > 0 && item.LabNameSubject[0].subject_id === Number(selFrom.subject_id)
    )
    data.value = arr
  } else {
    data.value = dataAll.value
  }
}

let setData = reactive({
  temperature: 20,
  carbonDioxide: 20,
  humidness: 20,
  PM10: 20,
  PM25: 20,
  voc: 20
})
const operate = (data: any) => {
  detail.value = data
  page.value = 4
}
const goDetail = (type: number) => {
  if (type == 1) {
    page.value = 2
  }
  if (type == 2) {
    page.value = 3
  }
}
const pageRetuen = () => {
  page.value = 1
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
}

main {
  width: 100%;

  .sel-box {
    width: 100%;
    height: 120px;

    .operation {
      float: left;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: rgb(220, 236, 227);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

      & > span {
        float: left;
        margin-left: 1.8%;
        font-size: 20px;
        color: #05c65d;
        font-weight: bold;
      }

      .button-box {
        display: flex;
        justify-content: space-between;

        div {
          margin-right: 20px;
          display: flex;
          align-items: center;
          box-sizing: border-box;

          img {
            margin-right: 4px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    .screen {
      height: 60px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      clear: both;

      .sel-l {
        float: left;
        width: 80%;

        .sel-item {
          float: left;
          margin-top: 16px;
          width: 25%;
          display: flex;
          justify-content: space-between;

          & > span {
            float: left;
            width: 20%;
            height: 30px;
            line-height: 30px;
            text-align: right;
            color: #848484;
          }

          .sel {
            float: left;
            margin-right: 10%;
            width: 60%;
          }
        }
      }

      .sel-r {
        float: right;
        width: 20%;

        .mt-4 {
          margin: 16px auto;
          width: calc(100% - 40px);

          .ser-icon {
            padding: 0 10px;
            cursor: pointer;

            img {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }

    .set {
      height: 30px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      clear: both;
      .sel-l {
        float: left;
        width: 80%;
      }
      span {
        float: left;
        margin-left: 30px;
        line-height: 30px;
      }
    }
  }
  .msg-box {
    margin-top: 20px;
    height: 350px;
    width: 100%;
    .all-lab {
      float: left;
      width: 350px;
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      p {
        margin-top: 75px;
        height: 26px;
        line-height: 26px;
      }
      & > div {
        margin: 30px auto;
        padding: 10px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: #05c65d;
        & > div {
          margin: auto;
          padding: 10px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #fff;
          & > div {
            margin: auto;
            padding: 10px;
            width: 80px;
            height: 80px;
            line-height: 80px;
            font-size: 40px;
            color: #fff;
            border-radius: 50%;
            background-color: #05c65d;
          }
        }
      }
    }
    .pie-box {
      float: right;
      width: calc(100% - 370px);
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
  }
  .table-box {
    margin-top: 20px;
    width: 100%;
  }
  .card_box {
    margin: 20px 0;
    height: 60px;
    line-height: 60px;
    width: 100%;
    display: flex;
    background-color: #fff;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #626572;
    div {
      flex: 1;
      cursor: pointer;
      border-radius: 10px;
    }
    .card-active {
      color: #05c65d;
      background-color: #bef1d5;
    }
  }
}
.btn {
  margin-right: 20px;
  padding: 8px 21px;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.el-input {
  float: left;
  width: auto;
}
.fl {
  padding-left: 5px;
}
</style>
