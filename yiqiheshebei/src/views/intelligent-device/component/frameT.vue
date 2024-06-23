<template>
  <div class="frame">
    <div class="label">实时画面</div>
    <div class="video-container">
      <img src="@/assets/images/common/real-time.png">
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from 'vue'

</script>

<style lang="scss" scoped>
.frame {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  //background: #fff;
  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10%;
    height: auto;
    //font-size: 20px;
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
    padding: 5%;
    box-sizing: border-box;
    .myvideo {
      margin: auto 0;
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
