<template>
  <div>
    <div class="content-box">
      <div class="content">
        <div class="title-box">
          <img src="@images/dataStatistics/today-need.png" alt="" />
          <div>
            <p>今日需开课</p>
            <p>{{ needClass }}</p>
          </div>
        </div>
        <div class="chart-box">
          <p>今日需开课详情</p>
          <chart-bar :seriesData="seriesData11" :xAxisData="xAxisData11" />
        </div>
      </div>
      <div class="content">
        <div class="title-box">
          <img src="@images/dataStatistics/today.png" alt="" />
          <div>
            <p>今日已开课</p>
            <p>{{ haveClass }}</p>
          </div>
        </div>
        <div class="chart-box">
          <p>今日已开课详情</p>
          <chart-bar :seriesData="seriesData12" :xAxisData="xAxisData12" />
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="content class-num">
        <div class="title-box">
          <div>
            <p>实验开课率<span>50%</span></p>
          </div>
        </div>
        <div class="text-box">
          <p>实验开课数量</p>
          <p>第二周累计/本学期累计/本学期应开课</p>
          <p>5 / 30 / 60</p>
        </div>
      </div>
      <div class="content class-num">
        <div class="chart-box">
          <chart-bar
            :seriesData="seriesData21"
            :xAxisData="xAxisData21"
            :height="240"
            :xName="'周次'"
            :yName="'实验频次'"
          />
        </div>
      </div>
      <div class="content">
        <div class="chart-box">
          <chart-bar :seriesData="seriesData31" :xAxisData="xAxisData31" :type="2" />
        </div>
      </div>
      <div v-if="false" class="content">
        <div class="chart-box">
          <p class="left">我的实验资源情况</p>
          <div class="data-box">
            <div>
              <p>我的资源累计总量</p>
              <p>1632</p>
              <p>收获点赞量累计：156665776</p>
            </div>
            <div>
              <p>本学期新增累计</p>
              <p>102</p>
              <p>20% 环比上周</p>
            </div>
            <div>
              <p>第二周新增</p>
              <p>22</p>
              <p>20% 环比上周</p>
            </div>
          </div>
          <chart-bar
            :seriesData="seriesData33"
            :xAxisData="xAxisData33"
            :type="3"
            :height="118"
          />
        </div>
      </div>
    </div>
    <div class="content-box">
      <!-- <div class="content">
        <div class="chart-box">
          <chart-bar :seriesData="seriesData31" :xAxisData="xAxisData31" :type="2"/>
        </div>
      </div> -->
      <div v-if="false" class="content">
        <div class="chart-box">
          <p>仪器出入库</p>
          <chart-bar :seriesData="seriesData32" :xAxisData="xAxisData32" :type="2" />
        </div>
      </div>
      <div v-if="false" class="content">
        <div class="chart-box">
          <p class="left">仪器使用情况</p>
          <chart-bar
            :seriesData="pieData"
            :xAxisData="xAxisData41"
            :type="4"
            :height="240"
          />
        </div>
      </div>
    </div>
    <div v-if="false" class="content-box">
      <div class="content-62">
        <div class="chart-box">
          <p class="left">仪器配备达标情况</p>
          <chart-bar
            :seriesData="seriesData41"
            :xAxisData="xAxisData41"
            :gridX="70"
            :height="240"
          />
        </div>
        <div class="pie_div2">
          <ul>
            <li v-for="(item, index) in xAxisData41" :key="index">
              <p>
                <span>{{ item }}</span>
                <span>{{ '数量：' + seriesData41[0].data[index] }}</span>
                <span>{{ '达标率：' + seriesData41[0].dataRate[index] + '%' }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="content">
        <div class="chart-box">
          <p class="left">仪器使用情况</p>
          <graph :seriesData="graphData" :xAxisData="xAxisData41" />
        </div>
      </div>
    </div>
    <!-- <div class="auto_l">
      <div class="equipment">
        <p class="title">装备情况</p>
        <div class="pie_div" ref="equ_up"/>
        <div class="pie_div" ref="equ_value"/>
        <div class="pie_div" ref="equ_pie"/>
      </div>
      <div class="equipment1">
        <div class="pie_div1" ref="equ_bar"/>
        <div class="pie_div2">
          <ul>
            <li v-for="(item, index) in base1.barData3.x" :key="index">
              <p>
                <span>{{item}}</span>
                <span>{{'数量：' + base1.barData3.num[index]}}</span>
                <span>{{'达标率：' + base1.barData3.y[index] + '%'}}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import ChartBar from '../../../components/echarts/chartBar.vue'
import Graph from '../../../components/echarts/graph.vue'
import { todayClass, laboratoryClass } from '@network/statisticalAdmin'
export default {
  components: {
    ChartBar,
    Graph,
  },
  props: {
    screenMessage: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  name: '',
  data() {
    return {
      seriesData11: [],
      xAxisData11: [],
      seriesData12: [],
      xAxisData12: [],
      needClass: 0,
      haveClass: 0,
      seriesData21: [],
      xAxisData21: ['物理实验室1', '物理实验室2', '物理实验室3'],
      seriesData31: [
        {
          name: '本学期',
          type: 'bar',
          data: [30, 40, 44],
          barWidth: 20,
        },
        {
          name: '本周',
          type: 'bar',
          data: [5, 6, 3],
          barWidth: 20,
        },
      ],
      xAxisData31: ['物理实验室1', '物理实验室2', '物理实验室3'],
      seriesData32: [
        {
          name: '本学期',
          type: 'bar',
          data: [430, 400],
          barWidth: 20,
        },
        {
          name: '本周',
          type: 'bar',
          data: [61, 30],
          barWidth: 20,
        },
      ],
      xAxisData32: ['仪器出库', '仪器入库'],
      seriesData33: [
        {
          name: '第一个',
          type: 'line',
          stack: 'Total',
          smooth: true,
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [4, 3, 2, 3],
          barWidth: 20,
        },
        {
          name: '第二个',
          type: 'line',
          stack: 'Total',
          smooth: true,
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [3, 2, 1, 2],
          barWidth: 20,
        },
      ],
      xAxisData33: ['1', '2', '3', '4'],
      pieData: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '空闲' },
            { value: 735, name: '在用' },
            { value: 580, name: '维修' },
            { value: 484, name: '报废' },
            { value: 300, name: '其他' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
      seriesData41: [
        {
          // name: '2021',
          type: 'bar',
          data: [194567, 244584, 212556, 94584],
          dataRate: [60, 80, 70, 30],
          barWidth: 20,
        },
      ],
      xAxisData41: ['通用设备', '教学专用设备', '非教学专用设备', '其他'],
      graphData: [
        {
          name: '报废总量\n523456',
          value: 523456,
          x: 0,
          y: 10,
          itemStyle: {
            color: 'rgb(255, 172, 172)',
          },
        },
        {
          name: '报废价值\n52345',
          value: 52345,
          x: 20,
          y: 15,
          itemStyle: {
            color: 'rgb(235, 174, 243)',
          },
        },
        {
          name: '维修总量\n523456',
          value: 523456,
          x: 50,
          y: 30,
          itemStyle: {
            color: 'rgb(152, 219, 144)',
          },
        },
        {
          name: '维修价值\n52345',
          value: 52345,
          x: 40,
          y: 45,
          itemStyle: {
            color: 'rgb(248, 244, 183)',
          },
        },
        {
          name: '借出总量\n523456',
          value: 523456,
          x: 90,
          y: 40,
          itemStyle: {
            color: 'rgb(140, 142, 255)',
          },
        },
        {
          name: '借出价值\n52345',
          value: 52345,
          x: 80,
          y: 25,
          itemStyle: {
            color: 'rgb(140, 238, 255)',
          },
        },
      ],
    }
  },
  watch: {
    screenMessage: {
      handler() {
        this.classToday()
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.classToday()
  },
  methods: {
    classToday() {
      todayClass({ type: 1, ...this.screenMessage }).then((res) => {
        this.xAxisData11 = res.data.class
        this.seriesData11 = [
          {
            name: '本学年',
            type: 'bar',
            data: res.data.sum,
            barWidth: 20,
          },
        ]
        this.needClass = res.data.all
      })
      todayClass({ type: 2, ...this.screenMessage }).then((res) => {
        this.xAxisData12 = res.data.class
        this.seriesData12 = [
          {
            name: '本学年',
            type: 'bar',
            data: res.data.sum,
            barWidth: 20,
          },
        ]
        this.haveClass = res.data.all
      })
      laboratoryClass(this.screenMessage).then((res) => {
        this.xAxisData21 = res.data.laboratory
        this.seriesData21 = [
          {
            name: '本学期预约次数',
            type: 'bar',
            data: res.data.semester,
            barWidth: 20,
          },
          {
            name: '本周预约次数',
            type: 'bar',
            data: res.data.week,
            barWidth: 20,
          },
        ]
        this.haveClass = res.data.all
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.content-box {
  display: flex;
  margin-bottom: 20px;
  .content {
    border: 1px solid #c9c7c7;
    width: 30%;
    margin: 0 30px 0 0;
    .title-box {
      display: flex;
      align-items: center;
      background: #e6f6fe;
      height: 80px;
      img {
        width: 60px;
        height: 60px;
        margin: 0 10px 0 10px;
      }
      & > div {
        margin-left: 10px;
        line-height: 30px;
        text-align: left;
        font-size: 18px;
        & > p:nth-of-type(1) {
          color: #848484;
          span {
            margin-left: 10px;
            color: #000;
          }
        }
        & > p:nth-of-type(2) {
          .margin-l {
            margin-left: 20px;
          }
          span {
            margin-right: 20px;
          }
        }
      }
    }
    .chart-box {
      width: 100%;
      p {
        color: #848484;
      }
      .top-text {
        display: flex;
        & > div {
          p {
            min-width: 200px;
          }
          margin: 10px 10% 10px 10px;
          .black {
            font-size: 14px;
            color: #000;
          }
        }
      }
      .left {
        margin: 10px 0 0 8px;
      }
      .data-box {
        text-align: left;
        & > div {
          display: inline-block;
          margin: 6px 20px 10px 12px;
          & > p:nth-of-type(2) {
            line-height: 40px;
            font-size: 18px;
            color: #000;
          }
        }
      }
    }
    .text-box {
      padding: 0 0 0 10px;
      text-align: left;
      font-size: 18px;
      line-height: 50px;
      & > p:nth-of-type(1) {
        color: #848484;
        font-size: 24px;
      }
      & > p:nth-of-type(2) {
        color: #848484;
      }
    }
  }
  .content-62 {
    border: 1px solid #c9c7c7;
    width: 62%;
    margin: 0 30px 0 0;
    .chart-box {
      float: left;
      width: 500px;
      p {
        color: #848484;
      }
      .top-text {
        display: flex;
        & > div {
          p {
            min-width: 200px;
          }
          margin: 10px 10% 10px 10px;
          .black {
            font-size: 14px;
            color: #000;
          }
        }
      }
      .left {
        margin: 10px 0 0 8px;
      }
      .data-box {
        text-align: left;
        & > div {
          display: inline-block;
          margin: 6px 20px 10px 12px;
          & > p:nth-of-type(2) {
            line-height: 40px;
            font-size: 18px;
            color: #000;
          }
        }
      }
    }
  }
  .content-l {
    width: 63%;
    p {
      padding: 6px;
      text-align: left;
      font-size: 18px;
      font-weight: 700;
      width: 99%;
      border-bottom: 1px solid #c9c7c7;
    }
    table {
      width: 98%;
      margin: 0 1% 10px;
      line-height: 40px;
      thead {
        tr {
          display: flex;
          color: #848484;
          border-bottom: 1px solid #c9c7c7;
          td {
            flex: 1;
          }
          td:nth-of-type(4) {
            flex: 1.2;
          }
          td:nth-of-type(5) {
            flex: 1.2;
          }
          td:nth-of-type(7) {
            flex: 1.2;
          }
        }
      }
      tbody {
        tr {
          display: flex;
          border-bottom: 1px solid #c9c7c7;
          td {
            flex: 1;
          }
          td:nth-of-type(4) {
            flex: 1.2;
          }
          td:nth-of-type(5) {
            flex: 1.2;
          }
          td:nth-of-type(7) {
            flex: 1.2;
          }
        }
      }
    }
  }
  .content-l-b {
    width: 63%;
    p {
      padding: 6px;
      text-align: left;
      font-size: 18px;
      font-weight: 700;
      width: 99%;
      border-bottom: 1px solid #c9c7c7;
    }
    table {
      width: 98%;
      margin: 0 1% 10px;
      thead {
        tr {
          height: 40px;
          line-height: 40px;
          display: flex;
          color: #848484;
          border-bottom: 1px solid #c9c7c7;
          td {
            flex: 1;
          }
          td:nth-of-type(1) {
            flex: 0.6;
          }
          td:nth-of-type(2) {
            flex: 1.2;
          }
          td:nth-of-type(3) {
            flex: 1.8;
          }
          td:nth-of-type(4) {
            flex: 1.5;
          }
          td:nth-of-type(6) {
            flex: 1.5;
          }
          td:nth-of-type(7) {
            flex: 1.5;
          }
          td:nth-of-type(9) {
            flex: 1.5;
          }
        }
      }
      tbody {
        tr {
          height: 40px;
          line-height: 40px;
          display: flex;
          border-bottom: 1px solid #c9c7c7;
          td {
            flex: 1;
          }
          td:nth-of-type(1) {
            flex: 0.6;
          }
          td:nth-of-type(2) {
            flex: 1.2;
          }
          td:nth-of-type(3) {
            flex: 1.8;
            overflow: hidden;
          }
          td:nth-of-type(4) {
            flex: 1.5;
          }
          td:nth-of-type(6) {
            flex: 1.5;
          }
          td:nth-of-type(7) {
            flex: 1.5;
          }
          td:nth-of-type(9) {
            flex: 1.5;
          }
        }
      }
    }
  }
  .content-r {
    display: flex;
    flex-direction: column;
    border: none;
    .box {
      border: 1px solid #c9c7c7;
      display: flex;
      width: 100%;
      height: 120px;
      & > div {
        flex: 1;
        margin-top: 10px;
        p {
          color: #848484;
        }
        p:nth-of-type(2) {
          font-size: 18px;
          line-height: 50px;
          color: #000;
        }
      }
    }
    .box:nth-of-type(2) {
      margin-top: 10px;
    }
  }
  .class-num {
    height: 240px;
    .chart-box {
      width: 100%;
      p {
        color: #848484;
      }
    }
  }
  .class-num:nth-of-type(2) {
    width: 30%;
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
}
.pie_div2 {
  float: left;
  margin-left: 10%;
  width: 40%;
  height: 280px;
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    li {
      width: 100%;
      height: 60px;
      line-height: 60px;
      p {
        display: flex;
        span {
          flex: 1;
          text-align: left;
        }
      }
    }
  }
}
</style>
