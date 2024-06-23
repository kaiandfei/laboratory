//功能室数量图表配置
export const laboratoryCountBar = {
  xAxis: {
    type: 'category',
    // data: ['物理', '化学', '生物', '小学科学']
  },
  yAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '25%',
    bottom: '5%',
    containLabel: true
  },
  series: [
    {
      data: [],
      type: 'bar',
      barMaxWidth: 50,
      itemStyle: {
        color: '#008aff'
      }
    }
  ]
}
//功能室数量
export const laboratoryCountPie = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '10%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  series: [
    {
      type: 'pie',
      roseType: 'area',
      radius: ['10%', '110%'],
      center: ['50%', '35%'],
      label: {
        show: true
      },
      // adjust the start angle
      startAngle: 0,
      data: [
        {
          // make an record to fill the bottom 50%
          value: 0,
          itemStyle: {
            // stop the chart from rendering this piece
            color: 'none',
            decal: {
              symbol: 'none'
            }
          },
          label: {
            show: false
          }
        },
        {
          // make an record to fill the bottom 50%
          value: 0,
          itemStyle: {
            // stop the chart from rendering this piece
            color: 'none',
            decal: {
              symbol: 'none'
            }
          },
          label: {
            show: false
          }
        },
        {
          // make an record to fill the bottom 50%
          value: 0,
          itemStyle: {
            // stop the chart from rendering this piece
            color: 'none',
            decal: {
              symbol: 'none'
            }
          },
          label: {
            show: false
          }
        },
        {
          // make an record to fill the bottom 50%
          value: 0,
          itemStyle: {
            // stop the chart from rendering this piece
            color: 'none',
            decal: {
              symbol: 'none'
            }
          },
          label: {
            show: false
          }
        }
      ]
    }
  ]
}
//功能室利用率图表配置
export const laboratoryUseRate = {
  tooltip: {
    trigger: 'item',
    formatter: ''
  },
  title: {
    text: 0,
    left: 'center',
    top: '45%',
    itemGap: 10,
    textStyle: {
      color: '#FFF',
      fontSize: '18',
      fontWeight: 600,
      fontStyle: "italic"
    },
  },
  angleAxis: {
    max: 100,
    // 隐藏刻度线
    show: false,
    startAngle: 90
  },
  radiusAxis: {
    type: 'category',
    show: true,
    axisLabel: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false
    },
  },
  polar: {
    radius: '100%' //图形大小
  },
  series: [{
    type: 'bar',
    data: [],
    showBackground: true,
    roundCap: true,
    backgroundStyle: {
      color: '#003c6b',
    },
    coordinateSystem: 'polar',
    barWidth: 20,
    itemStyle: {
      // normal: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#018cf8'
        }, {
          offset: 1, color: '#09d7ff'
        }],
        global: false
      }
      // }
    },
  }]
}

//装备总量增长趋势图表配置
export const instrumentFlowAdd = {
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  // legend: {
  //   top: '6%',
  //   right: '5%',
  //   textStyle: {
  //     color: '#fff'
  //   },
  //   data: ['仪器', '设备']
  // },
  grid: {
    left: '0%',
    right: '5%',
    top: '15%',
    bottom: '0%',
    containLabel: true
  },
  series: [
    {
      name: '仪器',
      data: [],
      type: 'line',
      smooth: true,
      areaStyle: {}
    },
    {
      name: '设备',
      data: [],
      type: 'line',
      smooth: true,
      areaStyle: {}
    }
  ]
}
//实验室使用频次统计
export const laboratoryUseFrequency = {
  xAxis: {
    type: 'category',

  },
  yAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '25%',
    bottom: '5%',
    containLabel: true
  },
  series: [{
    data: [],
    type: 'line'
  }]
}
//功能室类型占比
export const laboratoryType = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} {d}%'
  },
  series: [
    {
      // name: 'Access From',
      type: 'pie',
      radius: '70%',
      center: ['50%', '55%'],
      data: []
    }
  ]
}
//功能室总量达标统计
export const amountReachStandBySubject = {
  xAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  yAxis: {
    type: 'category',
    data: []
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: '{b} {c} %'
  },
  grid: {
    left: '0%',
    right: '0%',
    top: '15%',
    bottom: '0%',
    containLabel: true
  },
  series: [
    {
      data: [],
      type: 'bar',
      barMaxWidth: 50,
      itemStyle: {
        color: '#008aff'
      }
    }
  ]
}
//装备总量图表数据
export const equipTotal = {
  xAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  yAxis: {
    type: 'category',
    data: ['装备缺配总量', '装备实配总量', '装备应配总量']
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '20%',
    bottom: '0%',
    containLabel: true
  },
  series: [
    {
      data: [],
      type: 'bar',
      barMaxWidth: 50,
      itemStyle: {
        color: '#008aff'
      }
    }
  ]
}
//装备总量达标率图表配置
export const equipTotalRate = {
  series: [
    {
      type: 'liquidFill',
      //data: [0.6, 0.5, 0.4, 0.3],
      data: [],
      radius: '60%',
      // 水球颜色
      color: ['#49d088', '#38b470', '#2aaf66'],
      center: ['50%', '60%'],
      // outline  外边
      outline: {
        // show: false
        borderDistance: 2,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#13FDCE'
        }
      },
      label: {
        color: '#fff',
        insideColor: 'yellow',
        fontSize: 20
      },
      // 内图 背景色 边
      backgroundStyle: {
        color: 'rgba(4,24,74,0.8)'
        // borderWidth: 5,
        // borderColor: 'red',
      }
    }
  ]
}
//装备总量达标率图表配置
export const subjectTotal = {
  xAxis: {
    type: 'category',
    data: ['必配', '选配']
  },
  yAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: '{b} {c}%'
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '20%',
    bottom: '0%',
    containLabel: true
  },
  series: [
    {
      data: [],
      type: 'bar',
      barMaxWidth: 50,
      itemStyle: {
        color: '#008aff'
      }
    }
  ]
}
//生均教学仪器设备达标率
export const average = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} {d}%'
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '50%'],
      radius: '60%',
      // label: {
      //   show: false
      // },
      data: [
        { value: 0, name: '达标' },
        { value: 0, name: '不达标' }
      ]
    }
  ]
}
// 装备状态
export const equipStatus = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} {d}%'
  },
  legend: {
    left: '80%',
    top: '20%',
    textStyle: {
      color: '#fff'
    }
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['30%', '60%'],
      // avoidLabelOverlap: false,
      labelLine: {
        show: true
      },
      data: []
    }
  ]
}
//分类仪器总量达标率
export const category = {
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 30,
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: '{b} {c}%'
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '15%',
    bottom: '0%',
    containLabel: true
  },
  series: [
    {
      data: [],
      type: 'bar',
      barMaxWidth: 50,
      itemStyle: {
        color: '#008aff'
      }
    }
  ]
}
//实验开课率
export const courseRate = {
  series: [
    {
      type: 'liquidFill',
      //data: [0.6, 0.5, 0.4, 0.3],
      data: [],
      radius: '50%',
      // 水球颜色
      color: ['#49d088', '#38b470', '#2aaf66'],
      center: ['50%', '60%'],
      // outline  外边
      outline: {
        // show: false
        borderDistance: 2,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#13FDCE'
        }
      },
      label: {
        color: '#fff',
        insideColor: 'yellow',
        fontSize: 20

      },
      // 内图 背景色 边
      backgroundStyle: {
        color: 'rgba(4,24,74,0.8)'
        // borderWidth: 5,
        // borderColor: 'red',
      }
    }
  ]
}

//学科实验开课率
export const expBookRateBySubjectChart = {
  xAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    },
  },
  yAxis: {
    type: 'category',
    data: []
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: '{b} {c} %'
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '25%',
    bottom: '5%',
    containLabel: true
  },
  series: [
    {
      data: [],
      type: 'bar',
      barMaxWidth: 50,
      itemStyle: {
        color: '#008aff'
      }
    }
  ]
}

//开课率
export const openCourse = {
  xAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  yAxis: {
    type: 'category',
    data: [],
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: '{b} {c} %'
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '10%',
    bottom: '0%',
    containLabel: true
  },
  series: [
    {
      data: [],
      type: 'bar',
      barMaxWidth: 50,
      itemStyle: {
        color: '#008aff'
      }
    }
  ]
}
//学科开课数
export const subject = {
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '10%',
    bottom: '0%',
    containLabel: true
  },
  series: [
    {
      data: [],
      type: 'bar',
      barMaxWidth: 50,
      itemStyle: {
        color: '#008aff'
      }
    }
  ]
}
//开课频次图表配置
export const frequency = {
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '10%',
    bottom: '0%',
    containLabel: true
  },
  series: [
    {
      name: '分组实验',
      data: [],
      type: 'line'
    },
    {
      name: '演示实验',
      data: [],
      type: 'line'
    }
  ]
}
//年级开课数
export const classOpenCourse = {
  xAxis: {
    type: 'value',
    splitLine: {//分割线配置
      show: true,
      lineStyle: {
        color: "#002648",
      }
    }
  },
  yAxis: {
    type: 'category',
    data: []
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '0%',
    right: '5%',
    top: '10%',
    bottom: '0%',
    containLabel: true
  },
  series: [
    {
      data: [],
      type: 'bar',
      barMaxWidth: 50,
      itemStyle: {
        color: '#008aff'
      }
    },
  ]
}


export const map = {
  tooltip: {
    trigger: "item",
    // formatter: (params: any) => `${params.name}: <br /> ${params.value || 0}`
  },
  visualMap: {
    min: 0,
    max: 50000000,
    color: '#fff',
    right: 20,
    bottom: 20,
    textStyle: {
      color: '#fff'
    },
    pieces: [
      {
        gt: 5000000,
        label: '500万以上',
        color: '#2D99F6'
      },
      {
        gte: 3000000,
        lte: 5000000,
        label: '300万 ~ 500万',
        color: '#1862A0'
      },
      {
        lt: 3000000,
        label: '300万以下',
        color: '#02416F'
      }
    ]
  },

  series: [
    {
      type: 'map',
      map: 'jiangsu',
      name: '',
      // roam: false,
      // label: {
      //   fontsSize: 10,
      //   // fontWeight: 'bold',
      //   normal: {
      //     show: true,
      //     color: '#fff'
      //   },
      //   emphasis: {
      //     show: false
      //   }
      // },
      itemStyle: {
        borderColor: '#fff',
        areaColor: '#fff',
        // normal: {
        //   borderColor: '#2980b9',
        //   borderWidth: 1,
        //   areaColor: '#00538f'
        // },
      },
      // emphasis: { label: { show: true, color: '#02416f' } },
      data: []
    }
  ]
}
//功能室总量达标统计图表配置
export const laboratoryComplianceRate = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} {d}%'
    // formatter: function (data: any) {
    //   // console.log(data)
    //   return data.name + " : " + data.value * 100 + "%";
    // }
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '50%'],
      radius: '50%',
      label: {
        show: true
      },
      data: []
    }
  ]
}
export const rateOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} {d}%'
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '50%'],
      radius: '60%',
      label: {
        show: false
      },
      data: [

      ]
    }
  ]
}
