<template>
  <div class="big_data">
    <!-- <Header/> -->
    <header class="title">扬州实验教学统计</header>
    <main class="big_body">
      <div class="l1_box">
        <p class="title">功能室建设情况</p>
        <p class="sec_tit">功能室占比情况</p>
        <div class="one_box">
          <div ref="founction_rate" />
        </div>
        <p class="sec_tit">功能室占比情况</p>
        <div class="one_box">
          <div ref="founction_num" />
        </div>
      </div>
      <div class="middle_box">
        <div class="sel_div">
          <select name="" id="">
            <option value="2021">2021学年</option>
          </select>
          <select v-model="term" name="" id="">
            <option :value="1">第一学期</option>
            <option :value="2">第二学期</option>
          </select>
        </div>
        <div class="data_div">
          <ul>
            <li>
              <p>装备应配总量</p>
              <p>43200000</p>
            </li>
            <li>
              <p>装备实际总量</p>
              <p>40000000</p>
            </li>
            <li>
              <p>装备缺配总量</p>
              <p>3200000</p>
            </li>
            <li>
              <p>实际开课数量</p>
              <p>781032</p>
            </li>
            <li>
              <p>实际开课率</p>
              <p>81%</p>
            </li>
          </ul>
        </div>
        <div ref="map_pic" class="a" />
      </div>
      <div class="l1_box">
        <p class="title">实验开课情况</p>
        <p class="sec_tit">实验频率(次/日)</p>
        <div class="one_box">
          <div ref="exp_rate" />
        </div>
        <p class="sec_tit">学段实验开课率</p>
        <div class="two_box">
          <div>
            小学
            <div ref="primary" />
          </div>
          <div>
            初中
            <div ref="junior" />
          </div>
          <div>
            高中
            <div ref="high" />
          </div>
          <!-- <div ref="founction_num"/> -->
        </div>
      </div>
      <div class="auto_body">
        <div class="auto_l">
          <div class="equipment">
            <p class="title">装备情况</p>
            <div class="pie_div" ref="equ_up" />
            <div class="pie_div" ref="equ_value" />
            <div class="pie_div" ref="equ_pie" />
          </div>
          <div class="equipment1">
            <div class="pie_div1" ref="equ_bar" />
            <div class="pie_div2">
              <ul>
                <li v-for="(item, index) in base1.barData3.x" :key="index">
                  <p>
                    <span>{{ item }}</span>
                    <span>{{ '数量：' + base1.barData3.num[index] }}</span>
                    <span>{{ '达标率：' + base1.barData3.y[index] + '%' }}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="auto_r">
          <p class="title">危化品情况</p>
          <div class="tab_header">
            <span>序号</span>
            <span>种类</span>
            <span>存量</span>
            <span>周环比</span>
          </div>
          <ul>
            <li v-for="(item, index) in list" :key="index">
              <span>{{ index + 1 }}</span>
              <span>{{ item.type }}</span>
              <span>{{ item.num }}</span>
              <span :class="item.rate > 0 ? 'green' : 'red'"
                >{{ item.rate + '%' }}
                <i v-show="item.rate >= 0" class="el-icon-top-right green" />
                <i v-show="item.rate < 0" class="el-icon-bottom-right red" />
              </span>
            </li>
          </ul>
        </div>
        <div class="auto_l1">
          <div class="student">
            <p class="title">学生实验情况</p>
            <div ref="stu" />
          </div>
          <div class="teacher">
            <p class="title">师资配备情况</p>
            <div ref="tea" />
          </div>
        </div>
        <div class="auto_r1">
          <div>
            <p class="title">实验教学资源情况</p>
            <p>
              实验室教学资源总量：<span><strong>560 </strong>万份</span>
            </p>
            <p>
              今日新增：<i class="el-icon-top-right green" /><span> 10%</span> 同比上周
            </p>
            <p>10345</p>
          </div>
          <div>
            <p class="title">教学活动情况</p>
            <div>
              <p>累计发布活动数</p>
              <p>43209</p>
              <p>
                <i class="el-icon-top-right green" /><span class="green"> 10%</span>
                同比上周
              </p>
            </div>
            <div>
              <p>本周新增活动数</p>
              <p>342</p>
              <p>
                <i class="el-icon-bottom-right red" /><span class="red"> 10%</span>
                同比上周
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- <Footer/> -->
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import Header from '@/components/Header.vue'
export default {
  components: {
    // Header
  },
  data() {
    return {
      seriesData: [
        {
          name: '2011',
          type: 'bar',
          data: [18203, 23489, 29034, 104970, 131744, 630230],
        },
        {
          name: '2012',
          type: 'bar',
          data: [19325, 23438, 31000, 121594, 134141, 681807],
        },
      ],
      xAxisData: ['1', '2', '3', '4', '5', '6'],
      base1: {
        mapData: [
          { name: '广陵区', value: 80 },
          { name: '邗江区', value: 50 },
          { name: '江都区', value: 80 },
          { name: '宝应县', value: 70 },
          { name: '仪征市', value: 80 },
          { name: '高邮市', value: 20 },
        ],
        pieData: [
          { value: 1048, name: '物理' },
          { value: 735, name: '化学' },
          { value: 580, name: '生物' },
          { value: 484, name: '科学' },
          { value: 300, name: '其他' },
        ],
        pieData1: [
          { value: 1048, name: '物理' },
          { value: 735, name: '化学' },
          { value: 580, name: '生物' },
          { value: 484, name: '科学' },
          { value: 300, name: '其他' },
        ],
        barData1: {
          x: ['物理', '生物', '化学', '音', '体', '美', '其他'],
          y: [12312, 10121, 8130, 2000, 4800, 7000, 4510],
        },
        barData2: {
          x: ['报废总量', '维修总量', '借出总量'],
          y1: [12312, 10121, 8130],
          y2: [10312, 9121, 8700],
        },
        barData3: {
          x: ['通用设备', '教学专用设备', '非教学专用设备', '其他'],
          y: [90, 85, 74, 92],
          num: [10000, 23111, 4112, 1231],
        },
        barData4: {
          x: ['4月', '5月', '6月', '7月', '8月', '9月'],
          y: [8, 9, 8, 7, 11, 15, 12],
          y1: [10, 6, 8, 7, 11, 17, 15],
          y2: [12, 13, 8, 9, 12, 12, 18],
        },
        lineData1: {
          x: ['4月', '5月', '6月', '7月', '8月', '9月'],
          y: [12, 4, 8, 5, 13, 17, 18],
        },
        lineData2: {
          x: ['4月', '5月', '6月', '7月', '8月', '9月'],
          y: [12, 4, 8, 5, 13, 17, 18],
        },
      },
      base2: {
        mapData: [
          { name: '广陵区', value: 60 },
          { name: '邗江区', value: 70 },
          { name: '江都区', value: 40 },
          { name: '宝应县', value: 50 },
          { name: '仪征市', value: 90 },
          { name: '高邮市', value: 30 },
        ],
        pieData: [
          { value: 1001, name: '物理' },
          { value: 620, name: '化学' },
          { value: 660, name: '生物' },
          { value: 560, name: '科学' },
          { value: 100, name: '其他' },
        ],
        pieData1: [
          { value: 1001, name: '物理' },
          { value: 620, name: '化学' },
          { value: 660, name: '生物' },
          { value: 560, name: '科学' },
          { value: 100, name: '其他' },
        ],
        barData1: {
          x: ['物理', '生物', '化学', '音', '体', '美', '其他'],
          y: [11201, 11220, 7896, 1910, 4600, 6804, 4310],
        },
        barData2: {
          x: ['报废总量', '维修总量', '借出总量'],
          y1: [11421, 11126, 8320],
          y2: [9102, 10021, 8450],
        },
        barData3: {
          x: ['通用设备', '教学专用设备', '非教学专用设备', '其他'],
          y: [91, 84, 75, 93],
          num: [11000, 22111, 4712, 1731],
        },
        barData4: {
          x: ['4月', '5月', '6月', '7月', '8月', '9月'],
          y: [4, 8, 9, 8, 11, 13, 14],
          y1: [9, 7, 6, 9, 15, 13, 15],
          y2: [13, 11, 7, 13, 11, 12, 16],
        },
        lineData1: {
          x: ['4月', '5月', '6月', '7月', '8月', '9月'],
          y: [11, 8, 4, 5, 17, 13, 11],
        },
        lineData2: {
          x: ['4月', '5月', '6月', '7月', '8月', '9月'],
          y: [13, 5, 5, 8, 12, 11, 15],
        },
      },
      list: [
        {
          type: '爆炸品',
          num: '20000',
          rate: 10,
        },
        {
          type: '压缩气体和液化气体',
          num: '4000',
          rate: 10,
        },
        {
          type: '易燃液体',
          num: '2000',
          rate: -10,
        },
        {
          type: '易燃固体，自燃物品和遇湿易燃物品',
          num: '50000',
          rate: -10,
        },
        {
          type: '自燃物品',
          num: '3000',
          rate: 10,
        },
        {
          type: '氧化剂和有机氧化物',
          num: '30000',
          rate: 10,
        },
        {
          type: '毒害品和感染性物品',
          num: '4000',
          rate: 10,
        },
        {
          type: '放射性物品',
          num: '500',
          rate: 10,
        },
        {
          type: '腐蚀品',
          num: '600',
          rate: 10,
        },
      ],
      term: 1,
    }
  },
  mounted() {
    this.drawMap(this.base1.mapData)
    this.drawPie1(this.base1.pieData)
    this.drawPie2(this.base1.pieData1)
    this.drawbar1(this.base1.barData1)
    this.drawbar2(this.base1.barData2)
    this.drawbar3(this.base1.barData3)
    this.drawbar4(this.base1.barData4)
    this.drawline1(this.base1.lineData1)
    this.drawline2(this.base1.lineData2)
    this.drawring1()
    this.drawStudent()
  },
  watch: {
    term: function (val) {
      console.log(val)
      if (val === 1) {
        this.drawMap(this.base1.mapData)
        this.drawPie1(this.base1.pieData)
        this.drawPie2(this.base1.pieData1)
        this.drawbar1(this.base1.barData1)
        this.drawbar2(this.base1.barData2)
        this.drawbar3(this.base1.barData3)
        this.drawbar4(this.base1.barData4)
        this.drawline1(this.base1.lineData1)
        this.drawline2(this.base1.lineData2)
        this.drawring1()
        this.drawStudent()
      } else {
        this.drawMap(this.base2.mapData)
        this.drawPie1(this.base2.pieData)
        this.drawPie2(this.base2.pieData1)
        this.drawbar1(this.base2.barData1)
        this.drawbar2(this.base2.barData2)
        this.drawbar3(this.base2.barData3)
        this.drawbar4(this.base2.barData4)
        this.drawline1(this.base2.lineData1)
        this.drawline2(this.base2.lineData2)
        this.drawring1()
        this.drawStudent()
      }
    },
  },
  methods: {
    drawMap(data) {
      const myChart = echarts.init(this.$refs.map_pic)

      const appData = require('../utils/geoYangzhou.json')
      echarts.registerMap('yangzhou', appData)
      myChart.setOption({
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>{c}',
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: '10%',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        visualMap: {
          min: 0,
          max: 100,
          text: ['100', '0'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['rgb(255, 254, 248)', 'rgb(255, 213, 123)', 'rgb(255, 115, 0)'],
          },
        },
        series: [
          {
            type: 'map',
            mapType: 'yangzhou',
            roam: false,
            label: {
              normal: {
                show: true,
                color: '#000',
              },
              emphasis: {
                show: true,
              },
            },
            itemStyle: {
              emphasis: { label: { show: true } },
            },
            data: data,
          },
        ],
      })
    },
    drawPie1(data) {
      const myChart = echarts.init(this.$refs.founction_rate)
      myChart.setOption({
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '80%',
            label: {
              formatter: '{b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,

              rich: {
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33,
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4,
                },
              },
            },
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      })
    },
    drawPie2(data) {
      const myChart = echarts.init(this.$refs.equ_pie)
      myChart.setOption({
        title: {
          text: '装备增利用情况',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
            // emphasis: {
            //   itemStyle: {
            //     shadowBlur: 10,
            //     shadowOffsetX: 0,
            //     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //   }
            // }
          },
        ],
      })
    },
    drawbar1(data) {
      const myChart = echarts.init(this.$refs.founction_num)
      myChart.setOption({
        tooltip: {
          trigger: 'item',
        },
        xAxis: {
          type: 'category',
          data: data.x,
        },
        yAxis: {
          type: 'value',
        },
        grid: {
          x: 120,
          y: 10,
          x2: 20,
          y2: 20,
        },
        visualMap: {
          min: 0,
          max: 10000,
          itemWidth: 10, // 图形的宽度，即长条的宽度。
          itemHeight: 80, // 图形的高度，即长条的高度。
          text: [10000, 0],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['rgb(255, 254, 248)', 'rgb(255, 213, 123)', 'rgb(255, 115, 0)'],
          },
        },
        series: [
          {
            data: data.y,
            type: 'bar',
          },
        ],
      })
    },
    drawbar2(data) {
      const myChart = echarts.init(this.$refs.equ_value)
      myChart.setOption({
        title: {
          text: '装备情况和价值',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        // legend: {
        //   data: ['2011年', '2012年']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        xAxis: {
          type: 'category',
          data: data.x,
        },
        series: [
          {
            name: '总量',
            type: 'bar',
            data: data.y1,
          },
          {
            name: '价值',
            type: 'bar',
            data: data.y2,
          },
        ],
      })
    },
    drawbar3(data) {
      const myChart = echarts.init(this.$refs.equ_bar)
      myChart.setOption({
        title: {
          text: '装备情况和价值',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        // legend: {
        //   data: ['2011年', '2012年']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        xAxis: {
          type: 'category',
          data: data.x,
        },
        series: [
          {
            name: '达标情况',
            type: 'bar',
            data: data.y,
          },
        ],
      })
    },
    drawbar4(data) {
      const myChart = echarts.init(this.$refs.tea)
      myChart.setOption({
        title: {
          text: '教师配备数量',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          // orient: 'vertical',
          left: 'right',
        },
        // legend: {
        //   data: ['2011年', '2012年']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        xAxis: {
          type: 'category',
          data: data.x,
        },
        series: [
          {
            name: '小学',
            type: 'bar',
            data: data.y,
          },
          {
            name: '初中',
            type: 'bar',
            data: data.y1,
          },
          {
            name: '高中',
            type: 'bar',
            data: data.y2,
          },
        ],
      })
    },
    drawline1(data) {
      const myChart = echarts.init(this.$refs.exp_rate)
      myChart.setOption({
        tooltip: {
          trigger: 'item',
        },
        xAxis: {
          type: 'category',
          data: data.x,
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
        },
        grid: {
          x: 40,
          y: 20,
          x2: 40,
          y2: 20,
        },
        series: [
          {
            data: data.y,
            type: 'line',
          },
        ],
      })
    },
    drawline2(data) {
      const myChart = echarts.init(this.$refs.equ_up)
      myChart.setOption({
        title: {
          text: '装备增长趋势',
        },
        tooltip: {
          trigger: 'item',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.x,
        },
        yAxis: {
          type: 'value',
        },
        grid: {
          x: 40,
          y: 40,
          x2: 40,
          y2: 30,
        },
        series: [
          {
            data: data.y,
            type: 'line',
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(128, 255, 165, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(1, 191, 236, 0.1)',
                },
              ]),
            },
          },
        ],
      })
    },
    drawring1() {
      const myChart = echarts.init(this.$refs.primary)
      const myChart1 = echarts.init(this.$refs.junior)
      const myChart2 = echarts.init(this.$refs.high)
      myChart.setOption({
        title: {
          text: '75%',
          textStyle: {
            color: '#01c4a3',
            fontSize: 20,
          },
          subtextStyle: {
            color: '#909090',
          },
          left: 'center',
          top: 'center',
        },
        angleAxis: {
          max: 100, // 满分
          clockwise: true, // 逆时针
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        radiusAxis: {
          type: 'category',
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        polar: {
          center: ['50%', '50%'],
          radius: '170%', // 图形大小
        },
        series: [
          {
            type: 'bar',
            data: [
              {
                name: '作文得分',
                value: 75,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                      {
                        offset: 0,
                        color: '#aaf14f',
                      },
                      {
                        offset: 1,
                        color: '#0acfa1',
                      },
                    ]),
                  },
                },
              },
            ],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%', // 两环重叠
            z: 2,
          },
          {
            // 灰色环
            type: 'bar',
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e2e2e2',
                  shadowColor: 'rgba(0, 0, 0, 0.2)',
                  shadowBlur: 5,
                  shadowOffsetY: 2,
                },
              },
            ],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%', // 两环重叠
            z: 1,
          },
        ],
      })
      myChart1.setOption({
        title: {
          text: '70%',
          textStyle: {
            color: '#01c4a3',
            fontSize: 20,
          },
          subtextStyle: {
            color: '#909090',
          },
          left: 'center',
          top: 'center',
        },
        angleAxis: {
          max: 100, // 满分
          clockwise: true, // 逆时针
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        radiusAxis: {
          type: 'category',
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        polar: {
          center: ['50%', '50%'],
          radius: '170%', // 图形大小
        },
        series: [
          {
            type: 'bar',
            data: [
              {
                name: '作文得分',
                value: 70,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                      {
                        offset: 0,
                        color: '#aaf14f',
                      },
                      {
                        offset: 1,
                        color: '#0acfa1',
                      },
                    ]),
                  },
                },
              },
            ],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%', // 两环重叠
            z: 2,
          },
          {
            // 灰色环
            type: 'bar',
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e2e2e2',
                  shadowColor: 'rgba(0, 0, 0, 0.2)',
                  shadowBlur: 5,
                  shadowOffsetY: 2,
                },
              },
            ],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%', // 两环重叠
            z: 1,
          },
        ],
      })
      myChart2.setOption({
        title: {
          text: '90%',
          textStyle: {
            color: '#01c4a3',
            fontSize: 20,
          },
          subtextStyle: {
            color: '#909090',
          },
          left: 'center',
          top: 'center',
        },
        angleAxis: {
          max: 100, // 满分
          clockwise: true, // 逆时针
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        radiusAxis: {
          type: 'category',
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        polar: {
          center: ['50%', '50%'],
          radius: '170%', // 图形大小
        },
        series: [
          {
            type: 'bar',
            data: [
              {
                name: '作文得分',
                value: 90,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                      {
                        offset: 0,
                        color: '#aaf14f',
                      },
                      {
                        offset: 1,
                        color: '#0acfa1',
                      },
                    ]),
                  },
                },
              },
            ],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%', // 两环重叠
            z: 2,
          },
          {
            // 灰色环
            type: 'bar',
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e2e2e2',
                  shadowColor: 'rgba(0, 0, 0, 0.2)',
                  shadowBlur: 5,
                  shadowOffsetY: 2,
                },
              },
            ],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%', // 两环重叠
            z: 1,
          },
        ],
      })
    },
    drawStudent() {
      const myChart = echarts.init(this.$refs.stu)
      myChart.setOption({
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '实验操作能力', max: 6500 },
            { name: '数据处理能力', max: 16000 },
            { name: '活动参与情况', max: 30000 },
            { name: '实验效果', max: 38000 },
            { name: '实验结论', max: 52000 },
          ],
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000],
                name: '预算分配（Allocated Budget）',
              },
            ],
          },
        ],
      })
    },
  },
}
</script>

<style scoped lang="scss">
.big_data {
  padding: 0 20px 20px;
  .big_body {
    width: 100%;
    background-color: #fff;
    border: 1px solid #bebebe;
    .l1_box {
      position: relative;
      display: inline-block;
      margin-top: 40px;
      padding: 30px 20px;
      width: 28%;
      height: 400px;
      box-sizing: border-box;
      border: 1px solid #bebebe;
      .title {
        position: absolute;
        top: -20px;
        left: 50%;
        margin-left: -150px;
        border: 1px solid #bebebe;
      }
      .sec_tit {
        float: left;
        height: 30px;
        line-height: 30px;
      }
      .one_box {
        float: left;
        width: 100%;
        height: 140px;
        border: 1px solid #dadada;
        div {
          width: 100%;
          height: 100%;
        }
      }
      .two_box {
        float: left;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        width: 100%;
        height: 140px;
        box-sizing: border-box;
        border: 1px solid #dadada;
        div {
          flex: 1;
          border-right: 1px solid #bebebe;
          div {
            width: 100%;
            height: 100px;
            border-right: 0;
          }
        }
        & > :nth-last-child(1) {
          border-right: 0;
        }
      }
    }
    .middle_box {
      display: inline-block;
      width: 40%;
      height: 400px;
      .sel_div {
        float: left;
        margin: auto;
        width: 100%;
        height: 50px;
        line-height: 30px;
        select {
          margin: 0 2%;
          width: 20%;
          height: 24px;
          line-height: 24px;
          border: 0;
          border-bottom: 1px solid #bebebe;
        }
      }
      .data_div {
        float: left;
        width: 100%;
        height: 50px;
        ul {
          display: flex;
          justify-content: space-between;
          li {
            flex: 1;
            border-right: 2px solid #bebebe;
            & > :nth-child(1) {
              color: #848484;
            }
          }
          & > :nth-last-child(1) {
            border-right: 0;
          }
        }
      }
    }
    .r1_box {
      position: relative;
      display: inline-block;
      margin-top: 40px;
      width: 28%;
      height: 400px;
      border: 1px solid #bebebe;
      .title {
        position: absolute;
        top: -20px;
        left: 50%;
        margin-left: -150px;
        border: 1px solid #bebebe;
      }
    }
  }
}
.title {
  margin: 0 auto 20px;
  height: 40px;
  line-height: 40px;
  width: 300px;
  background-color: #fff;
}
header {
  margin-top: 20px !important;
}
.a {
  float: left;
  margin: 0 20%;
  width: 60%;
  height: 300px;
}
.auto_body {
  padding-top: 40px;
  width: 100%;
  height: 920px;
  background-color: #fff;
  .auto_l {
    float: left;
    margin: 0 2%;
    width: 66%;
    height: 480px;
    box-sizing: border-box;
    border: 1px solid #bebebe;
    .equipment {
      position: relative;
      width: 100%;
      height: 240px;
      border-bottom: 1px solid #dadada;
      .title {
        position: absolute;
        top: -20px;
        left: 50%;
        margin-left: -150px;
        border: 1px solid #bebebe;
      }
      .pie_div {
        float: left;
        margin-right: 3%;
        padding-top: 24px;
        width: 30%;
        height: 216px;
      }
    }
    .equipment1 {
      position: relative;
      width: 100%;
      height: 240px;
      .pie_div1 {
        float: left;
        width: 50%;
        height: 240px;
      }
      .pie_div2 {
        float: left;
        margin-left: 10%;
        width: 40%;
        height: 240px;
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
    }
  }
  .auto_l1 {
    float: left;
    margin: 0 2%;
    margin-top: 40px;
    width: 66%;
    height: 360px;
    .student {
      float: left;
      margin-right: 2%;
      padding: 40px 20px 0;
      width: 38%;
      height: 360px;
      box-sizing: border-box;
      border: 1px solid #bebebe;
      position: relative;
      .title {
        position: absolute;
        top: -20px;
        left: 50%;
        margin-left: -150px;
        border: 1px solid #bebebe;
      }
      div {
        width: 100%;
        height: 100%;
      }
    }
    .teacher {
      float: left;
      padding: 40px 20px 0;
      width: 60%;
      height: 360px;
      box-sizing: border-box;
      border: 1px solid #bebebe;
      position: relative;
      .title {
        position: absolute;
        top: -20px;
        left: 50%;
        margin-left: -150px;
        border: 1px solid #bebebe;
      }
      div {
        width: 100%;
        height: 100%;
      }
    }
  }
  .auto_r {
    float: left;
    position: relative;
    width: 28%;
    padding: 30px 20px 0;
    height: 480px;
    box-sizing: border-box;
    border: 1px solid #bebebe;
    .title {
      position: absolute;
      top: -20px;
      left: 50%;
      margin-left: -150px;
      border: 1px solid #bebebe;
    }
    .tab_header {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #dadada;
      display: flex;
      & :nth-child(1) {
        flex: 1;
      }
      & :nth-child(2) {
        flex: 4;
        text-align: left;
      }
      & :nth-child(3) {
        flex: 1;
      }
      & :nth-child(4) {
        flex: 1;
      }
    }
    ul {
      height: 400px;
      overflow-y: auto;
      li {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #dadada;
        display: flex;
        & :nth-child(1) {
          flex: 1;
        }
        & :nth-child(2) {
          flex: 4;
          text-align: left;
        }
        & :nth-child(3) {
          flex: 1;
        }
        & :nth-child(4) {
          flex: 1;
        }
      }
    }
    ul::-webkit-scrollbar {
      width: 0;
    }
  }
  .auto_r1 {
    float: left;
    width: 28%;
    margin-top: 40px;
    height: 360px;
    & > :nth-child(1) {
      position: relative;
      padding-top: 30px;
      width: 100%;
      height: 200px;
      border: 1px solid #bebebe;
      box-sizing: border-box;
      .title {
        position: absolute;
        top: -20px;
        left: 50%;
        margin-left: -150px;
        border: 1px solid #bebebe;
      }
      & > :nth-child(2) {
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        color: #848484;
        span {
          font-size: 24px;
          strong {
            color: #333;
          }
        }
      }
      & > :nth-child(3) {
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        color: #848484;
        span {
          font-size: 24px;
          color: #4bf34b;
        }
      }
      & > :nth-child(4) {
        height: 40px;
        line-height: 40px;
        font-size: 24px;
        color: #333;
        font-weight: 700;
      }
    }
    & > :nth-child(2) {
      position: relative;
      padding-top: 30px;
      margin-top: 40px;
      width: 100%;
      height: 120px;
      border: 1px solid #bebebe;
      box-sizing: border-box;
      .title {
        position: absolute;
        top: -20px;
        left: 50%;
        margin-left: -150px;
        border: 1px solid #bebebe;
      }
      & > :nth-child(2) {
        float: left;
        width: 50%;
        & > :nth-child(1) {
          color: #848484;
        }
        & > :nth-child(2) {
          font-size: 24px;
        }
        & > :nth-child(3) {
          color: #848484;
        }
      }
      & > :nth-child(3) {
        float: right;
        width: 50%;
        & > :nth-child(1) {
          color: #848484;
        }
        & > :nth-child(2) {
          font-size: 24px;
        }
        & > :nth-child(3) {
          color: #848484;
        }
      }
    }
  }
}
.green {
  color: #4bf34b;
}
.red {
  color: #f34b4b;
}
</style>
