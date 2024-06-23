<template>
  <div class="logo">
    <img src="@assets/images/logo.png" alt="" />
    实验教学管理
  </div>
  <div class="checkNotice">
    <div class="bg">
      <div v-if="!noticeDialogVisible">
        <div class="noticeHeader">
          <div class="left">
            <img src="@/assets/images/login/tip.png" alt="" />
            <span class="notice" @click="goIndex">首页</span>
            > 公告通知
          </div>
          <!-- <div class="right" @click="goIndex">
            <img src="@images/laboratory/laboratory-standard/cancel.png" alt="" />
            <span>返回</span>
          </div> -->
        </div>
        <div class="list" v-loading="loading" element-loading-text="加载中...">
          <div class="item-list">
            <div class="item" v-for="(item, index) in noticeListData" :key="item.id" @click="handleItemClick(item)">
              <div class="title">{{ item.title }}</div>
              <div class="time">{{ item.create_time }}</div>
              <div class="line" v-if="noticeListData.length - 1 !== index">
                <div class="long"></div>
                <div class="short"></div>
                <div class="short"></div>
              </div>
            </div>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <checkNotice v-else :detailNotice="detailNotice" @toggleNotice="toggleNotice" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { noticeList, seeCount } from '@service/login/login'
import CheckNotice from './check-notice.vue'
const router = useRouter()
const goIndex = () => {
  router.push({
    name: 'Login'
  })
}
const noticeListData: any = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(400)
const getNoticeData = async () => {
  loading.value = true
  try {
    let params = {
      page: currentPage.value,
      limit: pageSize.value,
      status: 1
    }
    const { data, code } = await noticeList(params)
    if (code === 10) {
      noticeListData.value = data.data
      total.value = data.total
      loading.value = false
    }
  } catch (error) {
    loading.value = false
    console.log(error)
    throw new Error('error')
  }
}
getNoticeData()
//当前页展示数据条数
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getNoticeData()
}
//当前页数据
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getNoticeData()
}
const updateSeeCount = async (id: number) => {
  try {
    let params = {
      id
    }
    await seeCount(params)
  } catch (error) {
    console.log(error)
    throw new Error('error')
  }
}
const detailNotice = ref({})
const noticeDialogVisible = ref(false)
const handleItemClick = (val: any) => {
  updateSeeCount(val.id)
  // getNoticeData(val)
  noticeListData.value.forEach((item: any) => {
    if (item.id === val.id) {
      detailNotice.value = item
    }
  })
  setTimeout(() => {
    noticeDialogVisible.value = true
  }, 100)
}
const toggleNotice = () => {
  getNoticeData()
  noticeDialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.logo {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  margin: 13px auto;
  width: 68%;
  height: 34px;
  font-size: 16px;
}
.checkNotice {
  width: 100vw;
  height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;

  .bg {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: calc(100% - 20px);
    background-image: url('../../assets/images/login/personbg.png');
    background-size: 100% 100%;
    padding-top: 20px;
  }
}
.list {
  width: 1390px;
  height: 740px;
  background-color: #fff;
  margin-top: 2px;
  padding: 20px 100px;
  box-sizing: border-box;
  .item-list {
    width: 1200px;
    height: 660px;
    overflow: auto;
  }
}
.item {
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #404040;
  padding: 25px 10px;
  cursor: pointer;
  .title {
    width: 800px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .line {
    position: absolute;
    bottom: 0;
    left: -10px;
    display: flex;
    .long {
      width: 1160px;
      height: 2px;
      background-color: #05c65d;
    }
    .short {
      width: 10px;
      height: 2px;
      margin-left: 10px;
      background-color: #05c65d;
    }
  }
}
.noticeHeader {
  width: 1390px;
  height: 60px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  .left {
    img {
      width: 17px;
      height: 21px;
      position: relative;
      top: 5px;
      margin-right: 10px;
    }
    .notice {
      cursor: pointer;
    }
    .notice:hover {
      color: #05c65d;
      text-decoration: underline;
    }
  }
  .right {
    cursor: pointer;
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
}
::v-deep .el-pagination {
  text-align: right;
  padding: 20px;
  box-sizing: border-box;
  .el-input .el-input__inner {
    width: 100% !important;
  }
}
</style>
