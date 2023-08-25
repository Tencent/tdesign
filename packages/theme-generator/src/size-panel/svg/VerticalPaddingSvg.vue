<template>
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_26565_99786)">
      <rect width="48" height="48" rx="6" fill="#D54941" fill-opacity="0.1" />
      <path
        d="M0 6C0 2.68629 2.68629 0 6 0H42C45.3137 0 48 2.68629 48 6V17H0V6Z"
        fill="#D54941"
        fill-opacity="0.16"
      />
      <path
        d="M0 32H48V42C48 45.3137 45.3137 48 42 48H6C2.68629 48 0 45.3137 0 42V32Z"
        fill="#D54941"
        fill-opacity="0.16"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20 1H23H25H28V3H25V15H28V17H25H23H20V15H23V3H20V1Z"
        fill="#D54941"
        fill-opacity="0.5"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20 32H23H25H28V34H25V46H28V48H25H23H20V46H23V34H20V32Z"
        fill="#D54941"
        fill-opacity="0.5"
      />
    </g>
    <rect
      x="0.5"
      y="0.5"
      width="47"
      height="47"
      rx="5.5"
      stroke="black"
      stroke-opacity="0.06"
    />
    <defs>
      <clipPath id="clip0_26565_99786">
        <rect width="48" height="48" rx="6" fill="white" />
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
};
</script>
