<template>
  <div
    class="screen"
    :style="{
      '--bg': bgColor.hex(),
      '--font-color': fontColor.hex(),
    }"
  >
    <div class="top">
      <p class="cry">:(</p>
      <k-multi-line-text class="tip" v-model="pageData.tip" />
      <p class="complete">
        <k-can-edit v-model="pageData.complete" />
        <div>{{ pageData.complete }}</div>
      </p>
      <div class="more-info">
      <div class="qrcode">
        <k-can-edit v-model="pageData.qrCode" />
        <img :src="qrcodeData" alt="qrcode" />
      </div>
        <k-multi-line-text class="connetc-info" v-model="pageData.connectInfo" />
      </div>
    </div>
  </div>
  <k-menu v-model="pageData.bg" :color="fontColor.hex()" :data="pageData"/>
</template>
<script setup lang="ts">
import { watchEffect, ref, reactive, computed } from 'vue';
import QRCode from 'qrcode';
import KCanEdit from './components/canEdit.vue';
import Color from 'color';
import KMultiLineText from './components/multiLineText.vue';
import KMenu from './components/menu.vue';
let searchData:object={};
try{
 searchData=JSON.parse(atob(new URL(location.href).searchParams.get('d')||''))
}catch{}
const pageData = reactive({
  tip: "Your PC ran into a problem and needs to restart.\nWe're just collecting some error info, then we'll restart for you.",
  complete: '24% complete',
  qrCode: 'https://kuankuan.site/',
  bg: '#0177d7',
  connectInfo:
    'For more information ablout this issue and possible fixes, visit https://kuankuan.site/\n\n\nIf you call a support person, give them this info:\nStop code: KFC_ERROR',
  ...searchData
});
const qrcodeData = ref('');
const bgColor = computed(() => {
  return Color(pageData.bg);
});
const fontColor = computed(() => {
  return bgColor.value.isDark() ? Color('#fff') : Color('#000');
});
watchEffect(async () => {
  qrcodeData.value = await QRCode.toDataURL(pageData.qrCode, {
    margin: 1,
    color: {
      light: fontColor.value.hex(),
      dark: bgColor.value.hex(),
    },
  });
});
</script>
<style scoped lang="scss">
.top {
  padding: 10em;
  font-size: min(1.8vw, 1.8vh);
  .cry {
    margin: 0;
    font-size: min(20vh, 16vw);
  }

  .tip {
    font-size: min(1.8em, 9vw);
    margin: 0;
    margin-top: 3vh;
    max-width: max(50vw, 28em);
    :deep(p) {
      margin: 0;
    }
  }

  .complete {
    font-size: min(1.5em, 7.5vw);
    margin-top: 1em;
    position: relative;
  }
  .more-info {
    display: flex;
    justify-content: start;
    align-items: stretch;
    column-gap: 1.5em;
    .qrcode {
      width: 10em;
      height: 10em;
      position: relative;
      flex: auto 0 0;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .connetc-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &:deep(p) {
        margin: 0;
        font-size: min(1.2em, 5vw);
      }
    }
  }
}
.screen {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  background-color: var(--bg);
  &:deep(*),.menu-box:deep(*) {
    color: var(--font-color);
  }
}
</style>
