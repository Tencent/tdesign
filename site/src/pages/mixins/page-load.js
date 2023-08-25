export default {
  data () {
    return {
      loaded: false
    }
  },

  computed: {
    contentStyle () {
      const { loaded } = this
      return { visibility: loaded ? 'visible' : 'hidden' }
    }
  },

  methods: {
    contentLoaded (callback) {
      requestAnimationFrame(() => {
        this.loaded = true
        callback()
      })
    }
  }
}
