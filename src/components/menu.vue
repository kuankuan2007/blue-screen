<template>
  <Teleport to="body">
    <div
      class="menu-box"
      :class="{ hide: hideMenu }"
      :style="{ '--bg': bg, '--font-color': color }"
    >
      <Transition :duration="300" name="menu-flod">
        <div class="menu" v-if="!flodMenu" @mouseenter="hideMenu = false">
          <ul>
            <li @click="flodMenu = !flodMenu">
              <p class="icon"><k-icon id="close" /></p>
              <p class="text">收起菜单</p>
            </li>
            <li @click="(hideMenu = true), (flodMenu = true)">
              <p class="icon"><k-icon id="eye-off" /></p>
              <p class="text">隐藏多余项</p>
            </li>
            <li @click="screenCapture">
              <p class="icon"><k-icon id="scissors" /></p>
              <p class="text">截图</p>
            </li>
            <li @click="shareUrl">
              <p class="icon"><k-icon id="share" /></p>
              <p class="text">分享带有页面内容的链接</p>
            </li>
            <li @click="colorSetDialog?.open()">
              <p class="icon"><k-icon id="edit" /></p>
              <p class="text">编辑背景色</p>
            </li>
          </ul>
        </div>
        <div
          class="menu-button"
          v-else
          @mouseenter="hideMenu = false"
          @click="flodMenu = !flodMenu"
        >
          <k-icon id="menu" />
        </div>
      </Transition>
    </div>
  </Teleport>
  <k-color-set-dialog v-model="bg" ref="colorSetDialog" />
</template>
<script setup lang="ts">
import { watchEffect } from 'vue';
import KIcon from './icon.vue';
import { ref } from 'vue';
import KColorSetDialog from './colorSetDialog.vue';
function screenCapture() {
  hideMenu.value = true;
  flodMenu.value = true;
  setTimeout(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: {
        cursor: 'none',
        displaySurface: 'browser',
      },
    } as object);
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext('2d')
        ?.drawImage(
          video,
          0,
          0,
          video.videoWidth,
          video.videoHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );
      setTimeout(() => {
        canvas.toBlob((blob) => {
          if (!blob) {
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'screenshot.png';
          a.click();
          URL.revokeObjectURL(url);
          stream.getTracks().forEach((track) => track.stop());
        });
      }, 200);
    }, 200);
  }, 300);
}
const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});
function shareUrl() {
  const s = encodeURI(btoa(JSON.stringify(props.data)));
  const now = new URL(location.href);
  now.search = `d=${s}`;
  const input = document.createElement('input');
  input.value = now.toString();
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  alert('已复制到剪贴板');
}
const colorSetDialog = ref<InstanceType<typeof KColorSetDialog>>();
const bg = defineModel({
  type: String,
  required: true,
});
const hideMenu = ref(false);
const flodMenu = ref(true);
watchEffect(() => {
  if (hideMenu.value) {
    window.dispatchEvent(new CustomEvent('hideMenu'));
  } else {
    window.dispatchEvent(new CustomEvent('showMenu'));
  }
});
</script>
<style scoped lang="scss">
.menu-box {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  &:deep(*) {
    color: var(--font-color);
  }
}
.menu-flod-enter-from,
.menu-flod-leave-to {
  opacity: 0;
  transform: translate(100%, 0);
  pointer-events: none;
}
.menu-flod-enter-to,
.menu-flod-leave-from {
  opacity: 1;
}
.menu {
  position: absolute;
  top: 0;
  right: 0;
  transition: 0.3s;
  width: max-content;
  background-color: var(--font-color);
  &:deep(*) {
    color: var(--bg);
  }
}
.menu-button {
  transition: 0.3s;
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  cursor: pointer;
  border: 0.1rem solid transparent;
  transition: 0.3s;
  opacity: 1;
  &:hover {
    border-color: var(--font-color);
  }
  .hide & {
    opacity: 0;
    transition: 0;
  }
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  row-gap: 1rem;
  padding: 0.5rem;
  & > li {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    column-gap: 1rem;
    font-size: 1.2em;
    border: 0.1rem transparent solid;
    padding: 0.5rem;
    cursor: pointer;
    transition: 0.3s;
    p {
      margin: 0;
      padding: 0;
      text-align: start;
    }
    &:hover,
    &:focus {
      border-color: var(--bg);
    }
  }
}
</style>
