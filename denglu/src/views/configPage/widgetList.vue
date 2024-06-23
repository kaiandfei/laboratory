<template>
  <div class="widget-container">
    <div class="count">
      <div class="count-title">
        <div class="triangle"></div>
        组件
      </div>

      <div class="count-list">
        <div
          class="count-item"
          v-for="(item, index) in listData.count"
          :key="index"
          draggable="true"
          @mousedown="(e) => onMousedown(e, item)"
        >
          <component :is="item.template" :item="item" :isDefaultValue="true"></component>
        </div>
      </div>
    </div>
    <div class="lab-list">
      <div
        class="lab-item"
        v-for="(item, index) in listData.labList"
        :key="index"
        draggable="true"
        @mousedown="(e) => onMousedown(e, item)"
      >
        <component :is="item.template" :item="item" :isDefaultValue="true"></component>
      </div>
    </div>
    <div class="widget-list">
      <div
        v-for="(widgetItem, index) in listData.chart"
        :key="index"
        class="widget"
        draggable="true"
        @mousedown="(e) => onMousedown(e, widgetItem)"
      >
        <!-- <div>{{ widgetItem.title }}</div> -->
        <component
          v-if="widgetItem.template"
          :is="widgetItem.template"
          :item="widgetItem"
          :isDefaultValue="true"
        ></component>
        <img
          v-if="widgetItem.isCustom"
          class="delImg"
          src="@/assets/images/bigData/del.png"
          alt=""
          @click="handleDel(widgetItem)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { diagramComponentList, deleteComponent } from '@/service/dataPage/index'
import { ElMessage } from 'element-plus'
const props = defineProps(['list'])
let listData = ref<any>({})
const $emit = defineEmits(['onMousedown'])
const onMousedown = (e: MouseEvent, widgetItem: any) => {
  $emit('onMousedown', e, widgetItem)
}
const getCustomOption = (_val: number) => {
  let customOptionObj: any = {}
  switch (_val) {
    case 1:
      customOptionObj = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value',
          splitLine: {
            //分割线配置
            show: true,
            lineStyle: {
              color: '#002648'
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
            data: [],
            type: 'bar',
            itemStyle: {
              color: '#008aff'
            }
          }
        ]
      }
      break
    case 2:
      customOptionObj = {
        xAxis: {
          type: 'value',
          splitLine: {
            //分割线配置
            show: true,
            lineStyle: {
              color: '#002648'
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
          // formatter: '{b} {c} %'
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
            data: [],
            type: 'bar',
            itemStyle: {
              color: '#008aff'
            }
          }
        ]
      }
      break
    case 3:
      customOptionObj = {
        tooltip: {
          trigger: 'item'
          // formatter: '{b} {d}%'
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '55%'],
            radius: '50%',
            label: {
              show: false
            },
            data: []
          }
        ]
      }
      break
    case 4:
      customOptionObj = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value',
          splitLine: {
            //分割线配置
            show: true,
            lineStyle: {
              color: '#002648'
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
            data: [],
            type: 'line'
          }
        ]
      }
      break
  }
  return customOptionObj
}
const getComponentList = async () => {
  listData.value = JSON.parse(JSON.stringify(props.list))
  try {
    const { data, code } = await diagramComponentList()
    if (code === 10) {
      let obj = {
        isCustom: true,
        flagNum: 0,
        type: '',
        template: 'chart',
        title: '',
        params: {},
        customOption: {}
      }
      for (let i = 0; i < data.length; i++) {
        obj.flagNum = data[i].type === 1 ? 20 : data[i].type === 2 ? 30 : data[i].type === 3 ? 40 : 50
        obj.type =
          data[i].type === 1
            ? 'bar-chart'
            : data[i].type === 2
            ? 'bar-chart'
            : data[i].type === 3
            ? 'pie-chart'
            : 'line-chart'
        obj.title = data[i].name
        obj.params = JSON.parse(data[i].param)
        obj.customOption = getCustomOption(data[i].type)
        listData.value.chart.push({ ...data[i], ...obj })
      }
      console.log('getComponentList', listData.value)
    }
  } catch (error) {
    console.log('err', error)
  }
}
getComponentList()

const handleDel = async (item: any) => {
  try {
    let params = {
      id: item.id
    }
    const { code } = await deleteComponent(params)
    if (code === 10) {
      ElMessage({
        type: 'success',
        message: '组件删除成功'
      })
      getComponentList()
    }
  } catch (error) {
    console.log('err', error)
  }
  console.log('123', item)
}
</script>

<style lang="scss" scoped>
.count-title {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 24px;
  font-weight: bold;
}
.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 16px;
  border-color: #5fafe4 transparent transparent transparent;
  position: relative;
  top: 10px;
  margin-right: 5px;
}

.triangle:after {
  content: '';
  border-style: solid;
  border-width: 11px;
  border-color: #fff transparent transparent transparent;
  position: absolute;
  top: -14px;
  left: -11px;
}
.widget-container {
  width: 35%;
  background-color: white;
  overflow-y: auto;
}
.count {
  width: 100%;
  height: 450px;
  padding: 20px;
  box-sizing: border-box;
  .count-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: calc(100% - 50px);
    .count-item {
      width: 32%;
      height: 30%;
      background-color: #0a234f;
      border-radius: 8px;
      border: 1px solid #099eca;
    }
  }
}
.lab-list {
  padding: 0 20px 20px;
  .lab-item {
    border-radius: 16px;
    background-color: #0a234f;
  }
}
.widget-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: 18px;
  padding: 0 20px;

  .widget {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 48%;
    height: 200px;
    background-color: #0a234f;
    border-radius: 8px;
    border: 1px solid #099eca;
    margin-bottom: 20px;
    position: relative;
    .delImg {
      width: 15px;
      position: absolute;
      right: 0;
      top: 0;
      background-color: #0d3150;
      border-radius: 5px;
      padding: 5px 10px;
      cursor: pointer;
    }
  }
}
</style>
