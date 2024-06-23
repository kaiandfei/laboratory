<template>
  <div class="main">
    <div class="Box">
      <div class="top-select">
        <div class="top-select-left">
          <span>我的实验数据统计详情</span>
          <el-select
            v-model="valueGrade"
            @change="getData()"
            clearable
            placeholder="请选择年级"
          >
            <el-option
              v-for="item in optionsGrade"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-if="roleId === 3"
            v-model="valueTeacher"
            @change="getData()"
            clearable
            placeholder="请选择教师"
          >
            <el-option
              v-for="item in optionsTeacher"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="top-select-right">
          <el-select
            v-model="valueYear"
            @change="getData()"
            clearable
            placeholder="请选择学年"
          >
            <el-option
              v-for="item in optionsYear"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="valueType"
            @change="getData()"
            clearable
            placeholder="请选择学期"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <teacher-view v-if="roleId === 4" :screenMessage="screenMessage" />
      <leader-view v-if="roleId === 3" :screenMessage="screenMessage" />
      <admin-view v-if="roleId === 2" :screenMessage="screenMessage" />
    </div>
  </div>
</template>

<script>
import AdminView from './components/adminView.vue'
import LeaderView from './components/leaderView.vue'
import teacherView from './components/teacherView.vue'
export default {
  components: { teacherView, AdminView, LeaderView },
  name: 'DataStatistics',
  data() {
    return {
      roleId: this.$store.state.userMsg.role_id,
      valueGrade: '',
      optionsGrade: [
        {
          value: '7',
          label: '七年级',
        },
        {
          value: '8',
          label: '八年级',
        },
        {
          value: '9',
          label: '九年级',
        },
      ],
      valueTeacher: '',
      optionsTeacher: [
        {
          value: '李老师',
          label: '李老师',
        },
        {
          value: '黄老师',
          label: '黄老师',
        },
        {
          value: '张老师',
          label: '张老师',
        },
      ],
      valueYear: '',
      optionsYear: [
        {
          value: '2020',
          label: '2020学年',
        },
        {
          value: '2021',
          label: '2021学年',
        },
        {
          value: '2022',
          label: '2022学年',
        },
      ],
      valueType: '',
      optionsType: [
        {
          value: '1',
          label: '第一学期',
        },
        {
          value: '2',
          label: '第二学期',
        },
      ],
      screenMessage: {},
    }
  },
  created() {},
  mounted() {},
  methods: {
    getData() {
      this.screenMessage = {
        grade: this.valueGrade,
        teacher: this.valueTeacher,
        school_year: this.valueYear,
        semester: this.valueType,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  padding: 20px 32px 0 32px;
  min-height: 800px;
  .Box {
    background: #fff;
    padding: 10px;
  }
  .top-select {
    text-align: left;
    height: 50px;
    .top-select-left {
      float: left;
    }
    .top-select-right {
      float: right;
    }
    ::v-deep .el-select {
      margin-left: 10px;
      width: 200px;
      .el-input__inner {
        width: 200px !important;
      }
    }
  }
}
</style>
<style>
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 10px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(31, 228, 58, 0.4);
}
</style>
