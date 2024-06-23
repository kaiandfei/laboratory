<template>
  <div>
    <div class="media-box">
      <video-flv class="video-box" :msg="url" />
    </div>
  </div>
</template>

<script>
import VideoFlv from '@/components/video-flv.vue'

export default {
  name: '',
  components: { VideoFlv },
  data() {
    return {
      url: '',
    }
  },
  created() {
    this.url = decodeURIComponent(this.$route.query.url)
    console.log('🚀 ~ created ~ this.url:', this.url, this.$route)
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.media-box {
  width: 100vw;
  height: 100vh;
  ::v-deep .video-box {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    video {
      width: 100%;
    }
  }
}
</style>
