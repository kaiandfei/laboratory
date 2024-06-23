<template>
  <header>
    <span>
      标签打印
      <!-- <span v-show="addShow">> 新增出借登记</span> -->
    </span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>标签打印</span>
        <div class="btn green-btn" @click="allSave" :style="{ pointerEvents: sigle ? 'none' : 'auto' }">批量导出</div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <!-- <div class="sel-item">
            <span>学科:</span>
            <div class="sel">
              <el-select v-model="dataAll.formData.subject_id" class="m-2" placeholder="Select" @change="getStore">
                <el-option
                  v-for="item in dataAll.subjectArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>学段:</span>
            <div class="sel">
              <el-select v-model="value" class="m-2" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div> -->
        </div>
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="dataAll.search" placeholder="请输入关键字" class="input-with-select">
              <template #append>
                <div class="ser-icon" @click="searchClick">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="card_box">
      <div @click="dataAll.state = 1" :class="{ 'card-active': dataAll.state === 1 }">实验室二维码</div>
      <div @click="dataAll.state = 2" :class="{ 'card-active': dataAll.state === 2 }">仪器二维码</div>
      <div @click="dataAll.state = 3" :class="{ 'card-active': dataAll.state === 3 }">设备二维码</div>
      <div @click="dataAll.state = 4" :class="{ 'card-active': dataAll.state === 4 }">仪器柜卡</div>
      <div @click="dataAll.state = 5" :class="{ 'card-active': dataAll.state === 5 }">资产标签</div>
    </div>
    <Lab ref="labShow" v-if="dataAll.state === 1" :search="dataAll.search"></Lab>
    <Ins ref="insShow" v-if="dataAll.state === 2" :search="dataAll.search"></Ins>
    <Equ ref="equShow" v-if="dataAll.state === 3" :search="dataAll.search"></Equ>
    <Cabinet ref="cabinetShow" v-if="dataAll.state === 4" :search="dataAll.search"></Cabinet>
    <Assets ref="assetsShow" v-if="dataAll.state === 5" :search="dataAll.search"></Assets>
  </main>

  <!-- <ExamineDetail ref="ExamineDeta"></ExamineDetail> -->
</template>

<script lang="ts" setup>
import Lab from './component/lab.vue'
import Ins from './component/ins.vue'
import Equ from './component/equ.vue'
import Cabinet from './component/cabinet.vue'
import Assets from './component/assets.vue'
import { reactive, ref, inject, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getStoreNumTable } from '@service/dataAnalysisApi'
import { useStore } from '@store/index'
// import { ExamineDetail } from './component/index'
const value = ref()
const options = ref()
const store = useStore()
const dataAll: any = reactive({
  search: '',
  state: 1,
  tableData: [],
  total: 0
})
// const getStore = () => {
//   getStoreNumTable(dataAll.formData).then((res: any) => {
//     console.log(res)
//     dataAll.tableData = res.data.list
//   })
// }
// getStore()
const edit = (item: any) => {
  console.log(item)
}
const ExamineDeta = ref()
const examineDetailClick = (id: number | string) => {
  console.log(id)
  ExamineDeta.value.getDetail(id)
}
// 实验室组件
const labShow = ref()
const insShow = ref()
const equShow = ref()
const cabinetShow = ref()
const assetsShow = ref()
const sigle = ref(false)
// 批量导出
const allSave = () => {
  console.log('外层点击全部导出')
  if (!sigle.value) {
    sigle.value = true
    if (dataAll.state === 1) {
      labShow.value.allExport()
    } else if (dataAll.state === 2) {
      insShow.value.allExport()
    } else if (dataAll.state === 3) {
      equShow.value.allExport()
    } else if (dataAll.state === 4) {
      cabinetShow.value.allExport()
    } else if (dataAll.state === 5) {
      assetsShow.value.allExport()
    }
  }
  setTimeout(() => {
    sigle.value = false
  }, 2000)
}
// 搜索
const searchClick = () => {
  console.log('外层点击搜索')
  if (dataAll.state === 1) {
    labShow.value.getTable()
  } else if (dataAll.state === 2) {
    insShow.value.getTable()
  } else if (dataAll.state === 3) {
    equShow.value.getTable()
  } else if (dataAll.state === 4) {
    cabinetShow.value.getTable()
  } else if (dataAll.state === 5) {
    assetsShow.value.getTable()
  }
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
</style>
