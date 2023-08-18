<template>
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_26625_99462)">
      <rect :width="height" height="40" fill="#D54941" fill-opacity="0.16" />
      <rect width="36" :height="height" fill="#D54941" fill-opacity="0.16" />
      <rect
        :x="36 - height"
        :width="height"
        height="36"
        fill="#D54941"
        fill-opacity="0.16"
      />
      <rect
        :y="36 - height"
        width="36"
        :height="height"
        fill="#D54941"
        fill-opacity="0.16"
      />
      <rect y="16" width="2" height="4" fill="#F78D94" />
      <rect x="2" y="17" :width="height - 4" height="2" fill="#F78D94" />
      <rect :x="height - 2" y="16" width="2" height="4" fill="#F78D94" />
      <rect :x="36 - height" y="16" width="2" height="4" fill="#F78D94" />
      <rect :x="38 - height" y="17" :width="height - 4" height="2" fill="#F78D94" />
      <rect x="34" y="16" width="2" height="4" fill="#F78D94" />
      <rect x="16" width="4" height="2" fill="#F78D94" />
      <rect x="17" y="2" width="2" :height="height-4" fill="#F78D94" />
      <rect x="16" :y="height - 2" width="4" height="2" fill="#F78D94" />
      <rect x="16" :y="36- height" width="4" height="2" fill="#F78D94" />
      <rect x="17" :y="38-height" width="2" :height="height-4" fill="#F78D94" />
      <rect x="16" y="34" width="4" height="2" fill="#F78D94" />
    </g>
    <!-- 圆角 -->
    <defs>
      <clipPath id="clip0_26625_99462">
        <rect width="36" height="36" rx="6" fill="white" />
      </clipPath>
    </defs>
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
      return Math.min(12 + this.height * 2, 36);
    },
  },
};
</script>
