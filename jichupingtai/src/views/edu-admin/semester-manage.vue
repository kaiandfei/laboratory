<template>
  <header>
    <span>教务管理 > 学期管理</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>学期管理</span>

        <div class="button-box">
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
          <div class="btn green-btn" @click="popState = true">+ 创建学期</div>
          <!-- <div class="btn white-btn">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出教师
          </div> -->
          <!-- <div class="btn white-btn">
            <img src="@assets/images/account-school/imp.png" alt="" />
            批量导入
          </div> -->
        </div>
      </div>
      <!-- <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>年纪:</span>
            <div class="sel">
              <el-select v-model="value" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>班级:</span>
            <div class="sel">
              <el-select v-model="value" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="input1" placeholder="请选择" class="input-with-select">
              <template #append>
                <div class="ser-icon">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div> -->
    </div>
    <!-- <div class="del-res">
      <div class="btn green-btn">
        <img src="@assets/images/account-school/w-del.png" alt="" />
        批量删除
      </div>
    </div> -->
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      stripe
      style="width: 100%"
      @current-change="handleSelectionChange"
      @select-all="selChangeAll"
    >
      <!-- <el-table-column align="left" type="selection" width="30" /> -->
      <el-table-column align="left" type="index" label="序号" min-width="10" />
      <el-table-column align="left" property="school_year" label="学年" min-width="15" />
      <el-table-column align="left" label="上学期">
        <el-table-column align="left" property="first_time" label="开始时间" min-width="15" />
        <el-table-column align="left" property="year_weekup" label="周次" min-width="15" :header-cell-style="rowClass">
          <template #default="props">
            <span>{{ props.row.schoolyearweek.filter((item:any) => item.term_num == 1)[0]?.weeknum }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="left" label="下学期">
        <el-table-column align="left" property="second_time" label="开始时间" min-width="15" />
        <el-table-column align="left" property="year_weekdown" label="周次" min-width="15">
          <template #default="props">
            <span>{{ props.row.schoolyearweek.filter((item:any) => item.term_num == 2)[0]?.weeknum }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="left" property="name" label="课时" min-width="10">
        <template #default="props">
          <span class="green_font" @click="rePassword1(props.row.id)">查看</span>
        </template>
      </el-table-column>
      <el-table-column align="center" property="address" label="操作" min-width="20">
        <template #default="props">
          <div class="operation-box">
            <div @click="rePassword(props.row.id)">
              <img src="@assets/images/common/edit.png" alt="" />
              <span>编辑</span>
            </div>
            <!-- <div @click="rePassword(props)">
              <img src="@assets/images/common/re-password.png" alt="" />
              <span>重置密码</span>
            </div> -->
            <div @click="delItem(props.row.id)">
              <img src="@assets/images/common/del-red.png" alt="" />
              <span>删除</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <!-- <footer>
    <el-pagination
      v-model:currentPage="pageData.page"
      v-model:page-size="pageData.limit"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </footer> -->
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>创建学期</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学年:
          </span>
          <div class="fl mr-70">
            <el-date-picker
              v-model="addFrom.schoolYearStart"
              type="year"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="yearChange1(null)"
              value-format="YYYY"
            ></el-date-picker>
            至
            <el-date-picker
              v-model="addFrom.schoolYearEnd"
              type="year"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="yearChange2(null)"
              value-format="YYYY"
            ></el-date-picker>
          </div>
          <!-- <span class="w-108 fl">性别:</span>
          <div class="w-300 fl">
            <el-select v-model="addFrom.sex" class="m-2" placeholder="选择">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </div> -->
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            上学期:
          </span>
          <div class="fl mr-70">
            <span class="mr-18">开始时间</span>
            <el-date-picker
              v-model="addFrom.schoolYearWeek[0].first_time"
              type="date"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
            <div class="h-30 mt-20" v-for="(item, index) in addFrom.schoolYearWeek[0].weeks" :key="index">
              <span class="fl mr-18">{{ item.name }}</span>
              <div class="w-220 fl mr-70">
                <el-input v-model="item.weeknum" placeholder="请输入具体周数"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            下学期:
          </span>
          <div class="fl mr-70">
            <span class="mr-18">开始时间</span>
            <el-date-picker
              v-model="addFrom.schoolYearWeek[1].first_time"
              type="date"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
            <div class="h-30 mt-20" v-for="(item, index) in addFrom.schoolYearWeek[1].weeks" :key="index">
              <span class="fl mr-18">{{ item.name }}</span>
              <div class="w-220 fl mr-70">
                <el-input v-model="item.weeknum" placeholder="请输入具体周数"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            作息时间:
          </span>
          <div class="fl mr-70">
            <div>
              <el-check-tag checked style="margin-right: 8px" @click="addFromworkrest">添加新的作息时间</el-check-tag>
            </div>
            <div v-for="(item, index) in addFrom.school_year_workrest" :key="index" class="mt-20">
              <div class="w-108 fl mr-18">
                <el-input v-model="item.title" placeholder="请输入名称"></el-input>
              </div>
              <el-date-picker
                v-model="item.start_time"
                type="date"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                @change="yearChange1(index)"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
              至
              <el-date-picker
                v-model="item.end_time"
                type="date"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                @change="yearChange2(index)"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
              <span v-if="index > 0" @click="addFrom.school_year_workrest.splice(index, 1)" class="font-red">
                <el-icon><circle-close /></el-icon>
              </span>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            课程表:
          </span>
          <div class="fl mr-70">
            <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane
                v-for="(item, index) in addFrom.school_year_workrest"
                :key="index"
                :label="item.title"
                :name="item.title"
              >
                <el-tabs tab-position="left" class="demo-tabs">
                  <el-tab-pane v-for="(item1, index1) in item.schoolYearSection" :key="index1" :label="item1.name">
                    <div>
                      <div>
                        <span>上午</span>
                        <el-input-number v-model="amNew" :min="1" :max="10" @change="handleChangeAmNew" />
                        <!-- <span>{{ item1.am.length }}</span> -->
                      </div>
                      <div class="mt-20" v-for="(item2, index2) in item1.am" :key="index2">
                        <span class="mr-18 jc">{{ '第' + (index2 + 1) + '节' }}</span>
                        <el-time-picker
                          v-model="item2.starttime"
                          placeholder="开始时间"
                          value-format="HH-mm-ss"
                        ></el-time-picker>
                        至
                        <el-time-picker
                          v-model="item2.endtime"
                          placeholder="结束时间"
                          value-format="HH-mm-ss"
                        ></el-time-picker>
                      </div>
                      <div class="mt-20">
                        <span>下午</span>
                        <el-input-number v-model="pmNew" :min="1" :max="10" @change="handleChangePmNew" />
                        <!-- <span>{{ item1.pm.length }}</span> -->
                      </div>
                      <div class="mt-20" v-for="(item3, index3) in item1.pm" :key="index3">
                        <span class="mr-18 jc">{{ '第' + (index3 + item1.am.length + 1) + '节' }}</span>
                        <el-time-picker
                          v-model="item3.starttime"
                          placeholder="开始时间"
                          value-format="HH-mm-ss"
                        ></el-time-picker>
                        至
                        <el-time-picker
                          v-model="item3.endtime"
                          placeholder="结束时间"
                          value-format="HH-mm-ss"
                        ></el-time-picker>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="addNew">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState1" @close="popState1 = $event">
    <template v-slot:header>
      <p>修改学期</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学年:
          </span>
          <div class="fl mr-70">
            <el-date-picker
              v-model="editFrom.schoolYearStart"
              type="year"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="yearChange3"
              value-format="YYYY"
            ></el-date-picker>
            至
            <el-date-picker
              v-model="editFrom.schoolYearEnd"
              type="year"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="yearChange4"
              value-format="YYYY"
            ></el-date-picker>
          </div>
          <!-- <span class="w-108 fl">性别:</span>
          <div class="w-300 fl">
            <el-select v-model="addFrom.sex" class="m-2" placeholder="选择">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </div> -->
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            上学期:
          </span>
          <div class="fl mr-70">
            <span class="mr-18">开始时间</span>
            <el-date-picker
              v-model="editFrom.schoolYearWeek[0].first_time"
              type="date"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
            <div class="h-30 mt-20" v-for="(item, index) in editFrom.schoolYearWeek[0].weeks" :key="index">
              <span class="fl mr-18">{{ item.name }}</span>
              <div class="w-220 fl mr-70">
                <el-input v-model="item.weeknum" placeholder="请输入具体周数"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            下学期:
          </span>
          <div class="fl mr-70">
            <span class="mr-18">开始时间</span>
            <el-date-picker
              v-model="editFrom.schoolYearWeek[1].first_time"
              type="date"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
            <div class="h-30 mt-20" v-for="(item, index) in editFrom.schoolYearWeek[1].weeks" :key="index">
              <span class="fl mr-18">{{ item.name }}</span>
              <div class="w-220 fl mr-70">
                <el-input v-model="item.weeknum" placeholder="请输入具体周数"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            作息时间:
          </span>
          <div class="fl mr-70">
            <div>
              <el-check-tag checked style="margin-right: 8px" @click="editFromworkrest">添加新的作息时间</el-check-tag>
            </div>
            <div v-for="(item, index) in editFrom.school_year_workrest" :key="index" class="mt-20">
              <div class="w-108 fl mr-18">
                <el-input v-model="item.title" placeholder="请输入名称"></el-input>
              </div>
              <el-date-picker
                v-model="item.start_time"
                type="date"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                @change="yearChange1(index)"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
              至
              <el-date-picker
                v-model="item.end_time"
                type="date"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                @change="yearChange2(index)"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
              <span v-if="index > 0" @click="editFrom.school_year_workrest.splice(index, 1)" class="font-red">
                <el-icon><circle-close /></el-icon>
              </span>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            课程表:
          </span>
          <div class="fl mr-70">
            <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClickEdit">
              <el-tab-pane
                v-for="(item, index) in editFrom.school_year_workrest"
                :key="index"
                :label="item.title"
                :name="item.title"
              >
                <el-tabs tab-position="left" class="demo-tabs">
                  <el-tab-pane v-for="(item1, index1) in item.schoolYearSection" :key="index1" :label="item1.name">
                    <div>
                      <div>
                        <span>上午</span>
                        <el-input-number v-model="amEdit" :min="1" :max="10" @change="handleChangeAmEdit" />
                      </div>
                      <div class="mt-20" v-for="(item2, index2) in item1.am" :key="index2">
                        <span class="mr-18 jc">{{ '第' + (index2 + 1) + '节' }}</span>
                        <el-time-picker
                          v-model="item2.starttime"
                          placeholder="开始时间"
                          value-format="HH-mm-ss"
                        ></el-time-picker>
                        至
                        <el-time-picker
                          v-model="item2.endtime"
                          placeholder="结束时间"
                          value-format="HH-mm-ss"
                        ></el-time-picker>
                      </div>
                      <div class="mt-20">
                        <span>下午</span>
                        <el-input-number v-model="pmEdit" :min="1" :max="10" @change="handleChangePmEdit" />
                      </div>
                      <div class="mt-20" v-for="(item3, index3) in item1.pm" :key="index3">
                        <span class="mr-18 jc">{{ '第' + (index3 + item1.am.length + 1) + '节' }}</span>
                        <el-time-picker
                          v-model="item3.starttime"
                          placeholder="开始时间"
                          value-format="HH-mm-ss"
                        ></el-time-picker>
                        <!-- <el-time-picker
                          v-model="item3.starttime"
                          placeholder="开始时间"
                          :disabled-hours="disabledHours"
                          value-format="HH-mm-ss"
                        ></el-time-picker> -->
                        至
                        <el-time-picker
                          v-model="item3.endtime"
                          placeholder="结束时间"
                          value-format="HH-mm-ss"
                        ></el-time-picker>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="editsave">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState1 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState10" @close="popState10 = $event">
    <template v-slot:header>
      <p>查看课时</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            课程表:
          </span>
          <div class="fl mr-70">
            <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClickEdit">
              <el-tab-pane
                v-for="(item, index) in editFrom.school_year_workrest"
                :key="index"
                :label="item.title"
                :name="item.title"
              >
                <el-tabs tab-position="left" class="demo-tabs">
                  <el-tab-pane v-for="(item1, index1) in item.schoolYearSection" :key="index1" :label="item1.name">
                    <div>
                      <div>
                        <span>上午</span>
                        <el-input-number v-model="amEdit" :min="1" :max="10" @change="handleChangeAmEdit" disabled />
                      </div>
                      <div class="mt-20" v-for="(item2, index2) in item1.am" :key="index2">
                        <span class="mr-18 jc">{{ '第' + (index2 + 1) + '节' }}</span>
                        <el-time-picker
                          v-model="item2.starttime"
                          placeholder="开始时间"
                          value-format="HH-mm-ss"
                          disabled
                        ></el-time-picker>
                        至
                        <el-time-picker
                          v-model="item2.endtime"
                          placeholder="结束时间"
                          value-format="HH-mm-ss"
                          disabled
                        ></el-time-picker>
                      </div>
                      <div class="mt-20">
                        <span>下午</span>
                        <el-input-number v-model="pmEdit" :min="1" :max="10" disabled @change="handleChangePmEdit" />
                      </div>
                      <div class="mt-20" v-for="(item3, index3) in item1.pm" :key="index3">
                        <span class="mr-18 jc">{{ '第' + (index3 + item1.am.length + 1) + '节' }}</span>
                        <el-time-picker
                          v-model="item3.starttime"
                          placeholder="开始时间"
                          value-format="HH-mm-ss"
                          disabled
                        ></el-time-picker>
                        至
                        <el-time-picker
                          v-model="item3.endtime"
                          placeholder="结束时间"
                          value-format="HH-mm-ss"
                          disabled
                        ></el-time-picker>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn white-btn ml-60" @click="popState10 = false">确定</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getDiffDay } from '@/utils/getDiffDay'
import type { ElTable } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useStore } from '@store/index'
import { PopCurrency } from '@components/pop-currency'
import { getSchoolMsg } from '@/service/term'
import { saveSchoolYear, schoolYearList, schoolYearDel } from '@service/school-class/index'
import { CircleClose } from '@element-plus/icons-vue'
const value1 = ref('')
const timeChange = (val: any) => {
  console.log(val)
  if (val === null) {
    pageData.start_time = ''
  } else {
    let str = val[0] + '~' + val[1]
    pageData.start_time = str
  }

  getPageData()
}
const store = useStore()
console.log(111)

console.log(store.state.login.userInfo)
// 第一个选项
const selTime = ref(0)
const amNew = ref(4)
const pmNew = ref(4)
const handleClick = (tab: any) => {
  selTime.value = parseInt(tab.index)
  console.log(selTime.value)
  amNew.value = addFrom.school_year_workrest[selTime.value].schoolYearSection[0].am.length
  pmNew.value = addFrom.school_year_workrest[selTime.value].schoolYearSection[0].pm.length
}
const handleChangeAmNew = (value: number) => {
  console.log(value)
  console.log(addFrom)
  if (value > addFrom.school_year_workrest[selTime.value].schoolYearSection[0].am.length) {
    console.log('大于')
    let a = value - addFrom.school_year_workrest[selTime.value].schoolYearSection[0].am.length
    for (let i = 0; i < a; i++) {
      addFrom.school_year_workrest[selTime.value].schoolYearSection[0].am.push({
        starttime: '',
        endtime: ''
      })
    }
  } else if (value < addFrom.school_year_workrest[selTime.value].schoolYearSection[0].am.length) {
    console.log('小于')
    let a = addFrom.school_year_workrest[selTime.value].schoolYearSection[0].am.length - value
    for (let i = 0; i < a; i++) {
      addFrom.school_year_workrest[selTime.value].schoolYearSection[0].am.pop()
    }
  }
}
const handleChangePmNew = (value: number) => {
  console.log(value)
  console.log(addFrom)
  if (value > addFrom.school_year_workrest[selTime.value].schoolYearSection[0].pm.length) {
    console.log('大于')
    let a = value - addFrom.school_year_workrest[selTime.value].schoolYearSection[0].pm.length
    for (let i = 0; i < a; i++) {
      addFrom.school_year_workrest[selTime.value].schoolYearSection[0].pm.push({
        starttime: '',
        endtime: ''
      })
    }
  } else if (value < addFrom.school_year_workrest[selTime.value].schoolYearSection[0].pm.length) {
    console.log('小于')
    let a = addFrom.school_year_workrest[selTime.value].schoolYearSection[0].pm.length - value
    for (let i = 0; i < a; i++) {
      addFrom.school_year_workrest[selTime.value].schoolYearSection[0].pm.pop()
    }
  }
}
const selTimeEdit = ref(0)
const amEdit = ref(4)
const pmEdit = ref(4)
const handleClickEdit = (tab: any) => {
  selTimeEdit.value = parseInt(tab.index)
  console.log(selTimeEdit.value)
  amEdit.value = editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].am.length
  pmEdit.value = editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].pm.length
}
const handleChangeAmEdit = (value: number) => {
  console.log(value)
  console.log(editFrom)
  if (value > editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].am.length) {
    console.log('大于')
    let a = value - editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].am.length
    for (let i = 0; i < a; i++) {
      editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].am.push({
        starttime: '',
        endtime: ''
      })
    }
  } else if (value < editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].am.length) {
    console.log('小于')
    let a = editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].am.length - value
    for (let i = 0; i < a; i++) {
      editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].am.pop()
    }
  }
}
const handleChangePmEdit = (value: number) => {
  console.log(value)
  console.log(editFrom)
  if (value > editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].pm.length) {
    console.log('大于')
    let a = value - editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].pm.length
    for (let i = 0; i < a; i++) {
      editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].pm.push({
        starttime: '',
        endtime: ''
      })
    }
  } else if (value < editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].pm.length) {
    console.log('小于')
    let a = editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].pm.length - value
    for (let i = 0; i < a; i++) {
      editFrom.school_year_workrest[selTimeEdit.value].schoolYearSection[0].pm.pop()
    }
  }
}
const userMsg: any = JSON.parse(JSON.stringify(store.state.login.userInfo))
// 弹窗相关
const popState = ref(false)
const popState1 = ref(false)
const popState10 = ref(false)
const school_code = userMsg.school_code
const school_id = userMsg.school_id
console.log(school_code)
console.log(school_id)
const addFrom: any = reactive({
  school_code: userMsg.school_code,
  school_id: userMsg.school_id,
  school_year: '',
  schoolYearStart: '',
  schoolYearEnd: '',
  schoolYearWeek: [
    {
      first_time: '',
      weeks: [
        {
          weeknum: '',
          term_num: '1',
          phase_study_id: '2',
          name: '初中'
        }
      ]
    },
    {
      first_time: '',
      weeks: [
        {
          weeknum: '',
          term_num: '2',
          phase_study_id: '2',
          name: '初中'
        }
      ]
    }
  ],
  school_year_workrest: [
    {
      title: '冬令时',
      start_time: '',
      endtime: '',
      schoolYearSection: []
    },
    {
      title: '夏令时',
      start_time: '',
      endtime: '',
      schoolYearSection: []
    }
  ]
})
const addFromworkrest = () => {
  let workrestobj: any = {
    title: '',
    start_time: '',
    endtime: '',
    schoolYearSection: []
  }
  addFrom.schoolYearWeek[0].weeks.forEach((item2: any) => {
    let obj: any = {}
    obj.name = item2.name
    obj.phase_study_id = item2.phase_study_id
    obj.am = []
    obj.am.push(
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      }
    )
    obj.pm = []
    obj.pm.push(
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      }
    )
    workrestobj.schoolYearSection.push(obj)
  })
  addFrom.school_year_workrest.push(workrestobj)
}
getSchoolMsg({
  school_id: userMsg.school_id
}).then((res) => {
  console.log(res)
  addFrom.schoolYearWeek = res.data

  addFrom.school_year_workrest.forEach((item: any) => {
    addFrom.schoolYearWeek[0].weeks.forEach((item2: any) => {
      let obj: any = {}
      obj.name = item2.name
      obj.phase_study_id = item2.phase_study_id
      obj.am = []
      obj.am.push(
        {
          starttime: '08-00-00',
          endtime: '08-45-00'
        },
        {
          starttime: '08-55-00',
          endtime: '09-40-00'
        },
        {
          starttime: '10-15-00',
          endtime: '11-00-00'
        },
        {
          starttime: '11-10-00',
          endtime: '11-55-00'
        }
      )
      obj.pm = []
      obj.pm.push(
        {
          starttime: '13-30-00',
          endtime: '14-15-00'
        },
        {
          starttime: '14-30-00',
          endtime: '15-15-00'
        },
        {
          starttime: '15-25-00',
          endtime: '16-00-00'
        },
        {
          starttime: '16-20-00',
          endtime: '17-05-00'
        }
      )
      item.schoolYearSection.push(obj)
    })
  })
  console.log('ssssssssss', addFrom)
})
const tableData: any = ref([])
const pageData = reactive({
  limit: 10,
  page: 1,
  school_code: userMsg.school_code,
  school_id: userMsg.school_id,
  start_time: ''
})
const getPageData = () => {
  schoolYearList(pageData).then((res) => {
    console.log(res)
    tableData.value = res.data.data
  })
}
getPageData()
const activeName = ref('冬令时')

const addNew = () => {
  if (!addFrom.schoolYearStart || !addFrom.schoolYearEnd) {
    ElMessage({
      type: 'warning',
      message: '请选择学年'
    })
    return
  }
  saveSchoolYear(addFrom).then((res) => {
    console.log(res)
    if (res.code === 10) {
      popState.value = false
      getPageData()
      ElMessage({
        type: 'success',
        message: '添加成功!'
      })
    }
  })
}
const editsave = () => {
  if (!editFrom.schoolYearStart || !editFrom.schoolYearEnd) {
    ElMessage({
      type: 'warning',
      message: '请选择学年'
    })
    return
  }
  saveSchoolYear(editFrom).then((res) => {
    console.log(res)
    if (res.code === 10) {
      popState1.value = false
      getPageData()
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
    }
  })
}
const editFromworkrest = () => {
  let workrestobj: any = {
    title: '',
    start_time: '',
    endtime: '',
    schoolYearSection: []
  }
  editFrom.schoolYearWeek[0].weeks.forEach((item2: any) => {
    let obj: any = {}
    obj.name = item2.name
    obj.phase_study_id = item2.phase_study_id
    obj.am = []
    obj.am.push(
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      }
    )
    obj.pm = []
    obj.pm.push(
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      },
      {
        starttime: '',
        endtime: ''
      }
    )
    workrestobj.schoolYearSection.push(obj)
  })
  editFrom.school_year_workrest.push(workrestobj)
}
const delItem = (val: any) => {
  ElMessageBox.confirm(
    '您正在删除学期，删除后将同步删除此学期下的所有数据，数据将无法恢复！确认是否删除!',
    '删除学期',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  )
    .then(() => {
      schoolYearDel({ id: val }).then((res) => {
        console.log(res)
        if (res.code === 10) {
          getPageData()
          ElMessage({
            type: 'success',
            message: '删除成功!'
          })
        }
      })
    })
    .catch(() => {
      console.log('取消操作')
    })
}
const getDate = (date) => {
  var time = new Date(date)
  var year = time.getFullYear()
  var month = ('0' + (time.getMonth() + 1)).slice(-2)
  var day = ('0' + time.getDate()).slice(-2)
  var mydate = year + '-' + month + '-' + day
  return mydate
}
const yearChange1 = (val: any) => {
  addFrom.school_year = addFrom.schoolYearStart + '-' + addFrom.schoolYearEnd
  if (val === null) return
  if (addFrom.school_year_workrest[val].start_time && addFrom.school_year_workrest[val].end_time) {
    getDiffDay(addFrom.school_year_workrest[val].start_time, addFrom.school_year_workrest[val].end_time)
  }
}
const yearChange2 = (val: any) => {
  addFrom.school_year = addFrom.schoolYearStart + '-' + addFrom.schoolYearEnd
  if (val === null || val === addFrom.school_year_workrest.length - 1) return
  let custom = new Date(addFrom.school_year_workrest[val].end_time)
  let next = custom.setDate(custom.getDate() + 1)
  addFrom.school_year_workrest[val + 1].start_time = getDate(next)
  if (addFrom.school_year_workrest[val].start_time && addFrom.school_year_workrest[val].end_time) {
    getDiffDay(addFrom.school_year_workrest[val].start_time, addFrom.school_year_workrest[val].end_time)
  }
}
const yearChange3 = (val: any) => {
  console.log(val)
  editFrom.school_year = editFrom.schoolYearStart + '-' + editFrom.schoolYearEnd
}
const yearChange4 = (val: any) => {
  console.log(val)
  editFrom.school_year = editFrom.schoolYearStart + '-' + editFrom.schoolYearEnd
}
// const value = ref('')
// const input1 = ref('')

// const options = [
//   {
//     value: 'Option1',
//     label: 'Option1'
//   },
//   {
//     value: 'Option2',
//     label: 'Option2'
//   }
// ]

const rowClass = () => {
  return 'background:#E6F1FF;color:#368CFF;'
}
// 表格相关
// interface User {
//   date: string
//   name: string
//   address: string
// }
// const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// const multipleSelection = ref<User[]>([])
// const tableData: User[] = [
//   {
//     date: '2016-05-03',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-02',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-04',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-03',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-02',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-04',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-01',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-04',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-01',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   },
//   {
//     date: '2016-05-01',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   }
// ]
const handleSelectionChange = (val: any) => {
  console.log(val)
  // multipleSelection.value = val
}
const selChangeAll = (selection: any) => {
  console.log(JSON.parse(JSON.stringify(selection)))
}

const small = ref(true)
const background = ref(true)
const disabled = ref(false)

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

const editFrom: any = reactive({
  school_code: userMsg.school_code,
  school_id: userMsg.school_id,
  school_year: '',
  schoolYearStart: '',
  schoolYearEnd: '',
  schoolYearWeek: [
    {
      first_time: '',
      weeks: [
        {
          weeknum: '',
          term_num: '1',
          phase_study_id: '2',
          name: '初中'
        }
      ]
    },
    {
      first_time: '',
      weeks: [
        {
          weeknum: '',
          term_num: '2',
          phase_study_id: '2',
          name: '初中'
        }
      ]
    }
  ],
  school_year_workrest: [
    {
      title: '冬令时',
      start_time: '',
      endtime: '',
      schoolYearSection: []
    },
    {
      title: '夏令时',
      start_time: '',
      endtime: '',
      schoolYearSection: []
    }
  ]
})

// 查看
const rePassword1 = (val: any) => {
  console.log(val)
  getSchoolMsg({
    school_code: userMsg.school_code,
    school_id: userMsg.school_id,
    id: val
  }).then((res) => {
    console.log(res)
    editFrom.id = res.data.id
    editFrom.schoolYearWeek = res.data.schoolYearWeek
    editFrom.school_year_workrest = res.data.SchoolYearWorkrest
    editFrom.school_year = res.data.school_year
    let arr = res.data.school_year.split('-')
    editFrom.schoolYearStart = arr[0]
    editFrom.schoolYearEnd = arr[1]
    if (res.data.SchoolYearWorkrest.length !== 0) {
      amEdit.value = res.data.SchoolYearWorkrest[0].schoolYearSection[0].am.length
      pmEdit.value = res.data.SchoolYearWorkrest[0].schoolYearSection[0].pm.length
    } else {
      editFrom.school_year_workrest = [
        {
          title: '冬令时',
          start_time: '',
          endtime: '',
          schoolYearSection: []
        },
        {
          title: '夏令时',
          start_time: '',
          endtime: '',
          schoolYearSection: []
        }
      ]
      editFrom.schoolYearWeek[0].weeks.forEach((item: any) => {
        let obj: any = {}
        obj.name = item.name
        obj.phase_study_id = item.phase_study_id
        obj.am = []
        obj.am.push(
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          }
        )
        obj.pm = []
        obj.pm.push(
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          }
        )
        editFrom.school_year_workrest[0].schoolYearSection.push(obj)
        editFrom.school_year_workrest[1].schoolYearSection.push(obj)
      })
    }

    selTimeEdit.value = 0
    console.log(addFrom)

    popState10.value = true
  })
}
// 操作
const rePassword = (val: any) => {
  console.log(val)
  getSchoolMsg({
    school_code: userMsg.school_code,
    school_id: userMsg.school_id,
    id: val
  }).then((res) => {
    console.log(res)
    editFrom.id = res.data.id
    editFrom.schoolYearWeek = res.data.schoolYearWeek
    console.log('dxi', res.data.schoolYearWeek)
    editFrom.school_year_workrest = res.data.SchoolYearWorkrest
    editFrom.school_year = res.data.school_year
    let arr = res.data.school_year.split('-')
    editFrom.schoolYearStart = arr[0]
    editFrom.schoolYearEnd = arr[1]
    if (res.data.SchoolYearWorkrest.length !== 0) {
      amEdit.value = res.data.SchoolYearWorkrest[0].schoolYearSection[0].am.length
      pmEdit.value = res.data.SchoolYearWorkrest[0].schoolYearSection[0].pm.length
    } else {
      editFrom.school_year_workrest = [
        {
          title: '冬令时',
          start_time: '',
          endtime: '',
          schoolYearSection: []
        },
        {
          title: '夏令时',
          start_time: '',
          endtime: '',
          schoolYearSection: []
        }
      ]
      editFrom.schoolYearWeek[0].weeks.forEach((item: any) => {
        let obj: any = {}
        obj.name = item.name
        obj.phase_study_id = item.phase_study_id
        obj.am = []
        obj.am.push(
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          }
        )
        obj.pm = []
        obj.pm.push(
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          },
          {
            starttime: '',
            endtime: ''
          }
        )
        editFrom.school_year_workrest[0].schoolYearSection.push(obj)
        editFrom.school_year_workrest[1].schoolYearSection.push(obj)
      })
    }

    selTimeEdit.value = 0
    console.log('qweqe', editFrom)

    popState1.value = true
  })
}
// const disabledHours = () => {
//   return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
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
.form-box {
  width: 886px;
  & .el-input-number {
    margin-left: 30px;
    width: 80px;
  }
  & > div {
    min-height: 30px;
    line-height: 30px;
    text-align: left;
    overflow: hidden;
    & > span {
      height: 100%;
    }
  }
  .el-check-tag {
    margin: 0 0 10px 0;
  }
  .school-class {
    width: 778px;
  }
}
.green_font {
  color: #05c65d;
  cursor: pointer;
}
.jc {
  display: inline-block;
  width: 50px;
}
</style>
