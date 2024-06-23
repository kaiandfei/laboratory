<template>
  <div class="main">
    <el-dialog
      :title="'更改上课班级(' + date + ')'"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="grade-list-box">
        <div
          :class="{
            'check-list': checkList.some((e) => e.class_id === item.class_id),
            'list-item': true,
          }"
          v-for="(item, index) in computedClasslist"
          :key="index"
          @click="clickItem(item)"
        >
          <p class="grade">
            <img
              v-show="checkList.some((e) => e.class_id === item.class_id)"
              src="@images/common/round-right.png"
              alt=""
            />
            <span>{{ $store.state.gradeArr[item.grade] + item.class_name }}</span>
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
import { getClassByTeacher } from '@network/subscribe'
export default {
  name: 'GradeList',
  props: {
    isShow: Boolean,
    clickList: {
      type: Array,
      default: () => [],
    },
    grade_xu: {
      type: [String, Number],
      default: '',
    },
    date: { type: String, required: true },
  },
  data() {
    return {
      dialogVisible: false,
      classlist: [],
      checkList: [],
    }
  },
  computed: {
    computedClasslist() {
      const arr = this.classlist.filter((e) =>
        this.grade_xu ? e.grade === this.grade_xu : true
      )
      return arr
    },
  },
  watch: {
    isShow(n) {
      this.dialogVisible = n
      if (n) {
        this.getData()
      }
    },
    dialogVisible(n) {
      if (!n) {
        this.back()
      }
    },
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.$store.getters.getUserMsg.role_id !== 2) {
        getClassByTeacher().then((res) => {
          this.classlist = res.data
          this.checkList = []
          if (this.clickList.length !== 0) {
            this.clickList.forEach((e) => {
              this.checkList.push({
                ...e,
                grade: e.grade_xu,
              })
            })
          }
        })
      } else {
        this.classlist = this.$store.state.classList.map((e) => {
          return {
            class_id: e.id,
            class_name: e.name,
            grade: e.grade_id,
          }
        })
        this.checkList = []
        if (this.clickList.length !== 0) {
          this.clickList.forEach((e) => {
            this.checkList.push({
              ...e,
              grade: e.grade_xu,
            })
          })
        }
      }
      // getClassByTeacher().then((res) => {
      //   this.classlist = res.data
      // })
    },
    clickItem(item) {
      const index = this.checkList.findIndex((e) => e.class_id === item.class_id)
      if (index === -1) {
        this.checkList.push(item)
      } else {
        this.checkList.splice(index, 1)
      }
    },
    sureClick() {
      this.$emit('sureClick', this.checkList)
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
    margin-top: 5vh !important;
    background: #e8e8e9;
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
          display: flex;
          align-items: center;
          width: 90%;
          height: 50px;
          line-height: 50px;
          background: #ffffff;
          box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
          user-select: none;
          & > .grade {
            // float: left;
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
          // & > .tip {
          //   float: right;
          //   color: #EE9A59;
          // }
        }
        .check-list {
          background: #dcece3;
        }
      }
    }
  }
}
</style>
