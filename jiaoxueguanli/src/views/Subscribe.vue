<template>
  <div class="lab-home">
    <p>
      <img src="@images/subscribe/title-icon.png" alt="" />
      {{ weekNowObj.year }}年 - {{ parseInt(weekNowObj.year) + 1 }}年第{{
        weekNowObj.term_num === 1 ? '一' : '二'
      }}学期
      <span>{{
        weekNowObj.datatimeArr[weekNow - 1]
          ? weekNowObj.datatimeArr[weekNow - 1].time
          : ''
      }}</span>
      <span class="fr radio-box">
        <el-radio v-model="gradeNow" :label="null" :disabled="propState">
          {{ '全部' }}
        </el-radio>
        <el-radio
          v-model="gradeNow"
          :label="item"
          v-for="(item, index) in gradeList"
          :key="index"
          :disabled="propState"
        >
          {{ $store.state.gradeArr[item] }}
        </el-radio>
        <el-radio v-model="gradeNow" :label="-1" :disabled="propState">
          {{ '其他' }}
        </el-radio>
      </span>
    </p>
    <div class="flex sub-body">
      <div class="surface">
        <div>
          <p>周次</p>
          <ul>
            <li
              :class="[
                weekNow === item.index ? 'week-on' : '',
                weekNowObj.week > index + 1 ? 'broy-bg' : '',
              ]"
              @click="selWeek(item.index)"
              v-for="(item, index) in weekList"
              :key="index"
            >
              {{ item.week }}
              <span v-show="'count' in item">{{ item.count }}</span>
            </li>
          </ul>
        </div>
        <div>
          <p><img src="@images/subscribe/time.png" alt="" />时段</p>
          <div>
            <div>
              <div><p>上午</p></div>
              <div><p>下午</p></div>
            </div>
            <div>
              <div>
                <div>第一节</div>
                <div>第二节</div>
                <div>第三节</div>
                <div>第四节</div>
              </div>
              <div>
                <div>第五节</div>
                <div>第六节</div>
                <div>第七节</div>
                <div>第八节</div>
                <div>第九节</div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(item, index) in expTable" :key="index">
          <div>
            <p class="week">{{ item.weekDate }}</p>
          </div>
          <!-- :class="{ 'broy-bg': weekNow < weekNowObj.week || (weekNow === weekNowObj.week && index + 1 < weekNowObj.weekend) }" -->
          <div
            class="item"
            :class="{
              'broy-bg1':
                weekNow < weekNowObj.week ||
                (weekNow === weekNowObj.week && index + 1 < weekNowObj.weekend),
            }"
            v-for="(item1, index1) in item.curriculum"
            @click="clickItem(item1, index + 1, index1 + 1)"
            :key="index1"
          >
            <div v-show="'num' in item1">
              <div
                class="sub-msg-box"
                :class="
                  item1.status === -1
                    ? 'red_bg'
                    : item1.status === 1
                    ? 'yellow_bg'
                    : item1.status === 0 || item1.is_del === -1
                    ? 'grey_bg'
                    : 'green_bg'
                "
              >
                <p class="one" :title="item1.name">{{ item1.name }}</p>
                <p
                  v-if="item1.laboratory_id === -1"
                  class="one"
                  :title="item1.laboratory"
                >
                  教室（演示）
                </p>
                <p
                  v-if="item1.laboratory_id !== -1"
                  class="one"
                  :title="item1.laboratory"
                >
                  {{ item1.laboratory }}
                </p>
                <div>
                  <span>{{ item1.num }}</span>
                </div>
                <img
                  v-show="item1.status === 2"
                  src="@images/subscribe/pass.png"
                  alt=""
                />
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
              </div>
            </div>
          </div>
        </div>
        <div class="detail-box" v-if="propState" @click="hideDetail">
          <div class="msg-box" id="msgBox">
            <div class="header">
              {{ btnState === 1 ? '实验预约' : btnState === 2 ? '查看' : '修改' }}
              <img src="@images/subscribe/close.png" alt="" @click="closeExp('close')" />
            </div>
            <el-tabs type="border-card" @tab-click="tabClick">
              <el-tab-pane
                :label="itemTab.name || '新建'"
                v-for="(itemTab, index2) in newDataList"
                :key="index2"
              >
                <div class="msg-body">
                  <p>
                    <span class="ms_span">实验名称</span>
                    {{ newData.name === '' ? '请在右侧选择实验' : newData.name }}
                  </p>
                  <p>
                    <span class="ms_span">实验类型</span>
                    <el-radio
                      v-show="gradeNow !== -1"
                      v-model="newData.type"
                      :label="1"
                      :disabled="btnState === 2"
                      @change="laboratoryTypeChange"
                    >
                      分组
                    </el-radio>
                    <el-radio
                      v-show="gradeNow !== -1"
                      v-model="newData.type"
                      :label="2"
                      :disabled="btnState === 2"
                      @change="laboratoryTypeChange"
                    >
                      演示
                    </el-radio>
                    <el-radio
                      v-show="gradeNow === -1"
                      v-model="newData.type"
                      :label="3"
                      :disabled="btnState === 2"
                      @change="laboratoryTypeChange"
                    >
                      其他
                    </el-radio>
                  </p>
                  <p>
                    <span class="ms_span">年级</span>
                    <span v-show="newData.type !== 3">
                      {{ $store.state.gradeArr[newData.grade] }}
                    </span>
                    <el-checkbox-group
                      v-show="newData.type === 3"
                      v-model="gradeCheckList"
                      :disabled="btnState === 2"
                    >
                      <el-checkbox
                        v-for="(item, index) in allGradeList"
                        :key="index"
                        :label="item"
                      >
                        {{ $store.state.gradeArr[item] }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </p>
                  <p>
                    <span class="ms_span">班级</span>
                    <el-select
                      v-show="newData.type !== 3"
                      v-model="newData.class_id"
                      placeholder="请选择"
                      :disabled="btnState === 2"
                    >
                      <el-option
                        v-for="(item, index) in classList"
                        :key="index"
                        :label="item.calssname"
                        :value="item.class_id"
                      />
                    </el-select>
                    <span v-show="newData.type === 3">活动班</span>
                  </p>
                  <p>
                    <span class="ms_span">分组</span>
                    <el-input-number
                      v-model="newData.number_groups"
                      :min="0"
                      label="描述文字"
                      :disabled="btnState === 2"
                    />
                    人/组
                  </p>
                  <p>
                    <span class="ms_span">实验仪器</span>
                    <el-input-number
                      v-model="newData.number_instruments"
                      :min="1"
                      label="描述文字"
                      :disabled="btnState === 2"
                    />
                    套
                    <el-popover
                      placement="right"
                      width="240"
                      @show="instrumentList(newData)"
                      trigger="click"
                    >
                      <div class="instrument-list">
                        <p>仪器详情</p>
                        <ul>
                          <li v-for="(item1, index) in tableData1" :key="index">
                            <span :title="item1.name">{{ item1.name }}</span>
                            <span>{{ item1.true_num + ' 个' }}</span>
                          </li>
                          <li v-show="tableData1.length === 0">
                            <span>暂无</span>
                          </li>
                        </ul>
                        <p>仪器备注</p>
                        <ul>
                          <li>
                            <span :title="instrumentTip">{{
                              instrumentTip === '' ? '暂无' : instrumentTip
                            }}</span>
                          </li>
                        </ul>
                      </div>
                      <!-- 新建时候没有添加id：不展示清单 -->
                      <span v-if="newData.id" slot="reference" class="havecolor"
                        >详细清单</span
                      >
                    </el-popover>
                  </p>
                  <p>
                    <span class="ms_span">实验室</span>
                    <el-select
                      v-model="newData.laboratory_id"
                      placeholder="请选择"
                      :disabled="btnState === 2"
                    >
                      <el-option :label="'教室'" :value="-1" />
                      <el-option
                        v-for="(item, index) in labList"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </p>
                  <p>
                    <span class="ms_span">提交说明</span>
                    {{
                      newData.status2 === 0
                        ? '已提交'
                        : newData.status2 === 1
                        ? '已取消'
                        : newData.status2 === 2
                        ? '已取消'
                        : newData.status2 === 3
                        ? '重新提交'
                        : newData.status2 === 4
                        ? '重新提交'
                        : '未提交'
                    }}
                  </p>
                  <p>
                    <span class="ms_span">状态</span>
                    <span>{{
                      newData.status === 1
                        ? '未审核'
                        : newData.status === 2
                        ? '审核已通过'
                        : newData.status === -1
                        ? '审核未通过'
                        : '未提交'
                    }}</span>
                  </p>
                  <p>
                    <span class="ms_span">备注</span>
                    <span
                      v-show="btnState !== 2"
                      class="mr_span"
                      @click="newData.tips = item.tips"
                      v-for="(item, index) in $store.state.teacher"
                      :key="index"
                      >{{ item.tips }}</span
                    >
                  </p>
                  <el-input
                    type="textarea"
                    placeholder="请输入备注..."
                    v-model="newData.tips"
                    maxlength="60"
                    resize="none"
                    :rows="4"
                    show-word-limit
                    :disabled="btnState === 2"
                  />
                </div>
                <div
                  v-show="
                    isHaveEnd
                      ? !(
                          newData.end === 1 ||
                          newData.is_del === -1 ||
                          newData.week_time < weekNowObj.week ||
                          (weekNow === weekNowObj.week &&
                            newData.weekend < weekNowObj.weekend)
                        )
                      : !(newData.is_del === -1)
                  "
                  class="footer"
                >
                  <button
                    v-show="newData.unchange === 0"
                    class="mr12"
                    :class="[
                      newData.status > 0 && btnState === 2 ? 'commonbtn' : 'graybtn',
                    ]"
                    @click="closeExp"
                  >
                    {{ newData.status > 0 && btnState === 2 ? '取消预约' : '取消' }}
                  </button>
                  <button
                    v-show="newData.unchange === 0"
                    class="commonbtn ml12"
                    @click="sureClick"
                  >
                    {{ btnState === 1 ? '确认' : btnState === 2 ? '修改' : '重新提交' }}
                  </button>
                  <button
                    v-show="newData.unchange === 1"
                    class="commonbtn ml12"
                    @click="delExpBook(newData)"
                  >
                    撤销
                  </button>
                  <button
                    v-show="newData.status === 2 && btnState === 2"
                    class="commonbtn ml12"
                    @click="shareToStudent(newData)"
                  >
                    {{ newData.unchange === 0 ? '发布给学生' : '发布' }}
                  </button>
                </div>
                <div
                  v-show="
                    isHaveEnd &&
                    (newData.end === 1 ||
                      newData.week_time < weekNowObj.week ||
                      (weekNow === weekNowObj.week &&
                        newData.weekend < weekNowObj.weekend))
                  "
                  class="footer"
                >
                  <p>已结束</p>
                </div>
                <div
                  v-show="
                    isHaveEnd
                      ? newData.end === 0 && newData.is_del === -1
                      : newData.is_del === -1
                  "
                  class="footer"
                >
                  <p>已撤销</p>
                </div>
                <div class="msg-date">
                  <p>预约时间</p>
                  <p>{{ $store.state.weekTimeArr[newData.week_time] }}</p>
                  <p>{{ $store.state.weekArr[newData.weekend] }}</p>
                  <p>{{ '第' + newData.section + '节' }}</p>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="sub-r-box" :class="[rBChange ? 'pd12' : 'pd34']">
        <div class="small-d" v-show="!rBChange" @click="rBChange = true">
          <img src="@images/subscribe/left-move.png" alt="" />
          实验列表 / 实验计划
        </div>
        <div class="big-d" v-show="rBChange">
          <div class="header">
            <div @click="bigState = 1">
              我的实验列表
              <div :class="[bigState === 1 ? 'sel' : '']" />
            </div>
            <div @click="bigState = 2">
              实验计划表
              <div :class="[bigState === 2 ? 'sel' : '']" />
            </div>
            <img
              @click="rBChange = false"
              src="@images/subscribe/right-move.png"
              alt=""
            />
          </div>
          <div class="tab-header">
            <span>{{ bigState === 2 ? '周次' : '年级' }}</span>
            <span>实验名称</span>
            <span v-show="bigState === 1">预约</span>
            <span>分组</span>
            <span>演示</span>
          </div>
          <div class="tab-item-box" v-show="bigState === 1">
            <div
              class="tab-item point"
              @click="selExp(item)"
              :class="[item.week_time === weekNow ? 'sel-bg' : '']"
              v-for="(item, index) in planListMine"
              :key="index"
            >
              <div>{{ item.grade }}</div>
              <div class="one-line" :title="item.name">{{ item.name }}</div>
              <div>
                <img
                  v-show="item.week_time === weekNow"
                  src="@images/subscribe/yy-on.png"
                  alt=""
                />
                <img
                  v-show="!(item.week_time === weekNow)"
                  src="@images/subscribe/yy-off.png"
                  alt=""
                />
              </div>
              <div>
                <img
                  v-show="!(item.week_time === weekNow) && item.is_group === 1"
                  src="@images/subscribe/yes-off.png"
                  alt=""
                />
                <img
                  v-show="item.week_time === weekNow && item.is_group === 1"
                  src="@images/subscribe/yes-on.png"
                  alt=""
                />
              </div>
              <div>
                <img
                  v-show="item.week_time === weekNow && item.is_group === 0"
                  src="@images/subscribe/yes-on.png"
                  alt=""
                />
                <img
                  v-show="!(item.week_time === weekNow) && item.is_group === 0"
                  src="@images/subscribe/yes-off.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="tab-item-box" v-show="bigState === 2">
            <div
              class="tab-item point"
              @click="selExp('planItem')"
              :class="[item.week_time === weekNow ? 'sel-bg' : '']"
              v-for="(item, index) in planList"
              :key="index"
            >
              <div>{{ item.week_time }}</div>
              <div class="one-line" :title="item.name">{{ item.name }}</div>
              <!-- <div>
                <img v-show="item.week_time === weekNow" src="@images/subscribe/yy-on.png" alt="">
                <img v-show="!(item.week_time === weekNow)" src="@images/subscribe/yy-off.png" alt="">
              </div> -->
              <div>
                <img
                  v-show="!(item.week_time === weekNow) && item.is_group === 1"
                  src="@images/subscribe/yes-off.png"
                  alt=""
                />
                <img
                  v-show="item.week_time === weekNow && item.is_group === 1"
                  src="@images/subscribe/yes-on.png"
                  alt=""
                />
              </div>
              <div>
                <img
                  v-show="item.week_time === weekNow && item.is_group === 0"
                  src="@images/subscribe/yes-on.png"
                  alt=""
                />
                <img
                  v-show="!(item.week_time === weekNow) && item.is_group === 0"
                  src="@images/subscribe/yes-off.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="add" v-show="rBChange">+新增实验预约</div> -->
      </div>
    </div>
    <!-- <Footer/> -->
  </div>
</template>

<script>
import {
  getExpPlan,
  getMyPlan,
  labExpDate,
  pushSub,
  cancelExpBook,
  getDatebyweek,
  delExpBook,
} from '../network/subscribe'
import { examInstrument } from '../network/subExamine'
export default {
  name: 'Subscribe',
  data() {
    return {
      // 按钮状态 1:未提交 2:查看 3:修改
      btnState: 1,
      bigState: 1,
      isHaveEnd: false, // 是否具有结束状态
      propState: false,
      rBChange: false,
      gradeCheckList: [this.$store.state.userMsg.grade[0]],
      newDataList: [],
      weekList: [
        {
          week: '第一周',
          index: 1,
        },
        {
          week: '第二周',
          index: 2,
        },
        {
          week: '第三周',
          index: 3,
        },
        {
          week: '第四周',
          index: 4,
        },
        {
          week: '第五周',
          index: 5,
        },
        {
          week: '第六周',
          index: 6,
        },
        {
          week: '第七周',
          index: 7,
        },
        {
          week: '第八周',
          index: 8,
        },
        {
          week: '第九周',
          index: 9,
        },
        {
          week: '第十周',
          index: 10,
        },
        {
          week: '十一周',
          index: 11,
        },
        {
          week: '十二周',
          index: 12,
        },
        {
          week: '十三周',
          index: 13,
        },
        {
          week: '十四周',
          index: 14,
        },
        {
          week: '十五周',
          index: 15,
        },
        {
          week: '十六周',
          index: 16,
        },
        {
          week: '十七周',
          index: 17,
        },
        {
          week: '十八周',
          index: 18,
        },
        {
          week: '十九周',
          index: 19,
        },
        {
          week: '二十周',
          index: 20,
        },
      ],
      newData: {
        name: '',
        exp_id: null,
        plan_detail_id: null,
        type: 1,
        end: 0,
        is_del: 0,
        unchange: 0,
        grade: null,
        class_id: null,
        number_groups: 2,
        number_instruments: 20,
        laboratory_id: this.$store.state.labList[0].id,
        tips: '',
        week_time: null,
        weekend: null,
        section: null,
      },
      weekNow: 0,
      weekNowObj: {
        week: '',
        year: '',
        weekend: '',
        datatimeArr: [{ time: '' }],
        term_num: 1,
      },
      expTable: [
        {
          weekDate: '星期一',
          date: '4.2',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期二',
          date: '4.3',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期三',
          date: '4.4',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期四',
          date: '4.5',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期五',
          date: '4.6',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期六',
          date: '4.7',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
        {
          weekDate: '星期日',
          date: '4.8',
          curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        },
      ],
      planList: [],
      planListMine: [],
      gradeList: this.$store.state.userMsg.grade,
      gradeNow: null,
      allGradeList: [],
      classList: [],
      tableData1: [],
      instrumentTip: '',
      labList: [],
    }
  },
  watch: {
    gradeNow(val) {
      console.log(val)
      this.getTableDate()
      if (val !== -1) {
        this.getTermPlan()
        if (this.gradeNow !== null) {
          this.classList = this.$store.state.userMsg.class.filter(
            (e) => e.grade_id === this.gradeNow
          )
        } else {
          this.classList = this.$store.state.userMsg.class
        }
      } else {
        this.getTermPlan('All')
      }
    },
    weekNow() {
      this.getTableDate()
    },
  },
  created() {
    this.allGradeList =
      this.$store.state.userMsg.time_ids === 1
        ? [1, 2, 3, 4, 5, 6]
        : this.$store.state.userMsg.time_ids === 2
        ? [7, 8, 9]
        : [10, 11, 12]
    this.getYearTermData()
    this.classList = this.$store.state.userMsg.class
    if (this.gradeNow !== null) {
      this.classList = this.$store.state.userMsg.class.filter(
        (e) => e.grade_id === this.gradeNow
      )
    }
    // 班级默认值
    this.newData.class_id = this.classList[0].class_id
    this.labList = [...this.$store.state.labList]
    this.getTermPlan()
    // this.getLabList()
  },
  methods: {
    // getLabList() {
    //   getLaboratoryByUser().then((res) => {
    //     this.labList = res.data
    //   })
    // },
    getYearTermData() {
      let weekend = new Date().getDay()
      if (weekend === 0) {
        weekend = 7
      }
      getDatebyweek().then((res) => {
        this.weekNow = res.data.week <= 20 ? res.data.week : 20
        this.weekNowObj = res.data
        this.weekNowObj.weekend = weekend
      })
    },
    laboratoryTypeChange(val) {
      if (val === 1) {
        this.newData.class_id = this.classList[0].class_id
        this.newData.number_groups = 2
        this.newData.number_instruments = 20
        this.newData.laboratory_id = this.labList[0].id
      }
      if (val === 2) {
        this.newData.class_id = this.classList[0].class_id
        this.newData.number_groups = 0
        this.newData.number_instruments = 1
        this.newData.laboratory_id = -1
      }
    },
    delExpBook(data) {
      this.$confirm('此操作将永久删除该课程信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delExpBook({
            id: data.id,
          }).then((res) => {
            if (res.code === 10) {
              this.propState = false
              this.$message.success(res.msg)
              this.getTableDate()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    instrumentList(item) {
      const data = {
        id: item.id,
      }
      examInstrument(data).then((res) => {
        this.tableData1 = res.data.data
        this.instrumentTip = res.data.tips
      })
    },
    hideDetail(event) {
      const msg = document.getElementById('msgBox')
      if (msg) {
        if (!msg.contains(event.target)) {
          // 关闭窗口要重置下边三个参数
          this.propState = false
          this.btnState = 1
          this.newData = {
            name: '',
            exp_id: null,
            plan_detail_id: null,
            type: 1,
            end: 0,
            is_del: 0,
            unchange: 0,
            grade: null,
            class_id: null,
            number_groups: 2,
            number_instruments: 20,
            laboratory_id: this.labList[0].id,
            tips: '',
            week_time: null,
            weekend: null,
            section: null,
          }
        }
      }
    },
    tabClick(data) {
      const clickObj = this.newDataList[data.index]
      this.newData = {
        name: clickObj.name,
        exp_id: clickObj.exp_id,
        plan_detail_id: clickObj.plan_detail_id,
        type: clickObj.type,
        end: clickObj.end,
        is_del: clickObj.is_del,
        unchange: clickObj.unchange,
        grade: clickObj.grade,
        class_id: clickObj.class_id,
        number_groups: clickObj.number_groups,
        number_instruments: clickObj.number_instruments,
        laboratory_id: clickObj.laboratory_id,
        tips: clickObj.tips,
        week_time: clickObj.week_time,
        weekend: clickObj.weekend,
        section: clickObj.section,
        id: clickObj.id,
        status2: clickObj.status2,
        status: clickObj.status,
      }
      this.gradeCheckList = clickObj.grade
    },
    selExp(item) {
      if (item === 'planItem') {
        this.$message({
          type: 'warning',
          message: '请选择"我的实验列表"进行预约',
        })
        return
      }
      if (this.btnState !== 2) {
        this.newData.name = item.name
        if (item.is_group === 1) {
          this.newData.type = 1
        } else {
          this.newData.type = 2
        }
        this.newData.exp_id = item.exp_scheme_id
        this.newData.grade = item.grade
        this.classList = this.$store.state.userMsg.class.filter(
          (e) => e.grade_id === item.grade
        )
        this.newData.class_id = this.classList[0].class_id
        if (this.gradeNow === -1) {
          this.newData.type = 3
        }
        // 推荐方案字段plan_detail_id
        this.newData.plan_detail_id = item.plan_id
        if (!this.propState) {
          this.$message({
            message: '请在左侧选择上课时间！',
            type: 'success',
          })
        }
      }
    },
    closeExp(type) {
      if (type === 'close' || !(this.newData.status > 0 && this.btnState === 2)) {
        this.btnState = 1
        this.propState = false
        this.newData = {
          name: '',
          exp_id: null,
          plan_detail_id: null,
          type: 1,
          end: 0,
          is_del: 0,
          unchange: 0,
          grade: null,
          class_id: null,
          number_groups: 2,
          number_instruments: 20,
          laboratory_id: this.labList[0].id,
          tips: '',
          week_time: null,
          weekend: null,
          section: null,
        }
        return
      }
      if (this.newData.status > 0 && this.btnState === 2) {
        this.$confirm('是否取消预约?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            cancelExpBook({
              id: this.newData.id,
            })
              .then((res) => {
                if (res.code === 10) {
                  this.propState = false
                  this.getTableDate()
                  this.$message({
                    message: '已取消预约',
                    type: 'success',
                  })
                  this.newData = {
                    name: '',
                    exp_id: null,
                    plan_detail_id: null,
                    type: 1,
                    end: 0,
                    is_del: 0,
                    unchange: 0,
                    grade: null,
                    class_id: null,
                    number_groups: 2,
                    number_instruments: 20,
                    laboratory_id: this.labList[0].id,
                    tips: '',
                    week_time: null,
                    weekend: null,
                    section: null,
                  }
                } else {
                  this.$message({
                    message: '取消预约失败',
                    type: 'warning',
                  })
                }
              })
              .catch(() => {
                this.$message({
                  message: '取消预约失败',
                  type: 'error',
                })
              })
          })
          .catch(() => {
            this.$message({
              message: '取消操作',
              type: 'warning',
            })
          })
      }
    },
    // 获取表格数据
    getTableDate() {
      const data = {
        week_time: this.weekNow,
        grade: this.gradeNow,
      }
      labExpDate(data).then((res) => {
        console.log(res)
        const arr = [
          {
            week: '第一周',
            index: 1,
          },
          {
            week: '第二周',
            index: 2,
          },
          {
            week: '第三周',
            index: 3,
          },
          {
            week: '第四周',
            index: 4,
          },
          {
            week: '第五周',
            index: 5,
          },
          {
            week: '第六周',
            index: 6,
          },
          {
            week: '第七周',
            index: 7,
          },
          {
            week: '第八周',
            index: 8,
          },
          {
            week: '第九周',
            index: 9,
          },
          {
            week: '第十周',
            index: 10,
          },
          {
            week: '十一周',
            index: 11,
          },
          {
            week: '十二周',
            index: 12,
          },
          {
            week: '十三周',
            index: 13,
          },
          {
            week: '十四周',
            index: 14,
          },
          {
            week: '十五周',
            index: 15,
          },
          {
            week: '十六周',
            index: 16,
          },
          {
            week: '十七周',
            index: 17,
          },
          {
            week: '十八周',
            index: 18,
          },
          {
            week: '十九周',
            index: 19,
          },
          {
            week: '二十周',
            index: 20,
          },
        ]
        res.data.pass.forEach((e) => {
          arr[e.week_time - 1].count = e.Count
        })
        this.weekList = JSON.parse(JSON.stringify(arr))
        if (res.code === 10) {
          this.expTable = [
            {
              weekDate: '星期一',
              date: '4.2',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期二',
              date: '4.3',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期三',
              date: '4.4',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期四',
              date: '4.5',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期五',
              date: '4.6',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期六',
              date: '4.7',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
            {
              weekDate: '星期日',
              date: '4.8',
              curriculum: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            },
          ]
          res.data.list.sort((a, b) => {
            return b.is_del - a.is_del
          })
          res.data.list.forEach((e) => {
            if ('name' in this.expTable[e.weekend - 1].curriculum[e.section - 1]) {
              // 教师同时预约多个实验，按照审核通过、审核失败、待审核、已取消排序
              // if (this.expTable[e.weekend - 1].curriculum[e.section - 1].status === 2) {
              //   this.expTable[e.weekend - 1].curriculum[e.section - 1] = { ...e, num: this.expTable[e.weekend - 1].curriculum[e.section - 1].num + 1 }
              // } else if (this.expTable[e.weekend - 1].curriculum[e.section - 1].status === -1) {
              //   this.expTable[e.weekend - 1].curriculum[e.section - 1] = { ...e, num: this.expTable[e.weekend - 1].curriculum[e.section - 1].num + 1 }
              // } else if (this.expTable[e.weekend - 1].curriculum[e.section - 1].status === 1) {
              //   this.expTable[e.weekend - 1].curriculum[e.section - 1] = { ...e, num: this.expTable[e.weekend - 1].curriculum[e.section - 1].num + 1 }
              // } else {
              //   this.expTable[e.weekend - 1].curriculum[e.section - 1] = { ...e, num: this.expTable[e.weekend - 1].curriculum[e.section - 1].num + 1 }
              // }
              this.expTable[e.weekend - 1].curriculum[e.section - 1].num++
            } else {
              this.expTable[e.weekend - 1].curriculum[e.section - 1] = e
              this.expTable[e.weekend - 1].curriculum[e.section - 1].num = 1
            }
          })
        }
      })
    },
    getTermPlan(grade) {
      const data = {
        grade: grade === 'All' ? null : this.gradeNow,
      }
      getExpPlan(data).then((res) => {
        if (res.code === 10) {
          this.planList = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
      getMyPlan(data).then((res) => {
        if (res.code === 10) {
          this.planListMine = res.data
        } else {
          this.$message({
            message: '本学期实验计划表获取失败',
            type: 'error',
          })
        }
      })
    },
    selWeek(index) {
      this.weekNow = index
    },
    sureClick() {
      if (this.btnState === 2) {
        this.btnState = 3
        return
      }
      if (!this.newData.exp_id) {
        this.$message({
          type: 'error',
          message: '请选择实验',
        })
        return
      }
      if (this.gradeCheckList.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一个年级',
        })
        return
      }
      // 保存时参数固定，不删掉会报错
      delete this.newData.name
      delete this.newData.status2
      delete this.newData.status
      delete this.newData.end
      delete this.newData.is_del
      delete this.newData.unchange
      if (this.btnState === 3) {
        this.newData.status = 1
      }
      if (this.newData.type === 3) {
        this.newData.class_id = -1
        this.newData.grade = this.gradeCheckList.join(',')
      }
      pushSub(this.newData)
        .then((res) => {
          if (res.code === 10) {
            this.propState = false
            this.getTableDate()
            this.$message({
              message: '预约完成',
              type: 'success',
            })
            this.newData = {
              name: '',
              exp_id: null,
              plan_detail_id: null,
              type: 1,
              is_del: 0,
              unchange: 0,
              end: 0,
              grade: null,
              class_id: null,
              number_groups: 2,
              number_instruments: 20,
              laboratory_id: this.labList[0].id,
              tips: '',
              week_time: null,
              weekend: null,
              section: null,
            }
            this.gradeCheckList = [this.$store.state.userMsg.grade[0]]
          }
        })
        .catch(() => {
          this.$message({
            message: '预约失败',
            type: 'error',
          })
        })
    },
    shareToStudent(data) {
      this.$router.push({
        name: 'MyExperiment',
        params: { item_id: data.exp_id, shareToStu: true },
      })
    },
    // 点击表格
    clickItem(item, weekend, section) {
      // 新增时判断预约的时间
      if (this.isHaveEnd) {
        if (
          !('name' in item) &&
          (this.weekNow < this.weekNowObj.week ||
            (this.weekNow === this.weekNowObj.week && weekend < this.weekNowObj.weekend))
        ) {
          this.$message.warning('预约的时间已结束，为无效预约')
          return
        }
      }
      // 班级默认值
      this.newData.class_id = this.classList[0].class_id
      this.rBChange = true
      console.log(item, weekend, section)

      // 获取tab列表预约数据
      const data = {
        week_time: this.weekNow,
        grade: this.gradeNow,
      }
      labExpDate(data).then((res) => {
        this.newDataList = res.data.list.filter(
          (e) =>
            e.week_time === this.weekNow && e.weekend === weekend && e.section === section
        )
        this.newDataList.sort((a, b) => {
          return b.is_del - a.is_del
        })
        if (this.gradeNow === -1) {
          this.newData.type = 3
        }
        // 判断是否新增还是修改
        if (this.newData.exp_id) {
          this.newData.week_time = this.weekNow
          this.newData.weekend = weekend
          this.newData.section = section
          this.btnState = 1
          this.newDataList.unshift(this.newData)
        } else {
          if ('name' in item) {
            this.btnState = 2
            this.newData = {
              name: this.newDataList[0].name,
              exp_id: this.newDataList[0].exp_id,
              plan_detail_id: this.newDataList[0].plan_detail_id,
              type: this.newDataList[0].type,
              end: this.newDataList[0].end,
              is_del: this.newDataList[0].is_del,
              unchange: this.newDataList[0].unchange,
              grade: this.newDataList[0].grade[0],
              class_id: this.newDataList[0].class_id,
              number_groups: this.newDataList[0].number_groups,
              number_instruments: this.newDataList[0].number_instruments,
              laboratory_id: this.newDataList[0].laboratory_id,
              tips: this.newDataList[0].tips,
              week_time: this.newDataList[0].week_time,
              weekend: this.newDataList[0].weekend,
              section: this.newDataList[0].section,
              id: this.newDataList[0].id,
              status2: this.newDataList[0].status2,
              status: this.newDataList[0].status,
            }
            if (this.newData.type === 3) {
              this.gradeCheckList = this.newDataList[0].grade
            }
          } else {
            this.btnState = 1
            this.newData.week_time = this.weekNow
            this.newData.weekend = weekend
            this.newData.section = section
          }
        }
        if (this.newDataList.length === 0) {
          this.newDataList.push(this.newData)
        }
        this.propState = true
      })
    },
  },
}
</script>

<style scoped lang="scss">
.lab-home {
  position: relative;
  box-sizing: border-box;
  padding: 8px 0 10px 32px;
  width: 100%;
  & > P {
    margin-bottom: 22px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #626572;
    text-align: left;
    img {
      float: left;
      margin-right: 20px;
      width: 30px;
      height: 30px;
    }
    span {
      padding-left: 28px;
      font-size: 14px;
      color: #8e8e8e;
    }
  }
}
.sub-body {
  width: 100%;
  height: 895px;
  .surface {
    flex: 1;
    width: auto;
    display: flex;
    height: 100%;
    position: relative;
    .detail-box {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      // background-color: rgba(255, 255, 255, 0.534);
      .msg-box {
        position: relative;
        margin-top: 30px;
        margin-left: 20%;
        width: 60%;
        height: 600px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        opacity: 1;
        .msg-date {
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background-color: #eea359;
          p {
            height: 25px;
            line-height: 25px;
            color: #fff;
          }
        }
        .header {
          position: relative;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          color: #fff;
          background-color: #05c65d;
          img {
            padding: 12px;
            width: 24px;
            height: 24px;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(0, -50%);
            cursor: pointer;
          }
        }
        .msg-body {
          padding: 0 20px;
          p {
            padding: 5px 0;
            height: 28px;
            line-height: 30px;
            text-align: left;
            color: #8e8e8e;
            .ms_span {
              text-align: left;
              float: left;
              width: 70px;
              font-size: 14px;
              color: #626572;
            }
            & .el-select ::v-deep .el-input__inner {
              width: 200px !important;
            }
          }
        }
        .footer {
          margin-top: 24px;
          height: 32px;
          line-height: 32px;
          p {
            width: 160px;
            padding: 0 12px;
            margin-left: 50%;
            transform: translate(-50%, 0);
            height: 32px;
            font-size: 16px;
            background: #a1a1a1;
            color: #fff;
          }
        }
      }
    }
    & > div {
      flex: 1;
      flex-direction: column;
      margin-right: 4px;
      height: 100%;
      & > .item {
        width: 100%;
        padding-top: 10px;
        height: 78px;
        margin-bottom: 4px;
        background-color: #fff;
        cursor: pointer;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      }
      & > :nth-child(1) {
        margin-bottom: 8px;
        height: 60px;
        background-color: #fff;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        opacity: 0.8;
        .week {
          // padding-top: 10px;
          height: 60px;
          line-height: 60px;
        }
        .date {
          height: 30px;
          line-height: 30px;
        }
      }
      & > :nth-child(5) {
        margin-bottom: 8px;
      }
    }
    & > :nth-child(1) {
      flex: none;
      width: 80px;
      background-color: #fff;
      p {
        font-size: 16px;
        color: #05c65d;
        margin-bottom: 8px;
        height: 60px;
        line-height: 60px;
        box-shadow: none;
        opacity: 1;
      }
      ul {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 827px;
      }
      ul li {
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        position: relative;
        span {
          position: absolute;
          top: -4px;
          right: -10px;
          width: 20px;
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          background-color: #05c65d;
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
        height: 60px;
        line-height: 60px;
        background-color: #fff;
        text-align: left;
        img {
          float: left;
          margin: 19px 10px 19px 11px;
          width: 22px;
          height: 22px;
        }
      }
      & > div {
        height: 736px;
        width: 100%;
        & > :nth-child(1) {
          float: left;
          width: 40px;
          & > :nth-child(1) {
            width: 40px;
            height: 364px;
            background-color: #fff;
            margin-bottom: 8px;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            p {
              padding: 134px 12px;
              width: 16px;
              height: 96px;
              line-height: 48px;
              font-size: 16px;
              color: #05c65d;
            }
          }
          & > :nth-child(2) {
            width: 40px;
            height: 455px;
            background-color: #fff;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
            p {
              padding: 134px 12px;
              width: 16px;
              height: 96px;
              line-height: 48px;
              font-size: 16px;
              color: #05c65d;
            }
          }
        }
        & > :nth-child(2) {
          float: right;
          & > :nth-child(1) {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            width: 40px;
            height: 364px;
            margin-bottom: 8px;
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
            height: 455px;
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
  .sub-r-box {
    .small-d {
      cursor: pointer;
      img {
        margin-bottom: 10px;
        width: 20px;
        height: 20px;
      }
      padding: 25px 21px;
      width: 20px;
      background-color: #05c65d;
      color: #fff;
      font-size: 20px;
      border-radius: 10px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
    .big-d {
      margin-top: 8px;
      width: 538px;
      height: 760px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      .header {
        padding-top: 10px;
        margin-bottom: 24px;
        height: 40px;
        & > :nth-child(1) {
          position: relative;
          float: left;
          margin: 0 40px;
          width: 96px;
          height: 38px;
          line-height: 38px;
          font-size: 16px;
          color: #626572;
          cursor: pointer;
          .sel {
            position: absolute;
            left: 10%;
            bottom: 0;
            width: 80%;
            height: 2px;
            background-color: #05c65d;
          }
        }
        & > :nth-child(2) {
          position: relative;
          float: left;
          width: 96px;
          height: 38px;
          line-height: 38px;
          font-size: 16px;
          color: #626572;
          cursor: pointer;
          .sel {
            position: absolute;
            left: 10%;
            bottom: 0;
            width: 80%;
            height: 2px;
            background-color: #05c65d;
          }
        }
        img {
          float: right;
          width: 38px;
          height: 38px;
          cursor: pointer;
        }
      }
      .tab-header {
        display: flex;
        justify-content: space-around;
        height: 45px;
        line-height: 45px;
        background-color: #05c65d;
        span {
          font-size: 14px;
          color: #fff;
        }
        & > :nth-child(1) {
          flex: 1;
        }
        & > :nth-child(2) {
          flex: 2;
          transform: translate(-20px, 0);
          // text-align: left;
          // padding-left: 30px;
        }
        & > :nth-child(3) {
          flex: 1;
        }
        & > :nth-child(4) {
          flex: 1;
        }
        & > :nth-child(5) {
          flex: 1;
        }
        & > :nth-child(6) {
          flex: 1;
        }
      }
      .tab-item {
        display: flex;
        justify-content: space-around;
        height: 50px;
        line-height: 50px;
        span {
          font-size: 14px;
          color: #fff;
        }
        & > :nth-child(1) {
          flex: 1;
        }
        & > :nth-child(2) {
          flex: 2;
          text-align: left;
          // padding-left: 30px;
        }
        & > :nth-child(3) {
          flex: 1;
        }
        & > :nth-child(4) {
          flex: 1;
        }
        & > :nth-child(5) {
          flex: 1;
        }
        & > :nth-child(6) {
          flex: 1;
        }
      }
    }
    .add {
      cursor: pointer;
      margin-top: 8px;
      width: 538px;
      height: 50px;
      line-height: 50px;
      border-radius: 10px;
      background-color: #05c65d;
      font-size: 14px;
      color: #fff;
    }
  }
  .pd34 {
    padding-left: 34px;
  }
  .pd12 {
    padding-left: 12px;
  }
}
.broy-bg {
  background: rgba(255, 255, 255);
  color: rgb(0, 0, 0);
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
  padding-right: 100px;
}
.sub-msg-box {
  position: relative;
  margin: auto;
  height: 68px;
  width: 89.7%;
  border-radius: 4px;
  & > :nth-child(1) {
    padding-top: 16px;
    margin-left: 15%;
    width: 70%;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #fff;
  }
  & > :nth-child(2) {
    padding-top: 8px;
    margin-left: 15%;
    width: 70%;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #fff;
  }
  & > :nth-child(3) {
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
      background-color: #51a8ff;
    }
  }
  img {
    position: absolute;
    top: -8px;
    right: -5px;
  }
}
.red_bg {
  background-color: #e43f3f;
}
.yellow_bg {
  background-color: #eea359;
}
.grey_bg {
  background: #848484;
}
.green_bg {
  background-color: #05c65d;
}
.one {
  overflow: hidden;
  text-overflow: ellipsis;
  // white-space: nowrap;
}
.tab-item-box {
  height: 620px;
  overflow-y: auto;
}
.tab-item-box::-webkit-scrollbar {
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
  margin-left: 10px;
  cursor: pointer;
  color: #05c65d !important;
}
</style>
<style lang="scss">
.instrument-list {
  p {
    font-size: 16px;
    font-weight: 600;
    border-bottom: #05c65d solid 1px;
  }
  ul {
    margin-bottom: 6px;
    max-height: 200px;
    overflow-y: scroll;
    li {
      height: 30px;
      line-height: 30px;
      border-bottom: #333 1px dashed;
      span:nth-of-type(1) {
        display: inline-block;
        width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span:nth-of-type(2) {
        display: inline-block;
        width: 29%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
}
</style>
