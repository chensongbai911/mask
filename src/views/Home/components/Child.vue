<template>
  {{ data }}
  <div ref="childNodeRef"
    class="children-wrap"
    :style="{
      gridTemplateColumns: `repeat(3, minmax(50px,1fr))`,
      gridRowGap: `10px`,
      gridColumnGap: `10px`,
    }">

    <div v-for="item in model"
      :key="item.goodsImage"
      class="child-wrap mover">
      <el-image style="width: 100%; height: 100%"
        :src="item.goodsImage"
        fit="cover" />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, watchEffect } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

const props = withDefaults(defineProps<{
  groupId: string
}>(), {
  groupId: ''
})
// 子类的池子
const emits = defineEmits(['update'])
const model = defineModel<Array<{ goodsImage: string }>>({
  default: function () {
    return []
  }, required: true
});
const childNodeRef = ref(null)
watchEffect(() => {
  if (childNodeRef.value) {
    useDraggable(childNodeRef.value, model, {
      animation: 150,
      ghostClass: 'ghost',
      group: 'people',
      onUpdate: (e) => {
        console.log('update list1', e)
      },
      onAdd: (e) => {
        console.log('add list1', e)
        emits('update', { data: e, groupId: props.groupId })
      },
      remove: () => {
        console.log('remove list1', props.data)
      },
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
