<template>
  <div>
    <header>
      <div class="fl">
        <span>智能设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>智慧班牌</span>
      </div>
    </header>
    <div class="sel-box">
      <div class="operation">
        <div class="button-box">
          <div class="btn green-btn" @click="add">新增</div>
        </div>
        <div class="button-box" style="float: right">
          <div class="btn white-btn" @click="pageRetuen">
            <img src="@assets/images/laboratory-standard/cancel.png" alt="" />
            返回
          </div>
        </div>
      </div>
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
          <el-table-column prop="code" label="卡号" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="type" label="类型" align="left" show-overflow-tooltip>
            <template #default="scope">
              <span>
                {{ ['ic', 'id'][scope.row.type - 1] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="ic_id_card_peripheral" label="所属智慧班牌" align="left" show-overflow-tooltip>
            <template #default="scope">
              <div v-for="(item, index) in scope.row.ic_id_card_peripheral">
                {{ item.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="负责人" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="create_time" label="添加时间" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <div class="click-box">
                <span class="click-text green" @click="dels(scope.row.id)">删除</span>
                <span class="click-text green" @click="sets(scope.row)">设置</span>
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
          <p style="text-align: center">新增ic/id卡</p>
        </template>
        <template v-slot:main>
          <div class="re_msg1">
            <div class="fl">
              <el-form label-width="100px" style="width: 400px; float: left">
                <el-form-item label="输入卡号:">
                  <el-input v-model="detail.code"></el-input>
                </el-form-item>
                <el-form-item label="类型:">
                  <el-select v-model="detail.type">
                    <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  style="margin-bottom: 0px"
                  label-width="250px"
                  label="请选择需要应用的智慧班牌设备:"
                ></el-form-item>
                <div class="hide-scrollbar">
                  <el-checkbox-group v-model="detail.lab">
                    <el-checkbox v-for="(item, index) in props.dataS" :label="item.id" size="large">
                      {{ item.device_no + '/' + item.labName }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <el-form-item label="负责人:">
                  <el-select v-model="detail.user_id">
                    <el-option v-for="item in optionsUser" :key="item.id" :label="item.username" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div>
            <div class="fr btn_z green-btn ml-60" @click="save">确认</div>
            <div class="fr btn_z white-btn ml-60" @click="popState = false">取消</div>
          </div>
        </template>
      </PopCurrency>
      <PopCurrency :popShow="popState2" @close="popState2 = false">
        <template v-slot:header>
          <p style="text-align: center">设置ic/id卡</p>
        </template>
        <template v-slot:main>
          <div class="re_msg1">
            <div class="fl">
              <el-form label-width="150px" style="width: 400px; float: left">
                <el-form-item label="卡号:">
                  <span class="fl">{{ detail.code }}</span>
                  <!-- <el-input v-model="selEqudata.data.number"></el-input> -->
                </el-form-item>
                <el-form-item label="类型:">
                  <el-select v-model="detail.type">
                    <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item
                    style="margin-bottom: 0px"
                    label-width="250px"
                    label="关联设备:"
                ></el-form-item>
                <div class="hide-scrollbar">
                  <el-checkbox-group v-model="detail.lab">
                    <el-checkbox v-for="(item, index) in props.dataS" :label="item.id" size="large">
                      {{ item.device_no + '/' + item.labName }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
<!--                <el-form-item label="关联设备:">-->
<!--                  <div>-->
<!--                    <el-checkbox-group v-model="detail.lab">-->
<!--                      <el-checkbox v-for="(item, index) in props.dataS" :label="item.id" size="large">-->
<!--                        {{ item.group_no + '/' + item.labName }}-->
<!--                      </el-checkbox>-->
<!--                      <el-checkbox label="1" size="large" style="display: none">1111</el-checkbox>-->
<!--                    </el-checkbox-group>-->
<!--                    &lt;!&ndash;                    <div style="text-align: left">&ndash;&gt;-->
<!--                    &lt;!&ndash;                      <el-checkbox v-model="checked2" label="Option 2" size="large" />&ndash;&gt;-->
<!--                    &lt;!&ndash;                    </div>&ndash;&gt;-->
<!--                  </div>-->
<!--                </el-form-item>-->
                <el-form-item label="负责人:">
                  <el-select v-model="detail.user_id">
                    <el-option v-for="item in optionsUser" :key="item.id" :label="item.username" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div>
            <div class="fr btn_z green-btn ml-60" @click="affirm()">确认</div>
            <div class="fr btn_z white-btn ml-60" @click="popState2 = false">取消</div>
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
import { findAllIcIdCard, icIdCardSave, icIdCardDelete } from '@service/intelligent-device/wisdom-class/index'
import { icIdListItem } from '@service/intelligent-device/wisdom-class/types'
import { getSchoolUser } from '@service/login/login'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteScrapList } from '@service/equ-manage/scrapRegistration'
import { ArrowRight } from '@element-plus/icons-vue'
const store = useStore()
const subject = store.state.common.subjectArr
const popState = ref(false)
const popState2 = ref(false)
const checked1 = ref(true)
const checked2 = ref(false)
const data = ref<icIdListItem[]>([])
let props = defineProps({
  dataS: {
    type: Array,
    required: true
  }
})
setTimeout(() => {
  console.log(props)
}, 2000)
let setData = reactive({
  temperature: 20,
  carbonDioxide: 20,
  type: 1,
  user_id: 0
})
let detail = reactive({
  code: '',
  type: 1,
  user_id: '',
  lab: ref([])
})
let optionsType = reactive([
  {
    value: 1,
    label: 'ic卡'
  },
  {
    value: 2,
    label: 'id卡'
  }
])
let optionsUser = ref([])

const selectId = ref(0)

const initDate = () => {
  findAllIcIdCard().then((res) => {
    console.log(res)
    data.value = res.data
  })
  getSchoolUser({ role_id: 2 }).then((res) => {
    optionsUser.value = []
    res.data.forEach((item) => {
      optionsUser.value.push({
        id: item.id,
        username: item.username
      })
    })
  })
}
initDate()
const dels = (id: number) => {
  ElMessageBox.confirm('提示:删除类型会删除所有的对应类型的信息，确认需要删除？', '删除类型', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    icIdCardDelete({ id: id }).then((res) => {
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        initDate()
      }
    })
  })
}
let emit = defineEmits(['back'])
const pageRetuen = () => {
  console.log(512132321)
  emit('back')
}
const add = () => {
  detail.code = ''
  detail.type = 1
  detail.user_id = ''
  popState.value = true
  detail.lab = []
}
const save = () => {
  let icIdCardPeripheral = []
  detail.lab.forEach((item) => {
    console.log(item)
    icIdCardPeripheral.push({
      peripheral_id: item
    })
  })
  icIdCardSave({
    code: detail.code,
    type: detail.type,
    user_id: detail.user_id,
    ic_id_card_peripheral: icIdCardPeripheral
  }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '添加成功'
      })
      detail.code = ''
      detail.type = 1
      detail.user_id = ''
      detail.lab = []
      initDate()
      popState.value = false
    }
  })
}

const sets = (date: any) => {
  popState2.value = true
  detail.code = date.code
  selectId.value = date.id
  detail.type = date.type
  detail.user_id = (date.user_id < 1 || date.user_id === '') ? '' : date.user_id
  detail.lab = date.ic_id_card_peripheral.map((e) => e.peripheral_id)
  console.log(detail.lab)
}
const affirm = () => {
  console.log(detail.lab)
  let icIdCardPeripheral = []
  detail.lab.forEach((item) => {
    console.log(item)
    icIdCardPeripheral.push({
      peripheral_id: item
    })
  })
  icIdCardSave({
    id: selectId.value,
    code: detail.code,
    type: detail.type,
    user_id: detail.user_id,
    ic_id_card_peripheral: icIdCardPeripheral
  }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '修改成功'
      })
      initDate()
      popState2.value = false
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

main {
  width: 100%;

  .sel-box {
    width: 100%;
    height: 60px;

    .operation {
      float: left;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: #f3f3f3;
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
          margin-left: 20px;
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
  width: 300px;
}
.el-select {
  width: 300px;
}
.el-checkbox {
  width: 100%;
}
.fl {
  padding-left: 5px;
}
.content {
  margin-top: 20px;
  .click-box {
    display: flex;
    justify-content: space-evenly;
    .click-text {
      display: flex;
      align-items: center;
      margin: 0 10px;
      cursor: pointer;
      img {
        margin-right: 6px;
      }
    }
  }
}
.green {
  color: #05c65d;
}
.white-btn {
  color: #05c65d;
  border: 0px solid #f3f3f3;
  background: #f3f3f3;
}
:deep(.el-form-item__label) {
  text-align: left;
}
:deep(.el-form-item__content) {
  display: flex;
}
.hide-scrollbar {
  max-height: 250px;
  overflow: auto; /* 启用滚动 */
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
}

/* 兼容所有浏览器的通用方法 */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
