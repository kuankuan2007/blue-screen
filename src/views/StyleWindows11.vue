<template>
  <div class="top">
    <div class="tip">
      <k-can-edit v-model="pageData.tip" button-at="right" />
      <div>{{ pageData.tip }}</div>
    </div>
    <div class="complete">
      <k-can-edit v-model="pageData.complete" button-at="right" />
      <div>{{ pageData.complete }}</div>
    </div>

    <div class="stop-code">
      <k-can-edit v-model="pageData.stopCode" button-at="right" />
      <div>{{ pageData.stopCode }}</div>
    </div>
    <div class="what-failed">
      <k-can-edit v-model="pageData.whatFailed" button-at="right" />
      <div>{{ pageData.whatFailed }}</div>
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
  tip: 'Your device ran into a problem and needs to restart.',
  complete: '24% complete',
  stopCode: 'Stop code: KFC_ERROR',
  whatFailed: 'What failed: kuankuan.sys',
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
  align-items: center;
  font-size: min(1.8vw, 1.8vh);
  height: 100%;

  .tip {
    margin-top: auto;
    font-size: min(1.6em, 8vw);
    position: relative;

    &:deep(p) {
      margin: 0;
    }
  }

  .complete {
    font-size: min(1.6em, 8vw);
    margin-top: 0.3em;
    position: relative;
  }
  .stop-code {
    position: relative;

    margin-top: auto;
  }
  .what-failed {
    position: relative;

    margin-bottom: 1.8em;
  }
}
</style>
