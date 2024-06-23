<template>
  <div
    class="main-item1"
    :style="{ color: option.contentColor, fontSize: option.contentSize + 'px' }"
  >
    <div class="mb20" style="height: 15%">{{ beginLabBookData.expName }}</div>
    <div class="mb20" style="height: 15%">
      {{ gradeList[parseInt(beginLabBookData.grade) - 1] + beginLabBookData.className }}
    </div>
    <div class="mb20" style="height: 52%">
      <img
        class="avatar"
        :src="
          beginLabBookData.teacherInfo?.headportrait ||
          require('@/assets/images/laboratory/avatar.png')
        "
        alt=""
      />
      <div class="user-name">{{ beginLabBookData.teacherInfo?.username }}</div>
    </div>
    <div class="btns mb20" style="height: 18%">
      <div class="primary-btn percentage" @click="openFaceRecognition(1)">签到</div>
      <div class="secondary-btn percentage" @click="openFaceRecognition(0)">签退</div>
    </div>
    <face-recognition
      ref="faceRecognitionRef"
      :isSignOut="isSignOut"
      :isSignIn="isSignIn"
      @handleSignOut="handleSignOut"
      @handleSignIn="handleSignIn"
    />
  </div>
</template>

<script>
import { gradeList } from '@/contants/index.js'
import LocalCache from '@/utils/localCache'
import { electronicHouseNumberOpen } from '@/utils/device-interaction'
import { sign, endSign } from '@/api/index.js'
import faceRecognition from '../dialog/face-recognition'
// import signInSuccess from './sign-in-success.vue'
export default {
  components: {
    faceRecognition,
  },
  props: {
    labBookData: {
      type: Array,
      default: () => [],
    },
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      gradeList: [],
      beginLabBookData: {},
      isSignIn: false,
      isSignOut: false,
    }
  },
  inject: ['closeSetInterval'],
  mounted() {
    this.gradeList = gradeList
    this.beginLabBookData = this.labBookData[0]
  },
  methods: {
    openFaceRecognition(val) {
      if (val === 1) {
        this.isSignIn = true
        this.isSignOut = false
      } else {
        this.isSignIn = false
        this.isSignOut = true
      }
      this.closeSetInterval()
      this.$refs.faceRecognitionRef.dialogVisible = true
      this.$refs.faceRecognitionRef.initCom()
    },
    //签到
    async handleSignIn() {
      // 调用签到接口
      try {
        let params = {
          id: this.beginLabBookData.id,
        }
        const { code } = await sign(params)
        this.$refs.faceRecognitionRef.dialogVisible = true
        if (code === 10) {
          electronicHouseNumberOpen('1')
          this.$message({
            type: 'success',
            message: `欢迎${LocalCache.getCookie('userName')}来上课~`,
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
    //签退
    async handleSignOut() {
      try {
        let params = {
          id: this.beginLabBookData.id,
        }
        const { code, data } = await endSign(params)
        if (code === 10) {
          console.log(data)
          this.$message({
            message: '签退成功',
            type: 'success',
          })
          LocalCache.setCookie('flag', 0)
          setTimeout(() => {
            this.$emit('handleTabClick', 0)
          }, 500)
          LocalCache.clearCookie('swr_token')
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.main-item1 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 60%;
  height: 100%;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  background: #fff;
  box-shadow: 0px 3px 6px 1px #61cab5;
  border-radius: 10px 10px 10px 10px;
  border: 1px solid #61cab5;
  margin: 0 auto;
  padding: 2% 0 0;
  box-sizing: border-box;

  .btns {
    display: flex;
    justify-content: space-evenly;
    font-weight: 400;
  }

  .mb20 {
    margin-bottom: 1%;

    .avatar {
      width: 16%;
      border-radius: 50%;
    }
    .user-name {
      height: 35%;
    }
  }
}
</style>
