<template>
  <div class="note2">
    <div class="note-title2">消息通知</div>
    <div class="note-mian">
      <div class="context2">{{ content }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
const content='消息通知.........'
</script>

<style lang="scss" scoped>
.note2 {
/*// position: relative;*/
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  .note-title2 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20%;
    color: #fff;
    background: #61cab5;
    border-radius: 10px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .note-mian {
    height: 80%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
    //background-color: #fff;
    margin-top: -20px;
    padding: 20px;
    box-sizing: border-box;
    .context2 {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 20px;
    }
    .not-footer {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .pag {
        width: 30px;
        height: 30px;
        margin: 0 20px;
        cursor: pointer;
      }
    }
  }
}
</style>