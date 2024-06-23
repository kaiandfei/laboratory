<template>
  <div class="pop-bg" v-show="props.popShow">
    <div class="pop">
      <!-- @click="emit('close', false)" -->
      <header>
        <div>
          <slot name="header"></slot>
        </div>
        <div class="close-i">
          <el-icon color="#333" @click="emit('close', false)" title="关闭">
            <Close />
          </el-icon>
        </div>
      </header>
      <main>
        <slot name="main"></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults } from 'vue'
import { Close } from '@element-plus/icons-vue'
const emit = defineEmits(['close'])
interface Props {
  popShow?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  popShow: false
})
</script>

<style scoped lang="scss">
.pop-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(132, 132, 132, 0.39);
  z-index: 100;
  display: flex;
  justify-content: center;
  // align-items: center;
  .pop {
    margin-top: 160px;
    header {
      display: flex;
      min-width: 300px;
      height: 60px;
      line-height: 60px;
      color: #333;
      font-size: 20px;
      background-color: #fff;
      border-bottom: 1px solid #05c65d;
      & > :nth-child(1) {
        flex: 1;
        padding: 0 20px;
        text-align: left;
      }
      .close-i {
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          font-size: 20px;
          cursor: pointer;
          &:hover {
            color: #05c65d;
          }
        }
      }
    }
    main {
      min-width: 300px;
      max-height: 600px;
      padding: 30px 60px;
      background-color: #fff;
      overflow-y: auto;
    }
    footer {
      padding: 0 60px 34px;
      background-color: #fff;
      overflow: hidden;
    }
  }
}
</style>
