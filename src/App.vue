<template>
  <div
    class="screen"
    :style="{
      '--bg': bgColor,
      '--font-color': fontColor,
    }"
  >
    <router-view
      :bg-color="bgColor"
      :font-color="fontColor"
      ref="mainBox"
      :page-data-from-url="pageDataFromUrl"
    />
  </div>
  <k-menu
    v-model:bg-color="bgColor"
    v-model:font-color="fontColor"
    :auto-font-color="autoFontColor"
    @copy-link="copyLinks"
  />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import Color from 'color';
import KMenu from './components/menu.vue';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { getVisibleColor ,copyText} from './scripts/uitl';
import { router } from './router';
import { showInfo } from '@/scripts/info';

const bgColor = ref('#0177d7');
const fontColor = ref('#ffffff');
const autoFontColor = ref(true);
const pageDataFromUrl = ref('');

router.afterEach((to, from) => {
  decodeUrl();
});

function decodeUrl() {
  const nowUrl = new URL(window.location.href);
  if (nowUrl.searchParams.get('b')) {
    const oldValue = bgColor.value;
    try {
      bgColor.value = `${nowUrl.searchParams.get('b')}`;
    } catch {
      bgColor.value = oldValue;
    }
  }
  if (nowUrl.searchParams.get('f')) {
    const oldValue = fontColor.value;
    try {
      fontColor.value = `${nowUrl.searchParams.get('f')}`;
    } catch {
      fontColor.value = oldValue;
    }
  }
  if (nowUrl.searchParams.get('a')) {
    try {
      autoFontColor.value = `${nowUrl.searchParams.get('a')}` === 'true';
    } catch {
      autoFontColor.value = true;
    }
  }
  if (nowUrl.searchParams.get('d')) {
    try {
      pageDataFromUrl.value = decompressFromEncodedURIComponent(nowUrl.searchParams.get('d') || '');
    } catch {
      pageDataFromUrl.value = '';
    }
  } else {
    pageDataFromUrl.value = '';
  }
}
onMounted(() => {
  decodeUrl();
});
function copyLinks() {
  const target = new URL(window.location.href);

  if (fontColor.value === getVisibleColor(bgColor.value).hex()) {
    target.searchParams.set('a', 'true');
  } else {
    target.searchParams.set('a', 'false');
    target.searchParams.set('f', encodeURI(Color(fontColor.value).hex()));
  }
  target.searchParams.set('b', encodeURI(Color(bgColor.value).hex()));
  target.searchParams.set(
    'd',
    // @ts-ignore
    compressToEncodedURIComponent(JSON.stringify(window.pageData || {}))
  );
  copyText(target.href);
  showInfo('The link has been copied to the clipboard.');
}
</script>
<style scoped lang="scss">
.screen {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  background-color: var(--bg);
  &:deep(*),
  .menu-box:deep(*) {
    color: var(--font-color);
  }
}
</style>
