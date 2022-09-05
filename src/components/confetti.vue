<script setup lang="ts">
import confetti from 'canvas-confetti'
const props = defineProps({
  passed: Boolean
})
function congras() {
  if (!props.passed) return
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.8 }
  });
}
watch(() => props.passed, (v) => {
  if (v) {
    setTimeout(() => {
      congras()
    }, 300);
  }
})
</script>
<template>

</template>
