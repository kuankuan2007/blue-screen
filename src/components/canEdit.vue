<template>
  <textarea
    v-model.lazy="value"
    :class="{
      'can-edit': onEdit,
      'hide-menu': hideMenu,
    }"
  ></textarea>
  <div
    class="menu"
    :class="{
      'hide-menu': hideMenu,
      [`at-${props.buttonAt}`]: true,
    }"
    @click="onEdit = !onEdit"
  >
    <k-icon :id="onEdit ? 'save' : 'edit'" />
  </div>
</template>
<script setup lang="ts">import KIcon from './icon.vue';
const value = defineModel({
  required: true,
  type: String,
});
const props = withDefaults(
  defineProps<{
    buttonAt?: 'top-right' | 'right';
  }>(),
  {
    buttonAt: 'top-right',
  }
);
const onEdit = ref(false);
const hideMenu = ref(false);
window.addEventListener('hideMenu', () => {
  hideMenu.value = true;
  onEdit.value = false;
});
window.addEventListener('showMenu', () => {
  hideMenu.value = false;
});
</script>
<style scoped lang="scss">
textarea {
  position: absolute;
  inset: 0;
  resize: none;
  border: var(--font-color) solid 0.1em;
  outline: none;
  background-color: var(--bg);
  font-size: 0.8em;
  opacity: 0;
  user-select: none;
  pointer-events: none;
  &.can-edit {
    opacity: 1;
    user-select: auto;
    pointer-events: auto;
  }
  &.hide-menu {
    opacity: 0;
    transition: 0;
  }
}
.menu {
  position: absolute;

  border: var(--font-color) solid 0.1em;
  transition: 0.3s;
  padding: 0.5em;
  cursor: pointer;
  &:hover {
    background-color: var(--font-color);
    & > * {
      color: var(--bg);
    }
  }
  &.hide-menu {
    opacity: 0;
    transition: 0;
  }
  &.at-top-right {
    bottom: 100%;
    right: 0;
  }
  &.at-right {
    left: 100%;
  }
}
</style>
