<template>
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="6" fill="#D54941" fill-opacity="0.1" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17 20H19V23H29V20H31V28H29V25H19V28H17V20Z"
      fill="#D54941"
      fill-opacity="0.6"
    />
    <rect
      x="3"
      y="8"
      width="14"
      height="32"
      rx="3"
      fill="#D54941"
      fill-opacity="0.2"
    />
    <rect
      x="31"
      y="8"
      width="14"
      height="32"
      rx="3"
      fill="#D54941"
      fill-opacity="0.2"
    />
    <rect
      x="0.5"
      y="0.5"
      width="47"
      height="47"
      rx="5.5"
      stroke="black"
      stroke-opacity="0.06"
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
};
</script>
