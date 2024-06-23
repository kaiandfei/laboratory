<template>
  <div class="frame" :style="{background:obj.bgColor}" @click="test()">
    <div class="label" :style="{color:obj.color,fontSize:obj.fontSize+'px'}">{{ obj.title }}</div>
    <div class="video-container">
      <img src="@/assets/images/common/real-time.png">
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
let props = defineProps({ itemData: Object,itemDetail: Object,itemId: Number })
const obj = ref({
  'title': props.itemDetail?props.itemDetail.title===''?'实 时 画 面':props.itemDetail.title:'实 时 画 面',
  'fontSize': props.itemDetail?props.itemDetail.fontSize===''?14:props.itemDetail.fontSize:14,
  'color': props.itemDetail?props.itemDetail.color===''?'#ffffff':props.itemDetail.color:'#ffffff',
  'bgColor': props.itemDetail?props.itemDetail.bgColor===''?'#ffffff':props.itemDetail.bgColor:'#ffffff',
  'contentSize': props.itemDetail?props.itemDetail.contentSize===''?14:props.itemDetail.contentSize:14,
  'contentColor': props.itemDetail?props.itemDetail.contentColor===''?'#000000':props.itemDetail.contentColor:'#000000',
})
// onMounted(()=>{
//   document.querySelector('.label').style.color = obj.value.color
//   document.querySelector('.label').style.fontSize = obj.value.fontSize+'px'
//   document.querySelector('.frame').style.background = obj.value.bgColor
// })
let emit = defineEmits(['back'])
function test(){
  emit('back',obj.value)
}
watch(obj.value, () => {
  // document.querySelector('.label').style.color = obj.value.color
  // document.querySelector('.label').style.fontSize = obj.value.fontSize+'px'
  // document.querySelector('.frame').style.background = obj.value.bgColor
  emit('changeObj', props.itemId)
})
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
