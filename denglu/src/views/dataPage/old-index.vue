<template>
  <div class="bigData">
    <div class="tit_sel">
      <span @click="pageback">返回登录页</span>
    </div>
    <div class="lab">
      <p class="h_p">
        <img src="@/assets/images/bigData/icon1.png" alt="" />
        <span>功能室建设情况</span>
        <img src="@/assets/images/bigData/icon2.png" alt="" />
      </p>
      <div class="rate">
        <div class="title blue_border">功能室占比</div>
        <div ref="ringLab" class="ring_lab"></div>
      </div>
      <div class="num">
        <div class="title blue_border">功能室总数</div>
        <p>
          功能室总数
          <span>24345</span>
        </p>
        <div class="legend">
          <div>
            <span></span>
            达标
          </div>
          <div>
            <span></span>
            未达标
          </div>
        </div>
        <div ref="barLab" class="bar_lab"></div>
      </div>
    </div>
    <div class="teacher">
      <p class="h_p">
        <img src="@/assets/images/bigData/icon1.png" alt="" />
        <span>师资配备情况</span>
        <img src="@/assets/images/bigData/icon2.png" alt="" />
      </p>
      <div class="num">
        <div class="title blue_border">教师配备数量</div>
        <div ref="barTeacher" class="bar_teacher"></div>
      </div>
    </div>
    <div class="student">
      <p class="h_p">
        <img src="@/assets/images/bigData/icon1.png" alt="" />
        <span>学生实验情况</span>
        <img src="@/assets/images/bigData/icon2.png" alt="" />
      </p>
      <div ref="chartStudent" class="chart_student"></div>
    </div>
    <div class="equ">
      <p class="w_p">
        <img src="@/assets/images/bigData/icon1.png" alt="" />
        <span>装备情况</span>
        <img src="@/assets/images/bigData/icon2.png" alt="" />
      </p>
      <div class="equ_line">
        <div class="title blue_border">装备增长趋势</div>
        <div ref="lineEquUp" class="line_equ_up"></div>
      </div>
      <div class="equ_bar">
        <div class="title blue_border">教仪分类达标率</div>
        <div class="legend">
          <div>
            <span></span>
            达标
          </div>
          <div>
            <span></span>
            未达标
          </div>
        </div>
        <div ref="equBar" class="line_equ_bar"></div>
      </div>
      <div class="equ_ring">
        <div class="title blue_border">装备利用情况</div>
        <div ref="equRing" class="equ_ring_pie"></div>
      </div>
      <div ref="equAc" class="equ_ac">
        <!-- <div ref="equAc" class="equ_ac"></div> -->
      </div>
      <div class="p_t_s rate_box">
        <p>总体达标率</p>
        <p>
          <span>80</span>
          %
        </p>
      </div>
    </div>
    <div class="cla">
      <p class="h_p">
        <img src="@/assets/images/bigData/icon1.png" alt="" />
        <span>实验开课情况</span>
        <img src="@/assets/images/bigData/icon2.png" alt="" />
      </p>
      <div class="rate">
        <div class="title blue_border">实验频率</div>
        <p>
          日均实验
          <span>3.5次/日</span>
        </p>
        <div ref="lineCla" class="line_cli"></div>
      </div>
      <div class="rate_a">
        <div class="title blue_border">学科实验开课率</div>
        <div class="ringBox">
          <div class="item">物理</div>
          <div ref="rItem1" class="ring_item"></div>
          <div class="item">化学</div>
          <div ref="rItem2" class="ring_item"></div>
          <div class="item">生物</div>
          <div ref="rItem3" class="ring_item"></div>
        </div>
      </div>
    </div>
    <div class="res">
      <p class="h_p">
        <img src="@/assets/images/bigData/icon1.png" alt="" />
        <span>实验教学资源情况</span>
        <img src="@/assets/images/bigData/icon2.png" alt="" />
      </p>
      <div class="line_box">
        <p>
          实验室资源总量
          <span>560</span>
          万份
        </p>
        <p>
          今日新增
          <span>10345</span>
        </p>
        <div ref="lineEqu" class="line_equ"></div>
      </div>
    </div>
    <div class="dc">
      <p class="h_p">
        <img src="@/assets/images/bigData/icon1.png" alt="" />
        <span>危化品情况</span>
        <img src="@/assets/images/bigData/icon2.png" alt="" />
      </p>
      <div>
        <div class="tb_h">
          <span>序号</span>
          <span>种类</span>
          <span>存量</span>
          <span>周环比</span>
        </div>
        <ul class="tb_ul">
          <li>
            <span>1</span>
            <span>爆炸物</span>
            <span>2000</span>
            <span>20%</span>
          </li>
          <li>
            <span>2</span>
            <span>易燃物</span>
            <span>1200</span>
            <span>20%</span>
          </li>
          <li>
            <span>3</span>
            <span>酸性溶液</span>
            <span>2000</span>
            <span>20%</span>
          </li>
          <li>
            <span>4</span>
            <span>碱性溶液</span>
            <span>2000</span>
            <span>20%</span>
          </li>
          <li>
            <span>5</span>
            <span>贵金属</span>
            <span>1000</span>
            <span>20%</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="map">
      <div class="p_t_s">
        <p>装备应配总量</p>
        <p>
          <span>35222001522</span>
          个
        </p>
      </div>
      <div class="p_t_s">
        <p>装备实际总量</p>
        <p>
          <span>33222002477</span>
          个
        </p>
      </div>
      <div class="p_t_s">
        <p>装备缺配总量</p>
        <p>
          <span>100000000</span>
          个
        </p>
      </div>
      <div class="p_t_s">
        <p>实际开课数量</p>
        <p>
          <span>53202</span>
          个
        </p>
      </div>
      <div class="p_t_s">
        <p>实际开课率</p>
        <p>
          <span>80</span>
          %
        </p>
      </div>
      <div ref="map_pic" class="map_pic" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { loginServer } from '@/service/login/login'
import { reactive, ref, onMounted } from 'vue'
// import router from '@/router'
import { useStore } from '../../store/index'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import { useRouter, useRoute } from 'vue-router'
const store = useStore()
const router = useRouter()
// import cookieCache from '@/utils/cookieCache'
// 实验室圆环
const ringLab = ref()
// 实验室柱状图
const barLab = ref()
// 教师柱状图
const barTeacher = ref()
// 学生雷达图
const chartStudent = ref()
// 频率折线图
const lineCla = ref()
// 水位图1,2,3
const rItem1 = ref()
const rItem2 = ref()
const rItem3 = ref()
const lineEqu = ref()
const lineEquUp = ref()
const equBar = ref()
const equRing = ref()
const equAc = ref()
const map_pic = ref()
onMounted(() => {
  ringLabDarw()
  barLabDarw()
  barTeacherDarw()
  studentDarw()
  lineClaDarw()
  rItem1Darw()
  rItem2Darw()
  rItem3Darw()
  lineEquDarw()
  mapDarw()
  lineEquUpDarw()
  equBarDarw()
  equRingDarw()
  equAcDarw()
})
const ringLabDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(ringLab.value)
  // 指定图表的配置项和数据
  let option = {
    // tooltip: {
    //   trigger: 'item'
    // },
    // legend: {
    //   top: '5%',
    //   left: 'center'
    // },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        // avoidLabelOverlap: false,
        label: {
          formatter: '{b} {d}%',
          color: '#fff'
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: '40',
        //     fontWeight: 'bold'
        //   }
        // },
        labelLine: {
          show: true
        },
        data: [
          { value: 1048, name: '科学' },
          { value: 735, name: '化学' },
          { value: 580, name: '物理' },
          { value: 484, name: '生物' },
          { value: 300, name: '其他' }
        ]
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const barLabDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(barLab.value)
  // 指定图表的配置项和数据
  let option = {
    xAxis: {
      type: 'category',
      data: ['物理', '生物', '化学', '音乐', '体育', '美术', '其他'],
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        show: false
      },
      color: '#fff'
    },
    grid: {
      left: '20',
      top: '20',
      right: '20',
      Bottom: '0',
      containLabel: true
    },
    series: [
      {
        data: [10000, 6700, 8643, 4800, 5500, 4800, 3400],
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          color: function (params: any) {
            if (params.data > 5000) {
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#008AFF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#09DAFF' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            } else {
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#CF5900' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFA200' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        }
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const barTeacherDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(barTeacher.value)
  // 指定图表的配置项和数据
  let option = {
    xAxis: {
      type: 'category',
      data: ['9月', '10月', '11月', '12月', '1月', '2月'],
      axisTick: {
        show: true
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        show: false
      },
      color: '#fff'
    },
    grid: {
      left: '20',
      top: '20',
      right: '60',
      Bottom: '0',
      containLabel: true
    },
    legend: {
      top: 0,
      right: 0,
      orient: 'vertical',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '小学',
        data: [60, 57, 63, 73, 43, 60],
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          color: '#016FE2'
        }
      },
      {
        name: '初中',
        data: [50, 52, 43, 60, 50, 45],
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          color: '#02FEFF'
        }
      },
      {
        name: '高中',
        data: [52, 47, 57, 52, 49, 57],
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          color: '#C5D845'
        }
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const studentDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(chartStudent.value)
  // 指定图表的配置项和数据
  let option = {
    radar: {
      // shape: 'circle',
      center: ['50%', '55%'],
      splitNumber: 4,
      lineStyle: {
        normal: {
          type: 'dashed'
        }
      },
      indicator: [
        { name: '仪器准备', max: 6500 },
        { name: '仪器搭建', max: 16000 },
        { name: '数据测量', max: 30000 },
        { name: '数据处理', max: 38000 },
        { name: '仪器整理', max: 52000 }
      ]
    },
    grid: {},
    series: [
      {
        name: '实验数据',
        type: 'radar',
        symbol: 'none',
        symbolSize: 3,
        color: '#F7AD66',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '学生数据'
          }
        ]
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const lineClaDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(lineCla.value)
  // 指定图表的配置项和数据
  let option = {
    xAxis: {
      type: 'category',
      data: ['9月', '10月', '11月', '12月', '1月', '2月'],
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        show: false
      },
      color: '#fff'
    },
    grid: {
      left: '20',
      top: '20',
      right: '20',
      Bottom: '0',
      containLabel: true
    },
    series: [
      {
        data: [4, 2, 5, 4, 3, 3],
        type: 'line',
        symbol: 'none',
        lineStyle: {
          color: '#59C3DC',
          width: '3'
        }
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const rItem1Darw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(rItem1.value)
  // 指定图表的配置项和数据
  let option = {
    series: [
      {
        type: 'liquidFill',
        radius: '95%',
        amplitude: 3,
        waveAnimation: true,
        data: [
          {
            value: 0.28,
            direction: 'left',
            itemStyle: {
              normal: {
                color: '#EA6B15'
              }
            }
          }
        ],
        outline: {
          // show: true , //是否显示轮廓 布尔值
          borderDistance: 1, // 外部轮廓与图表的距离 数字
          itemStyle: {
            borderColor: '#EA6B15 ', // 边框的颜色
            borderWidth: 1 // 边框的宽度
            // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
            // shadowColor: '#000' //外部轮廓的阴影颜色
          }
        },
        itemStyle: {
          opacity: 0.9, // 波浪的透明度
          shadowBlur: 0 // 波浪的阴影范围
        },
        backgroundStyle: {
          color: '#01061D' // 图表的背景颜色
        },
        label: {
          // 数据展示样式
          show: true,
          color: '#fff',
          insideColor: '#fff',
          fontSize: 20,
          fontWeight: 400,
          align: 'center',
          baseline: 'middle',
          position: 'inside'
        }
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const rItem2Darw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(rItem2.value)
  // 指定图表的配置项和数据
  let option = {
    series: [
      {
        type: 'liquidFill',
        radius: '95%',
        amplitude: 3,
        waveAnimation: true,
        data: [
          {
            value: 0.33,
            direction: 'left',
            itemStyle: {
              normal: {
                color: '#1ED81E'
              }
            }
          }
        ],
        outline: {
          // show: true , //是否显示轮廓 布尔值
          borderDistance: 1, // 外部轮廓与图表的距离 数字
          itemStyle: {
            borderColor: '#1ED81E', // 边框的颜色
            borderWidth: 1 // 边框的宽度
            // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
            // shadowColor: '#000' //外部轮廓的阴影颜色
          }
        },
        itemStyle: {
          opacity: 0.9, // 波浪的透明度
          shadowBlur: 0 // 波浪的阴影范围
        },
        backgroundStyle: {
          color: '#01061D' // 图表的背景颜色
        },
        label: {
          // 数据展示样式
          show: true,
          color: '#fff',
          insideColor: '#fff',
          fontSize: 20,
          fontWeight: 400,
          align: 'center',
          baseline: 'middle',
          position: 'inside'
        }
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const rItem3Darw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(rItem3.value)
  // 指定图表的配置项和数据
  let option = {
    series: [
      {
        type: 'liquidFill',
        radius: '95%',
        amplitude: 3,
        waveAnimation: true,
        data: [
          {
            value: 0.72,
            direction: 'left',
            itemStyle: {
              normal: {
                color: '#DD1818'
              }
            }
          }
        ],
        outline: {
          // show: true , //是否显示轮廓 布尔值
          borderDistance: 1, // 外部轮廓与图表的距离 数字
          itemStyle: {
            borderColor: '#DD1818', // 边框的颜色
            borderWidth: 1 // 边框的宽度
            // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
            // shadowColor: '#000' //外部轮廓的阴影颜色
          }
        },
        itemStyle: {
          opacity: 0.9, // 波浪的透明度
          shadowBlur: 0 // 波浪的阴影范围
        },
        backgroundStyle: {
          color: '#01061D' // 图表的背景颜色
        },
        label: {
          // 数据展示样式
          show: true,
          color: '#fff',
          insideColor: '#fff',
          fontSize: 20,
          fontWeight: 400,
          align: 'center',
          baseline: 'middle',
          position: 'inside'
        }
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const lineEquDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(lineEqu.value)
  // 指定图表的配置项和数据
  let option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['9月', '10月', '11月', '12月', '1月', '2月'],
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      },
      color: '#fff'
    },
    grid: {
      left: '0',
      top: '0',
      right: '0',
      // Bottom: '0',
      containLabel: true
    },
    series: [
      {
        data: [60000, 71233, 51231, 67124, 43251, 47213],
        type: 'line',
        symbol: 'none',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(20, 66, 104, 1)'
            },
            {
              offset: 1,
              color: 'rgba(20, 66, 104, 0.5)'
            }
          ])
        },
        lineStyle: {
          color: '#0B77D2',
          width: '1'
        }
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const lineEquUpDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(lineEquUp.value)
  // 指定图表的配置项和数据
  let option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['9月', '10月', '11月', '12月', '1月', '2月'],
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        show: false
      },
      color: '#fff'
    },
    grid: {
      left: '0',
      top: '10',
      right: '10',
      // Bottom: '0',
      containLabel: true
    },
    series: [
      {
        data: [60, 71, 51, 67, 43, 47],
        type: 'line',
        symbol: 'none',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(20, 66, 104, 1)'
            },
            {
              offset: 1,
              color: 'rgba(20, 66, 104, 0.5)'
            }
          ])
        },
        lineStyle: {
          color: '#0B77D2',
          width: '1'
        }
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const equBarDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(equBar.value)
  // 指定图表的配置项和数据
  let option = {
    xAxis: {
      type: 'category',
      data: ['计量', '通用', '专用', '模型', '标本', '挂图', '玻璃', '药品'],
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#002648'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        show: false
      },
      color: '#fff'
    },
    grid: {
      left: '20',
      top: '20',
      right: '20',
      Bottom: '0',
      containLabel: true
    },
    series: [
      {
        data: [60, 10, 44, 56, 98, 77, 23, 86],
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          color: function (params: any) {
            if (params.data > 50) {
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#008AFF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#09DAFF' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            } else {
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#CF5900' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFA200' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        }
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const equRingDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(equRing.value)
  // 指定图表的配置项和数据
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'center',
      right: '12',
      orient: 'vertical',
      itemWidth: 14,
      textStyle: {
        color: '#fff'
      }
    },

    series: [
      {
        name: '装备利用情况',
        type: 'pie',
        radius: ['60%', '90%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          formatter: '{b} {d}%',
          color: '#fff'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '科学' },
          { value: 735, name: '化学' },
          { value: 580, name: '物理' },
          { value: 484, name: '生物' },
          { value: 300, name: '其他' }
        ]
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const equAcDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(equAc.value)
  // 指定图表的配置项和数据
  let option = {
    tooltip: {},
    series: [
      {
        type: 'graph',
        symbolSize: 50,
        roam: true,
        label: {
          show: true
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 20
        },
        data: [
          {
            name: '报废总量',
            x: 0,
            y: 100,
            value: 200,
            symbolSize: 70,
            itemStyle: {
              color: '#DE4D4D'
            },
            label: {
              color: '#fff'
            }
          },
          {
            name: '报废价值',
            x: 220,
            y: 150,
            value: 200,
            symbolSize: 70,
            itemStyle: {
              color: '#00FF00'
            },
            label: {
              color: '#fff'
            }
          },
          {
            name: '维修总量',
            x: 800,
            y: 200,
            value: 200,
            symbolSize: 70,
            itemStyle: {
              color: '#FFC600'
            },
            label: {
              color: '#fff'
            }
          },
          {
            name: '维修价值',
            x: 600,
            y: 300,
            value: 200,
            symbolSize: 70,
            itemStyle: {
              color: '#00FF00'
            },
            label: {
              color: '#fff'
            }
          },
          {
            name: '借出总量',
            x: 180,
            y: 400,
            value: 200,
            symbolSize: 70,
            itemStyle: {
              color: '#00FF7E'
            },
            label: {
              color: '#fff'
            }
          },
          {
            name: '借出价值',
            x: 400,
            y: 500,
            value: 200,
            symbolSize: 70,
            itemStyle: {
              color: '#00FF00'
            },
            label: {
              color: '#fff'
            }
          }
        ]
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const mapDarw = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(map_pic.value)
  const appData = require('@/utils/geoYangzhou.json')
  echarts.registerMap('yangzhou', appData)
  // 指定图表的配置项和数据
  let option = {
    // backgroundColor: '#fff',
    // tooltip: {
    //   trigger: 'item',
    //   formatter: '{b}<br/>{c}'
    // },
    // toolbox: {
    //   show: true,
    //   orient: 'vertical',
    //   left: 'right',
    //   top: '10%',
    //   feature: {
    //     dataView: { readOnly: false },
    //     restore: {},
    //     saveAsImage: {}
    //   }
    // },
    visualMap: {
      min: 0,
      max: 500,
      color: '#fff',
      text: ['500(万)', '0(万)'],
      textStyle: {
        color: '#fff'
      },
      realtime: false,
      calculable: true,
      inRange: {
        color: ['rgba(24, 98, 160, 0.4)', 'rgba(24, 98, 160, 1)', 'rgba(45, 153, 246, 1)']
      }
    },
    series: [
      {
        type: 'map',
        mapType: 'yangzhou',
        roam: false,
        label: {
          fontsSize: 18,
          fontWeight: 'bold',
          normal: {
            show: true,
            color: '#fff'
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          borderColor: '#fff',
          emphasis: { label: { show: true, color: '#fff' } }
        },
        data: [
          { name: '广陵区', value: 60 },
          { name: '邗江区', value: 70 },
          { name: '江都区', value: 40 },
          { name: '宝应县', value: 250 },
          { name: '仪征市', value: 500 },
          { name: '高邮市', value: 0 }
        ]
      }
    ]
  }
  chart.setOption(option)
  window.onresize = function () {
    chart.resize
  }
}
const pageback = () => {
  router.push({
    path: '/login'
  })
}
</script>
<style lang="scss" scoped>
.blue_border {
  border: 1px solid #498eb1;
  font-size: 14px;
  color: #f5fdfd;
}

.bigData {
  position: relative;
  // width: 1920px;
  height: 1080px !important;
  background-image: url('../../assets/images/bigData/bg1.png');
  background-size: 100%;
  height: 100%;

  & > div {
    position: absolute;
    border-bottom-right-radius: 16px;
    background: rgba(1, 5, 7, 0.12);

    border: 1px solid #195d7e;
    & > .h_p {
      width: 96%;
      margin: auto;
      height: 44px;
      line-height: 46px;
      font-size: 18px;
      text-align: left;
      color: #f5fdfd;
      background-image: url('../../assets/images/bigData/line.png');
      background-repeat: no-repeat;
      background-position: center bottom;
      & > :nth-child(1) {
        float: left;
        margin-top: 12px;
      }
      & > :nth-child(2) {
        padding-left: 12px;
      }
      & > :nth-child(3) {
        float: right;
        margin-top: 5px;
      }
    }
    & > .w_p {
      width: 44px;
      float: left;
      height: 100%;
      font-size: 18px;
      text-align: center;
      color: #f5fdfd;
      position: relative;
      border-right: 1px solid rgba(22, 174, 224, 0.32);

      &::after {
        position: absolute;
        width: 256px;
        height: 1px;
        transform: translate(0, -50%);
        background-image: url('../../assets/images/bigData/line.png');
        background-repeat: no-repeat;
        background-position: center right;
      }
      & > :nth-child(1) {
        float: left;
        margin: 14px 0 0 12px;
      }
      & > :nth-child(2) {
        float: left;
        margin: 14px 0 0 12px;
        width: 20px;
      }
      & > :nth-child(3) {
        float: left;
        margin: 128px 0 0 5px;
        -webkit-transform: rotate(-180deg);
      }
    }
  }
  .tit_sel {
    border: none;
    position: absolute;
    top: 24px;
    left: 0;
    width: 1697px;
    height: 48px;
    // background-color: #fff;
    background-image: url('../../assets/images/bigData/t_h.png');
    background-size: 100% 100%;
    span {
      margin: 0 60px;
      float: left;
      width: 120px;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      background-color: #5aa8ec;
      color: #fff;
      cursor: pointer;
    }
  }
  .lab {
    top: 92px;
    left: 30px;
    width: 468px;
    height: 400px;
    .rate {
      width: 100%;
      height: 180px;
      // background-color: #fff;
      .title {
        float: left;
        padding: 12px 6px;
        margin: 26px 12px;
        width: 20px;
      }
      .ring_lab {
        float: right;
        width: 360px;
        height: 180px;
        // background-color: #fff;
      }
    }
    .num {
      width: 100%;
      height: 174px;
      // background-color: aqua;
      & > p {
        float: left;
        margin: 4px 0 0 40px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        span {
          font-size: 30px;
          font-family: Adobe Heiti Std;
          font-weight: bold;
          font-style: italic;
          color: #2d94ec;
          line-height: 2px;
          opacity: 0.8;
        }
      }
      .title {
        float: left;
        padding: 6px 12px;
        margin: 0 12px;
      }
      .legend {
        float: right;
        width: 100px;
        height: 48px;
        & > div {
          margin: 5px 0;
          height: 14px;
          line-height: 14px;
          color: #00dbf2;
          text-align: left;
          span {
            float: left;
            margin: 1px 4px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }
        }
        & > :nth-child(1) {
          span {
            background: linear-gradient(to bottom, #008aff, #09daff);
          }
        }
        & > :nth-child(2) {
          span {
            background: linear-gradient(to bottom, #cf5900, #ffa200);
          }
        }
      }
      .bar_lab {
        float: right;
        width: 468px;
        height: 190px;
      }
    }
  }
  .teacher {
    top: 504px;
    left: 30px;
    width: 468px;
    height: 250px;
    .num {
      width: 100%;
      height: 205px;
      .title {
        float: left;
        padding: 6px 12px;
        margin: 4px 12px;
      }
      .bar_teacher {
        float: right;
        width: 468px;
        height: 230px;
      }
    }
  }
  .student {
    top: 765px;
    left: 30px;
    width: 302px;
    height: 288px;

    .chart_student {
      width: 302px;
      height: 242px;
    }
  }
  .equ {
    top: 765px;
    left: 342px;
    width: 1082px;
    height: 288px;
    // background-color: aqua;
    position: relative;
    .rate_box {
      position: absolute;
      top: 4px;
      right: 40px;
    }
    .equ_line {
      position: absolute;
      top: 20px;
      left: 54px;
      width: 510px;
      height: 110px;
      // background-color: rgb(243, 177, 177);
      .title {
        float: left;
        padding: 6px;
        width: 20px;
        font-size: 14px;
        line-height: 16px;
      }
      .line_equ_up {
        float: right;
        width: 468px;
        height: 180px;
      }
    }
    .equ_bar {
      position: absolute;
      top: 150px;
      left: 54px;
      width: 750px;
      height: 124px;
      // background-color: rgb(243, 177, 177);
      .title {
        float: left;
        padding: 6px;
        width: 20px;
        font-size: 14px;
        line-height: 16px;
      }
      .line_equ_bar {
        float: right;
        width: 616px;
        height: 180px;
      }
      .legend {
        float: right;
        margin-top: 50px;
        width: 100px;
        height: 48px;
        & > div {
          margin: 5px 0;
          height: 14px;
          line-height: 14px;
          color: #00dbf2;
          text-align: left;
          span {
            float: left;
            margin: 1px 4px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }
        }
        & > :nth-child(1) {
          span {
            background: linear-gradient(to bottom, #008aff, #09daff);
          }
        }
        & > :nth-child(2) {
          span {
            background: linear-gradient(to bottom, #cf5900, #ffa200);
          }
        }
      }
    }
    .equ_ring {
      position: absolute;
      top: 130px;
      right: 0;
      width: 278px;
      height: 136px;
      .title {
        float: left;
        padding: 6px;
        width: 20px;
        font-size: 14px;
        line-height: 16px;
      }
      .equ_ring_pie {
        float: left;
        margin-left: 22px;
        width: 222px;
        height: 136px;
      }
    }
    .equ_ac {
      position: absolute;
      top: 0;
      right: 160px;
      width: 354px;
      height: 160px;
      // background-color: #fff;
    }
  }
  .cla {
    top: 25px;
    right: 20px;
    height: 358px;
    width: 468px;
    .title {
      float: left;
      padding: 6px 12px;
      margin: 4px 12px;
    }
    .rate {
      float: left;
      width: 100%;
      height: 180px;
      & > p {
        margin-top: 4px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        span {
          font-size: 30px;
          font-family: Adobe Heiti Std;
          font-weight: bold;
          font-style: italic;
          color: #2d94ec;
          line-height: 2px;
          opacity: 0.8;
        }
      }
      .line_cli {
        float: left;
        width: 468px;
        height: 200px;
      }
    }
    .rate_a {
      width: 100%;
      height: 132px;
      .ringBox {
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 64px;
        .ring_item {
          width: 80px;
          height: 80px;
        }
        .item {
          width: 8%;
          height: 80px;
          line-height: 80px;
          color: #fff;
        }
      }
    }
  }
  .res {
    top: 397px;
    right: 20px;
    width: 468px;
    height: 263px;
    .line_box {
      height: 218px;
      width: 100%;
      & > :nth-child(1) {
        margin: 10px 20px;
        padding-left: 22px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        color: #fff;
        span {
          display: inline-block;
          padding: 0 18px;
          height: 40px;
          line-height: 40px;
          font-size: 30px;
          font-weight: bold;
          background: linear-gradient(-75deg, #014666, #013366);
        }
      }
      & > :nth-child(2) {
        // margin-top: px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        span {
          font-size: 30px;
          font-family: Adobe Heiti Std;
          font-weight: bold;
          font-style: italic;
          color: #2d94ec;
          line-height: 2px;
          opacity: 0.8;
        }
      }
      .line_equ {
        margin: auto;
        height: 180px;
        width: 422px;
      }
    }
  }
  .dc {
    top: 674px;
    right: 20px;
    width: 468px;
    height: 378px;
    // background-color: aquamarine;
    .tb_h {
      display: flex;
      width: 100%;
      margin: 12px 0 6px;
      span {
        font-size: 14px;
        font-weight: bold;
        color: #f5fdfd;
      }
      :nth-child(1) {
        flex: 1;
      }
      :nth-child(2) {
        text-align: left;
        flex: 5;
      }
      :nth-child(3) {
        flex: 1;
      }
      :nth-child(4) {
        flex: 1;
      }
    }
    .tb_ul {
      width: 100%;
      height: 280px;
      li {
        margin: 6px 0;
        height: 28px;
        line-height: 28px;
        display: flex;
        width: 100%;
        cursor: pointer;
        &:hover {
          background: linear-gradient(to bottom, #ec1116, #eb761f);
        }
        span {
          font-size: 14px;
          font-weight: bold;
          color: #f5fdfd;
        }
        :nth-child(1) {
          flex: 1;
        }
        :nth-child(2) {
          text-align: left;
          flex: 5;
        }
        :nth-child(3) {
          flex: 1;
        }
        :nth-child(4) {
          flex: 1;
        }
      }
    }
  }
  .map {
    // position: relative;
    border: none;
    top: 74px;
    left: 502px;
    width: 922px;
    height: 680px;
    // background-color: #fff;
    .map_pic {
      position: absolute;
      top: 20px;
      right: 0;
      width: 540px;
      height: 580px;
    }
    .p_t_s {
      margin: 10px 26px;
      height: 106px;
    }
  }
}
.p_t_s {
  & > :nth-child(1) {
    height: 48px;
    line-height: 48px;
    font-size: 18px;
    color: #fff;
    text-align: left;
  }
  & > :nth-child(2) {
    float: left;
    font-size: 15px;
    color: #fff;
    height: 58px;
    line-height: 100px;
    span {
      float: left;
      margin-right: 12px;
      padding: 0 18px;
      height: 58px;
      line-height: 66px;
      font-size: 30px;
      color: #fff;
      background: linear-gradient(-75deg, #014666, #013366);
    }
  }
}
</style>
