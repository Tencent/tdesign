<template>
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_26565_99804)">
        <rect width="48" height="48" rx="6" fill="#D54941" fill-opacity="0.1" />
        <rect width="17" height="48" fill="#D54941" fill-opacity="0.16" />
        <rect x="31" width="17" height="48" fill="#D54941" fill-opacity="0.16" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1 20H3V23H15V20H17V23V25V28H15V25H3V28H1V25V23V20Z"
          fill="#D54941"
          fill-opacity="0.5"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M45 20H47V23V25V28H45V25H33V28H31V25V23V20H33V23H45V20Z"
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
        <clipPath id="clip0_26565_99804">
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
  