<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter
      :options="['semester', 'subject_id', 'grade', 'week_time', 'teacher_id']"
      @change="getData"
    />
    <div class="content-box">
      <div class="content">
        <div class="title">
          <img src="@images/dataStatistics/icon1.png" alt="" />
          <div class="message-box">
            <div class="text-box">
              <p>
                <span class="has-bg yellow"> 学生课前预习次数 </span>
                <span class="big-size yellow">
                  {{ beforeClassData.total1 }}
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg yellow"> 本学期累计 </span>
                <span class="big-size yellow">
                  {{ beforeClassData.total1 }}
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg yellow"> {{ weeknow }}累计 </span>
                <span class="big-size yellow">
                  {{ beforeClassData.total2 }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="chart-box">
          <p>学生课前预习次数</p>
          <div class="chart">
            <chart-bar
              :seriesData="seriesData1"
              :xAxisData="beforeClassData.list || []"
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
                <span class="has-bg green"> 学生课前预习次数完成率 </span>
              </p>
              <p>
                <span> 实际/理论&nbsp; </span>
                <span class="big-size green">
                  {{ beforeClassCompletionData.practical }}/{{
                    beforeClassCompletionData.expect
                  }}≈{{ beforeClassCompletionData.semesterlv }}%
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg green"> 本学期累计 </span>
              </p>
              <p>
                <span> 实际/理论&nbsp; </span>
                <span class="big-size green">
                  {{ beforeClassCompletionData.practical }}/{{
                    beforeClassCompletionData.expect
                  }}≈{{ beforeClassCompletionData.semesterlv }}%
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg green"> {{ weeknow }}累计 </span>
              </p>
              <p>
                <span> 实际/理论&nbsp; </span>
                <span class="big-size green">
                  {{ beforeClassCompletionData.weekpractical }}/{{
                    beforeClassCompletionData.weekexpect
                  }}≈{{ beforeClassCompletionData.weeklv }}%
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="chart-box">
          <p>学生课前预习次数完成率</p>
          <div class="chart">
            <chart-bar
              :seriesData="seriesData2"
              :xAxisData="beforeClassCompletionData.listClass || []"
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
                <span class="has-bg blue"> 学生课前预习反馈 </span>
              </p>
              <p>
                <span class="flex1"> 等级A </span>
                <span class="flex1"> 等级B </span>
                <span class="flex1"> 等级C </span>
                <span class="flex1"> 等级D </span>
              </p>
              <p>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.semesterA }}
                </span>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.semesterB }}
                </span>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.semesterC }}
                </span>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.semesterD }}
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg blue"> 本学期累计 </span>
              </p>
              <p>
                <span class="flex1"> 等级A </span>
                <span class="flex1"> 等级B </span>
                <span class="flex1"> 等级C </span>
                <span class="flex1"> 等级D </span>
              </p>
              <p>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.semesterA }}
                </span>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.semesterB }}
                </span>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.semesterC }}
                </span>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.semesterD }}
                </span>
              </p>
            </div>
            <div class="text-box">
              <p>
                <span class="has-bg blue"> {{ weeknow }}累计 </span>
              </p>
              <p>
                <span class="flex1"> 等级A </span>
                <span class="flex1"> 等级B </span>
                <span class="flex1"> 等级C </span>
                <span class="flex1"> 等级D </span>
              </p>
              <p>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.weekA }}
                </span>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.weekB }}
                </span>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.weekC }}
                </span>
                <span class="flex1 big-size blue">
                  {{ beforeClassBackData.weekD }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="chart-box">
          <p>学生课前预习反馈</p>
          <div class="chart">
            <chart-bar
              :seriesData="seriesData3"
              :xAxisData="beforeClassBackData.classList || []"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  beforeClass,
  beforeClassCompletion,
  beforeClassBack,
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
      beforeClassData: {},
      beforeClassCompletionData: {},
      beforeClassBackData: {},
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
      beforeClass(obj).then((result) => {
        this.beforeClassData = result.data
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
      beforeClassCompletion(obj).then((result) => {
        this.beforeClassCompletionData = result.data
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
      beforeClassBack(obj).then((result) => {
        this.beforeClassBackData = result.data
        this.seriesData3 = [
          {
            name: '等级A',
            type: 'bar',
            stack: 'Week',
            data: result.data.week.A,
            barWidth: 20,
            itemStyle: {
              color: '#5FAFE4',
            },
          },
          {
            name: '等级B',
            type: 'bar',
            stack: 'Week',
            data: result.data.week.B,
            barWidth: 20,
            itemStyle: {
              color: '#32D848',
            },
          },
          {
            name: '等级C',
            type: 'bar',
            stack: 'Week',
            data: result.data.week.C,
            barWidth: 20,
            itemStyle: {
              color: '#EEA359',
            },
          },
          {
            name: '等级D',
            type: 'bar',
            stack: 'Week',
            data: result.data.week.D,
            barWidth: 20,
            itemStyle: {
              color: '#FF7777',
            },
          },
          {
            name: '等级A',
            type: 'bar',
            stack: 'Semester',
            data: result.data.semester.A,
            barWidth: 20,
            itemStyle: {
              color: '#5FAFE4',
            },
          },
          {
            name: '等级B',
            type: 'bar',
            stack: 'Semester',
            data: result.data.semester.B,
            barWidth: 20,
            itemStyle: {
              color: '#32D848',
            },
          },
          {
            name: '等级C',
            type: 'bar',
            stack: 'Semester',
            data: result.data.semester.C,
            barWidth: 20,
            itemStyle: {
              color: '#EEA359',
            },
          },
          {
            name: '等级D',
            type: 'bar',
            stack: 'Semester',
            data: result.data.semester.D,
            barWidth: 20,
            itemStyle: {
              color: '#FF7777',
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
          padding: 0 20px;
          height: 40px;
          line-height: 40px;
          font-size: 20px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          border-radius: 10px;
        }
        .flex1 {
          width: 22%;
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
