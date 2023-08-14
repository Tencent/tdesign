<template>
  <t-dialog :visible.sync="visibleSync" class="dialog-download">
    <div class="dialog-content" slot="body">
      <img src="../pages/design/assets/source/emoji-light.png" width="160" />

      <div class="dialog-describe">
        <p>欢迎使用</p>
        <p>TDesign 设计资源</p>
      </div>
      <div class="dialog-email">
        <t-input placeholder="请留下你的邮箱" v-model="email" />
      </div>
    </div>

    <div class="dialog-footer" slot="footer">
      <t-button theme="default" @click="downloadCancel">取消</t-button>
      <t-button theme="primary" :disabled="!legalEmail" @click="downloadConfirm">确定</t-button>
    </div>
  </t-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    downloadItem: Object
  },

  data () {
    return {
      email: ''
    }
  },

  computed: {
    visibleSync: {
      get () {
        return this.visible
      },
      set (v) {
        this.$emit('update:visible', v)
      }
    },
    legalEmail () {
      return /^[A-Za-z0-9\-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)
    }
  },

  methods: {
    downloadCancel () {
      this.visibleSync = false
    },
    downloadConfirm () {
      const { downloadItem, email } = this
      if (!email || !downloadItem) return

      window.open(downloadItem.actionUrl, '_blank')
      this.visibleSync = false
      aegis.reportEvent({
        name: '设计资源下载', // 必填
        ext1: email,
        ext2: downloadItem.title,
        ext3: downloadItem.actionUrl
      })
    }
  }
}
</script>

<style lang="less">
.dialog-download {
  .dialog-content {
      display: flex;
      flex-direction: column;
      align-items: center;
  }
  .dialog-describe {
      font-weight: 600;
      font-size: 36px;
      line-height: 44px;
      color: var(--text-primary);
      text-align: center;
      margin: 30px 0 24px;
  }
  .dialog-email {
      width: 100%;
      padding: 0 2px;
  }
  .dialog-footer {
      text-align: center;
  }
}
</style>
