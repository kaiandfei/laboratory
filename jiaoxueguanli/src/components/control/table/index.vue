<template>
  <div class="hello">
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="stripe"
      :border="border"
      :max-height="maxHeight"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column v-if="index" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column v-if="selection" type="selection" width="55"> </el-table-column>
      <el-table-column
        v-for="item in column"
        :key="item.prop"
        :render-header="item.renderHeader"
        :sortable="item.sort"
        :sortBy="item.sortBy"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        show-overflow-tooltip
        :align="item.align"
      >
        <template slot-scope="scope">
          <slot v-if="item.type === 'slot'" :name="item.slotName" :data="scope.row" />
          <component
            v-else
            :is="!item.type ? 'com-text' : `com-${item.type}`"
            :prop="item.prop"
            :data="scope.row"
            :config="item"
            @getTableData="getTableData"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ComTable',
  props: {
    column: {
      type: Array,
      default: () => [],
    },
    checkList: {
      type: Array,
      default: () => [],
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Boolean,
      default: false,
    },
    selection: {
      type: Boolean,
      default: false,
    },
    sortable: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isPage: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
    maxHeight: {
      type: String,
      default: '',
    },
    getTableList: Function,
    format: Function,
  },
  data() {
    return {
      tableData: [],
      loading: false,
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      if (this.isLoading) this.loading = true
      try {
        const { data, code } = await this.getTableList(this.params)
        if (code === 10) {
          let resData = data.data
          //数据格式化
          if (this.format && typeof this.format === 'function') {
            resData = this.format(data.data)
          }
          this.tableData = resData
          if (this.isPage) this.$emit('update:total', data.total)
        }
        if (this.isLoading) this.loading = false
      } catch (error) {
        if (this.isLoading) this.loading = false
        throw new Error(error)
      }
    },

    handleSelectionChange(_val) {
      this.$emit('update:checkList', _val)
    },
    sortChange({ column, prop, order }) {
      this.$emit('sortChange', { column, prop, order })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss"></style>
