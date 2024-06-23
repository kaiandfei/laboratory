const countOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} {d}%'
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '50%'],
      radius: '70%',
      label: {
        show: false
      },
      data: [75, 25]
    }
  ]
}
export const WIDGETLIST = {
  count: [{
    template: 'count',
    title: '装备应配总量',
    count: 3947,
    flagNum: 0,
  },
  {
    template: 'count',
    title: '装备实配总量',
    count: 10000,
    flagNum: 0
  },
  {
    template: 'count',
    title: '装备缺口总量',
    count: 28478,
    flagNum: 0
  },
  {
    template: 'count',
    title: '仪器总量达标率',
    type: 'pie-chart',
    customOption: countOption,
    flagNum: 0
  },
  {
    template: 'count',
    title: '仪器种类达标率',
    type: 'pie-chart',
    customOption: countOption,
    flagNum: 0
  },
  {
    template: 'count',
    title: '仪器金额达标率',
    type: 'pie-chart',
    customOption: countOption,
    flagNum: 0
  },
  {
    template: 'count',
    title: '实验开课数',
    count: 10000,
    flagNum: 1
  }],
  labList: [{
    template: 'lab-list',
    title: '实验开课列表',
    list: [
      {
        "id": 2202,
        "grade": "10",
        "school_id": 382,
        "subject_id": 2,
        "teacher_id": 11,
        "start": "2024-02-04 17:15:00",
        "laboratory_id": 227,
        "exp_name": [
          "简单配合物的制备(新)"
        ],
        "teacher_name": "黄老师",
        "school_name": "秦淮第一高中",
        "subject_name": "化学",
        "laboratory_name": "化学实验室"
      },
      {
        "id": 2201,
        "grade": "10",
        "school_id": 382,
        "subject_id": 2,
        "teacher_id": 11,
        "start": "2024-02-04 16:20:00",
        "laboratory_id": 227,
        "exp_name": [
          "简单配合物的制备(新)"
        ],
        "teacher_name": "黄老师",
        "school_name": "秦淮第一高中",
        "subject_name": "化学",
        "laboratory_name": "化学实验室"
      },
      {
        "id": 2200,
        "grade": "10",
        "school_id": 382,
        "subject_id": 2,
        "teacher_id": 11,
        "start": "2024-02-02 08:00:00",
        "laboratory_id": 227,
        "exp_name": [
          "简单配合物的制备(新)"
        ],
        "teacher_name": "黄老师",
        "school_name": "秦淮第一高中",
        "subject_name": "化学",
        "laboratory_name": "化学实验室"
      },
      {
        "id": 2199,
        "grade": "10",
        "school_id": 382,
        "subject_id": 2,
        "teacher_id": 11,
        "start": "2024-01-31 08:55:00",
        "laboratory_id": 227,
        "exp_name": [
          "简单配合物的制备(新)",
          "凝固压缩蜡烛金属酵母肺部"
        ],
        "teacher_name": "黄老师",
        "school_name": "秦淮第一高中",
        "subject_name": "化学",
        "laboratory_name": "化学实验室"
      },
    ],
    flagNum: 0,
  }],
  chart: [
    {
      flagNum: 0,
      type: 'bar-chart',
      template: 'chart',
      title: '功能室数量统计',
      customOption: {
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
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '5%',
          top: '25%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            data: [['物理', 120], ['化学', 200], ['生物', 150], ['小学科学', 80]],
            type: 'bar',
            barMaxWidth: 50,
            itemStyle: {
              color: '#008aff'
            }
          }
        ]
      },
    },
    {
      flagNum: 0,
      type: 'pie-chart',
      template: 'chart',
      title: '功能室数量',
      customOption: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '20%',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            type: 'pie',
            roseType: 'area',
            radius: ['10%', '80%'],
            center: ['50%', '35%'],
            label: {
              show: true
            },
            // adjust the start angle
            startAngle: 0,
            data: [
              { value: 1048, name: '物理' },
              { value: 735, name: '化学' },
              { value: 580, name: '生物' },
              { value: 484, name: '小学科学' },
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
      },
    },
    {
      flagNum: 1,
      type: 'pie-chart',
      template: 'chart',
      title: '功能室利用率',
      customOption: {
        tooltip: {
          trigger: 'item',
          formatter: '利用率70%'
        },
        title: {
          text: '70%',
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
          data: [70],
          showBackground: true,
          roundCap: true,
          backgroundStyle: {
            color: '#003c6b',
          },
          coordinateSystem: 'polar',
          barWidth: 20,
          itemStyle: {
            normal: {
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
            }
          },
        }]
      }
    },
    {
      flagNum: 2,
      type: 'pie-chart',
      template: 'chart',
      title: '功能室达标率',
      customOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} {d}%'
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '55%'],
            radius: '50%',
            label: {
              show: false
            },
            data: [{
              value: 70, name: '达标率', itemStyle: {
                color: '#0195ff'
              }
            }, {
              value: 30, name: '不达标率', itemStyle: {
                color: '#ea8200'
              }
            }]
          }
        ]
      }
    },
    {
      flagNum: 3,
      type: 'line-chart',
      template: 'chart',
      title: '装备总量增长趋势',
      customOption: {
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
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
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            name: '仪器',
            data: [59, 33, 12, 1, 12, 12, 34, 55, 64, 76, 3, 4],
            type: 'line',
            smooth: true,
            areaStyle: {}
          },
          {
            name: '设备',
            data: [1, 2, 4, 54, 32, 1, 34, 56, 6, 2, 34, 34],
            type: 'line',
            smooth: true,
            areaStyle: {}
          }
        ]
      }
    },
    {
      flagNum: 4,
      type: 'bar-chart',
      template: 'chart',
      title: '实验学科开课率',
      customOption: {
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
          data: ['物理', '化学', '生物', '小学科学']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b} {c} %'
        },
        grid: {
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            data: [40, 50, 60, 10],
            type: 'bar',
            barMaxWidth: 50,
            itemStyle: {
              color: '#008aff'
            }
          }
        ]
      }
    },
    {
      flagNum: 5,
      type: 'line-chart',
      template: 'chart',
      title: '实验频次',
      customOption: {
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
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [{
          data: [
            [
              "一月",
              29
            ],
            [
              "二月",
              12
            ],
            [
              "三月",
              45
            ],
            [
              "四月",
              6
            ],
            [
              "五月",
              34
            ],
            [
              "六月",
              12
            ],
            [
              "七月",
              56
            ],
            [
              "八月",
              10
            ],
            [
              "九月",
              50
            ],
            [
              "十月",
              20
            ],
            [
              "十一月",
              0
            ],
            [
              "十二月",
              0
            ]
          ],
          type: 'line'
        }]
      }
    },
    {
      flagNum: 6,
      type: 'bar-chart',
      template: 'chart',
      title: '年级开课数',
      customOption: {
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
          data: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            data: [10, 20, 30, 40, 50, 60, 70, 40, 30, 10, 30, 20],
            type: 'bar',
            barMaxWidth: 50,
            itemStyle: {
              color: '#008aff'
            }
          },
        ]
      }
    },
    {
      flagNum: 7,
      type: 'bar-chart',
      template: 'chart',
      title: '实验分组演示开课率',
      customOption: {
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
          data: ['演示实验', '分组实验', '总开课'],
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b} {c} %'
        },
        grid: {
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            data: [30, 10, 50],
            type: 'bar',
            barMaxWidth: 50,
            itemStyle: {
              color: '#008aff'
            }
          }
        ]
      }
    },
    {
      flagNum: 8,
      type: 'bar-chart',
      template: 'chart',
      title: '装备必配选配达标率',
      customOption: {
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
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            data: [10, 30],
            type: 'bar',
            barMaxWidth: 50,
            itemStyle: {
              color: '#008aff'
            }
          }
        ]
      }
    },
    {
      flagNum: 8,
      type: 'bar-chart',
      template: 'chart',
      title: '装备总量',
      customOption: {
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
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            data: [10, 30, 5],
            type: 'bar',
            barMaxWidth: 50,
            itemStyle: {
              color: '#008aff'
            }
          }
        ]
      }
    },
    {
      flagNum: 8,
      type: 'line-chart',
      template: 'chart',
      title: '装备总量达标率',
      customOption: {
        series: [
          {
            type: 'liquidFill',
            data: [0.6],
            radius: '50%',
            // 水球颜色
            color: ['#49d088', '#38b470', '#2aaf66'],
            center: ['50%', '60%'],
            outline: {
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
            }
          }
        ]
      }
    },
    {
      flagNum: 8,
      type: 'line-chart',
      template: 'chart',
      title: '装备种类达标率',
      customOption: {
        series: [
          {
            type: 'liquidFill',
            data: [0.6],
            radius: '50%',
            // 水球颜色
            color: ['#49d088', '#38b470', '#2aaf66'],
            center: ['50%', '60%'],
            outline: {
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
            }
          }
        ]
      }
    },
    {
      flagNum: 9,
      type: 'pie-chart',
      template: 'chart',
      title: '生均教学仪器设备达标率',
      customOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} {d}%'
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '55%'],
            radius: '50%',
            data: [{
              value: 46, name: '达标率', itemStyle: {
                color: '#0195ff'
              }
            }, {
              value: 60, name: '不达标率', itemStyle: {
                color: '#ea8200'
              }
            }]
          }
        ]
      }
    },
    {
      flagNum: 10,
      type: 'pie-chart',
      template: 'chart',
      title: '仪器利用率',
      customOption: {
        tooltip: {
          trigger: 'item',
          formatter: '60%'
        },
        title: {
          text: '60%',
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
          data: [60],
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
    },
    {
      flagNum: 11,
      type: 'pie-chart',
      template: 'chart',
      title: '装备状态',
      customOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} {d}%'
        },
        legend: {
          left: '80%',
          top: '40%',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['30%', '60%'],
            labelLine: {
              show: true
            },
            data: [
              {
                "name": "正常",
                "value": 0.6
              },
              {
                "name": "报废",
                "value": 0.1
              },
              {
                "name": "损坏",
                "value": 0.05
              },
              {
                "name": "借出",
                "value": 0.2
              },
              {
                "name": "维修",
                "value": 0.15
              }
            ]
          }
        ]
      }
    },
    {
      flagNum: 12,
      type: 'bar-chart',
      template: 'chart',
      title: '分类仪器总量达标率',
      customOption: {
        xAxis: {
          type: 'category',
          data: ['玻璃仪器', '测量仪器', '专用仪器', '其它实验材料和工具', '模型', '药品'],
          axisLabel: {}
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
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            data: [20, 50, 60, 80, 30, 40],
            type: 'bar',
            barMaxWidth: 50,
            itemStyle: {
              color: '#008aff'
            }
          }
        ]
      }
    },
    {
      flagNum: 13,
      type: 'pie-chart',
      template: 'chart',
      title: '功能室占比统计',
      customOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} {d}%'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '55%'],
            data: [{ name: '仪器室', value: 335 }, { name: '处理室', value: 310 }, { name: '实验室', value: 234 }, { name: '资料室', value: 135 },]
          }
        ]
      }
    },
    {
      flagNum: 5,
      type: 'line-chart',
      template: 'chart',
      title: '实验使用频次',
      customOption: {
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
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [{
          data: [
            [
              "一月",
              29
            ],
            [
              "二月",
              12
            ],
            [
              "三月",
              45
            ],
            [
              "四月",
              6
            ],
            [
              "五月",
              34
            ],
            [
              "六月",
              12
            ],
            [
              "七月",
              56
            ],
            [
              "八月",
              10
            ],
            [
              "九月",
              50
            ],
            [
              "十月",
              20
            ],
            [
              "十一月",
              0
            ],
            [
              "十二月",
              0
            ]
          ],
          type: 'line'
        }]
      }
    },
    {
      flagNum: 14,
      type: 'line-chart',
      template: 'chart',
      title: '实验开课率',
      customOption: {
        series: [
          {
            type: 'liquidFill',
            data: [0.6],
            radius: '50%',
            // 水球颜色
            color: ['#49d088', '#38b470', '#2aaf66'],
            center: ['50%', '60%'],
            outline: {
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
            }
          }
        ]
      }
    },
    {
      flagNum: 15,
      type: 'bar-chart',
      template: 'chart',
      title: '学科开课数',
      customOption: {
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
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            data: [['物理', 10], ['化学', 65], ['生物', 44], ['小学科学', 12]],
            type: 'bar',
            barMaxWidth: 50,
            itemStyle: {
              color: '#008aff'
            }
          }
        ]
      }
    },
    {
      flagNum: 16,
      type: 'line-chart',
      template: 'chart',
      title: '开课频次',
      customOption: {
        xAxis: {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
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
          left: '2%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        series: [
          {
            name: '分组实验',
            data: [10, 10, 11, 12, 10, 13, 40, 6, 18, 4, 30, 15],
            type: 'line'
          },
          {
            name: '演示实验',
            data: [12, 15, 40, 5, 30, 4, 12, 10, 12, 11, 11, 10],
            type: 'line'
          }
        ]
      }
    },
    {
      flagNum: 17,
      type: 'map-chart',
      template: 'chart',
      title: '地图',
      customOption: {
        tooltip: {
          trigger: "item",
        },
        visualMap: {
          min: 0,
          max: 50000000,
          color: '#fff',
          right: 10,
          bottom: 10,
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
            itemStyle: {
              borderColor: '#fff',
              areaColor: '#fff',
            },
            data: [{
              name: "新北区",
              value: 44210
            }, {
              name: "武进区",
              value: 6666589
            }, {
              name: "钟楼区",
              value: 33219103
            }, {
              name: "天宁区",
              value: 959521842
            }, {
              name: "金坛区",
              value: 66522814
            }, {
              name: "溧阳市",
              value: 665289
            },]
          }
        ]
      }
    },

  ]
}
