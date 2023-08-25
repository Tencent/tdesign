<template>
  <span :class="_class" :style="_style">
    <img
      :src="imgSrc"
      alt="user avatar"
      @error="onError"
      v-if="!error && imgSrc"
    >
    <div class="tdesign-avatar-name">{{username}}</div>
  </span>
</template>
<script>
function getSrc (username, src) {
  if (username) {
    // return `http://dcloud.oa.com/Public/Avatar/${username}.png`;
    // return `http://r.hrc.oa.com/photo/500/${username}.png`;
    return `https://dayu.oa.com/avatars/${username}/profile.jpg`
  }

  return src || ''
}

export default {
  props: {
    /**
     * 头像类型
     * @member square | round
     */
    type: {
      type: String,
      default: 'round'
    },
    /**
     * 头像大小
     * @member large | default | small
     */
    size: {
      type: String,
      default: 'default'
    },
    username: String,
    src: String,
    width: [String, Number],
    height: [String, Number]
  },
  data () {
    return {
      prefixCls: 'tdesign-avatar',
      error: false
    }
  },
  computed: {
    _class () {
      return [this.prefixCls, {
        [`${this.prefixCls}__lg`]: this.size === 'large',
        [`${this.prefixCls}__square`]: this.type === 'square',
        [`${this.prefixCls}__default`]: this.error || !this.imgSrc
      }]
    },
    _style () {
      if (this.width) {
        return {
          width: `${this.width}px`,
          height: `${this.width}px`
        }
      }
      return {}
    },
    imgSrc () {
      return getSrc(this.username, this.src)
    }
  },
  methods: {
    onError () {
      this.error = true
    }
  }
}
</script>

<style lang="less">
.tdesign-avatar {
  display: inline-block;
  width: 34px;
  height: 34px;
  border: 1px solid #eee;
  line-height: 0;
  vertical-align: middle;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  &-name {
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    text-align: center;
    width: 100%;
  }

  &__default {
    background: url(http://tdesign.gtimg.com/docs/male.png) no-repeat center;
    background-size: 100%;
  }

  &__lg {
    width: 40px;
    height: 40px;
  }

  &__square {
    border-radius: 0;
  }
}
</style>
