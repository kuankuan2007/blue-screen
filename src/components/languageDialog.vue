<template>
  <k-dialog ref="dialog" can-cancel>
    <div class="language-dialog">
      <button class="exit" @click="close"><k-icon id="close" /></button>

      <div class="title">Choose your language</div>
      <ul class="language-list">
        <li
          v-for="item in languageList"
          :key="item.id"
          :class="{
            active: item.id === localSettingLanguage,
          }"
          @click="localSettingLanguage = item.id"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </k-dialog>
</template>
<script setup lang="ts">
import KDialog from './dialog.vue';
import KIcon from './icon.vue';
import { languageList, localSettingLanguage } from '@/i18n';
const dialog = useTemplateRef('dialog');

function open() {
  dialog.value?.open();
}
function close() {
  dialog.value?.close();
}
defineExpose({
  open,
});
</script>
<style scoped lang="scss">
.language-dialog {
  font-size: min(3vmin, 1.5rem);
  padding: 1.3em;
  overflow: hidden;
  .title {
    font-size: 1.5em;
    font-weight: bold;
  }

  .language-list {
    list-style: none;
    margin: 0;
    padding: 1em 0;
    display: flex;
    flex-direction: column;
    row-gap: 0.5em;
    li {
      padding: 0.3em 0.6em;
      border: 0.1em solid transparent;
      font-size: 1em;
      outline: none;
      transition: 0.3s;
      cursor: pointer;
      &.active {
        background-color: #ccc;
      }
      &:hover {
        border-color: #000;
      }
    }
  }
  button.exit {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 1.3em;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    &:hover {
      background-color: #f00;
      color: #fff;
      transition: 0.3s;
    }
  }
}
</style>
