<template>
  <div class="note2" :style="{background:obj.bgColor}" @click="test()">
    <div class="note-title2" :style="{color:obj.color,fontSize:obj.fontSize+'px'}">{{ obj.title }}</div>
    <div class="note-mian">
      <div class="context2" :style="{color:obj.contentColor,fontSize:obj.contentSize+'px'}">实验室的消息通知</div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
const content='消息通知.........'
let props = defineProps({ itemData: Object,itemDetail: Object,itemId: Number })
const obj = ref({
  'title': props.itemDetail?props.itemDetail.title===''?'消息通知':props.itemDetail.title:'消息通知',
  'fontSize': props.itemDetail?props.itemDetail.fontSize===''?14:props.itemDetail.fontSize:14,
  'color': props.itemDetail?props.itemDetail.color===''?'#ffffff':props.itemDetail.color:'#ffffff',
  'bgColor': props.itemDetail?props.itemDetail.bgColor===''?'#ffffff':props.itemDetail.bgColor:'#ffffff',
  'contentSize': props.itemDetail?props.itemDetail.contentSize===''?14:props.itemDetail.contentSize:14,
  'contentColor': props.itemDetail?props.itemDetail.contentColor===''?'#000000':props.itemDetail.contentColor:'#000000',
})
// onMounted(()=>{
//   document.querySelector('.note-title2').style.color = obj.value.color
//   document.querySelector('.note-title2').style.fontSize = obj.value.fontSize+'px'
//   document.querySelector('.note2').style.background = obj.value.bgColor
//   document.querySelector('.context2').style.fontSize = obj.value.contentSize+'px'
//   document.querySelector('.context2').style.color = obj.value.contentColor
// })
let emit = defineEmits(['back'])
function test(){
  emit('back',obj.value)
}
watch(obj.value, () => {
  // document.querySelector('.note-title2').style.color = obj.value.color
  // document.querySelector('.note-title2').style.fontSize = obj.value.fontSize+'px'
  // document.querySelector('.note2').style.background = obj.value.bgColor
  // document.querySelector('.context2').style.fontSize = obj.value.contentSize+'px'
  // document.querySelector('.context2').style.color = obj.value.contentColor
  emit('changeObj', props.itemId)
})
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