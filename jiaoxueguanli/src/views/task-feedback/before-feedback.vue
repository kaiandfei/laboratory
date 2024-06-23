<template>
  <div class="content">
    <p class="title">学生任务反馈<i class="el-icon-arrow-right" />学生课前</p>
    <top-filter
      ref="filterRef"
      :options="[
        'semester',
        'subject_id',
        'grade',
        'week',
        'exp_id',
        'type',
        'time_order',
        'teacher_id',
        'class_id',
      ]"
      @change="getData($event, 1)"
    />
    <div class="l-item-page">
      <div class="i-item-box" v-for="(item, index) in requestData" :key="index">
        <div class="base_msg">
          <p><span>学科：</span>{{ subjectName(item.subject_id) }}</p>
          <p>
            <span>实验：</span
            ><span v-for="(m, n) in item.exp" :key="n">{{ m.name }}</span>
          </p>
          <p>
            <span>年级：</span>
            <span v-for="(it, index) in item.grade" :key="index">{{
              $store.state.gradeArr[it]
            }}</span>
          </p>
          <p>
            <span class="fl">班级：</span>
            <span>{{ item.class_name }}</span>
            <span>{{ $store.state.groupTypeList[item.type - 1] || '' }}</span>
            <span>{{
              `第${item.week_time}周, ${$store.state.weekArr[item.weekend]}, ${
                $store.state.sectionArr[item.section]
              }(${item.classTime})`
            }}</span>
          </p>
        </div>
        <div v-for="(expItem, expIndex) in item.exp" :key="expIndex">
          <div v-for="(classItem, classIndex) in expItem.class_detail" :key="classIndex">
            <div class="exp-name">
              {{ expItem.name }}
            </div>
            <div class="contentBox">
              <div class="echartBox">
                <div class="echartDiv">
                  <chart-bar
                    v-if="seriesData1[index]"
                    :seriesData="seriesData1[index][expIndex]"
                    :xAxisData="seriesData1[index][expIndex]"
                    :type="5"
                    :width="154"
                    :height="154"
                  />
                </div>
                <!-- <div :id="'echartDiv1'+index+classIndex" class="echartDiv"/> -->
                <div class="centerText">{{ scoreStage(classItem.people * 100) }}</div>
              </div>
              <div class="progressBox">
                <ProgressColor
                  :title-text="'预习时间'"
                  :title="'(平均/总时间)'"
                  :percentage="parseInt((classItem.avgtime / classItem.maxtime) * 100)"
                  :content-text="`${Math.round(classItem.avgtime * 100) / 100}/${
                    Math.round(classItem.maxtime * 100) / 100
                  }`"
                />
              </div>
              <div class="progressBox">
                <ProgressColor
                  :title-text="'得分'"
                  :title="'(平均分/总分)'"
                  :percentage="parseInt((classItem.avgscore / classItem.maxscore) * 100)"
                  :content-text="`${Math.round(classItem.avgscore * 100) / 100}/${
                    Math.round(classItem.maxscore * 100) / 100
                  }`"
                />
              </div>
              <div class="progressBox">
                <ProgressColor
                  :title-text="'预习人数'"
                  :percentage="parseInt(classItem.people * 100)"
                  :content-text="
                    parseInt(classItem.all_people) + '/' + parseInt(classItem.student_num)
                  "
                />
              </div>
            </div>
          </div>
          <div
            v-if="
              !expItem.class_detail ||
              (Array.isArray(expItem.class_detail) && expItem.class_detail.length === 0)
            "
            class="value_none"
          >
            <div class="exp-name">
              {{ expItem.name }}
            </div>
            <div class="contentBox">
              <div class="echartBox">
                <div class="echartDiv">
                  <chart-bar
                    v-if="seriesData"
                    :seriesData="seriesData"
                    :xAxisData="seriesData"
                    :type="5"
                    :width="154"
                    :height="154"
                  />
                </div>
                <!-- <div :id="'echartDiv1'+index" class="echartDiv"/> -->
                <div class="centerText">暂无</div>
              </div>
              <div class="progressBox">
                <ProgressColor
                  :title-text="'预习时间'"
                  :percentage="0"
                  :content-text="0 + '/' + 0"
                />
              </div>
              <div class="progressBox">
                <ProgressColor
                  :title-text="'得分'"
                  :percentage="0"
                  :content-text="0 + '/' + 0"
                />
              </div>
              <div class="progressBox">
                <ProgressColor
                  :title-text="'预习人数'"
                  :percentage="0"
                  :content-text="0 + '/' + 0"
                />
              </div>
            </div>
          </div>
          <ItemTitle
            title-text="反馈详情"
            :is-show-child="true"
            :show-bg="false"
            @changeShow="expItem.showDetail = !expItem.showDetail"
          />
          <div v-show="expItem.showDetail" class="table_box_feedback">
            <div
              v-if="
                !expItem.student_detail ||
                (Array.isArray(expItem.student_detail) &&
                  expItem.student_detail.length === 0)
              "
              class="value_none_request"
            >
              反馈暂无数据
            </div>
            <table
              v-if="
                expItem.student_detail &&
                Array.isArray(expItem.student_detail) &&
                expItem.student_detail.length !== 0
              "
            >
              <tr class="thead">
                <td>学生姓名</td>
                <td>年级</td>
                <td>班级</td>
                <td>预习时间/s</td>
                <td>得分情况</td>
                <td>查看内容</td>
              </tr>
              <!-- <tr :class="studentIndex%2 === 0 ? '': 'table_bg'" v-for="(studentItem, studentIndex) in studentList(item,pageNumList[index])" :key="studentIndex"> -->
              <tr
                class="tr"
                :class="studentIndex % 2 === 0 ? '' : 'table_bg'"
                v-for="(studentItem, studentIndex) in expItem.student_detail"
                :key="studentIndex"
              >
                <td>{{ studentItem.swr_student }}</td>
                <td>{{ $store.state.gradeArr[studentItem.grade_id] }}</td>
                <td>{{ studentItem.classname }}</td>
                <td>{{ studentItem.length }}</td>
                <td>{{ studentItem.score }}</td>
                <td>{{ studentItem.xxxxx }}</td>
              </tr>
            </table>
          </div>
          <div v-show="expItem.showDetail" class="footer_msg">
            <!-- <span @click="changePage('-',index)"><i class="el-icon-arrow-left"/> 上一页</span>
            <span>{{ pageNumList[index]+1?pageNumList[index]+1:0 }}</span>
            <span @click="changePage('+',index)">下一页 <i class="el-icon-arrow-right"/></span> -->
          </div>
          <ItemTitle
            v-if="false"
            title-text="得分情况"
            :is-show-child="true"
            @changeShow="changeShow('得分情况')"
          />
          <div v-if="showFlagScore === '得分情况'" class="score-message">
            <div class="title">
              <span>题目</span>
              <span>答对人数</span>
            </div>
            <div class="content">
              <div
                class="score-item"
                v-for="(item, index3) in questionList"
                :key="index3"
              >
                <span>{{ item.question }}</span>
                <span>{{ item.number }}</span>
                <span>详情</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <el-button v-show="getMore" type="primary" :loading="loading" @click="getMoreData"
        >加载更多</el-button
      >
      <p v-show="!getMore">没有更多了~</p>
    </footer>
  </div>
</template>

<script>
import ItemTitle from '@components/ItemTitle'
import ProgressColor from '@components/ProgressColor'
import ChartBar from '@components/echarts/chartBar'
import TopFilter from '@components/top-filter.vue'

// import * as echarts from 'echarts'

import { previewData } from '@network/taskFeedback'

export default {
  name: 'BeforeFeedback',
  components: {
    ItemTitle,
    ProgressColor,
    ChartBar,
    TopFilter,
  },
  data() {
    return {
      searchObj: {},
      inputValue: '',
      showFlagScore: '',
      getMore: true,
      pageCount: 1,
      loading: false,
      // showFlagRequest: [],
      pageNumList: [],
      filedata: {
        token: this.$store.state.userMsg.token,
      },
      seriesData1: [],
      seriesData: [
        { value: 100, name: '' },
        { value: 0.1, name: '空' },
        { value: 0, name: '' },
        { value: 0.1, name: '空' },
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
      requestData: [],
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
    subjectName() {
      return (val) => {
        let name = ''
        this.$store.state.subjectArr.forEach((e) => {
          if (val === e.id) {
            name = e.name
          }
        })
        return name
      }
    },
    scoreStage() {
      return function (val) {
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
    userMsg() {
      return this.$store.getters.getUserMsg
    },
  },
  methods: {
    getData(obj, page) {
      this.searchObj = obj
      this.pageCount = page
      const message = {
        name: this.inputValue,
        page: this.pageCount,
        ...this.searchObj,
      }
      previewData(message)
        .then((res) => {
          this.getMore = true
          if (res.data.length < this.pageCount * 5) {
            this.getMore = false
          }
          this.requestData = res.data.map((e) => {
            return {
              ...e,
              exp: e.exp.map((m) => {
                return {
                  ...m,
                  showDetail: false,
                }
              }),
            }
          })
          // this.showFlagRequest.length = this.requestData.length
        })
        .then(() => {
          this.drawPie()
        })
    },
    getMoreData() {
      this.getData(this.searchObj, this.pageCount + 1)
    },
    drawPie() {
      this.seriesData1 = []
      if (this.requestData) {
        this.requestData.map((item) => {
          if (item.exp) {
            const arr = []
            item.exp.forEach((e) => {
              if (e.class_detail) {
                // 目前 item.class_detail是一个长度为1的数组，是否加forEach无影响
                e.class_detail.forEach((classItem) => {
                  arr.push([
                    { value: (100 - classItem.people * 100).toFixed(1), name: '' },
                    { value: 0.1, name: '空' },
                    {
                      value: (classItem.people * 100).toFixed(1),
                      name: this.scoreStage(classItem.people * 100),
                    },
                    { value: 0.1, name: '空' },
                  ])
                })
              } else {
                arr.push([
                  { value: 0, name: '' },
                  { value: 0.1, name: '空' },
                  { value: 100, name: '' },
                  { value: 0.1, name: '空' },
                ])
              }
            })
            this.seriesData1.push(arr)
          }
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 32px;
  width: 100%;
  box-sizing: border-box;
  .title {
    text-align: left;
  }
}
.selectInput {
  width: 276px;
  height: 30px;
  float: right;
  margin-right: 28px;
  & input {
    padding: 0 12px 0 12px;
    width: 236px;
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
.l-item-page {
  width: 100%;
  .i-item-box {
    padding-bottom: 4px;
    border-bottom: #e8e8e9 10px solid;
    background: #ffffff;
  }
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
  .score-message {
    width: 100%;
    margin: 10px 0;
    padding: 0 36px;
    text-align: left;
    & > .title {
      margin: 16px 0;
      height: 41px;
      & > span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #f3f3f3;
        color: #05c65d;
        border: 1px solid #05c65d;
        opacity: 1;
      }
      & > span:nth-of-type(1) {
        width: 89px;
      }
      & > span:nth-of-type(2) {
        width: 126px;
        margin-left: 961px;
      }
    }
    .score-item {
      margin: 6px 0;
      display: flex;
      justify-content: flex-start;
      & > span {
        height: 21px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        opacity: 1;
      }
      & > span:nth-of-type(1) {
        width: 800px;
        margin-right: 310px;
      }
      & > span:nth-of-type(2) {
        width: 126px;
        margin-right: 40px;
      }
      & > span:nth-of-type(3) {
        width: 60px;
        color: #05c65d;
        cursor: pointer;
      }
    }
  }
  .value_none {
    // margin: 6px 2%;
    // width: 96%;
    min-height: 50px;
    // line-height: 50px;
    // box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
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
  }
  .value_none_request {
    width: 100%;
    height: 98%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  }
}

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

.base_msg {
  box-sizing: border-box;
  padding: 24px 42px;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
}
.base_msg p {
  font-size: 16px;
  text-align: left;
  color: #626572;
}
.base_msg p span {
  padding-right: 32px;
}
.class_item {
  display: inline-block;
  img {
    float: left;
    margin-top: 1px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  span {
    padding-left: 20px;
    cursor: pointer;
  }
}
.body_msg {
  width: 100%;
  background-color: #fff;
  min-height: 360px;
  .grade_box {
    // float: left;
    position: relative;
    padding: 20px 0 20px 2.5%;
    width: 70%;
    height: 166px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    & .grade-item {
      width: 21%;
      height: 166px;
      & :nth-child(1) {
        height: 50px;
        line-height: 50px;
        width: 100%;
        background-color: #dcece3;
        font-size: 16px;
        color: #333;
        font-weight: bold;
        position: relative;
        img {
          position: absolute;
          right: 20px;
          top: 13px;
          width: 24px;
          height: 24px;
        }
      }
      & > :nth-child(2) {
        width: 100%;
        height: 70px;
        line-height: 70px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        color: #626572;
        font-size: 16px;
      }
      & :nth-child(3) {
        width: 100%;
        height: 50px;
        line-height: 50px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        background: #dcece3;
        font-size: 16px;
        color: #05c65d;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        img {
          // position: absolute;
          // left: 30%;
          // top: 50%;
          width: 20px;
          height: 20px;
          margin: 0 6px 0 0;
          // transform: translate(-50%, -50%);
        }
      }
    }
    & > .echartBox {
      position: absolute;
      top: 50%;
      right: -210px;
      width: 154px;
      height: 154px;
      transform: translate(0, -50%);
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
        position: relative;
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
        img {
          position: absolute;
          top: 0px;
          right: 0px;
          padding: 10px;
          width: 20px;
          height: 20px;
          cursor: pointer;
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
    padding-top: 4vh;
    box-sizing: border-box;
    background: rgba(132, 132, 132, 0);
    ::v-deep .el-carousel__mask {
      height: 0;
      background: rgba(0, 0, 0, 0);
    }
  }
  .el-carousel__item > img {
    // width: 586px;
    height: 92vh;
    // background-size: contain;
  }
}

.table_box_feedback {
  margin-top: 30px;
  width: 100%;
  max-height: 620px;
  padding: 0 64px 0 42px;
  box-sizing: border-box;
  overflow-y: scroll;
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
    }
    .tr {
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      display: flex;
      color: #626572;
      background-color: #f3f3f3;
      & td {
        flex: 1;
      }
    }
    .table_bg {
      background-color: #ececec;
    }
  }
}
.footer_msg {
  height: 100px;
  line-height: 100px;
  background-color: #fff;
  user-select: none;
  span {
    cursor: pointer;
    margin: 0 30px;
    color: #848484;
  }
}
footer {
  margin-bottom: 6px;
  .el-button {
    width: 200px;
  }
}
</style>
