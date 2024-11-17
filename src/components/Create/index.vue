<template>
  <el-dialog v-model="visible"
    :title="title"
    width="500"
    draggable
    overflow>
    <div class="content text-left">
      <slot name="message"></slot>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div class="cancel-btn"
          @click="closeDialog">取消</div>
        <div class="confirm-btn"
          @click="confirmData">
          确定
        </div>
      </div>
    </template>
  </el-dialog>
</template>
<script lang='ts' setup>
import { defineModel } from 'vue'
withDefaults(defineProps<{
  title?: string
  message?: string
}>(), {
  title: '创建全新归类',
  message: '确定要创建组间大类吗'
});
const visible = defineModel("show", {
  type: Boolean,
  default: false
});


const emits = defineEmits(['confirmData', 'closeDialog']);

const closeDialog = () => {
  emits('closeDialog')
}
const confirmData = () => {
  emits('confirmData')
}
</script>
<style scoped lang='scss'>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.confirm-btn {
  padding: 4px 26px;
  background: #000000;
  color: #fff;
  border-radius: 4px;
  margin-left: 20px;
  font-size: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #232323;
  }
}

.cancel-btn {
  padding: 4px 26px;
  background: #fff;
  color: #000;
  border-radius: 4px;
  border: 1px solid #e7e7e7;
  font-size: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all .3s linear;
  &:hover {
    color: #526ecc;
    border-color: #526ecc;
  }
}
</style>
