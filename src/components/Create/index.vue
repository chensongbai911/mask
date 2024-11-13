<template>
  <el-dialog v-model="visible" :title="title"
    width="500" draggable overflow>
    <div class="content text-left">
      <slot name="message"></slot>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmData">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang='ts' setup>
import { defineModel} from 'vue'
 withDefaults(defineProps<{
  title?: string
  message?: string
}>(), {
  title: '创建全新归类',
  message: '确定要创建全新归类吗'
});
const visible = defineModel("show" , {
  type: Boolean,
  default: false
});


const emits = defineEmits(['confirmData', 'closeDialog']);

const closeDialog = ()=>{
  emits('closeDialog')
}
const confirmData = () => {
  emits('confirmData')
}
</script>
<style scoped lang='scss'></style>
