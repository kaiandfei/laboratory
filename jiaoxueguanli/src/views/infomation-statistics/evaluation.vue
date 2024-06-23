<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter
      :options="['time_ids', 'semester', 'subject_id', 'grade', 'teacher_id']"
      @change="getData"
    />
    <div class="content-box">
      <div class="content">
        <div class="title">
          <img src="@images/dataStatistics/icon1.png" alt="" />
          <div class="message-box">
            <div class="text-box">
              <p>
                <span class="has-bg yellow"> 收到的评价累计 </span>
                <span class="big-size yellow">
                  {{ requestData.allcount.reduce((pre, cur) => pre + cur) }}
                </span>
              </p>
              <p>
                <span class="flex1"> 五星 </span>
                <span class="flex1"> 四星 </span>
                <span class="flex1"> 三星 </span>
                <span class="flex1"> 二星 </span>
                <span class="flex1"> 一星 </span>
              </p>
              <p>
                <span
                  v-for="(item, index) in requestData.allcount"
                  :key="index"
                  class="flex1 big-size yellow"
                >
                  {{ item }}
                </span>
              </p>
            </div>
            <!-- <div class="text-box">
              <p>
                <span class="has-bg yellow"> 本学期累计 </span>
                <span class="big-size yellow">
                  {{ requestData.yearcount.reduce((pre, cur) => pre + cur) }}
                </span>
              </p>
              <p>
                <span class="flex1"> 五星 </span>
                <span class="flex1"> 四星 </span>
                <span class="flex1"> 三星 </span>
                <span class="flex1"> 二星 </span>
                <span class="flex1"> 一星 </span>
              </p>
              <p>
                <span
                  v-for="(item, index) in requestData.yearcount"
                  :key="index"
                  class="flex1 big-size yellow"
                >
                  {{ item }}
                </span>
              </p>
            </div> -->
            <div class="text-box">
              <p>
                <span class="has-bg yellow"> {{ weeknow }}累计 </span>
                <span class="big-size yellow">
                  {{ requestData.weekcount.reduce((pre, cur) => pre + cur) }}
                </span>
              </p>
              <p>
                <span class="flex1"> 五星 </span>
                <span class="flex1"> 四星 </span>
                <span class="flex1"> 三星 </span>
                <span class="flex1"> 二星 </span>
                <span class="flex1"> 一星 </span>
              </p>
              <p>
                <span
                  v-for="(item, index) in requestData.weekcount"
                  :key="index"
                  class="flex1 big-size yellow"
                >
                  {{ item }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="chart-box">
          <p>学生课前预习反馈</p>
          <div class="chart">
            <chart-bar :seriesData="seriesData" :xAxisData="xAxisData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { evaluation } from '@network/infomationStatistical'
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
      requestData: {
        allcount: [0, 0, 0, 0, 0],
        weekcount: [0, 0, 0, 0, 0],
        // yearcount: [0, 0, 0, 0, 0],
      },
      xAxisData: ['五星', '四星', '三星', '二星', '一星'],
      seriesData: [],
    }
  },
  created() {
    this.weeknow = `第${this.$store.state.schoolDate.week}周`
    this.year = this.$store.state.schoolDate.year
  },
  mounted() {},
  methods: {
    getData(obj) {
      evaluation(obj).then((res) => {
        this.requestData = res.data
        for (const item in this.requestData) {
          this.requestData[item].reverse()
        }
        this.seriesData = [
          {
            name: '累计',
            type: 'bar',
            data: this.requestData.allcount,
            barWidth: 20,
            itemStyle: {
              color: '#5FAFE4',
            },
          },
          // {
          //   name: '学期',
          //   type: 'bar',
          //   data: this.requestData.yearcount,
          //   barWidth: 20,
          //   itemStyle: {
          //     color: '#32D848',
          //   },
          // },
          {
            name: this.weeknow,
            type: 'bar',
            data: this.requestData.weekcount,
            barWidth: 20,
            itemStyle: {
              color: '#EEA359',
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
        // justify-content: space-between;
        // align-items: center;
        .text-box {
          width: 33%;
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
