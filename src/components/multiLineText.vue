<template>
  <div>
    <p v-for="i of value.split('\n')">{{ i }}</p>
    <k-can-edit v-model="value" />
  </div>
</template>
<script setup lang="ts">
import KCanEdit from './canEdit.vue';
const value = defineModel({
  required: true,
  type: String,
});
</script>
<style scoped lang="scss">
div {
  position: relative;
}
</style>
