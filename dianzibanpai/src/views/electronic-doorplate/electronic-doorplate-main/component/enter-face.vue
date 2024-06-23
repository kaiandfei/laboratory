<template>
  <div class="container">
    <!-- <div class="operate">
      {{ active === 0 ? '眨眨眼~' : active === 1 ? '张张嘴~' : '转转头~' }}
    </div> -->
    <div class="face">
      <video
        ref="video"
        id="video"
        poster="https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220707/102957039.jpg"
      ></video>
      <canvas id="canvas"></canvas>
    </div>
    <!-- <div>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="第一步"></el-step>
        <el-step title="第二步"></el-step>
        <el-step title="第三步"></el-step>
      </el-steps>
    </div> -->
  </div>
</template>

<script>
import '@/assets/js/tracking.js'
import '@/assets/js/face-min.js'
import { getFileFromBase64 } from '@/utils/base64-change-img'
import LocalCache from '@/utils/localCache'
import { uploadImage, reAddFace } from '@/api/index'
import enterSuccess from './enter-success.vue'
// let t
export default {
  name: 'EnterFace',
  props: {
    ruleForm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      uploadLock: true, // 上传锁
      mediaStreamTrack: {},
      video_stream: '', // 视频stream
      canvas: null,
      context: null,
      tracker: '',
      trackertask: null,
      video: null,
      imgArr: [],
    }
  },
  mounted() {
    this.createVideo()
  },
  methods: {
    async createVideo() {
      // 获取 canvas 画布
      this.canvas = document.getElementById('canvas')
      this.context = this.canvas.getContext('2d')
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        console.log('123')
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(
              new Error('getUserMedia is not implemented in this browser')
            )
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      console.log(56, navigator.mediaDevices)
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 正常支持版本
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          console.log(91)
          // 摄像头开启成功
          this.mediaStreamTrack =
            typeof stream.stop === 'function' ? stream : stream.getTracks()[0]
          this.video_stream = stream
          this.$refs.video.srcObject = stream
          this.mediaStreamTrack = document.getElementById('video')
          this.$refs.video.play()
          this.initTracker()
        })
        .catch((err) => {
          console.log(99, err)
        })
    },
    initTracker() {
      this.context = document.getElementById('canvas').getContext('2d') // 画布
      this.tracker = new window.tracking.ObjectTracker('face') // tracker实例
      this.tracker.setInitialScale(4)
      this.tracker.setStepSize(2) // 设置步长
      this.tracker.setEdgesDensity(0.1)
      try {
        this.trackertask = window.tracking.track('#video', this.tracker) // 开始追踪
      } catch (e) {
        console.log('访问用户媒体失败，请重试')
      } //开始捕捉方法 一直不停的检测人脸直到检测到人脸
      let that = this
      this.tracker.on('track', (e) => {
        //画布描绘之前清空画布
        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height)
        // e.data.forEach(function (rect) {
        //   that.context.strokeStyle = '#07c160'
        //   that.context.strokeRect(rect.x - 90, rect.y - 100, rect.width, rect.height)
        // })
        if (that.uploadLock && e.data.length === 1) {
          that.uploadLock = false
          that.screenshotAndUpload()
        }
      })
    },
    // 上传图片
    async screenshotAndUpload() {
      // 上锁避免重复发送请求
      this.uploadLock = false
      // 绘制当前帧图片转换为base64格式
      let canvas = this.canvas
      this.video = this.mediaStreamTrack = document.getElementById('video')
      let video = this.video
      let ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      let base64Img = canvas.toDataURL('image/jpeg')
      try {
        let formData = new FormData() // 当前为空
        formData.append('image', getFileFromBase64(base64Img))
        const { data, code } = await uploadImage(formData)
        if (code === 10) {
          let image = data.file_url
          this.addFace(image)
        }
      } catch (error) {
        console.log(error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
    //添加人脸
    async addFace(image_url) {
      try {
        let params = {
          device_no: LocalCache.getCookie('device_no'),
          image_url,
          phone_or_login_name: this.ruleForm.user,
        }
        const { code } = await reAddFace(params)
        this.closeCamera()
        if (code === 10) {
          // 请求接口成功以后打开锁
          this.uploadLock = true
          // LocalCache.setCookie('swr_token', data.token)
          this.$emit('toggleComponent', enterSuccess, 2)
        } else {
          this.$emit('toggleComponent', enterSuccess, 2, true)
        }
      } catch (error) {
        this.closeCamera()
        this.$emit('toggleComponent', enterSuccess, 2, true)
        console.log(error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
    //关闭摄像头
    closeCamera() {
      if (!this.mediaStreamTrack) {
        return
      }
      this.mediaStreamTrack.srcObject?.getTracks()[0].stop()
      this.trackertask?.stop()
    },
  },
  // destroyed() {
  //   clearInterval(t)
  // },
}
</script>

<style lang="scss" scoped>
.container {
  .operate {
    font-size: 20px;
    font-weight: bold;
  }
  .face {
    position: relative;
    width: 450px;
    height: 450px;
    border: 4px solid #329581;
    border-radius: 50%;
    background-color: #dcdcdc;
    margin: 20px auto;
    overflow: hidden;
    video,
    canvas {
      position: absolute;
      top: 0;
      left: -80px;
      width: 600px;
      height: 100%;
    }
  }
}
</style>
