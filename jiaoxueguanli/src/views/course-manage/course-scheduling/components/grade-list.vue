<template>
  <div class="main">
    <el-dialog
      :title="date ? '更改上课班级(' + date + ')' : '班级选择'"
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
          v-for="(item, index) in classList"
          :key="index"
          @click="clickItem(item)"
        >
          <p class="grade">
            <img v-show="item.check" src="@images/common/round-right.png" alt="" />
            <span>{{ $store.state.gradeArr[item.grade] + '' + item.class_name }}</span>
          </p>
          <p v-if="item.needClass" class="tip">该时间点开课</p>
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
import { selectSchoolClass, getClassByTeacher, findSection } from '@network/subscribe'

export default {
  name: 'GradeList',
  props: {
    isShow: Boolean,
    date: String,
    weekend: [String, Number],
    filterData: Object,
    type: Number,
    checkList: Array,
    section: [String, Number],
  },
  data() {
    return {
      dialogVisible: true,
      checkItemList: [],
      classList: [],
    }
  },
  computed: {
    // classList() {
    //   const arr = [...this.$store.state.classList].sort((a, b) => {
    //     return a.name < b.name ? -1 : 1
    //   }).sort((a, b) => {
    //     return a.grade_id - b.grade_id
    //   })
    //   return arr
    // }
    computedTime() {
      return this.weekend + '' + this.section
    },
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
    computedTime(n) {
      console.log('🚀 ~ file: grade-list.vue:79 ~ computedTime ~ n:', n)
      if (!n) {
        // this.checkItemList = []
      }
    },
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      if (this.type === 3) {
        // console.log('🚀 ~ file: grade-list.vue ~ line 69 ~ getData ~ this.$store.state', this.$store.state)
        selectSchoolClass(this.filterData).then((res) => {
          this.classList = res.data.map((e) => {
            let obj = {
              ...e,
              class_id: e.id,
              class_name: e.name,
              grade: e.grade_id,
              grade_name: this.$store.state.gradeArr[e.grade_id],
              check: false,
            }
            let objFind = this.checkList.find((m) => m.id === obj.class_id)
            console.log(
              '🚀 ~ file: grade-list.vue:102 ~ this.classList=res.data.map ~ objFind:',
              objFind
            )
            if (objFind) {
              obj.check = true
            }
            return obj
          })
          this.getReference()
        })
      } else {
        if (this.$store.getters.getUserMsg.role_id !== 2) {
          getClassByTeacher().then((res) => {
            this.classList = res.data.map((e) => {
              let obj = {
                ...e,
                grade_name: this.$store.state.gradeArr[e.grade],
                check: false,
              }
              let objFind = this.checkList.find((m) => m.id === e.class_id)
              if (objFind) {
                obj.check = true
              }
              return obj
            })
            this.getReference()
          })
        } else {
          this.classList = []
          this.$store.state.classList.forEach((e) => {
            let obj = {
              class_id: e.id,
              class_name: e.name,
              grade: e.grade_id,
              grade_name: this.$store.state.gradeArr[e.grade_id],
              check: false,
            }
            let objFind = this.checkList.find((m) => m.id === e.class_id)
            if (objFind) {
              obj.check = true
            }
            let time_ids = this.filterData.time_ids
            if (time_ids - 1 === 0 && e.grade_id <= 6) {
              this.classList.push(obj)
            } else if (time_ids - 2 === 0 && e.grade_id > 6 && e.grade_id <= 9) {
              this.classList.push(obj)
            } else if (time_ids - 3 === 0 && e.grade_id > 9) {
              this.classList.push(obj)
            }
          })
          this.getReference()
        }
      }
    },
    getReference(grade) {
      findSection({ grade_xu: grade }).then((res) => {
        if (res.code === 10) {
          const arr = res.data.filter((e) => {
            return this.$store.getters.getUserMsg.role_id === 4
              ? e.user_id === this.$store.getters.getUserMsg.id
              : true
          })
          this.classList = this.classList.map((e) => {
            const flag = arr.some((m) => {
              return (
                e.class_id === m.class_id &&
                m.week === this.weekend &&
                m.section_xu === this.section
              )
            })
            if (flag) {
              return {
                ...e,
                needClass: true,
              }
            } else {
              return {
                ...e,
                needClass: false,
              }
            }
          })
          console.log(
            '🚀 ~ file: grade-list.vue ~ line 98 ~ findSection ~ arr',
            this.classList
          )
        }
      })
    },
    clickItem(item) {
      if (!item.check && this.type !== 3) {
        if (this.classList.filter((e) => e.check).length > 0) {
          this.$message({
            type: 'warning',
            message: '分组、演示只可选择一个班级',
          })
          return
        }
      }
      item.check = !item.check
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
    sureClick() {
      this.checkItemList = []
      this.classList.forEach((e) => {
        if (e.check) this.checkItemList.push(e)
      })
      if (this.checkItemList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择班级',
        })
        return
      }
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
