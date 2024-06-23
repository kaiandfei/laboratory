<template>
  <div class="today-course">
    <div
      class="today-course-main"
      :style="{ backgroundColor: option?.bgColor || '#fff' }"
    >
      <div class="herder">
        <img class="bookmark" src="@/assets/images/laboratory/bookmark.png" alt="" />
        <span
          class="course"
          :style="{ color: option.color, fontSize: option.fontSize + 'px' }"
          >{{ `${title}（${date}）` }}</span
        >
      </div>
      <div class="main">
        <component
          v-if="labBookData.length > 0"
          :is="currComponent"
          :labBookData="labBookData"
          @handleTabClick="handleTabClick"
          :row.sync="row"
          :option="option"
          :style="{ backgroundColor: option?.bgColor || '#fff' }"
        ></component>
        <div class="no-data" v-else>暂无课程</div>
      </div>
    </div>
    <div class="today-course-tabs">
      <div
        class="tabs-item"
        :class="currActive === index ? 'active' : ''"
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleTabClick(index)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import localCache from '@/utils/localCache'
import { getDate } from '@/utils/week-date'
import schoolBegins from '@/views/electronic-doorplate/electronic-doorplate-main/component/school-begins.vue'
import noSchoolBegins from '@/views/electronic-doorplate/electronic-doorplate-main/component/no-school-begins.vue'
import courseStarted from '@/views/electronic-doorplate/electronic-doorplate-main/component/course-started.vue'
import { getLabBook } from '@/api/index.js'
export default {
  name: 'TodayCourse',
  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      date: '',
      currActive: 0,
      currComponent: schoolBegins,
      tabs: [
        {
          label: '开课中',
        },
        {
          label: '暂未开课',
        },
        {
          label: '已开课',
        },
      ],
      labBookData: [],
      row: {},
    }
  },
  computed: {
    title() {
      return localCache.getCookie('isSystem') === '1' || !localCache.getCookie('isSystem')
        ? '今日课程'
        : this.option.title
    },
  },
  created() {
    console.log('12312', localCache.getCookie('isSystem'))
    this.date = getDate()
    this.getLabBookData(1, true)
  },
  mounted() {},
  methods: {
    handleTabClick(i) {
      this.labBookData = []
      this.currActive = i
      localCache.setCookie('currActive', this.currActive)
      switch (i) {
        case 0:
          this.currComponent = schoolBegins
          break
        case 1:
          this.currComponent = noSchoolBegins
          break
        case 2:
          this.currComponent = courseStarted
          break
      }
      this.getLabBookData(i + 1)
    },
    //获取实验室预约
    async getLabBookData(value, bol) {
      let params = {
        // lab_id: 227,
        lab_id: parseInt(localCache.getCookie('labor_id')),
        class_status: value,
      }
      if (value === 1) {
        params['one'] = 1
      }
      try {
        const { code, data } = await getLabBook(params)
        if (code === 10) {
          this.labBookData = data
          if (Array.isArray(this.labBookData) && this.labBookData.length === 0 && bol) {
            this.handleTabClick(1)
          }
          localCache.setCookie('courseId', this.labBookData[0]?.id)
          if (value === 1 && data.length > 0) {
            localCache.setCookie('flag', 1)
          } else if (value === 1 && data.length === 0) {
            localCache.setCookie('flag', 0)
          }
          // console.log(data)
        }
      } catch (error) {
        this.labBookData = []
        console.log(error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.today-course {
  width: 100%;
  height: 100%;
  text-align: center;
  border-radius: 5px;
  .today-course-main {
    display: flex;
    flex-direction: column;
    height: 89%;
    background: #fff;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    border-radius: 10px 10px 10px 10px;
    margin-bottom: 0.8%;
  }
  .today-course-tabs {
    display: flex;
    height: 10%;
    .tabs-item {
      width: 33%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      background: #e8f9f6;
      box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
      border-radius: 10px 10px 10px 10px;
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 5px;
      }
    }
    .active {
      color: #329581;
      background: #fff;
    }
  }
}
.herder {
  line-height: 55px;
  display: flex;
  align-items: center;

  .bookmark {
    width: 27px;
    height: 55px;
    margin: 0 20px 0 50px;
  }
  .course {
    font-size: 16px;
    font-weight: bold;
    color: #329581;
  }
}
.main {
  height: calc(100% - 55px);
  padding: 10px 20px;
  box-sizing: border-box;
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 30px;
    font-weight: bold;
    // box-shadow: 0px 3px 6px 1px #61cab5;
    // border-radius: 10px;
    // border: 1px solid #61cab5;
  }
}
</style>
