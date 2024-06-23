<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter
      :options="['semester', 'subject_id', 'grade', 'week', 'teacher_id']"
      @change="getData"
    />
    <div class="content-box">
      <div class="content">
        <div class="title">
          <img src="@images/dataStatistics/icon1.png" alt="" />
          <div class="message-box">
            <div class="text-box">
              <p>
                <span class="has-bg yellow"> 学生课中实验操作步骤图 </span>
                <span class="big-size yellow">
                  {{ reportClassPicData.total1 }}
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg yellow"> 本学期累计 </span>
                <span class="big-size yellow">
                  {{ reportClassPicData.total1 }}
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg yellow"> {{ weeknow }}累计 </span>
                <span class="big-size yellow">
                  {{ reportClassPicData.total2 }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="chart-box">
          <p>学生课中实验操作步骤图</p>
          <div class="chart">
            <chart-bar
              :seriesData="seriesData1"
              :xAxisData="reportClassPicData.list || []"
            />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <img src="@images/dataStatistics/icon2.png" alt="" />
          <div class="message-box">
            <div class="text-box">
              <p>
                <span class="has-bg green"> 学生课中实验操作步骤图平均值 </span>
              </p>
              <p>
                <span> 实际/开课数&nbsp; </span>
                <span class="big-size green">
                  {{ reportClassCompletionPicData.practical }}/{{
                    reportClassCompletionPicData.expect
                  }}≈{{ reportClassCompletionPicData.semesterlv }}
                  <i style="font-size: 18px">(平均每节课步骤图数量)</i>
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg green"> 本学期累计 </span>
              </p>
              <p>
                <span> 实际/开课数&nbsp; </span>
                <span class="big-size green">
                  {{ reportClassCompletionPicData.practical }}/{{
                    reportClassCompletionPicData.expect
                  }}≈{{ reportClassCompletionPicData.semesterlv }}
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg green"> {{ weeknow }}累计 </span>
              </p>
              <p>
                <span> 实际/开课数&nbsp; </span>
                <span class="big-size green">
                  {{ reportClassCompletionPicData.weekpractical }}/{{
                    reportClassCompletionPicData.weekexpect
                  }}≈{{ reportClassCompletionPicData.weeklv }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="chart-box">
          <p>学生课中实验操作步骤图平均值</p>
          <div class="chart">
            <chart-bar
              :seriesData="seriesData2"
              :xAxisData="reportClassCompletionPicData.list || []"
            />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <img src="@images/dataStatistics/icon3.png" alt="" />
          <div class="message-box">
            <div class="text-box">
              <p>
                <span class="has-bg blue"> 学生课中实验操作步骤图反馈 </span>
              </p>
              <p>
                <span class="flex1"> 五星 </span>
                <span class="flex1"> 四星 </span>
                <span class="flex1"> 三星 </span>
                <span class="flex1"> 二星 </span>
                <span class="flex1"> 一星 </span>
              </p>
              <p>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterOne }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterTwo }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterThree }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterFour }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterFive }}
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg blue"> 本学期累计 </span>
              </p>
              <p>
                <span class="flex1"> 五星 </span>
                <span class="flex1"> 四星 </span>
                <span class="flex1"> 三星 </span>
                <span class="flex1"> 二星 </span>
                <span class="flex1"> 一星 </span>
              </p>
              <p>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterOne }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterTwo }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterThree }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterFour }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.semesterFive }}
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg blue"> {{ weeknow }}累计 </span>
              </p>
              <p>
                <span class="flex1"> 五星 </span>
                <span class="flex1"> 四星 </span>
                <span class="flex1"> 三星 </span>
                <span class="flex1"> 二星 </span>
                <span class="flex1"> 一星 </span>
              </p>
              <p>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.weekOne }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.weekTwo }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.weekThree }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.weekFour }}
                </span>
                <span class="flex1 big-size blue">
                  {{ reportClassBackPicData.weekFive }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="chart-box">
          <p>学生课中实验操作步骤图反馈</p>
          <div class="chart">
            <chart-bar
              :seriesData="seriesData3"
              :xAxisData="reportClassBackPicData.classList || []"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reportClassPic,
  reportClassCompletionPic,
  reportClassBackPic,
} from '@network/infomationStatistical'
import ChartBar from '@components/echarts/chartBar.vue'
import TopFilter from '@components/top-filter.vue'
export default {
  name: '',
  components: {
    ChartBar,
    TopFilter,
  },
  data() {
    return {
      weeknow: '',
      year: '',
      reportClassPicData: {},
      reportClassCompletionPicData: {},
      reportClassBackPicData: {},
      seriesData1: [],
      seriesData2: [],
      seriesData3: [],
    }
  },
  created() {
    this.weeknow = `第${this.$store.state.schoolDate.week}周`
    this.year = this.$store.state.schoolDate.year
  },
  mounted() {},
  methods: {
    getData(obj) {
      reportClassPic(obj).then((result) => {
        this.reportClassPicData = result.data
        this.seriesData1 = [
          {
            name: '本学期',
            type: 'bar',
            data: result.data.data1,
            barWidth: 20,
            itemStyle: {
              color: '#EE9A59',
              borderRadius: 10,
            },
          },
          {
            name: this.weeknow,
            type: 'bar',
            data: result.data.data2,
            barWidth: 20,
            itemStyle: {
              color: '#30B930',
              borderRadius: 10,
            },
          },
        ]
      })
      reportClassCompletionPic(obj).then((result) => {
        this.reportClassCompletionPicData = result.data
        this.seriesData2 = [
          {
            name: '本学期',
            type: 'bar',
            data: result.data.list1,
            barWidth: 20,
            itemStyle: {
              color: '#05C65D',
              borderRadius: 10,
            },
          },
          {
            name: this.weeknow,
            type: 'bar',
            data: result.data.list2,
            barWidth: 20,
            itemStyle: {
              color: '#FF7777',
              borderRadius: 10,
            },
          },
        ]
      })
      reportClassBackPic(obj).then((result) => {
        this.reportClassBackPicData = result.data
        this.seriesData3 = [
          {
            name: '一星',
            type: 'bar',
            stack: 'Week',
            data: result.data.week.one,
            barWidth: 20,
            itemStyle: {
              color: '#5FAFE4',
            },
          },
          {
            name: '二星',
            type: 'bar',
            stack: 'Week',
            data: result.data.week.two,
            barWidth: 20,
            itemStyle: {
              color: '#32D848',
            },
          },
          {
            name: '三星',
            type: 'bar',
            stack: 'Week',
            data: result.data.week.three,
            barWidth: 20,
            itemStyle: {
              color: '#EEA359',
            },
          },
          {
            name: '四星',
            type: 'bar',
            stack: 'Week',
            data: result.data.week.four,
            barWidth: 20,
            itemStyle: {
              color: '#FF7777',
            },
          },
          {
            name: '五星',
            type: 'bar',
            stack: 'Week',
            data: result.data.week.five,
            barWidth: 20,
            itemStyle: {
              color: '#D27FFB',
            },
          },
          {
            name: '一星',
            type: 'bar',
            stack: 'Semester',
            data: result.data.semester.one,
            barWidth: 20,
            itemStyle: {
              color: '#5FAFE4',
            },
          },
          {
            name: '二星',
            type: 'bar',
            stack: 'Semester',
            data: result.data.semester.two,
            barWidth: 20,
            itemStyle: {
              color: '#32D848',
            },
          },
          {
            name: '三星',
            type: 'bar',
            stack: 'Semester',
            data: result.data.semester.three,
            barWidth: 20,
            itemStyle: {
              color: '#EEA359',
            },
          },
          {
            name: '四星',
            type: 'bar',
            stack: 'Semester',
            data: result.data.semester.four,
            barWidth: 20,
            itemStyle: {
              color: '#FF7777',
            },
          },
          {
            name: '五星',
            type: 'bar',
            stack: 'Semester',
            data: result.data.semester.five,
            barWidth: 20,
            itemStyle: {
              color: '#D27FFB',
            },
          },
        ]
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  padding: 20px 32px;
  width: 100%;
  box-sizing: border-box;
  .title {
    text-align: left;
  }
}
.content-box {
  width: 100%;
  .content {
    margin-bottom: 16px;
    width: 100%;
    .title {
      margin-bottom: 2px;
      padding: 30px 10px;
      background: #ffffff;
      display: flex;
      border-radius: 5px;
      img {
        margin: 0 10px;
        width: 40px;
        height: 40px;
      }
      .message-box {
        width: calc(100% - 60px);
        display: flex;
        justify-content: space-between;
        // align-items: center;
        .text-box {
          flex: 1;
          & > p {
            margin-bottom: 6px;
            display: flex;
            align-items: center;
          }
        }
        .has-bg {
          margin-right: 20px;
          display: inline-block;
          padding: 7px 20px;
          font-size: 20px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          border-radius: 10px;
        }
        .flex1 {
          width: 18%;
          font-size: 20px;
        }
        .big-size {
          font-size: 30px;
          font-weight: 400;
          background: none !important;
        }
        .yellow {
          color: #ee9a59;
          background: #ffe7d5;
        }
        .green {
          color: #05c65d;
          background: #dcece3;
        }
        .blue {
          color: #5fafe4;
          background: #e1f3ff;
        }
      }
    }
    .chart-box {
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      background: #ffffff;
      p {
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        width: 20px;
      }
      .chart {
        width: calc(100% - 80px);
      }
    }
  }

  .left {
    text-align: left;
  }
  .red {
    color: red !important;
  }
  .green {
    color: green !important;
  }
  .increment {
    margin: 0 6px;
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 8px solid green;
  }
  .decrement {
    margin: 0 6px;
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid red;
    border-bottom: 0;
  }
}
</style>
