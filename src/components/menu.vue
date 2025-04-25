<template>
  <Teleport to="body">
    <div
      class="menu-box"
      :class="{ hide: hideMenu }"
      :style="{ '--bg': bgColor, '--font-color': fontColor }"
    >
      <Transition :duration="300" name="menu-fold">
        <div class="menu" v-if="!foldMenu" @mouseenter="hideMenu = false">
          <ul>
            <li @click="foldMenu = !foldMenu">
              <p class="icon"><k-icon id="close" /></p>
              <p class="text">收起菜单</p>
            </li>
            <li @click="(hideMenu = true), (foldMenu = true)">
              <p class="icon"><k-icon id="eye-off" /></p>
              <p class="text">隐藏多余项</p>
            </li>
            <li @click="screenCapture">
              <p class="icon"><k-icon id="scissors" /></p>
              <p class="text">截图</p>
            </li>
            <li @click="$emit('copy-link')">
              <p class="icon"><k-icon id="share" /></p>
              <p class="text">分享带有页面内容的链接</p>
            </li>
            <li @click="bgColorSetDialog?.open()">
              <p class="icon"><k-icon id="background-color" /></p>
              <p class="text">编辑背景色</p>
            </li>
            <li @click="autoFontColor = !autoFontColor">
              <k-check-box v-model="autoFontColor" />
              <p class="text">自动前景色</p>
            </li>
            <li
              @click="fontColorSetDialog?.open()"
              :class="{
                hide: autoFontColor,
              }"
            >
              <p class="icon"><k-icon id="fontcolor" /></p>
              <p class="text">编辑前景色</p>
            </li>
          </ul>
        </div>

        <div
          class="menu-button"
          v-else
          @mouseenter="hideMenu = false"
          @click="foldMenu = !foldMenu"
        >
          <k-icon id="menu" />
        </div>
      </Transition>
      <Transition :duration="300" name="menu-fold">
        <div class="style-choice" v-if="!foldMenu" @mouseenter="hideMenu = false">
          <div class="style-list">
            <router-link v-for="i of links" :to="i.path">
              <p>{{ i.name }}</p>
            </router-link>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
  <k-color-set-dialog
    v-model="bgColor"
    ref="bgColorSetDialog"
    :defined-choice="[
      {
        name: 'Windows 古早蓝色',
        value: '#0028D2',
      },
      {
        name: 'Windows 默认蓝色',
        value: '#0177D7',
      },
      {
        name: 'Windows Insider',
        value: '#246F24',
      },
    ]"
  />
  <k-color-set-dialog
    v-model="fontColor"
    ref="fontColorSetDialog"
    :defined-choice="[
      {
        name: '白色',
        value: '#ffffff',
      },
      {
        name: '黑色',
        value: '#000000',
      },
    ]"
  />
</template>
<script setup lang="ts">import KIcon from './icon.vue';import KColorSetDialog from './colorSetDialog.vue';
import Color from 'color';
import { getVisibleColor } from '@/scripts/uitl';
import KCheckBox from './checkBox.vue';
import { RouterLink } from 'vue-router';

import { routes } from '@/router';
defineEmits(['copy-link']);

const links = computed(() => {
  return routes
    .filter((i) => i?.meta?.isStyleView)
    .map((i) => ({
      name: i?.meta?.title,
      path: i?.path,
    }));
});

const autoFontColor = defineModel('autoFontColor', {
  type: Boolean,
  default: true,
});

function screenCapture() {
  hideMenu.value = true;
  foldMenu.value = true;
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

const bgColorSetDialog = useTemplateRef('bgColorSetDialog');
const fontColorSetDialog = useTemplateRef('fontColorSetDialog');
const bgColor = defineModel('bgColor', {
  type: String,
  required: true,
});
const fontColor = defineModel('fontColor', {
  type: String,
  required: true,
});
watchEffect(() => {
  bgColor.value;
  if (autoFontColor.value) {
    fontColor.value = getVisibleColor(bgColor.value).hex();
  }
});
const hideMenu = ref(false);
const foldMenu = ref(true);
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
  width: 100%;
  top: 0;
  right: 0;
  z-index: 999;
  font-size: 2vmin;
  display: flex;
  flex-direction: row-reverse;
  justify-content: start;
  align-items: stretch;
  &:deep(*) {
    color: var(--font-color);
  }
}
.menu-fold-enter-from,
.menu-fold-leave-to {
  opacity: 0;

  pointer-events: none;
  &.menu,
  &.menu-button {
    transform: translate(100%, 0);
  }
  &.style-choice {
    transform: translate(0, -100%);
  }
}
.menu-fold-enter-to,
.menu-fold-leave-from {
  opacity: 1;
}
.style-choice {
  background-color: var(--font-color);
  transition: 0.3s;
  flex: 1 1 0;
  font-size: 0.8em;
  max-height: 50vh;
  overflow-y: auto;
  div.style-list {
    padding: 0.5em;
    display: flex;
    column-gap: 1em;
    row-gap: 0.3em;
    flex-wrap: wrap;

    & > a {
      border: 0.1rem solid var(--bg);
      padding: 0.3em 1em;
      text-decoration: none;
      color: var(--bg);
      transition: 0.3s;
      &:hover {
        background-color: var(--bg);
        &:deep(*) {
          color: var(--font-color);
        }
      }
    }
  }
  &:deep(*) {
    color: var(--bg);
  }
}
.menu {
  position: relative;
  top: 0;
  right: 0;
  transition: 0.3s;
  width: max-content;
  background-color: var(--font-color);
  flex: 0 0 auto;
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
  font-size: 1.5em;
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
  padding: 0.5rem;
  & > li {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    column-gap: 1rem;
    font-size: 1.2em;
    border: 0.1rem transparent solid;
    padding: 0.5rem;
    cursor: pointer;
    transition: 0.3s;
    height: calc-size(auto, size);
    overflow: hidden;
    p {
      margin: 0;
      padding: 0;
      text-align: start;
    }
    &:hover,
    &:focus {
      border-color: var(--bg);
    }
    &.hide {
      height: 0px;
      opacity: 0;
      border-width: 0;
      padding-top: 0;
      padding-bottom: 0;
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}
</style>
