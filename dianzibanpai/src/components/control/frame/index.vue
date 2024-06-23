<template>
  <div class="frame">
    <div class="label" :style="{ color: option.color, fontSize: option.fontSize + 'px' }">
      {{ title }}
    </div>
    <div class="video-container">
      <video
        id="myvideo"
        ref="myVideo"
        width="100%"
        height="100%"
        muted="muted"
        crossorigin="anonymous"
      ></video>
    </div>
  </div>
</template>

<script>
import flvjs from 'flv.js'
import { getCameraVideoRealTime } from '@/api/index.js'
import localCache from '@/utils/localCache'

export default {
  name: 'Videojs',
  props: {
    labor_id: Number,
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      url: '',
      flvPlayer: '',
      timer: null,
    }
  },
  computed: {
    title() {
      return localCache.getCookie('isSystem') === '1' || !localCache.getCookie('isSystem')
        ? '实 时 画 面'
        : this.option.title
    },
  },
  created() {
    console.log('q12231', this.option)
    this.getCameraVideoRealTimeUrl()
    this.timer = setInterval(this.getCameraVideoRealTimeUrl, 3600000)
  },
  mounted() {},
  methods: {
    async getCameraVideoRealTimeUrl() {
      try {
        let params = {
          lab_id: this.labor_id,
          type: 'student',
        }
        const { data, code } = await getCameraVideoRealTime(params)
        if (code === 10) {
          this.url = data.url
          this.videoPlayer()
        }
      } catch (error) {
        console.log(error)
      }
    },
    videoPlayer() {
      if (flvjs.isSupported()) {
        var videoElement = this.$refs.myVideo
        this.flvPlayer = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: this.url, // 你的url地址
        })
        this.flvPlayer.attachMediaElement(videoElement)
        this.flvPlayer.load()
        setTimeout(() => {
          this.flvPlayer.play()
        }, 100)
      }
    },
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
    if (this.flvPlayer) this.flvPlayer.destroy()
  },
}
</script>

<style lang="scss" scoped>
.frame {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: #fff;
  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 100%;
    font-size: 20px;
    writing-mode: vertical-rl;
    color: #fff;
    background: #61cab5;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    border-radius: 10px 10px 10px 10px;
  }
  .video-container {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    .myvideo {
      margin: auto 0;
    }
  }
}
</style>
