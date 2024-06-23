<template>
  <div class="box_div" @click="showTip(-1)">
    <div class="top_menu" v-show="shareShow === -1">
      <span @click="detailShowClick(-1)">实验课记录 </span>
      <i v-show="detailShow !== -1" class="el-icon-arrow-right" />
      <span v-show="detailShow !== -1"> 实验过程查看</span>
      <div
        v-show="!hideBack && detailShow !== -1"
        class="fr cancel-btn"
        @click="detailShowClick(-1)"
      >
        <img src="@assets/images/common/cancel.png" alt="" />
        <span class="cancel">返回</span>
      </div>
    </div>
    <div class="item_list" v-show="detailShow === -1 && shareShow === -1">
      <!-- <div class="check_box">
        <div>
          <span>年级：</span>
          <el-select v-model="valueGrade" @change="getRecordStatistical()" clearable placeholder="请选择">
            <el-option
              v-for="item in optionsGrade"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
        <div>
          <span>班级：</span>
          <el-select v-model="valueClass" @change="getRecordStatistical()" clearable placeholder="请选择">
            <el-option
              v-for="item in optionsClass"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </div>
        <div v-show="$store.state.userMsg.role_id===3">
          <span>教师：</span>
          <el-select v-model="valueTeacher" @change="getRecordStatistical()" clearable placeholder="请选择">
            <el-option
              v-for="item in optionsTeacher"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
        <div>
          <span>周次：</span>
          <el-cascader
            v-model="valueWeek"
            clearable
            :options="optionsWeek"
            @change="getRecordStatistical()"/>
        </div>
        <input class="btn_new" type="button" value="+新建课程记录">
      </div> -->
      <top-filter
        ref="filterRef"
        :options="[
          'time_ids',
          'semester',
          'subject_id',
          'grade',
          'week',
          'name',
          'type',
          'evaluate',

          'teacher_id',
        ]"
        @change="getData($event, 1)"
      />
      <button
        v-if="[1, 2, 4].includes($store.getters.getUserMsg.role_id)"
        class="my-btn"
        @click="exportExcel"
      >
        导出
      </button>
      <p class="tip-line">
        *实验开课记录包含登记成功的实验、排课成功的实验、预约成功的实验。
      </p>
      <div class="table_box_home">
        <table>
          <thead>
            <td>实验名称</td>
            <td class="classroom">
              班级
              <i
                class="el-icon-caret-top"
                @click="classTop('class')"
                :style="{ color: isTopClassColor ? '#05c65d' : '' }"
              ></i>
              <i
                class="el-icon-caret-bottom"
                @click="classBottom('class')"
                :style="{ color: isBottomClassColor ? '#05c65d' : '' }"
              ></i>
            </td>
            <td class="classroom">
              周次
              <i
                class="el-icon-caret-top"
                @click="weekTop('week')"
                :style="{ color: isTopWeekColor ? '#05c65d' : '' }"
              ></i>
              <i
                class="el-icon-caret-bottom"
                @click="weekBottom('week')"
                :style="{ color: isBottomWeekColor ? '#05c65d' : '' }"
              ></i>
            </td>
            <td>学科</td>
            <!-- <td>课前预习</td>
            <td>课中报告</td>
            <td>课中图片记录(张)</td>
            <td>课后复习</td> -->
            <td>实验评价</td>
            <td>授课教师</td>
            <td>报告提交情况</td>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in trtdList"
              :class="{ table_bg_home: index % 2 === 0 }"
              :key="index"
              @click.stop="detailShowClick(index)"
            >
              <td>
                <!-- <img
                  src="@images/experimentalRecord/seach-green.png"
                  @click.stop="detailShowClick(index)"
                  alt=""
                /> -->
                <!-- <img src="@images/experimentalRecord/share-green.png" @click.stop="imgShare(index)" alt=""> -->
                <img
                  v-show="item.isRed"
                  src="@images/experimentalRecord/icon-red.png"
                  alt=""
                />

                <span :class="{ isRed: item.isRed }" :title="item.exp_name.join(',')">{{
                  item.exp_name.join(',')
                }}</span>
                <div class="tip" v-show="index === showTipValue">
                  <span>提示</span>
                  <span>计划实验时间未开始</span>
                </div>
              </td>
              <td>
                <span style="margin-right: 8px" :title="computedClassName(item)">{{
                  computedClassName(item)
                }}</span>
                <img
                  v-if="item.type === 1"
                  src="@images/experimentalRecord/group1.png"
                  alt=""
                />
                <img
                  v-if="item.type === 2"
                  src="@images/experimentalRecord/group2.png"
                  alt=""
                />
              </td>
              <td class="flex_direction">
                <p>
                  <span>第{{ item.week_time }}周/</span>
                  <span>{{ item.weekend }}/</span>
                  <span>第{{ item.section }}节课</span>
                </p>
                <!-- </p>
                <p> -->

                <p>
                  <span>{{ item.start }}</span>
                </p>
              </td>
              <td>
                <span
                  :class="{
                    subject_icon: true,
                    icon_green: item.subject === '化学',
                    icon_blue: item.subject === '物理',
                    icon_orange: item.subject === '生物',
                  }"
                />
                <span>{{ item.subject }}</span>
              </td>
              <!-- <td>{{ item.before_class }}</td>
              <td>{{ item.in_class }}</td>
              <td>{{ item.pic_count === 0 ? '/' : item.pic_count }}</td>
              <td
                @mouseover="changeMouseFlag(index, true)"
                @mouseout="changeMouseFlag(index, false)"
                :class="{ bg_green: mouseFlag[index] }"
              >
                <div v-show="mouseFlag[index]">
                  <img
                    src="@images/experimentalRecord/refresh-green.png"
                    @click.stop="refreshList(index)"
                    alt=""
                  />
                  <img
                    src="@images/experimentalRecord/seach-green.png"
                    @click.stop="detailShowClick(index)"
                    alt=""
                  />
                </div>
                {{ item.after_class }}
              </td> -->
              <td>{{ item.status === 5 ? '已完成' : '未完成' }}</td>
              <td>{{ computedTeacherName(item) }}</td>
              <td>
                {{ item.report_submission }}
                <div class="img-box">
                  <img src="@images/experimentalRecord/book-type.png" alt="" />
                  {{ ['', '预约', '排课', '登记'][item.book_type] }}
                </div>
              </td>
            </tr>
            <tr v-show="trtdList.length === 0">
              <td>暂无数据</td>
            </tr>
          </tbody>
          <el-pagination
            :current-page.sync="currentPage"
            background
            layout="prev, pager, next"
            @current-change="changeCurrent"
            :page-size="5"
            :total="pageLength"
          />
        </table>
      </div>
    </div>
    <div v-show="shareShow !== -1 && shareStatus === ''" class="shareBoxStatus">
      <p>
        分享<img
          src="@images/experimentalRecord/close.png"
          alt=""
          @click="imgShare(-1)"
        />
      </p>
      <div>
        <p @click="clickStatus('教师')">教师</p>
        <p @click="clickStatus('教研组长')">教研组长</p>
      </div>
    </div>
    <div v-show="shareStatus" class="shareTable">
      <p>
        选择分享的{{ shareStatus
        }}<img src="@images/experimentalRecord/close.png" alt="" @click="imgShare(-1)" />
      </p>
      <div class="share_content">
        <div class="el-select-box">
          <el-select v-model="valueSubject" placeholder="请选择学科">
            <el-option
              v-for="item in optionsSubject"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="valueGradeShare" placeholder="请选择年级">
            <el-option
              v-for="item in optionsGrade"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="selectInput">
          <input type="text" placeholder="搜索" v-model="inputValueSeach" />
          <div @click="selectClick">
            <img src="@images/taskFeedback/select-icon.png" alt="" />
          </div>
        </div>
        <div class="table_box_share">
          <table>
            <thead>
              <td>
                <span class="class_item" @click="checkAll">
                  <img v-show="isCheckAll" src="@images/common/round-right.png" alt="" />
                  <img v-show="!isCheckAll" src="@images/common/round-none.png" alt="" />
                </span>
              </td>
              <td>教师</td>
              <td>学科</td>
              <td>年级</td>
              <td>班级</td>
            </thead>
            <tbody>
              <tr
                :class="{ table_bg_share: index % 2 !== 0, isGreen: item.check }"
                v-for="(item, index) in classList"
                :key="index"
              >
                <td>
                  <span
                    @click="itemCheck(index)"
                    :disabled="disableFlag"
                    class="class_item"
                  >
                    <img
                      v-show="item.check"
                      src="@images/common/round-right.png"
                      alt=""
                    />
                    <img
                      v-show="!item.check"
                      src="@images/common/round-none.png"
                      alt=""
                    />
                  </span>
                </td>
                <td>王老师</td>
                <td>化学</td>
                <td>九年级</td>
                <td>一班</td>
              </tr>
              <tr>
                <div class="footer_msg_share">
                  <span @click="changePage('-', index)"
                    ><i class="el-icon-arrow-left" /> 上一页</span
                  >
                  <span>1</span>
                  <span @click="changePage('+', index)"
                    >下一页 <i class="el-icon-arrow-right"
                  /></span>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="change_disable" @click="changeDisabeFlag">
          <img v-show="disableFlag" src="@images/common/round-none.png" alt="" />
          <img v-show="!disableFlag" src="@images/experimentalRecord/around.png" alt="" />
          <span>允许被编辑</span>
        </div>
        <p class="btn_no">取消</p>
        <p class="btn_yes">确认</p>
      </div>
    </div>
    <detail-vue
      v-if="detailShow !== -1"
      :clickItem="clickItem"
      @changeBack="changeHideBack"
    ></detail-vue>

    <!-- <Footer/> -->
  </div>
</template>

<script>
import TopFilter from '@components/top-filter.vue'
import detailVue from './detail.vue'

import { recordStatistical } from '@/network/experimentRecord'
import axios from 'axios'
import localCache from '@/utils/localCache'
import mixinsFormatter from '@/mixins/formatter'

export default {
  mixins: [mixinsFormatter],
  name: 'ExperimentalRecord',
  components: {
    TopFilter,
    detailVue,
  },
  data() {
    return {
      currentPage: 1,
      evaluationType: [
        '',
        '仪器准备',
        '仪器搭建',
        '数据测量',
        '数据处理',
        '仪器整理',
        '其他',
      ],
      isActive: 1,
      inputValue: '',
      searchObj: {},
      showFlagScore: '',
      showFlagRequest: '',
      inputValueSeach: '',
      detailShow: -1,
      seriesData1: [],
      seriesData2: [],
      seriesData3: [],
      pageNumList: [],
      maxPageNum: [],
      pageLength: 0,
      showTipValue: -1,
      optionsGrade: [
        {
          value: 7,
          label: '七年级',
        },
        {
          value: 8,
          label: '八年级',
        },
        {
          value: 9,
          label: '九年级',
        },
      ],
      valueGrade: null,
      optionsClass: this.$store.state.classList,
      valueClass: '',
      optionsTeacher: [
        {
          value: '8',
          label: '黄老师',
        },
        {
          value: '1',
          label: '李老师',
        },
      ],
      trtdList: [],
      valueTeacher: '',
      valueWeek: [],
      optionsWeek: [],
      optionsSubject: [
        {
          value: '7',
          label: '化学',
        },
        {
          value: '8',
          label: '物理',
        },
        {
          value: '9',
          label: '生物',
        },
      ],
      valueSubject: '',
      valueGradeShare: '',
      students: [
        {
          name: '小红',
          grade: 7,
          class: 1,
          lev: 'A',
          image: [require('@images/experimentalRecord/test.png')],
        },
        {
          name: '小绿',
          grade: 7,
          class: 1,
          lev: 'B',
          image: [require('@images/experimentalRecord/test.png')],
        },
        {
          name: '小蓝',
          grade: 7,
          class: 1,
          lev: 'B',
          image: [require('@images/experimentalRecord/test.png')],
        },
        {
          name: '小绿',
          grade: 7,
          class: 1,
          lev: 'B',
          image: [require('@images/experimentalRecord/test.png')],
        },
        {
          name: '小蓝',
          grade: 7,
          class: 1,
          lev: 'B',
          image: [
            require('@images/experimentalRecord/test.png'),
            require('@images/experimentalRecord/test.png'),
          ],
        },
      ],
      feedback: [
        {
          name: '小红',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
        {
          name: '小绿',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
        {
          name: '小蓝',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
        {
          name: '小绿',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
        {
          name: '小蓝',
          grade: 7,
          class: 1,
          preview: '10分钟',
          score: '60分',
          percentage: '60%',
        },
      ],
      questionList: [
        {
          question: '原线圈接入恒定电压，副线圈会有电压输出1。',
          number: 10,
        },
        {
          question: '原线圈接入恒定电1。',
          number: 100,
        },
        {
          question:
            '原线圈接入恒定电压，副线圈会有电压输出1原线圈接入恒定电压，副线圈会有电压输出1原线圈接入恒定电压，副线圈会有电压输出1。',
          number: 10,
        },
      ],
      gradeNow: 7,
      requestData: [],
      gradeList: [
        {
          grade: 7,
          name: '七年级',
        },
        {
          grade: 8,
          name: '八年级',
        },
        {
          grade: 9,
          name: '九年级',
        },
      ],
      classList: [
        {
          name: '1班',
          check: true,
        },
        {
          name: '2班',
          check: true,
        },
        {
          name: '3班',
          check: true,
        },
        {
          name: '4班',
          check: false,
        },
        {
          name: '5班',
          check: true,
        },
        {
          name: '6班',
          check: false,
        },
      ],
      clickItem: {},
      evaluationStudentList: [],
      mediaObj: {},
      insDetail: {},
      myevaluationList: [],
      evaluationmeList: [],
      mouseFlag: [],
      disableFlag: false,
      shareStatus: '',
      seachShow: false,
      showChildFlag2: -1,
      imgList: [],
      requestOneData: {},
      reportOneData: {},
      afterOneData: {},
      shareShow: -1,
      hideBack: false,
      sortData: {
        order_week: 2,
      },
      isTopClassColor: false,
      isBottomClassColor: false,
      isTopWeekColor: false,
      isBottomWeekColor: true,
    }
  },
  created() {
    this.mouseFlag.length = this.classList.length
    // this.getRecordStatistical(1)
    this.optionsWeek = require('@/utils/optionsWeek.json')
    document.addEventListener('click', this.backToHomepage)
    this.$store.state.classList.forEach((item) => {
      const obj = {
        value: item.grade_id,
        label: this.$store.state.gradeArr[item.grade_id],
      }
      let flag = false
      this.optionsGrade.forEach((i) => {
        if (i.value === item.grade_id) {
          flag = true
        }
      })
      if (!flag) {
        this.optionsGrade.push(obj)
      }
    })
  },
  beforeDestroy() {
    document.removeEventListener('click', this.backToHomepage)
  },
  computed: {
    computedName() {
      const arr = []
      if (this.requestOneData.exp) {
        this.requestOneData.exp.forEach((e) => {
          arr.push(e.name)
        })
      }
      return arr.join(',')
    },
    scoreStage() {
      return function (val) {
        if (val === 0) {
          return '暂无'
        }
        if (val < 60) {
          return '一般'
        }
        if (val >= 60 && val <= 85) {
          return '良好'
        }
        if (val > 85) {
          return '优秀'
        }
      }
    },
    studentList() {
      return function (item, pageNum) {
        let arr = []
        arr = JSON.parse(JSON.stringify(item))
        const pages = Math.ceil(arr.length / 5)
        if (this.maxPageNum.length < this.requestData.length) {
          this.maxPageNum.push(pages)
        }
        const res = arr
        return res.slice(pageNum * 5, (pageNum + 1) * 5)
      }
    },
    isCheckAll() {
      let res = 0
      this.classList.map((item) => {
        if (!item.check) {
          res = 0
        } else {
          res = 1
        }
      })
      return res
    },
    rankList() {
      return function (item) {
        const ranfg = [
          {
            name: 'A',
            value: 0,
          },
          {
            name: 'B',
            value: 0,
          },
          {
            name: 'C',
            value: 0,
          },
          {
            name: 'D',
            value: 0,
          },
        ]
        if (item.length !== 0) {
          item.map((item) => {
            if (item.level === 'A') {
              ranfg.splice(0, 1, {
                name: 'A',
                value: item.Count ? item.Count : 0,
              })
            }
            if (item.level === 'B') {
              ranfg.splice(1, 1, {
                name: 'B',
                value: item.Count ? item.Count : 0,
              })
            }
            if (item.level === 'C') {
              ranfg.splice(2, 1, {
                name: 'C',
                value: item.Count ? item.Count : 0,
              })
            }
            if (item.level === 'D') {
              ranfg.splice(3, 1, {
                name: 'D',
                value: item.Count ? item.Count : 0,
              })
            }
          })
        }
        return ranfg
      }
    },
  },
  watch: {
    valueGrade(newVal) {
      this.valueClass = null
      this.optionsClass = this.$store.state.classList.filter((item) => {
        if (newVal !== '') {
          return item.grade_id === newVal
        } else {
          return true
        }
      })
    },
  },
  methods: {
    backToHomepage(event) {
      const msg = document.getElementsByClassName('el-menu-item')
      if (msg) {
        Array.from(msg).forEach((item) => {
          if (item.contains(event.target)) {
            this.detailShowClick(-1)
          }
        })
      }
    },
    changeHideBack(boolen) {
      this.hideBack = boolen
    },
    getData(obj, page) {
      this.searchObj = obj
      this.currentPage = page
      const data = {
        ...this.searchObj,
        page: this.currentPage,
        ...this.sortData,
        // grade: this.valueGrade,
        // class_id: this.valueClass,
        // teacher_id: this.valueTeacher,
      }
      recordStatistical(data).then((res) => {
        this.pageLength = res.data.count
        this.trtdList = res.data.list
      })
    },
    changeCurrent(val) {
      this.getData(this.searchObj, val)
    },
    exportExcel() {
      const token = localCache.getCookie('swr_token')

      axios
        .post(
          process.env.VUE_APP_APP_BASEURL + 'teach/HPresults/recordStatistical',
          { ...this.searchObj, token, is_explode: 1, ...this.sortData },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName =
            this.$store.getters.getUserMsg.school.name + '-' + '实验开课记录.xlsx'
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
    // handleSizeChange(val) {
    //   const data = {
    //     page: val,
    //     grade: this.valueGrade,
    //     class_id: this.valueClass,
    //     teacher_id: this.valueTeacher
    //     // teacher_id: this.$store.getters.getUserMsg.id
    //   }
    //   recordStatistical(data).then((res) => {
    //     this.trtdList = res.data.list
    //   })
    // },
    selectClick() {
      console.log('点击')
    },
    showTip(index) {
      if (index === this.showTipValue) {
        this.showTipValue = -1
      } else {
        this.showTipValue = index
      }
    },
    checkAll() {
      if (!this.disableFlag) {
        if (!this.isCheckAll) {
          this.classList.map((item) => {
            item.check = true
          })
        } else {
          this.classList.map((item) => {
            item.check = false
          })
        }
      }
      console.log('点击', this.isCheckAll)
    },
    imgSeach() {
      this.seachShow = true
      console.log('imgSeach')
    },
    refreshList(index) {
      console.log(`刷新${index}`, index)
    },
    changeMouseFlag() {
      // this.mouseFlag.splice(index, 1, data)
    },
    itemCheck(index) {
      if (!this.disableFlag) {
        this.classList[index].check = !this.classList[index].check
      }
    },
    changeDisabeFlag() {
      this.disableFlag = !this.disableFlag
    },
    imgShare(data) {
      this.shareStatus = ''
      this.shareShow = data
    },
    changePage(a, index) {
      if (a === '-') {
        if (this.pageNumList[index] > 0) {
          this.pageNumList.splice(index, 1, this.pageNumList[index] - 1)
        }
      }
      if (a === '+') {
        if (this.pageNumList[index] < this.maxPageNum[index] - 1) {
          this.pageNumList.splice(index, 1, this.pageNumList[index] + 1)
        }
      }
    },
    detailShowClick(index) {
      if (index === -1) {
        this.detailShow = index
      } else {
        this.clickItem = this.trtdList[index]
        // console.log('🚀 ~ file: ExperimentalRecord.vue ~ line 942 ~ detailShowClick ~ this.clickItem', this.clickItem)

        this.detailShow = index
      }
    },

    clickStatus(index) {
      // this.shareShow = 3
      if (index === '教师') {
        this.shareStatus = '教师'
        console.log('教师')
      } else if (index === '教研组长') {
        this.shareStatus = '教研组长'
        console.log('教研组长')
      } else {
        this.shareStatus = ''
      }
    },
    classTop(val) {
      this.sortData = {}
      this.isTopClassColor = true
      this.isBottomClassColor = false
      this.isTopWeekColor = false
      this.isBottomWeekColor = false
      this.sortData[`order_${val}`] = 1
      this.$refs.filterRef.changeValue()
    },
    classBottom(val) {
      this.sortData = {}
      this.isTopClassColor = false
      this.isBottomClassColor = true
      this.isTopWeekColor = false
      this.isBottomWeekColor = false
      this.sortData[`order_${val}`] = 2
      this.$refs.filterRef.changeValue()
    },
    weekTop(val) {
      this.sortData = {}
      this.isTopWeekColor = true
      this.isBottomWeekColor = false
      this.isTopClassColor = false
      this.isBottomClassColor = false
      this.sortData[`order_${val}`] = 1
      this.$refs.filterRef.changeValue()
    },
    weekBottom(val) {
      this.sortData = {}
      this.isTopWeekColor = false
      this.isBottomWeekColor = true
      this.isTopClassColor = false
      this.isBottomClassColor = false
      this.sortData[`order_${val}`] = 2
      this.$refs.filterRef.changeValue()
    },
  },
}
</script>

<style lang="scss" scoped>
.box_div {
  padding: 20px 32px 0 32px;
  min-height: 800px;

  .top_menu {
    text-align: left;

    & > span {
      cursor: pointer;
    }

    & > span:nth-of-type(1):hover {
      color: #05c65d;
    }

    .cancel-btn {
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        margin-right: 6px;
      }
    }
  }

  .check_box {
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    opacity: 1;

    div span {
      margin-right: 10px;
    }

    .el-select ::v-deep .el-input__inner {
      width: 180px !important;
      height: 30px !important;
    }

    .el-cascader ::v-deep .el-input__inner {
      width: 260px !important;
      height: 30px !important;
    }

    .btn_new {
      width: 16%;
      height: 40px;
      background: #05c65d;
      opacity: 1;
      border: 0;
      border-radius: 10px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 19px;
      color: #ffffff;
      opacity: 0;
    }
  }

  .item_list {
    text-align: left;
    .my-btn {
      // margin: -108px 20px 0 0;
      margin: -57px 20px 0 0;

      float: right;
    }
  }

  // .tip-line {
  //   // display: none;
  // }
  .table_box_home {
    margin-top: 6px;
    width: 100%;
    padding: 10px 32px 29px 30px;
    background-color: #ffffff;
    box-sizing: border-box;

    table {
      width: 100%;
      text-align: center;

      thead {
        width: 100%;
        height: 43px;
        line-height: 43px;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        border-bottom: 1px solid #c9c7c7;

        & td {
          color: #333;
          flex: 1;
        }

        td:nth-of-type(1) {
          flex: 1.6;
        }

        td:nth-of-type(2) {
          flex: 1.3;
        }

        th {
          width: 6%;
        }
      }

      tr {
        width: 100%;
        height: 110px;
        // line-height: 126px;
        font-size: 14px;
        display: flex;
        color: #333333;
        cursor: pointer;

        th {
          width: 6%;
          display: flex;
          align-items: center;

          & > img {
            margin-right: 20px;
            width: 24px;
            height: 24px;
            cursor: pointer;
          }
        }

        & td {
          position: relative;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;

          & > img {
            margin-right: 6px;
            width: 16px;
            height: 16px;
          }

          & p {
            line-height: 29px;
            width: 100%;
          }

          & .p_left {
            line-height: 29px;
            text-align: left;
            width: 100%;

            & > span:nth-of-type(1) {
              display: inline-block;
              width: 35%;
              // text-align: left;
              color: #848484;
              // margin-right: 10px;
            }

            .isGreen {
              color: #05c65d !important;
            }
          }
        }

        td:nth-of-type(1) {
          flex: 1.6;
          position: relative;
          text-align: left;
          justify-content: center;

          & > img:nth-of-type(1) {
            position: absolute;
            // left: 30%;
            left: 50%;
            bottom: 10%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            transform: translate(-50%, 0);
          }

          & > img:nth-of-type(2) {
            position: absolute;
            left: 55%;
            bottom: 10%;
            width: 24px;
            height: 24px;
            cursor: pointer;
          }

          & > span {
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        td:nth-of-type(2) {
          flex: 1.3;
        }
        .img-box {
          position: absolute;
          right: 6px;
          display: flex;
          align-items: center;
          // margin: 0 20px;
          color: #1296db;
          img {
            width: 20px;
          }
        }
        // td:nth-of-type(8){
        //   flex: .8;
        // }
        // td:nth-of-type(9){
        //   flex: .8;
        // }
        .tip {
          position: absolute;
          top: 40%;
          left: 90%;
          width: 241px;
          height: 96px;
          background: #ffffff;
          border: 1px solid #05c65d;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          opacity: 1;
          padding: 0 30px;

          span:nth-of-type(1) {
            display: inline-block;
            width: 100%;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #05c65d;
            opacity: 1;
            border-bottom: 1px solid #05c65d;
            text-align: left;
            box-sizing: border-box;
          }

          span:nth-of-type(2) {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 60px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            opacity: 1;
          }
        }

        .isGreen {
          color: #05c65d !important;
        }

        .isRed {
          color: #de4747;
        }

        .flex_direction {
          flex-direction: column;
        }
      }

      .bg_green {
        position: relative;
        background: rgba(195, 236, 213, 0.44);
        color: #05c65d;

        div {
          position: absolute;
          left: 50%;
          bottom: 9px;
          width: 100px;
          transform: translate(-50%, 0);
        }

        img {
          display: inline-block;
          width: 24px;
          height: 24px;
          margin: 0 12px;
          cursor: pointer;
        }
      }

      .table_bg_home {
        background-color: #efefef;
      }

      .subject_icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 2px;
        margin-right: 12px;
      }

      .icon_green {
        background: #30b930;
      }

      .icon_orange {
        background: #ee9a59;
      }

      .icon_blue {
        background: #5fafe4;
      }
    }

    ::v-deep {
      .el-pagination {
        margin-top: 10px;
      }
    }
  }

  // height: 3000px;
  header {
    width: 100%;
    height: 60px;
    background: #dcece3;
    opacity: 1;
    margin: 10px auto;

    .header_title {
      width: 340px;
      height: 60px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 60px;
      color: #05c65d;
      opacity: 1;
    }

    .share {
      float: right;
      width: 48px;
      height: 60px;
      opacity: 1;
      line-height: 60px;
    }
  }

  .module {
    width: 100%;
    margin: 10px auto 20px;
    position: relative;

    .title {
      width: 240px;
      height: 40px;
      line-height: 40px;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
    }

    .refresh_button {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 36px;
      line-height: 36px;
      background: #05c65d;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      font-size: 14px;
      color: #ffffff;
      border-radius: 10px;
      visibility: hidden;
    }

    .message-box {
      padding: 24px 80px;
      background: #fff;

      .row {
        display: flex;
        flex-wrap: wrap;

        .item {
          margin-bottom: 24px;
          padding-right: 16px;
          min-width: 16%;
          font-weight: 16px;
          box-sizing: border-box;

          span:nth-of-type(1) {
            display: inline-block;
            width: 70px;
            color: #848484;
          }
        }
      }
    }

    .content {
      padding-bottom: 20px;
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;

      .exp-name {
        padding-left: 20px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #05c65d;
        border-left: 4px solid #05c65d;
        box-sizing: border-box;
        font-size: 16px;
        background: #dcece3;
        text-align: left;
      }

      .media-box {
        padding: 0 15px;
        min-height: 40px;
        text-align: left;

        .video-box {
          display: inline-block;
          margin: 13px 15px;
          width: 230px;
          height: 128px;

          ::v-deep video {
            width: 100%;
            height: 100%;
          }
        }

        ::v-deep .el-image {
          display: inline-block;
          margin: 13px 15px;
          width: 230px;
          height: 128px;
        }
      }
    }

    // .experiment-procedure {
    //   // max-height: 600px;
    //   // overflow-y: scroll;
    // }
    .contentBox {
      padding: 10px 0;
      position: relative;

      .echartBox {
        position: absolute;
        top: -20px;
        left: 84%;
        width: 154px;
        height: 154px;

        .echartDiv {
          width: 154px;
          height: 154px;
        }

        .centerText {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 52px;
          height: 52px;
          background: #efefef;
          color: #05c65d;
          border-radius: 50%;
          text-align: center;
          line-height: 52px;
          transform: translate(-50%, -50%);
        }
      }

      .progressBox {
        width: 94%;
        margin: 10px 3%;
        display: flex;
        flex-direction: row;

        ::v-deep .el-progress {
          width: 74%;
          margin: 0 18px;
        }
      }
    }

    .grouping {
      margin: 10px 0;
      padding: 10px 0;
      width: 100%;
      // height: 182px;
      background: #ffffff;
      border-top: 1px solid #c9c7c7;
      border-bottom: 1px solid #c9c7c7;
      text-align: left;
      opacity: 1;

      // overflow: hidden;
      p:nth-of-type(1) {
        width: 200px;
        font-size: 18px;
        font-weight: 400;
        margin-left: 30px;
      }

      .grouping-item {
        min-height: 60px;
        display: flex;
        align-items: center;
        margin: 6px 0;

        .grouping_left {
          width: 30%;
          float: left;
          display: flex;
          align-items: center;

          span:nth-of-type(1) {
            display: inline-block;
            width: 80px;
            font-size: 16px;
            text-align: left;
            margin: 5px 0 0 64px;
          }

          .star {
            display: inline;

            ::v-deep .el-rate {
              display: inline;
              margin: 30px 0 0 64px;

              .el-rate__icon {
                font-size: 28px;
              }
            }
          }
        }

        .grouping_right {
          width: 70%;
          display: flex;
          flex-wrap: wrap;
          align-content: center;

          .el-image,
          video {
            margin: 0 60px 6px 0;
            width: 200px;
            height: 128px;
            background: rgba(0, 0, 0, 0);
            border: 1px solid #05c65d;
            opacity: 1;
          }
        }
      }
    }

    .none-data {
      padding: 0 30px;
      height: 30px;
      line-height: 30px;
      text-align: left;
      color: #ababab;
    }

    .evaLute-box {
      // max-height: 640px;
      overflow-y: scroll;
    }

    .evaluate {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 96%;
      height: 158px;
      margin: 10px 2%;
      padding: 18px 0;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 5px;
      text-align: left;

      .value-none {
        width: 100%;
        text-align: center;
        font-size: 18px;
      }

      .tip {
        position: absolute;
        top: 0;
        right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 2px;
        width: 20px;
        height: 194px;
        color: #ffffff;
        background: #05c65d;
        box-sizing: border-box;
      }
    }

    .evaluate_line {
      padding: 0 80px 0 60px;
      display: flex;
      justify-content: space-between;

      & > p {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;

        & > span:nth-of-type(1) {
          margin-right: 20px;
          display: inline-block;
          width: 80px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #848484;
        }

        img {
          width: 24px;
          height: 24px;
          margin-right: 6px;
        }

        ::v-deep .el-rate {
          width: 180px;

          .el-rate__item {
            .el-rate__icon {
              font-size: 24px;
            }
          }
        }

        .has-width {
          width: 180px;
        }
      }

      // .transform_span {
      //   display: inline-block;
      //   transform: translate(-30px,0);
      //   width: 240px !important;
      // }
    }

    .haveBgColor {
      background: #dcece3;
    }

    .row {
      text-align: left;
    }

    .f_left {
      display: flex;
      align-items: center;
      margin-top: 30px;
    }

    .exper_time {
      margin: 0 10px 0 80px;
      width: 50px;
      height: 140px;
      background: #dcece3;
      opacity: 1;
      color: #05c65d;
      border-radius: 10px;
      writing-mode: vertical-lr;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .class_message {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 30px;
      width: 300px;
      height: 140px;
      background: #ffffff;
      border: 1px solid #05c65d;
      opacity: 1;

      p {
        line-height: 24px;
      }
    }

    .refresh {
      margin-right: 180px;
      width: 80px;
      height: 80px;
      line-height: 80px;
      background: #ffffff;
      border: 1px solid #05c65d;
      box-shadow: 0px 2px 4px rgba(51, 51, 51, 0.2);
      color: #05c65d;
      opacity: 1;
      border-radius: 50px;
      text-align: center;
      visibility: hidden;
    }
  }

  .body_msg {
    width: 100%;
    background-color: #fff;

    .grade_box {
      // float: left;
      position: relative;
      padding: 20px 0 0 2.5%;
      width: 70%;
      height: 136px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;

      & .grade-item {
        width: 21%;
        height: 120px;

        & :nth-child(1) {
          height: 50px;
          line-height: 50px;
          width: 100%;
          background-color: #dcece3;
          font-size: 16px;
          color: #333;
          font-weight: bold;
        }

        & :nth-child(2) {
          width: 100%;
          height: 70px;
          line-height: 70px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          color: #626572;
          font-size: 16px;
        }
      }

      & > .echartBox {
        position: absolute;
        top: 0;
        right: -210px;
        width: 154px;
        height: 154px;

        & > .echartDiv {
          width: 154px;
          height: 154px;
        }

        .centerText {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 52px;
          height: 52px;
          background: #efefef;
          color: #05c65d;
          border-radius: 50%;
          text-align: center;
          line-height: 52px;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  .student_list {
    width: 100%;
    overflow: hidden;
    padding: 0 32px;
    box-sizing: border-box;
    // max-height: 600px;
    overflow-y: scroll;

    // display: flex;
    // justify-content: space-evenly;
    .student_score {
      margin: 20px 3% 10px 10px;
      float: left;
      width: 29%;
      background: #ffffff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.26);
      opacity: 1;

      .l_img {
        width: 36%;
        height: 220px;
        padding: 3% 2%;
        float: left;
        background: #dcece3;
        box-sizing: border-box;
        position: relative;

        img {
          width: 100%;
          height: 100%;
        }

        .show_more {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
      }

      .r_text {
        width: 64%;
        height: 220px;
        padding: 0 8%;
        float: left;
        box-sizing: border-box;

        p {
          text-align: left;
          color: #626572;
          height: 20%;
          display: flex;
          align-items: center;

          span:nth-of-type(1) {
            margin: 0 20px;
            display: inline-block;
            width: 64px;
            height: 21px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            line-height: 21px;
            color: #333333;
            opacity: 1;
          }
        }
      }
    }
  }

  .child_img_list {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(132, 132, 132, 0.51);
    z-index: 10;

    .close_icon {
      width: 60px;
      height: 60px;
      position: absolute;
      right: 7px;
      top: 25px;
      z-index: 30;
      cursor: pointer;
    }

    .el-carousel__item {
      background: rgba(132, 132, 132, 0);

      ::v-deep .el-carousel__mask {
        height: 0;
        background: rgba(0, 0, 0, 0);
      }
    }

    .el-carousel__item img {
      margin-top: 50px;
      // width: 586px;
      height: 100%;
    }
  }

  .table_box {
    margin-top: 30px;
    width: 100%;
    // max-height: 618px;
    overflow-y: scroll;
    padding: 0 64px 0 42px;
    box-sizing: border-box;

    table {
      width: 100%;

      .thead {
        width: 100%;
        height: 56px;
        line-height: 56px;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        background-color: #dcece3;

        & td {
          color: #333;
          flex: 1;
          text-align: center;
        }

        & > :nth-last-child(1) {
          flex: 2;
        }
      }

      .tr {
        width: 100%;
        height: 80px;
        line-height: 80px;
        font-size: 16px;
        display: flex;
        color: #626572;
        background-color: #f3f3f3;

        & td {
          flex: 1;

          img {
            width: 100px;
            height: 70px;
            margin: 5px 10px 0 10px;
          }
        }

        & > :nth-last-child(1) {
          flex: 2;
        }
      }

      .table_bg {
        background-color: #ececec;
      }
    }
  }

  .left_span {
    margin: 20px 0 10px 50px;
    padding-left: 2%;
    display: inline-block;
    width: 40%;
    height: 21px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    color: #848484;
    opacity: 1;
    text-align: left;

    span:nth-of-type(1) {
      display: inline-block;
      width: 100px;
    }

    span:nth-of-type(2) {
      color: #333333;
    }
  }

  .right_span {
    margin: 10px 0 10px 30px;
    padding-left: 2%;
    display: inline-block;
    width: 40%;
    height: 21px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    color: #848484;
    opacity: 1;
    text-align: left;

    span:nth-of-type(1) {
      display: inline-block;
      width: 100px;
    }

    span:nth-of-type(2) {
      color: #333333;
    }
  }

  .footer_msg {
    height: 100px;
    line-height: 100px;
    background-color: #fff;
    user-select: none;
    border-bottom: #e8e8e9 5px solid;

    span {
      cursor: pointer;
      margin: 0 30px;
      color: #848484;
    }
  }

  .shareBoxStatus {
    color: #333333;
    background: #ffffff;
    width: 300px;
    height: 360px;
    margin: 180px auto;
    position: relative;

    // position: fixed;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%,-50%);
    & > p:nth-of-type(1) {
      position: absolute;
      top: 0;
      left: 0;
      width: 300px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      border-bottom: 1px solid #05c65d;
      box-sizing: border-box;

      img {
        position: absolute;
        top: 15px;
        right: 10px;
        width: 30px;
        height: 30px;
      }
    }

    div {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 300px;
      height: 300px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: column;

      p {
        width: 184px;
        height: 78px;
        background: #f3f3f3;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        line-height: 78px;
        cursor: pointer;
      }
    }
  }

  .shareTable {
    color: #333333;
    background: #ffffff;
    width: 700px;
    height: 703px;
    margin: 10px auto;
    position: relative;

    & > p:nth-of-type(1) {
      position: absolute;
      top: 0;
      left: 0;
      width: 700px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      border-bottom: 1px solid #05c65d;
      box-sizing: border-box;

      img {
        position: absolute;
        top: 15px;
        right: 10px;
        width: 30px;
        height: 30px;
      }
    }

    .share_content {
      position: absolute;
      top: 60px;
      left: 0;
      width: 700px;
      height: 643px;
      background: #ffffff;
      opacity: 1;
    }

    .el-select-box {
      position: absolute;
      top: 25px;
      left: 35px;
      width: 630px;
      height: 30px;
      display: flex;
      justify-content: space-between;
    }

    .selectInput {
      position: absolute;
      top: 75px;
      left: 35px;
      width: 300px;
      height: 30px;

      & input {
        padding: 0 12px 0 12px;
        width: 260px;
        height: 30px;
        box-sizing: border-box;
        transform: translate(0, -10px);
        border: 1px solid #c9c7c7;
        font-size: 14px;
      }

      div {
        display: inline-block;
        cursor: pointer;
        height: 30px;
        background-color: #05c65d;

        img {
          margin: 5px 10px;
          width: 20px;
          height: 20px;
          background: #05c65d;
          opacity: 1;
        }
      }
    }

    .change_disable {
      display: flex;
      align-items: center;
      position: absolute;
      left: 35px;
      bottom: 77px;
      cursor: pointer;
      user-select: none;

      img {
        margin-right: 20px;
      }
    }

    .btn_no {
      position: absolute;
      left: 220px;
      bottom: 16px;
      width: 100px;
      height: 36px;
      line-height: 36px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 10px;
      cursor: pointer;
    }

    .btn_yes {
      position: absolute;
      right: 220px;
      bottom: 16px;
      width: 100px;
      height: 36px;
      line-height: 36px;
      background: #05c65d;
      color: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 10px;
      cursor: pointer;
    }

    .table_box_share {
      position: absolute;
      left: 0;
      top: 125px;
      width: 700px;
      padding: 0 35px 0 34px;
      background-color: #ffffff;
      box-sizing: border-box;

      table {
        width: 100%;
        text-align: center;
        background: #f3f3f3;

        thead {
          width: 100%;
          height: 53px;
          line-height: 53px;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          border-bottom: 1px solid #c9c7c7;

          & td {
            color: #333;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }

          td:nth-of-type(1) {
            flex: 0.3;
          }
        }

        tr {
          width: 100%;
          height: 50px;
          // line-height: 126px;
          font-size: 14px;
          display: flex;
          color: #333333;

          & td {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          td:nth-of-type(1) {
            flex: 0.3;
          }

          .isGreen {
            color: #05c65d !important;
          }

          .flex_direction {
            flex-direction: column;
          }

          .footer_msg_share {
            margin: 16px 0 0 150px;
            user-select: none;

            span {
              cursor: pointer;
              margin: 0 30px;
              color: #848484;
            }
          }
        }

        .isGreen {
          color: #05c65d !important;
        }

        .table_bg_share {
          background-color: #ececec;
        }
      }
    }
  }
}

.classroom {
  position: relative;

  .el-icon-caret-top {
    position: absolute;
    top: 10px;
    cursor: pointer;
  }

  .el-icon-caret-bottom {
    position: absolute;
    top: 20px;
    cursor: pointer;
  }
}
</style>
