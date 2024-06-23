<template>
  <div class="main">
    <el-dialog
      :title="date ? '更改上课班级(' + date + ')' : '班级选择'"
      top="20vh"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="grade-list-box">
        <div
          :class="{
            'check-list': checkItem.class_id === item.class_id,
            'list-item': true,
          }"
          v-for="(item, index) in classlist"
          :key="index"
          @click="clickItem(item)"
        >
          <p class="grade">
            <img
              v-show="checkItem.class_id === item.class_id"
              src="@images/reservation/round-right.png"
              alt=""
            />
            <span>{{ $store.state.gradeArr[item.grade] + '' + item.class_name }}</span>
          </p>
          <p v-if="item.needClass" class="tip">该时间点开课</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getClassByTeacher, findSection } from '@/api/index'

export default {
  name: 'GradeList',
  props: {
    isShow: Boolean,
    date: String,
    weekend: [String, Number],
    section: [String, Number],
  },
  data() {
    return {
      dialogVisible: false,
      checkItem: {},
      classlist: [],
    }
  },
  computed: {
    computedTime() {
      return this.weekend + '' + this.section
    },
  },
  watch: {
    isShow(n) {
      this.dialogVisible = n
    },
    dialogVisible(n) {
      if (!n) {
        this.back()
      }
    },
    computedTime() {
      this.getReference()
    },
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      getClassByTeacher().then((res) => {
        this.classlist = res.data
      })
    },
    getReference(grade) {
      findSection({ grade_xu: grade }).then((res) => {
        if (res.code === 10) {
          const arr = res.data.filter((e) => {
            return e.user_id === this.$store.getters.getUserMsg.id
          })
          this.classlist = this.classlist.map((e) => {
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
            this.classlist
          )
        }
      })
    },
    clickItem(item) {
      this.checkItem = item
      this.$emit('sureClick', this.checkItem)
      this.back()
    },
    sureClick() {
      this.$emit('sureClick', this.checkItem)
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
    text-align: center;
    background-color: #e8e8e9;
    border-radius: 20px;
    overflow: hidden;
    .el-dialog__header {
      background-color: #61cab5;
      .el-dialog__title {
        color: #fff;
      }
    }
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
