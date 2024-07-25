<template>
  <Teleport to="body">
    <dialog ref="dialog">
      <div class="dialog-box">
        <div class="color-pick">
          <div class="sl">
            <canvas ref="slCanvas" class="sl" width="500" height="500"></canvas>
          </div>
          <div
            class="h"
            :style="{
              '--h': hsl.h,
            }"
          ></div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
<script setup lang="ts">
import Color from 'color';
import { ref, watchEffect, reactive, onMounted } from 'vue';
const value = defineModel({
  type: String,
  default: '',
});
const slCanvas = ref<HTMLCanvasElement>();
onMounted(() => {
  watchEffect(() => {
    if (!slCanvas.value) {
      return;
    }
    const ctx = slCanvas.value.getContext('2d')!;
    ctx.clearRect(0, 0, 500, 500);

    ctx.fillRect(0, 0, 500, 500);
  });
});
const choiceValue = ref(Color(value.value));
const hsl = reactive({
  h: choiceValue.value.hue(),
  s: choiceValue.value.saturationv(),
  l: choiceValue.value.lightness(),
});
watchEffect(() => {
  const va = Color(value.value);
  choiceValue.value = va;
  hsl.h = va.hue();
  hsl.s = va.saturationv();
  hsl.l = va.lightness();
});
watchEffect(() => {
  choiceValue.value = Color(
    {
      h: hsl.h,
      s: hsl.s,
      l: hsl.l,
    },
    'hsl'
  );
});
const dialog = ref<HTMLDialogElement>();
function open() {
  dialog.value?.showModal();
}
function close() {
  dialog.value?.close();
}
defineExpose({
  open,
  close,
});
</script>
<style scoped lang="scss">
dialog {
  outline: none;
  border: 0.1rem solid black;
}
.dialog-box {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
}
.color-pick {
  display: flex;
  column-gap: 1rem;
  align-items: stretch;
  div.sl {
    border: 0.1rem solid black;
    canvas {
      width: 60vw;
      height: 60vw;
    }
  }
  div.h {
    border: 0.1rem solid black;
    position: relative;
    width: 1rem;
    background: linear-gradient(
      to bottom,
      hsl(0, 100%, 50%),
      hsl(90deg, 100%, 50%),
      hsl(180deg, 100%, 50%),
      hsl(270deg, 100%, 50%),
      hsl(0, 100%, 50%)
    );
    &::after {
      position: absolute;
      content: '';
      height: 0.4rem;
      border: 0.1rem solid black;
      background-color: white;
      left: -0.2rem;
      right: -0.2rem;
      top: calc(100% * var(--h) / 360);
      transform: translate(0, -50%) scale(1.2);
    }
  }
}
</style>
