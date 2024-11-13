<template>
  <div class="children-wrap" ref="childNodeRef" :style="{
    gridTemplateColumns: `repeat(3, minmax(50px,1fr))`,
    gridRowGap: `10px`,
    gridColumnGap: `10px`,
  }">
    <div
      v-for="item in data" :key="item.brand" class="child-wrap mover">
      <el-image style="width: 100%; height: 100%" :src="item.brandUrl" fit="cover" />
    </div>
  </div>

</template>
<script lang='ts' setup>
import { ref, watchEffect } from 'vue'
import { useDraggable } from 'vue-draggable-plus'
const props = withDefaults(defineProps<{
  data: Array<any>
}>(), {
  data: () => {
    return []
  },
});
const childNodeRef = ref(null) //子类的池子
const emits = defineEmits(['update']);


watchEffect(() => {
  if (childNodeRef.value) {
    useDraggable(childNodeRef.value, props.data, {
      animation: 150,
      ghostClass: 'ghost',
      group: 'people',
      onUpdate: (e) => {
        console.log('update list1', e)

      },
      onAdd: (e) => {
        console.log('add list1', e)
        emits('update', e)
      },
      remove: () => {
        console.log('remove list1', props.data)
      }
    })
  }

})

</script>
<style scoped lang='scss'>
.children-wrap {
  display: grid;
  min-height: 300px;
}
</style>
