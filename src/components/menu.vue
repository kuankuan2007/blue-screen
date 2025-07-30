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
              <p class="text">{{ $t('menu.collapseMenu') }}</p>
            </li>
            <li @click="languageDialog?.open()">
              <p class="icon"><k-icon id="language" /></p>
              <p class="text">Language</p>
            </li>
            <li @click="((hideMenu = true), (foldMenu = true))">
              <p class="icon"><k-icon id="eye-off" /></p>
              <p class="text">{{ $t('menu.hideUnnecessaries') }}</p>
            </li>
            <li
              @click="screenCapture"
              :class="{
                hide: !canScreenCapture,
              }"
            >
              <p class="icon"><k-icon id="scissors" /></p>
              <p class="text">{{ $t('menu.screenshots') }}</p>
            </li>
            <li @click="$emit('copy-link')">
              <p class="icon"><k-icon id="share" /></p>
              <p class="text">{{ $t('menu.shareLink') }}</p>
            </li>
            <li @click="bgColorSetDialog?.open()">
              <p class="icon"><k-icon id="background-color" /></p>
              <p class="text">{{ $t('menu.editBgColor') }}</p>
            </li>
            <li @click="autoFontColor = !autoFontColor">
              <k-check-box v-model="autoFontColor" />
              <p class="text">{{ $t('menu.autoFgColor') }}</p>
            </li>
            <li
              @click="fontColorSetDialog?.open()"
              :class="{
                hide: autoFontColor,
              }"
            >
              <p class="icon"><k-icon id="fontcolor" /></p>
              <p class="text">{{ $t('menu.editFgColor') }}</p>
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
    :defined-choice="Object.values(colors)"
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
  <k-language-dialog ref="languageDialog" />
</template>
<script setup lang="ts">
import KIcon from './icon.vue';
import KColorSetDialog from './colorSetDialog.vue';
import KLanguageDialog from './languageDialog.vue';
import { getVisibleColor } from '@/scripts/uitl';
import KCheckBox from './checkBox.vue';
import { RouterLink } from 'vue-router';
import colors from '@/scripts/colors';
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

const canScreenCapture = ref(!!navigator?.mediaDevices?.getDisplayMedia);
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
const languageDialog = useTemplateRef('languageDialog');
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
  font-size: min(2.4vmin, 2.2vw, 2.6vh);
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
  overflow-y: auto;
  div.style-list {
    padding: 0.5em;
    display: flex;
    column-gap: 1em;
    row-gap: 0.3em;
    flex-wrap: wrap;

    & > a {
      border: 0.1em solid var(--bg);
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
  padding: 0.5em;
  cursor: pointer;
  border: 0.1em solid transparent;
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
  & > li {
    display: flex;
    align-items: center;
    margin: 0.2em 0;
    column-gap: 0.8em;
    font-size: 1.2em;
    border: 0.1em transparent solid;
    padding: 0.5em 1em;
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
