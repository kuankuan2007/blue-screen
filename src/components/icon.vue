<template>
  <div class="icon">{{ String.fromCharCode(fontelloData[id]) }}</div>
</template>
<script setup lang="ts">
import fontelloData from '../assets/fontello/data';
defineProps({
  id: {
    required: true,
    type: String,
  },
});
</script>
<style scoped lang="scss">
@use '../assets/fontello/fontello.scss';
* {
  @include fontello.fontello;
  user-select: none;
  display: block;
  width: 1em;
  height: 1em;
  line-height: 1em;
}
</style>
