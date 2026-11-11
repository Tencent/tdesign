<template>
  <t-dialog v-model:visible="visibleSync" class="dialog-download">
    <template #body>
      <div class="dialog-content">
        <img src="../pages/design/assets/source/emoji-light.png" width="160" />

        <div class="dialog-describe">
          <p>欢迎使用</p>
          <p>TDesign 设计资源</p>
        </div>
        <div class="dialog-email">
          <t-input v-model="email" placeholder="请留下你的邮箱" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="dialog-footer">
        <t-button theme="default" @click="downloadCancel">取消</t-button>
        <t-button theme="primary" :disabled="!legalEmail" @click="downloadConfirm">确定</t-button>
      </div>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface DownloadItem {
  title: string;
  actionUrl: string;
}

interface AegisReporter {
  reportEvent(event: { name: string; ext1?: string; ext2?: string; ext3?: string }): void;
}

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    downloadItem?: DownloadItem;
  }>(),
  {
    visible: false,
  },
);
const emit = defineEmits<(event: 'update:visible', value: boolean) => void>();

const email = ref('');
const visibleSync = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
});
const legalEmail = computed(() => /^[A-Za-z0-9\-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email.value));

function downloadCancel(): void {
  visibleSync.value = false;
}

function downloadConfirm(): void {
  if (!email.value || !props.downloadItem) return;

  window.open(props.downloadItem.actionUrl, '_blank');
  visibleSync.value = false;
  const { aegis } = window as Window & { aegis?: AegisReporter };
  aegis?.reportEvent({
    name: '设计资源下载',
    ext1: email.value,
    ext2: props.downloadItem.title,
    ext3: props.downloadItem.actionUrl,
  });
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
