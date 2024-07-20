<template>
  <div class="top">
    <p class="cry">:(</p>
    <p class="tip">你的访问遇到问题<br />我们只收集某些错误信息</p>
    <p class="more-info">
      有关次问题的详细情况，请您咨询这个问题：{{ errorCode }} - {{ errorReason }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
const pageURL = ref(window.location.href);
const errorCode = ref('');
const errorReason = ref('');
watchEffect(() => {
  fetch(pageURL.value).then(
    (res) => {
      errorCode.value = res.status.toString();
      errorReason.value = res.statusText;
    },
    () => {
      errorCode.value = '-1';
      errorReason.value = 'NETWORK_ERROR';
    }
  );
});
</script>
<style scoped lang="scss">
.top {
  margin-left: 10vw;

  .cry {
    font-size: min(40vh, 30vw);
    margin: 0;
  }

  .tip {
    font-size: min(2rem, 10vw);
    margin: 0;
  }

  .more-info {
    font-size: min(1.2rem, 5vw);
    margin-top: 1em;
  }
}
</style>
