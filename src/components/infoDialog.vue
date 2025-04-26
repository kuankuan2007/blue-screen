<template>
  <k-dialog ref="dialog" @cancel="(close(), emit('close', 'cancel'))" :can-cancel="canCancel"
    ><div class="info-dialog">
      <div class="title-infos">
        <k-icon :id="icon" />
        <div class="title">{{ title }}</div>
      </div>
      <hr />
      <div class="content">{{ content }}</div>
      <div class="button-box">
        <button v-for="i of buttons" @click="(close(), emit('close', i))">
          {{ i }}
        </button>
      </div>
    </div>
  </k-dialog>
</template>
<script setup lang="ts">
import KDialog from './dialog.vue';
import KIcon from './icon.vue';
const dialog = useTemplateRef('dialog');
const props = withDefaults(
  defineProps<{
    canCancel?: boolean;
    icon?: string;
    title?: string;
    buttons?: string[];
    content: string;
  }>(),
  {
    canCancel: true,
    icon: 'info',
    title: 'Information',
    content: '',
    buttons: () => ['OK'],
  }
);

const emit = defineEmits(['close']);
function close() {
  dialog.value?.close();
}
onMounted(() => {
  dialog.value?.open();
});
</script>
<style scoped lang="scss">
.info-dialog {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-size: min(3vmin, 1.5rem);
  .title-infos {
    display: flex;
    align-items: center;
    font-size: 1.5em;
    .title {
      margin-left: 10px;
      font-weight: bold;
    }
  }
  hr {
    display: block;
    margin: 0.5em 0;
    padding: 0;
    height: 0.2em;
    border: none;
    background-color: #8c8c8c;
    border-radius: 1em;
  }
  .content {
    font-size: 1.2em;
    margin-top: 0.8em;
  }
  .button-box {
    margin-top: 1em;
    font-size: 1em;
    display: flex;
    justify-content: flex-end;
    button {
      display: block;
      padding: 0.3em 0.6em;
      border: 0.1em solid black;
      font-size: 1em;
      outline: none;
      transition: 0.3s;
      cursor: pointer;
      background-color: #d6d6d6;
      &:hover {
        background-color: #000;
        color: white;
      }
    }
  }
}
</style>
