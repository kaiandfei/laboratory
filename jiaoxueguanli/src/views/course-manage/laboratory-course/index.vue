<template>
  <div class="lab-home">
    <p class="breadcrumb">
      课程管理<i class="el-icon-arrow-right" />{{ $route.meta.title }}
    </p>
    <top-filter
      v-show="pageState === 0"
      ref="filterRef"
      :options="[
        'time_ids',
        'semester',
        'subject_id',
        'grade',
        'type',
        'book_type',
        'status',
      ]"
      @change="getTableDateLab"
    />
    <div v-show="pageState === 0" class="lab-tab">
      <div
        v-for="(item, index) in labList"
        :class="{ 'active-tab': activeLabId === item.laboratory_id }"
        :key="index"
        @click="changeActiveLab(item.laboratory_id)"
      >
        <p>
          {{ item.name }}
        </p>
      </div>
      <div v-if="false" class="get-more">
        <span>更多>></span>
      </div>
    </div>

    <div v-show="pageState === 0" class="flex sub-body">
      <div class="surface">
        <div class="vertical">
          <p>周次</p>
          <ul
            class="scroll"
            :style="{
              height: (computedAmPm(1).length + computedAmPm(2).length) * 92 - 4 + 'px',
            }"
          >
            <li
              v-for="(item, index) in weekList"
              :class="[
                weekNow === index + 1 ? 'week-on' : '',
                weekNowObj.week > index + 1 ? 'broy-bg' : '',
              ]"
              @click="selWeek(index + 1)"
              :key="index"
            >
              {{ item.week }}
              <span v-show="'count' in item">
                {{ item.count }}
              </span>
            </li>
          </ul>
        </div>
        <div class="vertical">
          <p><img src="@images/subscribe/time.png" alt="" />时段</p>
          <div>
            <div>
              <div :style="{ height: computedAmPm(1).length * 92 - 4 + 'px' }">
                <p>上午</p>
              </div>
              <div :style="{ height: computedAmPm(2).length * 92 - 4 + 'px' }">
                <p>下午</p>
              </div>
            </div>
            <div>
              <div :style="{ height: computedAmPm(1).length * 92 - 4 + 'px' }">
                <div v-for="(m, n) in computedAmPm(1)" :key="n">{{ m.section_name }}</div>
              </div>
              <div :style="{ height: computedAmPm(2).length * 92 - 4 + 'px' }">
                <div v-for="(m, n) in computedAmPm(2)" :key="n">{{ m.section_name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="vertical" v-for="(item, index) in expTable" :key="index">
          <div>
            <div class="bar" :style="{ backgroundColor: computedColor }" />
            <p class="week">{{ item.weekDate }}</p>
            <p class="date">
              {{
                weekNowObj.datatimeArr && weekNowObj.datatimeArr[weekNow - 1]
                  ? weekNowObj.datatimeArr[weekNow - 1][index]
                  : ''
              }}
            </p>
          </div>
          <div class="item" v-for="(item1, index1) in item.curriculum" :key="index1">
            <div v-if="'num' in item1" @click="clickItem(item1, index + 1, index1 + 1)">
              <div
                class="sub-msg-box"
                :style="{
                  backgroundColor:
                    item1.laboratoryArr.length > 1 ? '#333' : item1.laboratory_color,
                }"
              >
                <p class="one">
                  {{ computedClassName(item1) }}
                </p>
                <p class="one" :title="Array.isArray(item1.name) && item1.name.join(',')">
                  {{ item1.name && item1.name[0] }}
                </p>
                <!-- <p v-if="item1.laboratory_id === -1" class="one" :title="item1.laboratory">教室（演示）</p>
                <p v-if="item1.laboratory_id !== -1" class="one" :title="item1.laboratory">{{ item1.laboratory }}</p> -->
                <p class="one">{{ computedTeacherName(item1) }}</p>
                <div>
                  <span>{{ item1.num }}</span>
                </div>
                <img v-show="item1.status >= 2" src="@images/subscribe/pass.png" alt="" />
                <img
                  v-show="item1.status === 1"
                  src="@images/subscribe/stay.png"
                  alt=""
                />
                <img
                  v-show="item1.status === -1"
                  src="@images/subscribe/error.png"
                  alt=""
                />
                <img
                  class="book-type"
                  :src="
                    item1.book_type &&
                    require('@images/subscribe/icon-type' + item1.book_type + '.png')
                  "
                  alt=""
                />
                <p class="book-type-text book-type">
                  {{ ['', '预约', '排课', '登记'][item1.book_type] }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <course-window
      v-if="propState"
      :dataProp="newDataList"
      :labList="labList"
      @back="back"
      @getInstrument="instrumentClick"
    />
    <div v-if="pageState === 1">
      <div class="header1">
        {{ instrumentData.is_confirm === 0 ? '待确认仪器清单' : '已确认仪器清单' }}
        <button class="graybtn" @click="pageState = 0">返回审核列表</button>
      </div>
      <div class="base-msg-box">
        <div>
          <p>
            <span> 实验名称 </span>
            <span>
              {{ instrumentData.name.join(',') }}
            </span>
          </p>
          <p>
            <span> 分组数 </span>
            <span>
              {{ instrumentData.number_instruments }}
            </span>
          </p>
        </div>
        <!-- <div>
          <p>
            <span>
              实验班级
            </span>
            <span>
              {{ instrumentData.class_name }}
            </span>
          </p>
          <p>
            <span>
              实验类型
            </span>
            <span>
              {{instrumentData.type === 1 ? '分组' : instrumentData.type === 2 ? '演示' : '其他'}}
            </span>
          </p>
          <p>
            <span>
              实验地点
            </span>
            <span>
              {{instrumentData.laboratory}}
            </span>
          </p>
        </div> -->
        <div>
          <p>
            <span> 实验时间 </span>
            <span>
              {{
                '第' +
                instrumentData.week_time +
                '周/星期' +
                instrumentData.weekend +
                '/第' +
                instrumentData.section +
                '节次'
              }}
            </span>
          </p>
          <p>
            <span> 预约备注 </span>
            <span>
              {{ instrumentData.tips }}
            </span>
          </p>
        </div>
        <div>
          <p>
            <span> 其他实验材料 </span>
            <span>
              {{ instrumentData.material_tips || '无' }}
            </span>
          </p>
        </div>
      </div>
      <!-- <p>所需套数<el-input-number v-model="number_instruments" :min="1" :max="1000" label="描述文字"/></p> -->
      <div class="table-box1">
        <!-- <div class="table-title">
          <span>仪器备注：{{ tips.join(',') }}</span>
          <span>套数：{{ multiple }}</span>
        </div> -->
        <el-table
          :data="tableData1"
          border
          stripe
          style="width: 100%"
          max-height="500px"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column type="index" label="序号" width="80px" sortable />
          <el-table-column prop="material_number" label="分类编号" sortable />
          <el-table-column prop="name" label="仪器名称" sortable />
          <el-table-column
            prop="specification"
            label="规格"
            sortable
            show-overflow-tooltip
          />
          <el-table-column prop="" label="每组数量" sortable>
            <template slot-scope="scope">
              {{
                scope.row.num
                  ? parseInt(scope.row.num) / parseInt(number_instruments)
                  : '/'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="num" :label="'所需总数量'" sortable>
            <template slot-scope="scope">
              <div>
                {{ scope.row.num || '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="instrumentData.is_confirm === 0"
            prop="usable"
            label="可用库存"
            sortable
          />
          <el-table-column prop="library" label="仪器使用位置及数量" width="240" sortable>
            <template slot-scope="scope">
              <p
                v-for="(item, index) in scope.row.position"
                :key="index"
                v-show="item.num !== 0"
              >
                {{
                  item.store_name
                    ? item.school_laboratory_name +
                      '/' +
                      item.store_name +
                      '/' +
                      '第' +
                      item.number_plies +
                      '层'
                    : item.school_laboratory_name
                }}
                <span class="font-green">{{ item.num + '个' }}</span>
              </p>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="ambry"
            label="橱柜"
            sortable/>
          <el-table-column
            prop="layer_number"
            label="层数"
            sortable/> -->
          <el-table-column
            v-if="instrumentData.is_confirm === 0"
            prop="tips"
            label="提示"
            sortable
          >
            <template #default="scope">
              <!-- total 和 > num -->
              <div v-if="scope.row.num > scope.row.usable" class="font-red">
                数量不足 {{ scope.row.occupy > 0 ? `(已占用${scope.row.occupy})` : '' }}
              </div>
              <div v-else>可用</div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="true_num" label="确认数量" sortable />
          <el-table-column
            v-if="instrumentData.is_confirm === 0"
            prop=""
            label=""
            width="200"
            sortable
          >
            <template #default="scope">
              <div class="button-box">
                <button class="commonbtn" @click="adjustmentRow(scope.row, scope.$index)">
                  调整
                </button>
                <button class="commonbtn" @click="deleteRow(scope.$index)">删除</button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn-box">
          <button class="commonbtn" v-if="instrumentData.is_confirm === 0" @click="add">
            新增 +
          </button>
          <button
            class="commonbtn"
            v-if="instrumentData.is_confirm === 0"
            @click="saveMaterial"
          >
            确认清单
          </button>
          <button
            class="commonbtn"
            v-if="instrumentData.is_confirm === 1"
            @click="exportExcel"
          >
            导出
          </button>
        </div>
        <el-drawer title="仪器调整" :visible.sync="drawer" direction="rtl">
          <div class="drawer-box">
            <div class="message">
              <div class="row">
                <div>
                  <div class="title">分类编号</div>
                  <div class="value">
                    {{ adjustmentObj.material_number }}
                  </div>
                </div>
                <div>
                  <div class="title">库存数</div>
                  <div class="value">
                    {{
                      adjustmentObj.usable +
                      adjustmentObj.occupy +
                      ' ' +
                      adjustmentObj.unit
                    }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div>
                  <div class="title">学校编号</div>
                  <div class="value">
                    {{ adjustmentObj.asset_number }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div>
                  <div class="title">名称</div>
                  <div class="value">
                    {{ adjustmentObj.name }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div>
                  <div class="title">规格型号</div>
                  <div class="value">
                    {{ adjustmentObj.specification }}
                  </div>
                </div>
              </div>
              <el-table
                :data="adjustmentObj.position"
                style="width: 100%"
                max-height="540"
              >
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="" label="存放位置" width="240">
                  <template #default="scope">
                    {{
                      scope.row.store_name
                        ? scope.row.school_laboratory_name +
                          '/' +
                          scope.row.store_name +
                          '/' +
                          '第' +
                          scope.row.number_plies +
                          '层'
                        : scope.row.school_laboratory_name
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="" label="现有库存">
                  <template #default="scope">
                    {{ scope.row.usable
                    }}{{
                      scope.row.total - scope.row.usable > 0
                        ? `(已占用${scope.row.total - scope.row.usable})`
                        : ''
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="" label="实验数量">
                  <template #default="scope">
                    <el-input-number
                      v-model="scope.row.num"
                      :min="0"
                      :max="scope.row.total"
                      label=""
                      :step="1"
                      step-strictly
                    />
                  </template>
                </el-table-column>
              </el-table>
              <div class="btn-box">
                <!-- <p v-if="$route.meta.type === 3" class="btn" @click="nextShow = true">下一步</p> -->
                <p class="btn gray-btn" @click="drawer = false">取消</p>
                <p class="btn" @click="sureAdjustment()">确认</p>
              </div>
            </div>
          </div>
        </el-drawer>
        <el-dialog title="添加仪器" :visible.sync="dialogVisible" width="30%">
          <div style="display: flex">
            <p style="width: 100px; line-height: 30px">新增仪器</p>
            <el-input v-model="input" placeholder="请输入内容" @change="add" />
          </div>
          <div class="tab-box">
            <el-table
              ref="multipleTable"
              :data="tableData3"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" :selectable="canBeChecked" />
              <el-table-column prop="number" label="分类编号" width="150" />
              <el-table-column prop="name" label="仪器名称" width="150" />
              <el-table-column prop="specification" label="规格" show-overflow-tooltip />
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="determine">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- <div class="footer1">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="100"
          background
          layout="prev, pager, next, jumper"
          :total="1000"/>
      </div> -->
    </div>
    <!-- <Footer/> -->
  </div>
</template>

<script>
import TopFilter from '@components/top-filter.vue'

import { labExpDate } from '@network/subscribe'
import { findschoolYearweek } from '@network/log'

// import { ExpMaterialFind } from '@/network/experimentPlan'

import {
  getLaboratoryByUser,
  insList,
  insDetailList,
  findSchoolIns,
  insAdjustment,
  insConfirm,
} from '@network/subExamine'
import CourseWindow from './components/course-window.vue'
import { mapState } from 'vuex'

import axios from 'axios'
import localCache from '@/utils/localCache'

import mixinsFormatter from '@/mixins/formatter'

export default {
  mixins: [mixinsFormatter],
  name: 'Subscribe',
  components: {
    TopFilter,
    CourseWindow,
  },
  data() {
    return {
      // 按钮状态
      bigState: 1,
      propState: false,
      requestData: [],
      activeLabId: 0,

      selectForm: {
        year: '',
        subject_id: '',
        grade: '',
        type: '',
        status: [],
      },
      input: '',
      tips: '',
      multiple: 0,
      labList: [],
      weekList: [],
      newData: {
        name: '',
        exp_id: null,
        plan_detail_id: null,
        type: null,
        grade: null,
        class_id: null,
        number_groups: null,
        number_instruments: null,
        laboratory_id: null,
        tips: '',
        week_time: null,
        weekend: null,
        section: null,
      },
      newDataList: [],
      weekNow: 0,
      expTable: [
        {
          weekDate: '星期一',
          date: '',
          curriculum: [],
        },
        {
          weekDate: '星期二',
          date: '',
          curriculum: [],
        },
        {
          weekDate: '星期三',
          date: '4.4',
          curriculum: [],
        },
        {
          weekDate: '星期四',
          date: '',
          curriculum: [],
        },
        {
          weekDate: '星期五',
          date: '',
          curriculum: [],
        },
        {
          weekDate: '星期六',
          date: '',
          curriculum: [],
        },
        {
          weekDate: '星期日',
          date: '',
          curriculum: [],
        },
      ],
      planList: [],
      planListMine: [],
      gradeList: this.$store.state.userMsg.grade,
      gradeNow: this.$store.state.userMsg.grade[0],
      value: '',
      tableData1: [],
      tableData2: [],
      tableData3: [],
      currentPage3: 1,
      weekNowObj: {
        week: '',
        year: '',
        datatimeArr: [{ time: '' }],
        term_num: 1,
      },
      pageState: 0,
      instrumentData: {},
      number_instruments: 0,
      dialogVisible: false,
      drawer: false,
      adjustmentObj: {},
      adjustmentIndex: 0,
    }
  },
  watch: {
    weekNow() {
      this.$refs.filterRef.changeValue()
    },
    // propState(val) {
    //   if (val === false) {
    //     this.editStatus = false
    //   }
    // }
  },
  computed: {
    ...mapState({
      userMsg: 'userMsg',
      labListSubject: 'labList',
      teacherArr: 'teacherArr',
      gradeArr: 'gradeArr',
      weekTimeArr: 'weekTimeArr',
      schoolDate: 'schoolDate',
      role_id: (state) => state.userMsg.role_id,
    }),
    computedColor() {
      return this.labList.find((e) => e.laboratory_id === this.activeLabId)
        ? this.labList.find((e) => e.laboratory_id === this.activeLabId).color
        : ''
    },
    computedAmPm() {
      return (type) => {
        let arr =
          this.weekNowObj && this.weekNowObj.sectionData
            ? this.weekNowObj.sectionData.filter((e) => e.am_pm === type)
            : []
        console.log('🚀 ~ file: index.vue:625 ~ return ~ arr:', arr)

        return arr
      }
    },
  },
  created() {
    this.getLabList()
    this.weekNow = this.$store.state.schoolDate.week

    // this.weekNowObj = this.$store.state.schoolDate
  },
  mounted() {},
  methods: {
    getLabList() {
      if (this.role_id === 2) {
        getLaboratoryByUser().then((res) => {
          this.labList = res.data
          let obj = {
            id: 0,
            // is_order: 2,
            laboratory_id: 0,
            name: '',
            school_code: '',
            school_id: 0,
            subject_id: 0,
            user_id: 0,
            user_name: '',
          }
          if (res.data.length > 0) {
            obj = { ...res.data[0] }
          }
          this.labList.push({
            ...obj,
            color: '#333',
            laboratory_id: -1,
            name: '教室',
            is_order: 2,
          })
          this.labList.unshift({
            ...obj,
            color: '#333',
            laboratory_id: 0,
            name: '全部实验室',
            is_order: 2,
          })
        })
      } else {
        this.labList = this.labListSubject.map((e) => {
          return { ...e, laboratory_id: e.id }
        })
        let obj = {
          id: 0,
          // is_order: 2,
          laboratory_id: 0,
          name: '',
          school_code: '',
          school_id: 0,
          subject_id: 0,
          user_id: 0,
          user_name: '',
        }
        if (this.labList.length > 0) {
          obj = { ...this.labList[0] }
        }
        this.labList.push({
          ...obj,
          color: '#333',
          laboratory_id: -1,
          name: '教室',
          is_order: 2,
        })
        this.labList.unshift({
          ...obj,
          color: '#333',
          laboratory_id: 0,
          name: '全部实验室',
          is_order: 2,
        })
      }
    },
    changeActiveLab(id) {
      this.activeLabId = id
      this.$refs.filterRef.changeValue()
    },
    back() {
      this.propState = false
      this.$refs.filterRef.changeValue()
    },
    add() {
      this.dialogVisible = true
      const data = {
        subject_id: this.instrumentData.subject_id,
        name: this.input,
      }
      findSchoolIns(data).then((res) => {
        console.log(res)
        this.tableData3 = res.data
      })
    },
    canBeChecked(row) {
      // console.log('🚀 ~ file: standard.vue:564 ~ canBeChecked ~ row', row, index)
      if (this.tableData1.some((e) => e.material_number === row.number)) {
        return false
      } else {
        return true
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(val)
      this.tableData2 = val
    },
    determine() {
      this.dialogVisible = false
      this.tableData2.forEach((item) => {
        delete item.id
        insAdjustment({
          id: this.instrumentData.id,
          number: item.number,
        }).then((res) => {
          this.tableData1.push({
            ...item,
            ...res.data,
            // num: 10,
            week_time: this.instrumentData.week_time,
            weekend: this.instrumentData.weekend,
            section: this.instrumentData.section,
            material_number: item.number,
            exp_book_id: this.instrumentData.id,
            position: res.data.position.map((e) => {
              delete e.id

              return {
                ...e,
                num: e.total,
              }
            }),
          })
          console.log('🚀 ~ file: index.vue:556 ~ insAdjustment ~ res:', res)
        })
      })
    },
    selExp(item) {
      console.log(item)
      this.newData.name = item.name
      if (item.is_group === 1) {
        this.newData.type = 1
      } else {
        this.newData.type = 2
      }
      this.newData.exp_id = item.exp_scheme_id
      this.newData.plan_detail_id = item.plan_id
    },
    // 仪器准备
    instrumentClick(item) {
      this.instrumentData = item
      const data = {
        id: this.instrumentData.id,
      }
      if (this.instrumentData.is_confirm === 0) {
        insList(data).then((res) => {
          this.tips = res.data.tips
          this.multiple = res.data.multiple
          this.tableData1 = res.data.list.map((e) => {
            let sum = e.num

            return {
              ...e,
              position: e.position.map((m) => {
                let num = 0
                if (sum > 0) {
                  if (sum > m.total) {
                    num = m.total
                    sum -= m.total
                  } else {
                    num = sum
                    sum = 0
                  }
                }

                return {
                  ...m,
                  num,
                }
              }),
            }
          })
          this.number_instruments = res.data.number_instruments
          this.pageState = 1
        })
      } else {
        insDetailList(data).then((res) => {
          this.tips = res.data.tips
          this.multiple = res.data.multiple
          this.tableData1 = res.data.list
          // this.tableData1 = res.data.list.map(e => {
          //   let sum = e.num

          //   return {
          //     ...e,
          //     position: e.position.map(m => {
          //       let num = 0
          //       if (sum > 0) {
          //         if (sum > m.total) {
          //           num = m.total
          //           sum -= m.total
          //         } else {
          //           sum = 0
          //           num = sum
          //         }
          //       }

          //       return {
          //         ...m,
          //         num
          //       }
          //     })
          //   }
          // })
          this.number_instruments = res.data.number_instruments
          this.pageState = 1
        })
      }
    },
    adjustmentRow(item, index) {
      console.log('🚀 ~ file: index.vue:541 ~ adjustmentRow ~ item:', item)
      this.adjustmentObj = JSON.parse(JSON.stringify(item))
      this.adjustmentIndex = index
      // insAdjustment({
      //   id: this.instrumentData.id,
      //   number: item.material_number
      // }).then((res) => {
      //   this.adjustmentObj = {
      //     ...res.data,
      //     position: res.data.position.map((e) => {
      //       return {
      //         ...e,
      //         num: 0
      //       }
      //     })
      //   }
      //   console.log('🚀 ~ file: index.vue:556 ~ insAdjustment ~ res:', res)
      // })
      this.drawer = true
    },
    deleteRow(index) {
      this.tableData1.splice(index, 1)
      console.log('🚀 ~ file: index.vue:544 ~ deleteRow ~ item:', index)
    },
    sureAdjustment() {
      this.tableData1.splice(this.adjustmentIndex, 1, this.adjustmentObj)
      console.log(this.adjustmentObj)
      this.drawer = false
    },
    saveMaterial() {
      console.log(this.tableData1)
      this.$confirm('仪器是否调整完毕', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          insConfirm({
            exp_book_id: this.instrumentData.id,
            list: this.tableData1.map((e) => {
              let true_num = 0
              e.position.forEach((m) => {
                true_num += m.num
              })
              return {
                ...e,
                true_num,
                detail: e.position,
              }
            }),
          }).then((res) => {
            console.log(res)
            // this.instrumentClick(this.instrumentData)
            this.$refs.filterRef.changeValue()
            this.pageState = 0
            this.propState = false
            this.activeIndex = '0'
            if (res.code === 10) {
              this.$message({
                message: '保存成功',
                type: 'success',
              })
            } else {
              this.$message({
                message: '保存失败',
                type: 'error',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消',
          })
        })
    },
    exportExcel() {
      console.log('导出')
      const token = localCache.getCookie('swr_token')

      axios
        .post(
          process.env.VUE_APP_APP_BASEURL + '/school/ExpBookMaterial/Materialexport',
          { id: this.instrumentData.id, token },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName = '仪器确认信息导出表.xlsx'
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        })
    },
    // 获取表格数据筛选实验室
    async getTableDateLab(obj) {
      console.log('🚀 ~ file: index.vue:563 ~ getTableDateLab ~ obj', obj)
      const res = await findschoolYearweek({
        school_year: obj.school_year,
        semester: obj.semester,
        time_ids: obj.time_ids,
      })
      console.log('🚀 ~ file: index.vue:571 ~ getTableDateLab ~ res', res)
      if (res.code === 10) {
        this.weekNowObj = res.data
      } else {
        this.weekNow = 1
        this.weekNowObj = {
          id: null,
          school_year: '',
          first_time: '',
          second_time: '',
          school_code: '',
          school_id: 382,
          is_edit: -1,
          year: 2023,
          weeknum: 20,
          school_year_id: null,
          phase_study_id: '',
          term_num: 1,
          week: 1,
          datatimeArr: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
          ],
          sectionData: [
            {
              starttime: '08-00-00',
              endtime: '08-45-00',
              am_pm: 1,
              section_name: '第1节',
              section_xu: 1,
            },
            {
              starttime: '08-55-00',
              endtime: '09-40-00',
              am_pm: 1,
              section_name: '第2节',
              section_xu: 2,
            },
            {
              starttime: '10-15-00',
              endtime: '11-00-00',
              am_pm: 1,
              section_name: '第3节',
              section_xu: 3,
            },
            {
              starttime: '11-10-00',
              endtime: '11-55-00',
              am_pm: 1,
              section_name: '第4节',
              section_xu: 4,
            },
            {
              starttime: '13-30-00',
              endtime: '14-15-00',
              am_pm: 2,
              section_name: '第1节',
              section_xu: 5,
            },
            {
              starttime: '14-30-00',
              endtime: '15-15-00',
              am_pm: 2,
              section_name: '第2节',
              section_xu: 6,
            },
            {
              starttime: '15-25-00',
              endtime: '16-00-00',
              am_pm: 2,
              section_name: '第3节',
              section_xu: 7,
            },
            {
              starttime: '16-20-00',
              endtime: '17-05-00',
              am_pm: 2,
              section_name: '第4节',
              section_xu: 8,
            },
          ],
        }
      }

      const data = {
        ...obj,
        laboratory_id: this.activeLabId,
        week_time: this.weekNow,
      }
      labExpDate(data).then((res) => {
        this.requestData = res.data.list.filter((e) => {
          if (this.role_id === 2) {
            if (e.book_type === 1) {
              return e.is_del === 0 && e.status !== 0
            } else {
              return e.is_del === 0
            }
          } else {
            return e.teacher_id === this.userMsg.id && e.is_del === 0
          }
        })
        this.weekList = this.weekTimeArr
          .map((e) => {
            return {
              week: e,
            }
          })
          .splice(1, this.weekNowObj.weeknum)
        console.log(
          '🚀 ~ file: index.vue:583 ~ labExpDate ~ this.weekList',
          this.weekList
        )
        if (this.role_id === 2) {
          res.data.refused.forEach((e) => {
            if (this.weekList[e.week_time - 1]) {
              this.weekList[e.week_time - 1].count = e.Count
            }
          })
        } else {
          res.data.pass.forEach((e) => {
            if (this.weekList[e.week_time - 1]) {
              this.weekList[e.week_time - 1].count = e.Count
            }
          })
        }
        this.weekList = JSON.parse(JSON.stringify(this.weekList))
        if (res.code === 10) {
          this.expTable = [
            {
              weekDate: '星期一',
              date: '',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期二',
              date: '',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期三',
              date: '',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期四',
              date: '',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期五',
              date: '',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期六',
              date: '',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
            {
              weekDate: '星期日',
              date: '',
              curriculum: new Array(this.weekNowObj.sectionData.length).fill({}),
            },
          ]
          // this.requestData.sort((a, b) => {
          //   return b.is_del - a.is_del
          // })
          this.requestData.forEach((e) => {
            if ('name' in this.expTable[e.weekend - 1].curriculum[e.section - 1]) {
              this.expTable[e.weekend - 1].curriculum[e.section - 1].num++
              if (
                this.expTable[e.weekend - 1].curriculum[
                  e.section - 1
                ].laboratoryArr.indexOf(e.laboratory) === -1
              ) {
                this.expTable[e.weekend - 1].curriculum[e.section - 1].laboratoryArr.push(
                  e.laboratory
                )
              }
            } else {
              this.expTable[e.weekend - 1].curriculum[e.section - 1] = e
              this.expTable[e.weekend - 1].curriculum[e.section - 1].num = 1
              this.expTable[e.weekend - 1].curriculum[e.section - 1].laboratoryArr = [
                e.laboratory,
              ]
            }
          })
        }
      })
    },
    // 获取表格数据
    // getTableDate() {
    //   const data = {
    //     week_time: this.weekNow,
    //     grade: this.gradeNow
    //   }
    //   labExpDate(data).then(res => {
    //     res.data.refused.forEach(e => {
    //       this.weekList[e.week_time - 1].count = e.Count
    //     })
    //     this.weekList = JSON.parse(JSON.stringify(this.weekList))
    //     console.log(this.weekList)
    //     if (res.code === 10) {
    //       this.expTable = [{
    //         weekDate: '星期一',
    //         date: '4.2',
    //         curriculum: [{}, {}, {}, {}, {}, {}, {}, {}]
    //       }, {
    //         weekDate: '星期二',
    //         date: '4.3',
    //         curriculum: [{}, {}, {}, {}, {}, {}, {}, {}]
    //       }, {
    //         weekDate: '星期三',
    //         date: '4.4',
    //         curriculum: [{}, {}, {}, {}, {}, {}, {}, {}]
    //       }, {
    //         weekDate: '星期四',
    //         date: '4.5',
    //         curriculum: [{}, {}, {}, {}, {}, {}, {}, {}]
    //       }, {
    //         weekDate: '星期五',
    //         date: '4.6',
    //         curriculum: [{}, {}, {}, {}, {}, {}, {}, {}]
    //       }, {
    //         weekDate: '星期六',
    //         date: '4.7',
    //         curriculum: [{}, {}, {}, {}, {}, {}, {}, {}]
    //       }, {
    //         weekDate: '星期日',
    //         date: '4.8',
    //         curriculum: [{}, {}, {}, {}, {}, {}, {}, {}]
    //       }]
    //       res.data.list.sort((a, b) => {
    //         return b.is_del - a.is_del
    //       })
    //       res.data.list.forEach(e => {
    //         if ('name' in this.expTable[e.weekend - 1].curriculum[e.section - 1]) {
    //           this.expTable[e.weekend - 1].curriculum[e.section - 1].num++
    //           if (this.expTable[e.weekend - 1].curriculum[e.section - 1].laboratoryArr.indexOf(e.laboratory) === -1) {
    //             this.expTable[e.weekend - 1].curriculum[e.section - 1].laboratoryArr.push(e.laboratory)
    //           }
    //         } else {
    //           this.expTable[e.weekend - 1].curriculum[e.section - 1] = e
    //           this.expTable[e.weekend - 1].curriculum[e.section - 1].num = 1
    //           this.expTable[e.weekend - 1].curriculum[e.section - 1].laboratoryArr = [e.laboratory]
    //         }
    //       })
    //     }
    //   })
    // },
    selWeek(index) {
      this.weekNow = index
    },
    // 点击表格
    clickItem(item, weekend, section) {
      /* this.requestData.sort((a, b) => {
        return b.is_del - a.is_del
      })*/
      const arr = this.requestData.filter(
        (e) =>
          e.week_time === this.weekNow && e.weekend === weekend && e.section === section
      )
      arr.forEach((e) => {
        e.yiqi = false
        if (!('ex_admin_tips' in e)) {
          e.ex_admin_tips = ''
        }
      })
      // console.log('🚀 ~ file: index.vue ~ line 1193 ~ labExpDate ~ arr', arr)
      this.newDataList = arr
      this.propState = true
      // const data = {
      //   week_time: this.weekNow,
      //   grade: this.gradeNow
      // }
      // labExpDate(data).then(res => {
      //   this.propState = true
      //   res.data.list.sort((a, b) => {
      //     return b.is_del - a.is_del
      //   })
      //   const arr = res.data.list.filter(e => e.week_time === this.weekNow && e.weekend === weekend && e.section === section)
      //   arr.forEach(e => {
      //     e.yiqi = false
      //     if (!('ex_admin_tips' in e)) {
      //       e.ex_admin_tips = ''
      //     }
      //   })
      //   console.log('🚀 ~ file: index.vue ~ line 1193 ~ labExpDate ~ arr', arr)
      //   this.newDataList = arr
      // })
      // if ('name' in item) {
      // console.log(1)
      // this.newData = {
      //   name: item.name,
      //   exp_id: item.exp_id,
      //   plan_detail_id: item.plan_detail_id,
      //   type: item.type,
      //   grade: item.grade,
      //   class_id: item.class_id,
      //   number_groups: item.number_groups,
      //   number_instruments: item.number_instruments,
      //   laboratory_id: item.laboratory_id,
      //   tips: item.tips,
      //   week_time: item.week_time,
      //   weekend: item.weekend,
      //   section: item.section,
      //   id: item.id
      // }
      // } else {
      //   this.btnState = 1
      //   this.newData.grade = this.gradeNow
      //   this.newData.week_time = this.weekNow
      //   this.newData.weekend = weekend
      //   this.newData.section = section
      // }
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // closeExp() {
    //   this.editStatus = false
    //   this.btnState = 1
    //   this.propState = false
    //   this.newData = {
    //     name: '',
    //     exp_id: null,
    //     plan_detail_id: null,
    //     type: 1,
    //     end: 0,
    //     is_del: 0,
    //     unchange: 0,
    //     grade: null,
    //     class_id: null,
    //     number_groups: 2,
    //     number_instruments: 20,
    //     laboratory_id: this.labList[0].id,
    //     tips: '',
    //     week_time: null,
    //     weekend: null,
    //     section: null
    //   }
    //   this.$refs.filterRef.changeValue()
    // },
    changeStatus(item) {
      console.log('🚀 ~ file: index.vue ~ line 1259 ~ changeStatus ~ item', item)
      this.editStatus = true
      // getMaterialBook({
      //   number: ['P-swr1652336364234']
      // }).then((res) => {
      //   // res.data.forEach(e => {
      //   //   if (this.instrumentList.some(m => {
      //   //     m.
      //   //   }))
      //   // })
      //   this.materialTable = res.data
      // })
    },
  },
}
</script>

<style scoped lang="scss">
.lab-home {
  position: relative;
  box-sizing: border-box;
  padding: 20px 32px 0 32px;
  width: 100%;
  .breadcrumb {
    width: 100%;
    color: #626572;
    font-size: 16px;
    text-align: left;
  }
  .lab-tab {
    display: flex;
    & > div {
      margin: 0 0.5% 10px 0;
      padding: 0.4% 0.4%;
      width: 12%;
      background: #fff;
      border-radius: 10px;
      font-size: 16px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      cursor: pointer;
      & > p {
        height: 48px;
        line-height: 48px;
        border: 1px dotted #c9c7c7;
        border-radius: 6px;
        color: #848484;
      }
    }
    .active-tab {
      background: rgba(220, 236, 227, 0.39);
      & > p {
        font-weight: 600;
        border: 1px dotted #05c65d;
        color: #05c65d;
      }
    }
  }
  .get-more {
    color: #05c65d;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .header1 {
    margin-top: 10px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    font-weight: 400;
    font-size: 18px;
    color: #626572;
    & > button {
      float: right;
      margin: 4px 20px;
    }
  }
  .base-msg-box {
    margin-top: 8px;
    padding: 12px 0;
    width: 100%;
    min-height: 60px;
    background-color: #dcece3;
    overflow: hidden;

    & > div {
      display: flex;

      & > p {
        flex: 1;
        text-align: left;
        padding: 0 20px;
        min-height: 40px;
        line-height: 40px;
        & > :nth-child(1) {
          padding-right: 12px;
          display: inline-block;
          min-width: 60px;
          color: #05c65d;
        }
        & > :nth-child(2) {
          color: rgb(150, 150, 150);
        }
      }
    }
  }
  .drawer-box {
    padding: 0 30px;
    .message {
      text-align: left;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin: 6px 0;
        & > div {
          display: flex;
        }
        .title {
          min-width: 80px;
          color: #333;
        }
        .value {
          color: #05c65d;
        }
      }
    }
  }
  .btn-box {
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    .btn {
      margin: 0 10px;
      width: 78px;
      height: 36px;
      line-height: 36px;
      background: #05c65d;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      color: #fff;
      cursor: pointer;
    }
    .gray-btn {
      background: #b5b5b5;
    }
  }
}
.sub-body {
  width: 100%;
  // height: 824px;
  .surface {
    flex: 1;
    display: flex;
    height: 100%;
    position: relative;
    & > .vertical {
      flex: 1;
      margin-right: 4px;
      height: 100%;
      & > .item {
        padding-top: 10px;
        height: 78px;
        margin-bottom: 4px;
        background-color: #fff;
        cursor: pointer;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        .sub-msg-box {
          position: relative;
          margin: auto;
          height: 68px;
          width: 92%;
          border-radius: 4px;
          background-color: #51a8ff;
          & > :nth-child(1) {
            padding-top: 6px;
            margin-left: 15%;
            width: 70%;
            height: 16px;
            line-height: 16px;
            font-size: 12px;
            color: #fff;
          }
          & > :nth-child(2) {
            padding-top: 4px;
            margin-left: 15%;
            width: 70%;
            height: 16px;
            line-height: 16px;
            font-size: 12px;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          & > :nth-child(3) {
            padding-top: 4px;
            margin-left: 15%;
            width: 70%;
            height: 16px;
            line-height: 16px;
            font-size: 12px;
            color: #fff;
          }
          & > :nth-child(4) {
            position: absolute;
            top: -2px;
            left: -2px;
            width: 20px;
            height: 20px;
            border-radius: 2px;
            background-color: #fff;
            span {
              float: left;
              margin-top: 1px;
              margin-left: 1px;
              width: 18px;
              height: 18px;
              line-height: 18px;
              font-size: 12px;
              border-radius: 2px;
              color: #fff;
              background-color: #eb983b;
            }
          }
          img {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(50%, -30%);
          }
          .book-type {
            position: absolute;
            top: 100%;
            right: 0;
            transform: translate(50%, -80%);
          }
          .book-type-text {
            width: 16px;
            font-size: 12px;
            color: #fff;
          }
        }
      }
      .scroll {
        padding-top: 4px;
        overflow-y: scroll;
        overflow-x: auto;
        box-sizing: border-box;
      }
      .scroll::-webkit-scrollbar {
        display: none;
      }
      & > :nth-child(1) {
        position: relative;
        margin-bottom: 8px;
        height: 50px;
        background-color: #fff;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        opacity: 0.8;
        .bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
        }
        .week {
          padding-top: 10px;
        }
        .date {
          margin-top: 2px;
        }
      }
      // & > :nth-child(5) {
      //   margin-bottom: 8px;
      // }
    }
    & > :nth-child(1) {
      flex: none;
      width: 100px;
      background-color: #fff;
      p {
        font-size: 16px;
        color: #05c65d;
        margin-bottom: 8px;
        height: 50px;
        line-height: 50px;
        box-shadow: none;
        opacity: 1;
      }
      ul {
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        width: 100%;
        height: 100%;
      }
      ul li {
        width: 100%;
        height: 32px;
        line-height: 32px;
        position: relative;
        cursor: pointer;
        span {
          position: absolute;
          top: -4px;
          right: 0;
          width: 20px;
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          background-color: #e66f6f;
          color: #fff;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }
    & > :nth-child(2) {
      flex: none;
      width: 86px;
      background-color: rgba(255, 255, 255, 0) !important;
      p {
        font-size: 16px;
        color: #05c65d;
        margin-bottom: 8px;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        text-align: left;
        img {
          float: left;
          margin: 14px 10px 0 11px;
          width: 22px;
          height: 22px;
        }
      }
      & > div {
        // height: 736px;
        width: 100%;
        & > :nth-child(1) {
          float: left;
          width: 40px;
          & > :nth-child(1),
          & > :nth-child(2) {
            width: 40px;
            // height: 364px;
            background-color: #fff;
            margin-bottom: 4px;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            writing-mode: vertical-lr;
            text-align: center;
            p {
              width: 40px;
              height: 100%;
              line-height: 40px;
              text-align: center;
              letter-spacing: 2em;
              font-size: 16px;
              color: #05c65d;
            }
          }
          // & > :nth-child(2) {
          //   width: 40px;
          //   // height: 455px;
          //   background-color: #fff;
          //   box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
          //   p {
          //     padding: 134px 12px;
          //     width: 16px;
          //     height: 96px;
          //     line-height: 48px;
          //     font-size: 16px;
          //     color: #05c65d;
          //   }
          // }
        }
        & > :nth-child(2) {
          float: right;
          & > :nth-child(1) {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            width: 40px;
            // height: 364px;
            margin-bottom: 4px;
            div {
              height: 66px;
              width: 16px;
              line-height: 22px;
              padding: 11px 12px;
              font-size: 16px;
              background-color: #fff;
              color: #05c65d;
              box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            }
          }
          & > :nth-child(2) {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            width: 40px;
            // height: 455px;
            div {
              height: 66px;
              width: 16px;
              line-height: 22px;
              padding: 11px 12px;
              font-size: 16px;
              background-color: #fff;
              color: #05c65d;
              box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            }
          }
        }
      }
    }
  }
}
.broy-bg {
  background: #fff;
  color: #000;
}
.week-on {
  background-color: #eea359;
  color: #fff;
}
.sel-bg {
  background-color: #eea359;
  color: #fff;
}
.radio-box {
  width: 100px;
  padding-right: 100px;
}
.lab-header {
  margin: 0 auto 7px;
  width: 300px;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  color: #333333;
  background-color: #fff;
}
.bar-black {
  background-color: #333;
}
.bar-green {
  background-color: #4c854c;
}
.bar-purple {
  background-color: #a57ce3;
}
.bar-orange {
  background-color: #f17d59;
}
.bar-yellow {
  background-color: #b1af3c;
}
.font-black {
  color: #333;
}
.font-green {
  color: #4c854c;
}
.font-purple {
  color: #71d4c7;
}
.font-orange {
  color: #496e18;
}
.font-yellow {
  color: #b1af3c;
}
.one {
  overflow: hidden;
  text-overflow: ellipsis;
  // white-space: nowrap;
}

.table-box {
  margin-top: 40px;
  width: 100%;
  height: 440px;
  background-color: #fff;
}
.table-box1 {
  ::v-deep .el-table {
    margin-top: 20px;
    .font-red {
      color: red;
    }
  }
  .button-box {
    display: flex;
    .commonbtn {
      margin: 0 5px;
      min-width: 80px;
    }
  }
  // padding: 12px 20px 20px;
  // width: 100%;
  // height: 620px;
  // background-color: #fff;
  // box-sizing: border-box;
  // .table-title {
  //   text-align: left;
  //   height: 30px;
  //   line-height: 30px;
  //   span:nth-of-type(2) {
  //     float: right;
  //   }
  // }
  // .table-scoll {
  //   height: 520px;
  //   overflow-y: auto;
  // }
  button {
    margin-top: 10px;
  }
  // & > :nth-child(3) {
  //   float: right;
  //   margin-right: 20px;
  // }
}
// .table-scoll::-webkit-scrollbar {
//   width: 0;
// }
// .footer3 {
//   text-align: right;
//   margin-top: 32px;
//   padding: 30px 0 90px 0;
//   height: 28px;
//   background-color: #fff;
// }
.footer1 {
  text-align: right;
  padding: 20px;
  height: 28px;
  background-color: #fff;
}
// 分页
.el-pagination ::v-deep .number:hover {
  color: #05c65d !important;
}
.el-pagination ::v-deep .active {
  background-color: #05c65d !important;
  &:hover {
    color: #fff !important;
  }
}
.font-simple {
  cursor: pointer;
  margin: 0 4px;
  &:hover {
    color: #05c65d;
  }
}
.font-simple-disable {
  margin: 0 4px;
}
.font-red {
  color: rgb(250, 108, 108) !important;
}
.font-green {
  color: #05c65d !important;
}
.el-input-number ::v-deep .el-input {
  height: 20px !important;
}
.tab-box {
  margin-top: 10px;
  width: 100%;
  height: 300px;
}
.tab-box ::v-deep .el-table__body-wrapper {
  height: 300px;
  overflow-y: auto;
}
.tab-box ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 0;
}
.mr_span {
  padding: 0 8px;
  background-color: #05c65d;
  margin-right: 20px;
  cursor: pointer;
  color: #fff !important;
}
.mr_span:hover {
  color: #c1ffd0 !important;
}
.havecolor {
  cursor: pointer;
  color: #05c65d !important;
}
</style>
