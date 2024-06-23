<template>
  <div>
    <video crossorigin="anonymous" controls ref="myVideo" />
  </div>
</template>

<script>
import flvjs from 'flv.js'
export default {
  name: '',
  props: {
    msg: String,
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.videoPlayer()
    })
  },
  methods: {
    videoPlayer() {
      console.log(333, this.msg)
      if (!this.msg) return
      if (flvjs.isSupported()) {
        var videoElement = this.$refs.myVideo
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: this.msg, // 你的url地址
        })
        flvPlayer.attachMediaElement(videoElement)
        flvPlayer.load()
        // flvPlayer.play()
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
