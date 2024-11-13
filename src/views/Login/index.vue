<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <div class="login-left h-[100%]">
        <LottieAnimation ref="anim"
          class="h-[100%]"
          :animation-data="WatermelonJSON"
          :loop="true"
          :auto-play="true"
          :speed="1"
          @loopComplete="loopComplete"
          @complete="complete"
          @enterFrame="enterFrame"
          @segmentStart="segmentStart"
          @stopped="stopped" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <!-- <img class="login-icon"
            src="@/assets/img/home/logo.svg"
            alt="" /> -->
          <h2 class="logo-text">98kAmz机会洞察</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import { onMounted, ref } from "vue"
import { LottieAnimation } from "lottie-web-vue"
import LoginForm from "./components/LoginForm.vue";
import { json } from './lottie'

const anim = ref(null)
const WatermelonJSON = ref(json)

onMounted(() => {
  setTimeout(() => {
    console.log(anim.value.goToAndPlay(150, true))
    anim.value
  }, 500)
})

// called after each loop
const loopComplete = () => {
  console.log('Loop complete')
}

// called after first loop
const complete = () => {
  console.log('First loop complete')
}

// called after first frame entered
const enterFrame = () => {
  console.log('Entered first frame')
}

// called after segment started
const segmentStart = () => {
  console.log('Segment started')
}

// called after animation stopped
const stopped = () => {
  console.log('Stopped')
}
</script>

<style scoped lang="scss">
@import url("./index.scss");
</style>