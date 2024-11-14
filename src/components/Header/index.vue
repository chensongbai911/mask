<template>
  <div class="g-header"
    :class="{ 'frosted-glass': scrollHeight }">
    <div class="g-header-content g-padding-x pl-[32px]">
      <div class="g-header-left">
        <RouterLink to="/">
          <div class="g-header-logo" />
        </RouterLink>
        <div class="g-header-logo-small h-[28px]">
          <RouterLink to="/">
            <div class="g-header-logo" />
          </RouterLink>
        </div>
        <Menu />
      </div>
      <div class="g-header-right">
        <!-- <div class="g-header-logo" /> -->
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted } from 'vue'
import Menu from '../Menu/index.vue'
import throttle from 'lodash/throttle'

// 监听的滚动高度
const scrollHeight = ref(0)

const calculateScrollHeight = throttle(() => {
  requestAnimationFrame(() => {
    scrollHeight.value = window.pageYOffset || document.documentElement.scrollTop
  })
}, 200) // 每 200 毫秒计算一次滚动高度

onMounted(() => {
  window.addEventListener('scroll', calculateScrollHeight)
})
</script>

<style scoped lang="scss">
.frosted-glass.g-header {
  background-color: rgba(25, 25, 25, 0.5) !important;
  backdrop-filter: blur(4px);
  box-shadow: 0 1px 0px 0px #696969 !important;
  z-index: 99999;
}

.g-header {
  background-color: #232F3E !important;
  position: fixed;
  min-height: 60px;
  z-index: 99999;
  width: 100%;

  &-content {
    top: 0;
    width: 100%;
    z-index: 9999;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 40px;
  }

  &-left {
    display: flex;
    align-items: center;
    height: 60px;
  }

  &-right {}

  &-logo {
    display: inline-block;
    width: 200px;
    height: 60px;
    background: url('@/assets/img/home/logo.png') no-repeat;
    background-size: contain;
    vertical-align: middle;
    background-position: 0 center;

    &-small {
      display: none;
    }
  }
}

.g-menu {
  min-height: 60px;

  .g-header-menu {
    padding-top: 16px;
    padding-bottom: 16px;
    position: fixed;
    top: calc(60px + 1px);
    left: 0;
    width: 100%;
    z-index: 6;
    background-color: #fff;
    border-bottom: 1px solid #F1F1F8;
    box-sizing: border-box;
  }
}

.pc-menu {
  display: flex;

  @media screen and (max-width: 768px) {
    display: none;
  }
}

.mobile-menu {
  display: none;

  @media screen and (max-width: 480px) {
    display: flex;
  }
}

@media screen and (min-width: 1024px) {
  .menu_mb {
    display: none !important;
  }

}

@media screen and (max-width: 1024px) {
  .menu_mb {
    display: block;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%) rotate(0deg) !important;
  }
}

@media screen and (max-width: 768px) {
  .g-header-logo {
    display: none;
  }

  .g-header-logo-small {
    display: inline-block;
  }

}
</style>
