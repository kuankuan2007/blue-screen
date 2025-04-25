<template>
  <div class="check-box" @click.stop="() => (value = !value)">
    <div class="show-box">
      <k-icon
        id="check"
        :class="{
          hide: !value,
        }"
      >
      </k-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import KIcon from './icon.vue';
const value = defineModel({ required: true, type: Boolean });
</script>

<style scoped lang="scss">
.check-box {
  position: relative;
  width: 1em;
  height: 1em;
}

.show-box {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: var(--font-color);
  border: solid 0.15rem var(--bg);
  border-radius: 0.2em;
  box-sizing: border-box;
  font-size: 0.9em;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;

  .icon {
    transition: 0.3s;
    &.hide {
      opacity: 0;
    }
  }
}
</style>
