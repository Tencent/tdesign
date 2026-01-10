<template>
  <t-dialog v-model="visibleSync" class="dialog-download">
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

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  visible: Boolean,
  downloadItem: Object,
});

const emit = defineEmits(['update:visible']);

const email = ref('');

const visibleSync = computed({
  get() {
    return props.visible;
  },
  set(v) {
    emit('update:visible', v);
  },
});

const legalEmail = computed(() => {
  return /^[A-Za-z0-9\-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email.value);
});

const downloadCancel = () => {
  visibleSync.value = false;
};

const downloadConfirm = () => {
  if (!email.value || !props.downloadItem) return;

  window.open(props.downloadItem.actionUrl, '_blank');
  visibleSync.value = false;
  aegis.reportEvent({
    name: '设计资源下载', // 必填
    ext1: email.value,
    ext2: props.downloadItem.title,
    ext3: props.downloadItem.actionUrl,
  });
};
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
