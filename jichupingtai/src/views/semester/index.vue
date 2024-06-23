<template>
  <header>
    <span>学期管理</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>学期管理</span>
        <div class="button-box">
          <div class="sel-item">
            <span>范围筛选：</span>
            <el-date-picker
              v-model="value1"
              type="daterange"
              size="small"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              @change="timeChange"
            />
          </div>

          <div class="btn green-btn" @click="popState = true">+ 新建学年学期</div>
          <!-- <div class="btn white-btn">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出账号
          </div> -->
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>省:</span>
            <div class="sel">
              <el-select v-model="area1" class="m-2" placeholder="请选择" @change="areaChange1">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options1" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>市:</span>
            <div class="sel">
              <el-select v-model="area2" class="m-2" placeholder="请选择" @change="areaChange2">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options2" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>区域:</span>
            <div class="sel">
              <el-select v-model="area3" class="m-2" placeholder="请选择" @change="areaChange3">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options3" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="sel-r">
          <div class="mt-4">
            <el-input placeholder="请输入学年" v-model="fromData.pageData.year" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon" @click="getArea">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%">
      <!-- <el-table-column align="left" type="selection" width="30" /> -->
      <el-table-column align="left" type="index" label="序号" width="100" />
      <el-table-column align="left" property="date" label="区域" min-width="20">
        <template #default="props">
          <span>{{ props.row.proName + props.row.cityName + props.row.areaName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" property="date" label="学年" min-width="20">
        <template #default="props">
          <span>{{ props.row.year }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="上学期">
        <el-table-column align="left" property="address" label="开始时间" min-width="20">
          <template #default="props">
            <span>{{ props.row.first_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" property="address" label="小学周次" min-width="20">
          <template #default="props">
            <span>{{ props.row.upweeknumx }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" property="address" label="初中周次" min-width="20">
          <template #default="props">
            <span>{{ props.row.upweeknumc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" property="address" label="高中周次" min-width="20">
          <template #default="props">
            <span>{{ props.row.upweeknumg }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="left" label="下学期">
        <el-table-column align="left" property="address" label="开始时间" min-width="20">
          <template #default="props">
            <span>{{ props.row.second_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" property="address" label="小学周次" min-width="20">
          <template #default="props">
            <span>{{ props.row.downweeknumx }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" property="address" label="初中周次" min-width="20">
          <template #default="props">
            <span>{{ props.row.downweeknumc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" property="address" label="高中周次" min-width="20">
          <template #default="props">
            <span>{{ props.row.downweeknumg }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" property="date" label="操作" min-width="30">
        <template #default="props">
          <div class="operation-box">
            <div @click="edit(props.row)">
              <img src="@assets/images/common/edit.png" alt="" />
              <span>编辑</span>
            </div>
            <!-- <div @click="rePassword(props)">
              <img src="@assets/images/common/re-password.png" alt="" />
              <span>重置密码</span>
            </div> -->
            <div @click="delitem(props.row.id)">
              <img src="@assets/images/common/del-red.png" alt="" />
              <span>删除</span>
            </div>
          </div>

          <!-- <span @click="edit(props.row)" class="point_green">编辑</span>
          <span @click="delitem(props.row.id)" class="point_green">删除</span> -->
        </template>
      </el-table-column>
    </el-table>
  </main>
  <footer>
    <el-pagination
      v-model:currentPage="currentPage3"
      v-model:page-size="pageSize3"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="fromData.dataTotal"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </footer>
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>创建学年学期</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl" style="height: 100%">区域:</span>
          <div class="w-300 fl">
            <div class="sel mb-8">
              <el-select v-model="area4" class="m-2" placeholder="请选择省份" @change="areaChange4">
                <el-option v-for="item in options4" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="sel mb-8">
              <el-select v-model="area5" class="m-2" placeholder="请选择城市" @change="areaChange5">
                <el-option v-for="item in options5" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="sel">
              <el-select v-model="area6" class="m-2" placeholder="请选择区域" @change="areaChange6">
                <el-option v-for="item in options6" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="">
          <span class="w-108 fl" style="height: 100%">学年:</span>
          <div class="w-200 fl mb-20">
            <el-date-picker
              v-model="year1"
              value-format="YYYY"
              type="year"
              placeholder="请选择日期"
              size="small"
              @change="yearChange1"
            />
          </div>
          <div class="w-200 fl mb-20">
            <el-date-picker
              v-model="year2"
              value-format="YYYY"
              type="year"
              placeholder="请选择日期"
              size="small"
              @change="yearChange2"
            />
          </div>
        </div>
        <div class="">
          <span class="w-108 fl" style="height: 100%">上学期:</span>
          <div class="w-200 fl">
            <div class="mb-8">
              <span class="fl w-108">上学期开学时间</span>
              <el-date-picker
                v-model="newData.first_time"
                type="data"
                placeholder="请选择上学期开学时间"
                size="small"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="">
              <span class="fl w-108">小学周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="newData.upweeknumx" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
            <div class="">
              <span class="fl w-108">初中周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="newData.upweeknumc" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
            <div class="">
              <span class="fl w-108">高中周次</span>
              <div class="w-200 fl mb-20">
                <el-input v-model="newData.upweeknumg" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
          </div>
        </div>
        <div class="">
          <span class="w-108 fl" style="height: 100%">下学期:</span>
          <div class="w-200 fl">
            <div class="mb-8">
              <span class="fl w-108">下学期开学时间</span>
              <el-date-picker
                v-model="newData.second_time"
                type="data"
                placeholder="请选择上学期开学时间"
                size="small"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="">
              <span class="fl w-108">小学周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="newData.downweeknumx" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
            <div class="">
              <span class="fl w-108">初中周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="newData.downweeknumc" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
            <div class="">
              <span class="fl w-108">高中周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="newData.downweeknumg" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="save">保存</div>
        <div class="fr btn white-btn ml-60" @click="addAreaClose">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState1" @close="popState1 = $event">
    <template v-slot:header>
      <p>编辑学年学期</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl" style="height: 100%">区域:</span>
          <div class="w-300 fl">
            {{ editData.proName + editData.cityName + editData.areaName }}
          </div>
        </div>
        <div class="">
          <span class="w-108 fl" style="height: 100%">学年:</span>
          <div class="w-200 fl mb-20">
            {{ editData.year }}
          </div>
        </div>
        <div class="">
          <span class="w-108 fl" style="height: 100%">上学期:</span>
          <div class="w-200 fl">
            <div class="mb-8">
              <span class="fl w-108">上学期开学时间</span>
              <el-date-picker
                v-model="editData.first_time"
                type="data"
                placeholder="请选择上学期开学时间"
                size="small"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="">
              <span class="fl w-108">小学周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="editData.upweeknumx" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
            <div class="">
              <span class="fl w-108">初中周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="editData.upweeknumc" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
            <div class="">
              <span class="fl w-108">高中周次</span>
              <div class="w-200 fl mb-20">
                <el-input v-model="editData.upweeknumg" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
          </div>
        </div>
        <div class="">
          <span class="w-108 fl" style="height: 100%">下学期:</span>
          <div class="w-200 fl">
            <div class="mb-8">
              <span class="fl w-108">下学期开学时间</span>
              <el-date-picker
                v-model="editData.second_time"
                type="data"
                placeholder="请选择上学期开学时间"
                size="small"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="">
              <span class="fl w-108">小学周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="editData.downweeknumx" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
            <div class="">
              <span class="fl w-108">初中周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="editData.downweeknumc" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
            <div class="">
              <span class="fl w-108">高中周次</span>
              <div class="w-200 fl mb-8">
                <el-input v-model="editData.downweeknumg" type="number" placeholder="请输入小学周次" size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="save1">保存</div>
        <div class="fr btn white-btn ml-60" @click="addAreaClose1">取消</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import type { ElTable } from 'element-plus'
import { getAreaPage, changeStandard, findArea } from '@service/area/index'
import { getSwrYear, saveSwrYear, delSwrYear } from '@service/term/index'
import { PopCurrency } from '@components/pop-currency'
const value1 = ref('')
const timeChange = (val: any) => {
  console.log(val)
  if (val === null) {
    fromData.pageData.swryear = ''
  } else {
    let str = val[0] + '~' + val[1]
    fromData.pageData.swryear = str
  }

  getArea()
}
const delitem = (id: number) => {
  ElMessageBox.confirm('确定删除!', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  })
    .then(() => {
      delSwrYear({ id: id }).then((res) => {
        console.log(res)
        getArea()
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          ElMessage({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    })
    .catch(() => {
      console.log('取消操作')
    })
  // delSwrYear({ id: id }).then((res) => {
  //   console.log(res)
  // })
}
const popState = ref(false)
const popState1 = ref(false)
const addAreaClose = () => {
  popState.value = false
}
const addAreaClose1 = () => {
  popState1.value = false
}
const getFindArea = (val: number, id: any, sel: any) => {
  findArea({ area_level: val, p_id: id }).then((res) => {
    console.log(res)
    if (sel === 1) {
      options1.value = res.data
      options4.value = res.data
    } else if (sel === 2) {
      options2.value = res.data
      options5.value = res.data
    } else if (sel === 3) {
      options3.value = res.data
      options6.value = res.data
    }
  })
}
getFindArea(1, 0, 1)

const area1 = ref('')
const options1: any = ref([])
const areaChange1 = () => {
  area2.value = ''
  area3.value = ''
  fromData.pageData.city = ''
  fromData.pageData.area = ''
  fromData.pageData.pro = area1.value
  if (area1.value === '') {
    options2.value = []
    options3.value = []
  } else {
    getFindArea(2, area1.value, 2)
    options3.value = []
  }

  getArea()
}
const areaChange2 = () => {
  console.log(area1.value)
  area3.value = ''
  fromData.pageData.city = area2.value
  fromData.pageData.area = ''
  if (area2.value === '') {
    options3.value = []
  } else {
    getFindArea(3, area2.value, 3)
  }
  getArea()
}
const areaChange3 = () => {
  fromData.pageData.area = area3.value
  getArea()
}
const area2 = ref('')
const options2: any = ref([])
const area3 = ref('')
const options3: any = ref([])
/* fenge*/
const area4 = ref('')
const options4: any = ref([])
const areaChange4 = () => {
  area5.value = ''
  area6.value = ''
  newData.city = ''
  newData.area = ''
  newData.pro = area4.value
  if (area4.value === '') {
    options5.value = []
    options6.value = []
  } else {
    getFindArea(2, area4.value, 2)
    options3.value = []
  }

  getArea()
}
const areaChange5 = () => {
  console.log(area4.value)
  area6.value = ''
  newData.city = area5.value
  newData.area = ''
  if (area5.value === '') {
    options6.value = []
  } else {
    getFindArea(3, area5.value, 3)
  }
  getArea()
}
const areaChange6 = () => {
  newData.area = area6.value
  getArea()
}
const area5 = ref('')
const options5: any = ref([])
const area6 = ref('')
const options6: any = ref([])
const value = ref('')
// const input1 = ref('')
const newData = reactive({
  area: '',
  city: '',
  pro: '',
  year: '',
  first_time: '',
  second_time: '',
  upweeknumx: '',
  upweeknumc: '',
  upweeknumg: '',
  downweeknumx: '',
  downweeknumc: '',
  downweeknumg: ''
})
const editData: any = ref({})
const year1: any = ref('')
const year2: any = ref('')
const yearChange1 = () => {
  console.log(year1.value)
  year2.value = (parseInt(year1.value) + 1).toString()
  newData.year = year1.value + '-' + year2.value
}
const yearChange2 = () => {
  year1.value = (parseInt(year2.value) - 1).toString()
  newData.year = year1.value + '-' + year2.value
}
const fromData: any = reactive({
  dataTotal: 0,
  pageData: {
    limit: 10,
    page: 1,
    pro: '',
    city: '',
    area: '',
    year: '',
    swryear: ''
  }
})
const tableData: any = ref([])
const getArea = () => {
  getSwrYear(fromData.pageData).then((res) => {
    console.log('数据：', res.data)
    tableData.value = res.data.data
    fromData.dataTotal = res.data.total
  })
}
getArea()
const save = () => {
  console.log(newData)
  saveSwrYear(newData).then((res) => {
    if (res.code === 10) {
      console.log('保存结果', res)
      popState.value = false
      getArea()
      year1.value = ''
      year2.value = ''
      area4.value = ''
      area5.value = ''
      area6.value = ''
      areaChange4()
      newData.area = ''
      newData.city = ''
      newData.pro = ''
      newData.year = ''
      newData.first_time = ''
      newData.second_time = ''
      newData.upweeknumx = ''
      newData.upweeknumc = ''
      newData.upweeknumg = ''
      newData.downweeknumx = ''
      newData.downweeknumc = ''
      newData.downweeknumg = ''
      ElMessage({
        type: 'success',
        message: '创建成功!'
      })
    }
  })
}
const save1 = () => {
  console.log(editData)
  saveSwrYear(editData.value).then((res) => {
    if (res.code === 10) {
      console.log('保存结果', res)
      popState1.value = false
      getArea()
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
    }
  })
}
const edit = (item: any) => {
  console.log(item)
  editData.value = item
  popState1.value = true
}
const change = (id: any, instrument_standard: any) => {
  changeStandard({ id, instrument_standard }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
      getArea()
    }
  })
}
// 分页
const currentPage3 = ref(1)
const pageSize3 = ref(10)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)
const handleCurrentChange = (val: number) => {
  fromData.pageData.page = val
  getArea()
}
// 操作
// const rePassword = (val: any) => {
//   console.log(val)
// }
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
.form-box {
  & > div {
    min-height: 30px;
    line-height: 30px;
    text-align: left;
    overflow: hidden;
    & > span {
      height: 100%;
    }
  }
}
main {
  width: 100%;
  .sel-box {
    margin-bottom: 20px;
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
          margin-left: 20px;
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
            width: 30%;
            height: 30px;
            line-height: 30px;
            text-align: center;
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
        float: left;
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
  .del-res {
    margin-top: 10px;
    height: 56px;
    span {
      float: left;
      height: 56px;
      line-height: 56px;
      font-size: 20px;
      color: #404040;
    }
    .green-t {
      padding: 0 8px;
      color: #05c65d;
    }
    & > div {
      float: right;
      margin: 10px 20px 0 0;
      display: flex;
      align-items: center;
      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }
}
footer {
  margin: 28px 0 16px;
  text-align: right;
}
.operation-box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      margin-right: 12px;
      width: 20px;
      height: 20px;
    }
  }
}
::v-deep .el-table .el-table__row .el-table__cell {
  padding: 12px 0;
}
.point_green {
  cursor: pointer;
  margin: 0 12px;
  &:hover {
    color: #05c65d;
  }
}
</style>
