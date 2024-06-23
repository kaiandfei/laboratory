<template>
  <div class="note">
    <div class="note-title">实验室注意事项</div>
    <div class="note-mian">
      <div class="context">
        {{ content }}
      </div>
      <div class="not-footer">
        <img
            class="pag"
            src="@/assets/images/common/pre.png"
            alt=""
        />
        <span>2</span>
        <img
            class="pag"
            src="@/assets/images/common/next.png"
            alt=""
            @click="handleNext"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
const content='实验室的注意事项.....'
</script>

<style lang="scss" scoped>
.note {
/*// position: relative;*/
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  .note-title {
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    //font-size: 20px;
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
    .context {
      height: 80%;
      padding: 20px;
      display: flex;
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */
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