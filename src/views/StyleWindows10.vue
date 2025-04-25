<template>
    <div class="top">
      <p class="cry">:(</p>
      <k-multi-line-text class="tip" v-model="pageData.tip" />
      <div class="paragraph complete">
        <k-can-edit v-model="pageData.complete" />
        <div>{{ pageData.complete }}</div>
      </div>
      <div class="more-info">
      <div class="qrcode">
        <k-can-edit v-model="pageData.qrCode" />
        <img :src="qrcodeData" alt="qrcode" />
      </div>
        <k-multi-line-text class="connetc-info" v-model="pageData.connectInfo" />
      </div>
    </div>
</template>
<script setup lang="ts">
import { decodePageData } from '@/scripts/uitl';

import kCanEdit from '@/components/canEdit.vue';
import KMultiLineText from '@/components/multiLineText.vue';
import QRCode from 'qrcode';

const props=defineProps<{ bgColor: string; fontColor: string , pageDataFromUrl?: string}>();



const pageData = reactive({
  tip: "Your device ran into a problem and needs to restart.\nWe're just collecting some error info, then we'll restart for you.",
  complete: '24% complete',
  qrCode: 'https://kuankuan.site/',
  connectInfo:
    'For more information ablout this issue and possible fixes, visit https://kuankuan.site/\n\n\nIf you call a support person, give them this info:\nStop code: KFC_ERROR',
});
const qrcodeData = ref('');

// @ts-expect-error 2551
window.pageData = pageData;

watchEffect(async () => {
  qrcodeData.value = await QRCode.toDataURL(pageData.qrCode, {
    margin: 1,
    color: {
      light: props.fontColor,
      dark: props.bgColor,
    },
  });
});
onMounted(() => {
  if (props.pageDataFromUrl) {
    decodePageData(pageData, props.pageDataFromUrl);
  }
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
    margin-top: 1.5em;

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
</style>