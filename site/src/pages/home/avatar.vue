<template>
  <a class="avatar" :href="href" target="_blank" rel="nofollow">
    <img :src="src" loading="lazy" />
  </a>
</template>

<script>
export default {
  props: {
    href: String,
    src: String
  }
}
</script>

<style lang="less">
.module-contributor__avatars {
  --avatar-size: 104px;
  --avatar-padding: 6px;

  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  justify-content: space-between;

  .avatar {
    border-radius: 100%;
    -webkit-border-radius: 100%;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    background: var(--bg-color-card);
    justify-content: center;
    align-items: center;
    padding: var(--avatar-padding);
    box-sizing: border-box;
    width: var(--avatar-size);
    height: var(--avatar-size);
    transition: all 1s;
    // fix safari border-radiu overflow bug
    mask-image: -webkit-radial-gradient(white, black);
    -webkit-mask-image: -webkit-radial-gradient(white, black);

    &.change {
      animation: s1 1s cubic-bezier(0.38, 0, 0.24, 1);
    }

    &.active {
      &::before {
        --avatar-padding: 6px;
      }
      &::after {
        opacity: 1;
        visibility: visible;
        animation: r1 6s cubic-bezier(0.38, 0, 0.24, 1) infinite;
        -webkit-animation: r1 6s cubic-bezier(0.38, 0, 0.24, 1) infinite;
      }
    }

    &::before {
      content: '';
      position: absolute;
      z-index: 1;
      --avatar-padding: 0;
      background: var(--bg-color-card);
      top: var(--avatar-padding);
      left: var(--avatar-padding);
      right: var(--avatar-padding);
      bottom: var(--avatar-padding);
      transition: all 0.2s linear;
      overflow: hidden;
      border-radius: 100%;
    }

    &::after {
      content: '';
      position: absolute;
      top: calc(-104px + 50%);
      left: -10px;
      background: linear-gradient(
        180deg,
        var(--bg-color-card),
        var(--bg-color-card),
        #0052d9,
        var(--bg-color-card),
        var(--bg-color-card),
        var(--bg-color-card)
      );
      height: calc(2 * var(--avatar-size));
      width: calc(2 * var(--avatar-size));
      border-radius: 100%;
      transform-origin: center center;
      // animation: r1 6s cubic-bezier(0.38, 0, 0.24, 1) infinite;
      // -webkit-animation: r1 6s cubic-bezier(0.38, 0, 0.24, 1) infinite;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s linear, visibility 0.2s linear;
    }

    img {
      width: calc(100% - calc(var(--avatar-padding) * 2));
      height: calc(100% - calc(var(--avatar-padding) * 2));
      border-radius: 100%;
      position: absolute;
      z-index: 3;
    }
  }
  @-webkit-keyframes r1 {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    70% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes r1 {
    0% {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    70% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
    100% {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes s1 {
    0% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
    50% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
    100% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
  @keyframes s1 {
    0% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
    50% {
      transform: scale(0);
      -webkit-transform: scale(0);
    }
    100% {
      transform: scale(1);
      -webkit-transform: scale(1);
    }
  }
}

@media screen and (max-width: 1200px) {
  .module-contributor__avatars {
    --avatar-size: 88px;
  }
}
</style>
