<template>
  <svg
    :width="size + 2 || 2"
    height="8"
    :viewBox="`0 0 ${size || 2} 8`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="1" height="8" fill="#D54941" />
    <rect x="1" y="3" :width="size || 2" height="2" fill="#D54941" />
    <rect :x="size || 2 - 1" width="1" height="8" fill="#D54941" />
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 2,
    },
  },
};
</script>
