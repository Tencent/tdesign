<template>
  <div>
    <td-icons-view />
    <td-doc-footer :style="footerStyle" />
  </div>
</template>
<script>
export default {
  name: 'icons',
  computed: {
    footerStyle() {
      return {
        '--content-padding-right': '0',
        '--content-max-width': '1440px',
        '--content-padding-left-right': '48px',
        '--footer-inner-position': 'relative',
        '--footer-logo-position': 'unset',
      };
    },
  },
};
</script>
