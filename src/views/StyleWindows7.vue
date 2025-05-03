<template>
  <div class="top">
    <div class="tip">
      <k-can-edit v-model="pageData.tip" />
      <div>{{ pageData.tip }}</div>
    </div>
    <div class="tip2">
      <k-can-edit v-model="pageData.tip2" />
      <div>{{ pageData.tip2 }}</div>
    </div>

    <div class="steps">
      <k-can-edit v-model="pageData.steps" />
      <div>{{ pageData.steps }}</div>
    </div>
    <div class="technical-info-tip">
      <k-can-edit v-model="pageData.technicalInfoTip" />
      <div>{{ pageData.technicalInfoTip }}</div>
    </div>
    <div class="technical-information">
      <k-can-edit v-model="pageData.technicalInformation" />
      <div>{{ pageData.technicalInformation }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">

import kCanEdit from '@/components/canEdit.vue';
import KMultiLineText from '@/components/multiLineText.vue';
import QRCode from 'qrcode';
import { decodePageData } from '@/scripts/uitl';

const props = defineProps<{ bgColor: string; fontColor: string; pageDataFromUrl?: string }>();

const pageData = reactive({
  tip: 'A problem has been detected and Windows has been shut down to prevent damage to your computer.',
  tip2: "If this is the first time you've seen this stop error screen, restart your computer. If this screen appears again, follow these steps:",
  steps:
    'Check for virus on your computer. Remove any newly installed hard drives or hard drive controllers. Check your hard drive to make sure it is properly configured and terminated. Run CHKDSK /F to check for hard drive corruption, and then restart your computer. Welcome to https://kuankuan.site/',
  technicalInfoTip: 'Technical information:',
  technicalInformation: '*** STOP: 0x0000007B (0xF7A9E524, 0xC0000034, 0x00000000, 0x00000000)',
});

// @ts-expect-error 2551
window.pageData = pageData;

onMounted(() => {
  if (props.pageDataFromUrl) {
    decodePageData(pageData, props.pageDataFromUrl);
  }
});
</script>
<style scoped lang="scss">
.top {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  font-size: max(2vw, 2vh);
  padding: 2em;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  row-gap: 2em;

  & > div {
    position: relative;
  }
  &:deep(*){
    font-family: 'fixedsys', "Microsoft YaHei", sans-serif;

  }
}
</style>
