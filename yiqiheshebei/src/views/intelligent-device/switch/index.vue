<template>
  <div>
    <header>
      <div class="fl">
        <span>智能设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>智能空开管理</span>
      </div>
    </header>
    <div class="sel-box">
      <div class="operation">
        <span>智能空开总览</span>
        <div class="button-box">
          <div class="btn green-btn" @click="getSet">
            <img src="@assets/images/intelligent-device/set.png" alt="" />
            设置
          </div>
          <!--         <div class="btn white-btn">-->
          <!--          <img src="@assets/images/account-school/exp.png" alt="" />-->
          <!--          导出教师-->
          <!--         </div>-->
          <!--         <div class="btn green-btn" @click="addPurchase">新建危化品采购</div>-->
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
              <el-select v-model="selFrom.subject_id" placeholder="" @change="cateChange">
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
              <el-select v-model="selFrom.status" placeholder="" @change="cateChange">
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
      <!--          <span @click="getSet">设置</span>-->
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
          @sort-change="sortChange"
        >
          <el-table-column type="index" prop="" label="序号" width="60" align="left"></el-table-column>
          <el-table-column prop="school_name" label="学校" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="type_name" label="类型" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="device_no" label="设备号" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="labName" label="实验室" align="left" show-overflow-tooltip></el-table-column>
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
          <el-table-column prop="UseData.payload" label="" align="left" show-overflow-tooltip>
            <template #default="scope">
              <div class="disFlex">
                <div class="flex3">
                  设备温度:
                  {{ scope.row.UseData.payload ? scope.row.UseData.payload.Temp : '' }}
                  ({{
                    scope.row.UseData.payload ? (scope.row.UseData.payload.Temp > setData.cable ? '过热' : '正常') : ''
                  }})
                </div>
                <!--                <div class="flex1"></div>-->
              </div>
              <div class="disFlex">
                <div class="flex3">
                  漏电流:
                  {{ scope.row.UseData.payload ? scope.row.UseData.payload.Leakage : '' }}
                  ({{
                    scope.row.UseData.payload
                      ? scope.row.UseData.payload.Leakage > setData.leakage
                        ? '过高'
                        : '正常'
                      : ''
                  }})
                </div>
                <!--                <div class="flex1"></div>-->
              </div>
              <div class="disFlex">
                <div class="flex3">
                  功率:
                  {{ scope.row.UseData.payload ? scope.row.UseData.payload.Power : '' }}
                </div>
                <!--                <div class="flex1"></div>-->
              </div>
              <div class="disFlex">
                <div class="flex3">
                  电流:
                  {{ scope.row.UseData.payload ? scope.row.UseData.payload.Current : '' }}
                  ({{
                    scope.row.UseData.payload
                      ? scope.row.UseData.payload.Leakage === setData.leakage
                        ? '正常'
                        : '异常'
                      : ''
                  }})
                </div>
                <!--                <div class="flex1"></div>-->
              </div>
              <div class="disFlex">
                <div class="flex3">
                  电压:
                  {{ scope.row.UseData.payload ? scope.row.UseData.payload.Voltage : '' }}
                  ({{
                    scope.row.UseData.payload
                      ? scope.row.UseData.payload.Voltage > setData.voltage_max
                        ? '过压'
                        : scope.row.UseData.payload.Voltage < setData.voltage_min
                        ? '欠压'
                        : '正常'
                      : ''
                  }})
                </div>
                <!--                <div class="flex1"></div>-->
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
      <PopCurrency :popShow="popState" @close="popState = false">
        <template v-slot:header>
          <p style="text-align: center">设置</p>
        </template>
        <template v-slot:main>
          <div class="re_msg1">
            <div class="fl">
              <el-form label-width="150px" style="width: 400px; float: left">
                <el-form-item label="分类:">
                  <span class="fl">预警值</span>
                  <!-- <el-input v-model="selEqudata.data.number"></el-input> -->
                </el-form-item>
                <el-form-item label="设备温度:">
                  <el-input v-model="setData.cable" type="number"></el-input>
                  <span class="fl">°C</span>
                </el-form-item>
                <el-form-item label="漏电流:">
                  <el-input v-model="setData.leakage" type="number"></el-input>
                  <span class="fl">mA</span>
                </el-form-item>
                <el-form-item label="电流:">
                  <el-input v-model="setData.current" type="number"></el-input>
                  <span class="fl">A</span>
                </el-form-item>
                <el-form-item label="电压:">
                  <el-input style="width: 60px" v-model="setData.voltage_max" type="number"></el-input>
                  <span class="fl">V (最大)</span>
                  <el-input
                    style="width: 60px; margin-left: 15px"
                    v-model="setData.voltage_min"
                    type="number"
                  ></el-input>
                  <span class="fl">V (最低)</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div>
            <div class="fr btn_z green-btn ml-60" @click="saveDate">确认</div>
            <div class="fr btn_z white-btn ml-60" @click="popState = false">取消</div>
          </div>
        </template>
      </PopCurrency>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, inject, computed, onMounted } from 'vue'
import { useStore } from '@/store'
import { PopCurrency } from '@components/pop-currency'
import { ArrowRight } from '@element-plus/icons-vue'
import { getAirSwitch, saveAirSwitchSetting, findAirSwitchSetting } from '@service/intelligent-device/switch/index'
import { ListItem } from '@service/intelligent-device/switch/types'
import { ElMessage } from 'element-plus'
const store = useStore()
const subject = store.state.common.subjectArr
const schoolName = store.state.login.userInfo.school.name
const popState = ref(false)
const dataAll = ref<ListItem[]>([])
const data = ref<ListItem[]>([])
let setData = reactive({
  cable: 20,
  leakage: 20,
  current: 20,
  voltage_max: 20,
  voltage_min: 20
})
let selFrom = reactive({
  school_id: '',
  subject_id: '',
  status: ''
})

const initData = (value: string) => {
  getAirSwitch().then((res) => {
    console.log(res)
    data.value = res.data
    dataAll.value = res.data
  })
  findAirSwitchSetting().then((res) => {
    console.log(res)
    if (res.code === 10) {
      if (res.data !== null) {
        setData.cable = res.data.cable
        setData.leakage = res.data.leakage
        setData.current = res.data.current
        setData.voltage_max = res.data.voltage_max
        setData.voltage_min = res.data.voltage_min
      } else {
        setData.cable = 67.31
        setData.leakage = 30
        setData.current = 33
        setData.voltage_max = 200
        setData.voltage_min = 100
      }
      // popState.value = true
    }
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
const getSet = () => {
  findAirSwitchSetting().then((res) => {
    console.log(res)
    if (res.code === 10) {
      if (res.data !== null) {
        setData.temp = res.data.cable
        setData.leakage = res.data.leakage
        setData.current = res.data.current
        setData.voltage_max = res.data.voltage_max
        setData.voltage_min = res.data.voltage_min
      } else {
        setData.temp = 67.31
        setData.leakage = 30
        setData.current = 33
        setData.voltage_max = 200
        setData.voltage_min = 100
      }
      popState.value = true
    }
  })
}
const saveDate = () => {
  if (setData.cable > 100 || setData.cable < 0) {
    ElMessage({
      type: 'warning',
      message: '电缆在0-100之间'
    })
    return
  }
  if (setData.leakage > 100 || setData.leakage < 0) {
    ElMessage({
      type: 'warning',
      message: '漏电在0-100'
    })
    return
  }
  if (setData.current > 100 || setData.current < 0) {
    ElMessage({
      type: 'warning',
      message: '电流在0-100'
    })
    return
  }
  if (setData.voltage_max > 220 || setData.voltage_max < 0) {
    ElMessage({
      type: 'warning',
      message: '最大电压在0-220之间'
    })
    return
  }
  if (setData.voltage_min > 220 || setData.voltage_min < 0) {
    ElMessage({
      type: 'warning',
      message: '最小电压在0-220之间'
    })
    return
  }
  if (setData.voltage_min > setData.voltage_max) {
    ElMessage({
      type: 'warning',
      message: '最大电压不能小于最小电压'
    })
    return
  }
  saveAirSwitchSetting(setData).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '设置成功'
      })
      popState.value = false
    }
  })
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
.disFlex {
  display: flex;
  text-align: left;
}
.flex1 {
  flex: 1;
}
.flex3 {
  flex: 1;
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
