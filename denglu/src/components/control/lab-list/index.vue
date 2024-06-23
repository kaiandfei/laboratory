<template>
  <ul class="open-course-list" v-if="listData?.length !== 0">
    <li>实验开课列表</li>
    <li v-for="(item, index) in listData" :key="index">
      {{
        `${item.school_name}/${item.laboratory_name}/${[...item.exp_name]}/${GRADEARR[item.grade]}/${
          item.teacher_name
        }/${item.start}`
      }}
    </li>
  </ul>
  <div v-else class="empty">No Data</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { GRADEARR } from '@/constents/common'
import { expBookDate } from '@/service/dataPage/index'
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  isDefaultValue: {
    type: Boolean,
    default: true
  },
  city: {
    type: [String, Number],
    default: ''
  },
  area: {
    type: [String, Number],
    default: ''
  },
  school: {
    type: String,
    default: ''
  },
  schoolyear: {
    type: [String, Number],
    default: ''
  }
})
watch(
  () => props.schoolyear,
  (newValue, oldValue) => {
    school_year.value = Number(newValue.split(',')[0])
    semester.value = Number(newValue.split(',')[1])
    getUseList()
  }
)
let school_year = ref<number | string>(Number(props.schoolyear.split(',')[0] || ''))
let semester = ref<number | string>(Number(props.schoolyear.split(',')[1] || ''))
let listData = ref<any>([])
let params = {
  city: props.city,
  area: props.area,
  school_id: props.school,
  school_year: school_year.value,
  semester: semester.value
}
const getUseList = async () => {
  try {
    const { data, code } = await expBookDate(params)
    if (code === 10) {
      listData.value = data?.slice(0, 20)
    }
  } catch (error) {
    console.log('useList', error)
  }
}
if (!props.isDefaultValue) {
  console.log('useList')
  switch (props.item.flagNum) {
    case 0:
      getUseList()
      break
  }
} else {
  if (props.item.list) listData.value = JSON.parse(JSON.stringify(props.item.list))
}

watch([() => props.city, () => props.area, () => props.school, () => props.standardLevel], (newValue, oldValue) => {
  params = {
    city: props.city,
    area: props.area,
    school_id: props.school,
    school_year: school_year.value,
    semester: semester.value
  }
  listData.value = []
  getUseList()
})
</script>

<style lang="scss" scoped>
.open-course-list {
  width: 100%;
  height: 100%;
  text-align: left;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: auto;
  cursor: pointer;
  li {
    font-size: 14px;
    line-height: 35px;
    color: #fff;
    border-bottom: 1px solid #317cab;
    padding: 5px 20px;
    box-sizing: border-box;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  li:first-child {
    font-size: 20px;
    border-bottom: none;
    text-align: center;
  }
}
.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
  font-size: 18px;
}
</style>
