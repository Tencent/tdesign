<template>
  <svg
    width="16"
    :height="viewHeight"
    :viewBox="`0 0 16 ${viewHeight}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="16" height="8" rx="3" fill="#D54941" fill-opacity="0.2" />
    <rect x="6" y="8" width="4" height="2" fill="#F78D94" />
    <rect x="7" y="10" width="2" :height="height" fill="#F78D94" />
    <rect x="6" :y="10 + height" width="4" height="2" fill="#F78D94" />
    <rect
      :y="12 + height"
      width="16"
      height="8"
      rx="3"
      fill="#D54941"
      fill-opacity="0.2"
    />
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
  computed: {
    height() {
      return Math.min(parseInt(this.size, 10), 12);
    },
    viewHeight() {
      return Math.min(20 + this.height, 36);
    },
  },
};
</script>
