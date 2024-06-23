<template>
  <div>
    <el-switch
      v-model="data[prop]"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ccc"
      @change="statusChange(data)"
    />
  </div>
</template>

<script>
import { releaseStatus } from '@/network/notice'
export default {
  name: 'ComSwitch',
  props: {
    prop: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    async statusChange(val) {
      try {
        let params = {
          id: val.id,
          status: val.status ? 1 : 2,
        }
        const { code } = await releaseStatus(params)
        if (code === 10) {
          this.$message({
            type: 'success',
            message: '修改成功',
          })
          this.$nextTick(() => {
            this.$emit('getTableData')
          })
        }
      } catch (error) {
        console.log(error)
        throw new Error('error')
      }
    },
  },
}
</script>
