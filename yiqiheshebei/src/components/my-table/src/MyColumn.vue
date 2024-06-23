<!-- <template>
  <el-table-column :prop="col.prop" :label="col.label" align="left">
    <template v-if="col.children && col.children.length">
      <my-column v-for="(item, index) in col.children" :key="index" :col="item"></my-column>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'

const props = defineProps({
  col: { type: Object }
})

const { col } = toRefs(props)
</script>

<style scoped lang="scss"></style> -->
