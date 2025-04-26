<template>
  <Teleport to="body">
    <dialog ref="dialog">
      <slot></slot>
    </dialog>
  </Teleport>
</template>
<script setup lang="ts">
const dialog = useTemplateRef('dialog');

const emit = defineEmits(['open', 'close', 'cancel']);
const props = defineProps({
  canCancel: {
    type: Boolean,
    default: true,
  },
});

function open() {
  dialog.value?.showModal();
  emit('open');
}

function close() {
  dialog.value?.close();
  emit('close');
}
function onCancel(e: Event) {
  if (props.canCancel) {
    emit('cancel');
  } else {
    e.preventDefault();
  }
}

function cancel() {
  if (props.canCancel) {
    emit('cancel');
    close();
  }
}
onMounted(() => {
  dialog.value?.addEventListener('cancel', onCancel);
});
onUnmounted(() => {
  dialog.value?.removeEventListener('cancel', onCancel);
});

defineExpose({ open, close, cancel });
</script>
<style scoped lang="scss">
dialog {
  outline: none;
  border: 0.2em solid black;
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
  }
}
</style>
