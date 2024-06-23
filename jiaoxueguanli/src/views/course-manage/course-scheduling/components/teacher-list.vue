<template>
  <div class="main">
    <el-dialog
      :title="'选择教师'"
      top="6vh"
      :visible.sync="dialogVisible"
      :modal="false"
      width="30%"
    >
      <div class="grade-list-box">
        <div
          :class="{
            'check-list': item.check,
            'list-item': true,
          }"
          v-for="(item, index) in teacherList"
          :key="index"
          @click="clickItem(item)"
        >
          <p class="grade">
            <img v-show="item.check" src="@images/common/round-right.png" alt="" />
            <span>{{ item.teacher_name }}</span>
          </p>
          <p class="tip">
            <el-radio :value="item.is_main" :label="1" @input="changeMain(index)"
              >主要负责人</el-radio
            >
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="back">取 消</el-button>
        <el-button type="primary" @click="sureClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getClassByTeacher } from '@network/subscribe'
import { mapState } from 'vuex'

export default {
  name: 'TeacherList',
  props: {
    isShow: Boolean,
    date: String,
    filterData: Object,
    checkList: Array,
    weekend: [String, Number],
    section: [String, Number],
  },
  data() {
    return {
      dialogVisible: true,
      checkItemList: [],
      teacherList: [],
    }
  },
  computed: {
    computedTime() {
      return this.weekend + '' + this.section
    },
    ...mapState({
      teacherArr: 'teacherArr',
    }),
  },
  watch: {
    // isShow(n) {
    //   this.dialogVisible = n
    // },
    dialogVisible(n) {
      if (!n) {
        this.back()
      }
    },
    filterData(n) {
      if (!n) {
        // this.checkItemList = []
      }
      this.getData()
    },
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      // console.log('🚀 ~ file: grade-list.vue ~ line 69 ~ getData ~ this.$store.state', this.$store.state)
      this.teacherList = this.teacherArr.map((e) => {
        let obj = {
          ...e,
          teacher_id: e.id,
          teacher_name: e.username,
          is_main: 2,
          check: false,
        }
        let objFind = this.checkList.find((m) => m.teacher_id === obj.teacher_id)
        console.log(
          '🚀 ~ file: teacher-list.vue:100 ~ this.teacherList=this.teacherArr.map ~ objFind:',
          objFind
        )
        if (objFind) {
          obj.check = true
          obj.is_main = objFind.is_main
        }
        return obj
      })
    },

    clickItem(item) {
      item.check = !item.check
      if (!item.check) item.is_main = 2
      else {
        // 默认负责人
        if (this.teacherList.filter((e) => e.check).length === 1) {
          item.is_main = 1
        }
      }
      // this.checkItemList = item
      // this.$emit('sureClick', this.checkItemList)
      // this.back()
      // const index = this.checkList.indexOf(item)
      // if (index === -1) {
      //   this.checkList.push(item)
      // } else {
      //   this.checkList.splice(index, 1)
      // }
    },
    changeMain(index) {
      console.log('🚀 ~ file: teacher-list.vue:128 ~ changeMain ~ index:', index)
      this.teacherList = this.teacherList.map((e, i) => {
        return {
          ...e,
          check: i === index ? true : e.check,
          is_main: i === index ? 1 : 2,
        }
      })
    },
    sureClick() {
      this.checkItemList = []
      this.teacherList.forEach((e) => {
        if (e.check) this.checkItemList.push(e)
      })
      this.$emit('sureClick', this.checkItemList)
      this.back()
    },
    back() {
      this.$emit('back')
    },
  },
}
</script>

<style scoped lang="scss">
.main {
  ::v-deep .el-dialog {
    // margin-top: 5vh !important;
    background-color: #e8e8e9;
    .el-dialog__body {
      border-top: 1px solid #05c65d;
      .grade-list-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-height: 70vh;
        overflow-y: scroll;
        .list-item {
          margin-bottom: 10px;
          // display: flex;
          // align-items: center;
          // justify-content: space-around;
          width: 90%;
          height: 50px;
          line-height: 50px;
          background: #ffffff;
          box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
          user-select: none;
          & > .grade {
            float: left;
            position: relative;
            white-space: nowrap;
            display: flex;
            align-items: center;
            & > img {
              position: absolute;
              left: 30px;
              top: 50%;
              transform: translate(0, -50%);
              width: 20px;
              height: 20px;
            }
            & > span {
              margin-left: 80px;
            }
          }
          & > .tip {
            float: right;
            margin-right: 60px;
            color: #ee9a59;
          }
        }
        .check-list {
          background: #dcece3;
        }
      }
    }
  }
}
</style>
