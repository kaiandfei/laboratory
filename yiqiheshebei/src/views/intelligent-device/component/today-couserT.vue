<template>
  <div class="main-item1 today-course">
    <div class="herder">
      <img class="bookmark" src="@/assets/images/common/bookmark.png" alt="" />
      <span
          class="course"
      >今日课程(2023-2-3)</span
      >
    </div>
    <div class="mb20 exp-detail" style="height: 20%">实验名称</div>
    <div class="mb20 exp-detail" style="height: 20%">
      高一一班
    </div>
    <div class="mb20" style="height: 42%">
      <img class="avatar" src="@/assets/images/common/avatar.png" alt="" />
      <div class="user-name exp-detail">张老师</div>
    </div>
    <div class="btns mb20" style="height: 18%">
      <div class="primary-btn percentage">签到</div>
      <div class="secondary-btn percentage">签退</div>
    </div>
    <div class="today-course-tabs">
      <div
          class="tabs-item"
          v-for="(item, index) in tabs"
          :key="index"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
const tabs = [
  {
    label: '开课中',
  },
  {
    label: '暂未开课',
  },
  {
    label: '已开课',
  },
]
</script>
<style lang="scss" scoped>
.main-item1 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 60%;
  height: 100%;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  background: #fff;
  box-shadow: 0px 3px 6px 1px #61cab5;
  border-radius: 10px 10px 10px 10px;
  border: 1px solid #61cab5;
  margin: 0 auto;
  padding: 1% 0;
  box-sizing: border-box;

  .btns {
    display: flex;
    justify-content: space-evenly;
    font-weight: 400;
  }

  .mb20 {
    margin-bottom: 1%;

    .avatar {
      width: 16%;
      height: 65%;
      border-radius: 50%;
    }
    .user-name {
      height: 35%;
    }
  }
  .herder {
    line-height: 55px;
    display: flex;
    align-items: center;

    .bookmark {
      width: 27px;
      height: 55px;
      margin: 0 20px 0 50px;
    }
    .course {
      font-size: 16px;
      font-weight: bold;
      color: #329581;
    }
  }
  .today-course-tabs {
    display: flex;
    height: 10%;
    .tabs-item {
      width: 33%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      background: #e8f9f6;
      box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
      border-radius: 10px 10px 10px 10px;
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 5px;
      }
    }
    .active {
      color: #329581;
      background: #fff;
    }
  }
}
.primary-btn{
  text-align: center;
  color: #fff;
  background-color: #329581;
  padding: 8px 30px;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.secondary-btn{
  color: #333;
  background-color: #EBEBEB ;
  padding: 8px 30px;
  border: 1px solid #bebebe;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.percentage{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 80%;
  padding: 0;
}
</style>
