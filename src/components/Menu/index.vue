<template>
  <section class="menu-wrap">
    <section
      v-for="item in menuList"
      class="menu-child"
      @click="goPage(item.path)"
    >
      <el-image
        style="width: 18px; height: 18px;"
        :src="item.url"
        fit="cover"
      ></el-image>
      <span :style="{ color: route.name === item.path ? '#DA203E' : '#fff' }">
        {{ item.name }}
      </span>
    </section>
  </section>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import homeLogo from '@/assets/img/home/home.png'
import { useRoute, useRouter } from 'vue-router'

const menuList = ref([
  {
    url: homeLogo,
    name: '项目',
    path: 'Home',
  },
  {
    url: homeLogo,
    name: '首页',
    path: 'Project',
  },
])

const route = useRoute()
const router = useRouter()

function goPage(name: string) {
  router.push({ name })
}
</script>
<style scoped lang="scss">
.menu-wrap {
  margin: 0 30px;
  display: flex;

  .menu-child {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0 20px;

    span {
      font-size: 16px;
      color: #ffffff;
      padding-left: 10px;
      transition: all 0.3s linear;
      font-weight: 900;
      &:hover {
        color: #DA203E !important;
      }
    }
  }
}
</style>
