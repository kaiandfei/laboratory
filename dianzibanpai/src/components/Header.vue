<template>
  <div class="header header-bg"></div>
</template>

<script>
export default {
  name: 'HeaderView',
  data() {
    return {
      isCollapse: true,
    }
  },
  created() {
    this.username = this.$store.state.userMsg.username
    this.imgGroup()
  },
  methods: {
    exit() {
      sessionStorage.removeItem('state')
      this.$router.replace({
        name: 'Login',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  height: 60px;
  width: 100%;
  .print {
    top: 18px;
    right: 300px;
    position: absolute;
    width: 120px;
    height: 24px;
    line-height: 24px;
    text-align: left;
    font-size: 12px;
    color: #333;
    cursor: pointer;
    img {
      float: left;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
    &:hover {
      color: #05c65d;
    }
  }
  .help {
    top: 18px;
    right: 200px;
    position: absolute;
    width: 120px;
    height: 24px;
    line-height: 24px;
    text-align: left;
    font-size: 12px;
    color: #333;
    cursor: pointer;
    img {
      float: left;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
    &:hover {
      color: #05c65d;
    }
  }
  .user {
    top: 18px;
    right: 80px;
    position: absolute;
    min-width: 120px;
    height: 24px;
    line-height: 24px;
    text-align: left;
    font-size: 12px;
    color: #333;
    img {
      float: left;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
  }
  .home {
    position: absolute;
    top: 18px;
    right: 0;
    width: 80px;
    height: 24px;
    line-height: 24px;
    text-align: left;
    font-size: 12px;
    color: #333;
    cursor: pointer;
    img {
      float: left;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
    &:hover {
      color: #05c65d;
    }
  }
}
.help_bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../assets/images/menu/help_bg.png');
  background-size: 100% 100%;
  z-index: 10000;
  & .header {
    position: fixed;
    top: 34px;
    left: 50%;
    margin-left: -170px;
    width: 340px;
    height: 86px;
  }
  & .body {
    position: fixed;
    top: 180px;
    left: 50%;
    margin-left: -794px;
    width: 1588px;
    height: 600px;
  }
  & .footer {
    position: fixed;
    top: 800px;
    left: 50%;
    margin-left: -130px;
    width: 260px;
    height: 92px;
    cursor: pointer;
    opacity: 0.4;
  }
  & .footer:hover {
    opacity: 0.8;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade1-enter-active,
.fade1-leave-active {
  transition: opacity 1s;
}
.fade1-enter, .fade1-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.high_light {
  position: fixed;
  top: 30px;
  right: 100px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  background-color: #fff;
  color: #05c65d;
  font-weight: 700;
}
</style>
