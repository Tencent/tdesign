<template>
  <div ref="article" name="DOC" class="doc-layout">
    <nav class="td-toc-container" style="position: absolute; top: 328px">
      <ol class="td-toc-list">
        <li v-for="anchor in catalog" :key="anchor.id" class="td-toc-list-item">
          <a class="td-toc-link" :href="`#${anchor.id}`">{{ anchor.title }} </a>
          <ol v-if="anchor.children.length" class="td-toc-list">
            <li v-for="subAnchor in anchor.children" :key="subAnchor.id" class="td-toc-list-item">
              <a class="td-toc-link" :href="`#${subAnchor.id}`">{{ subAnchor.title }} </a>
            </li>
          </ol>
        </li>
      </ol>
    </nav>

    <template v-for="(block, index) in contentBlocks" :key="index">
      <component :is="block.type" v-if="['h2', 'h3', 'h4', 'p'].includes(block.type)" :class="block.class">
        {{ block.text }}
      </component>
      <img v-else-if="block.type === 'img'" :src="getLayoutImage(block.image)" />
      <hr v-else-if="block.type === 'hr'" />
      <t-table
        v-else-if="block.type === 'table'"
        style="margin: 16px 0"
        bordered
        :data="dataSource"
        :columns="columns"
        :row-key="rowKey"
        :size="size"
        :rowspan-and-colspan="rowspanAndColspan"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import designVisualMessages from '../../locales/pages/design-visual';
import useAnchor from '../mixins/anchor';
import { localeArray } from '../../locales/locale-array';

interface ContentBlock {
  type: 'h2' | 'h3' | 'h4' | 'p' | 'img' | 'hr' | 'table';
  text?: string;
  class?: string;
  image?: string;
}

interface LayoutTableRow {
  cut: string;
  cutValue: string;
  range: string;
  colWidth: string;
  grid: string;
  device: string;
}

interface LayoutTableColumn {
  width?: number;
  ellipsis?: boolean;
  colKey: keyof LayoutTableRow;
  title: string;
}

interface SpanParams {
  col: LayoutTableColumn;
  rowIndex: number;
}

const { tm } = useI18n({ messages: designVisualMessages });
const { article, catalog } = useAnchor();
const contentBlocks = computed(() => localeArray<ContentBlock>(tm('layout.content')));
const dataSource = computed(() => localeArray<LayoutTableRow>(tm('layout.table.rows')));
const columns = computed(() => localeArray<LayoutTableColumn>(tm('layout.table.columns')));
const layoutImages = import.meta.glob('./assets/layout/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
const getLayoutImage = (image?: string): string | undefined =>
  image ? layoutImages[`./assets/layout/${image}`] : undefined;
const rowKey = 'cut';
const size = 'small';

const rowspanAndColspan = ({ col, rowIndex }: SpanParams): { rowspan: number } | undefined => {
  if (col.colKey === 'colWidth' && rowIndex === 0) {
    return { rowspan: 3 };
  }
  if (col.colKey === 'grid' && rowIndex === 0) {
    return { rowspan: 2 };
  }
};
</script>

<style lang="less">
.doc-layout {
  .desc {
    color: var(--text-placeholder);
  }

  img {
    border-radius: 6px;
    border: 1px solid var(--component-border);
  }
}
</style>
