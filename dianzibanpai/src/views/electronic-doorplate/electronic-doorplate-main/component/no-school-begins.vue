<template>
  <div class="container">
    <el-table
      :data="tableData"
      :style="{
        color: option.contentColor,
        fontSize: option.contentSize + 'px',
        width: '100%',
      }"
      :max-height="250"
      :show-header="false"
    >
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        align="left"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button type="primary" @click="openFaceRecognition(scope.row)"
            >签到</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <face-recognition
      ref="faceRecognitionRef"
      :isSignIn="isSignIn"
      @handleSignIn="handleSignIn"
    />
  </div>
</template>

<script>
import { gradeList, sectionList } from '@/contants/index.js'
import { electronicHouseNumberOpen } from '@/utils/device-interaction'
import { sign } from '@/api/index.js'
import faceRecognition from '../dialog/face-recognition.vue'
import signInSuccess from './sign-in-success.vue'
import localCache from '@/utils/localCache'
export default {
  components: {
    faceRecognition,
  },
  props: {
    labBookData: {
      type: Array,
      default: () => [],
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableData: [],
      beginLabBookData: {},
      isSignIn: false,
      columns: [
        {
          prop: 'section',
        },
        {
          prop: 'expName',
        },
        {
          prop: 'className',
        },
        {
          prop: 'username',
        },
      ],
    }
  },
  inject: ['closeSetInterval'],
  computed: {
    flag() {
      return localCache.getCookie('flag')
    },
  },
  mounted() {
    this.format(this.labBookData)
    this.beginLabBookData = this.labBookData[0]
  },
  methods: {
    format(data) {
      this.tableData = []
      data.forEach((item) => {
        let obj = {}
        obj['section'] = `第${sectionList[item.section - 1]}节`
        obj['expName'] = item.expName
        obj['id'] = item.id
        obj['className'] = gradeList[parseInt(item.grade) - 1] + item.className
        obj['username'] = item.teacherInfo.username
        this.tableData.push(obj)
      })
    },
    openFaceRecognition(row) {
      this.closeSetInterval()
      this.$emit('update:row', row)
      this.$refs.faceRecognitionRef.dialogVisible = true
      if (this.flag === '1') {
        this.$refs.faceRecognitionRef.toggleComponent(
          signInSuccess,
          3,
          true,
          '上一节实验课未结束，签到失败！'
        )
      } else {
        this.isSignIn = true
        this.$refs.faceRecognitionRef.initCom()
      }
    },
    async handleSignIn() {
      console.log(85, this.row)
      // 调用签到接口
      try {
        let params = {
          id: this.row.id,
        }
        const { code } = await sign(params)
        this.$refs.faceRecognitionRef.dialogVisible = true
        if (code === 10) {
          electronicHouseNumberOpen('1')
          this.$message({
            type: 'success',
            message: `欢迎${localCache.getCookie('userName')}来上课~`,
            duration: 1500,
          })
          this.$refs.faceRecognitionRef.handleClose()
          setTimeout(() => {
            this.$emit('handleTabClick', 0)
          }, 500)
          // this.$refs.faceRecognitionRef.toggleComponent(signInSuccess, 3)
        } else {
          electronicHouseNumberOpen('0')
          this.$refs.faceRecognitionRef.handleClose()
          // this.$refs.faceRecognitionRef.toggleComponent(signInSuccess, 3, true, msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background: #ffffff;
  // box-shadow: 0px 3px 6px 1px #61cab5;
  // border-radius: 10px;
  // border: 1px solid #61cab5;
  overflow: auto;
  .el-table {
    border-radius: 10px;
  }
}
</style>
