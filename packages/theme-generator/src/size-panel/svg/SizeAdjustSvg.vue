<template>
  <svg
    width="8"
    :height="height"
    :viewBox="`0 0 8 ${height}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="8" :height="height" rx="3" fill="#F78D94" />
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 16,
    },
  },
  computed: {
    height() {
      return Math.min(parseInt(this.size, 10) / 2, 80);
    },
  },
};
</script>
