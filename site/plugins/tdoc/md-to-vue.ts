import matter from 'gray-matter';

export interface MarkdownRenderer {
  render(this: unknown, src: string): { html: string };
}

export interface MdToVueOptions {
  source: string;
  file: string;
  md: MarkdownRenderer;
}

interface PageData {
  toc: boolean;
  title: string;
  description: string;
  tdDocHeader: boolean;
  isDesign?: boolean;
}

export default function mdToVue(options: MdToVueOptions): string {
  const mdSegment = customRender(options);

  if (mdSegment.isDesign) {
    return `
      <template>
        <div name="DESIGN">${mdSegment.docMd}</div>
      </template>
    `;
  }

  const docHeader = mdSegment.tdDocHeader
    ? `
          <td-doc-header
            slot="doc-header"
            ref="tdDocHeader"
          >
          </td-doc-header>`
    : '';

  return `
    <template>
      <td-doc-content ref="tdDocContent" page-status="hidden">
        ${docHeader}
        <div name="DOC">${mdSegment.docMd}</div>
        <td-doc-footer slot="doc-footer"></td-doc-footer>
      </td-doc-content>
    </template>

    <script setup>
      import { computed, onMounted, ref } from 'vue';
      import { useRoute, useRouter } from 'vue-router';
      import Prismjs from 'prismjs';

      const emit = defineEmits(['loaded']);
      const route = useRoute();
      const router = useRouter();
      const tdDocContent = ref(null);
      const tdDocHeader = ref(null);

      const tab = computed({
        get: () => route.query.tab || 'demo',
        set: (value) => {
          if (route.query.tab !== value) {
            router.push({ query: { tab: value } });
          }
        },
      });

      onMounted(() => {
        if (tdDocHeader.value) {
          tdDocHeader.value.docInfo = {
            title: \`${mdSegment.title}\`,
            desc: \`${mdSegment.description}\`,
          };
        }

        Prismjs.highlightAll();

        emit('loaded', () => {
          tdDocContent.value.pageStatus = 'show';
        });
      });
    </script>
  `;
}

function customRender({ source, md }: MdToVueOptions): PageData & { docMd: string } {
  const { content, data } = matter(source);
  const pageData: PageData = {
    toc: true,
    title: '',
    description: '',
    tdDocHeader: true,
    ...normalizePageData(data),
  };

  return {
    ...pageData,
    // eslint-disable-next-line no-useless-call
    docMd: md.render.call(md, `${pageData.toc ? '[toc]\n' : ''}${content}`).html,
  };
}

function normalizePageData(data: Record<string, unknown>): Partial<PageData> {
  return {
    ...(typeof data.toc === 'boolean' ? { toc: data.toc } : {}),
    ...(typeof data.title === 'string' ? { title: data.title } : {}),
    ...(typeof data.description === 'string' ? { description: data.description } : {}),
    ...(typeof data.tdDocHeader === 'boolean' ? { tdDocHeader: data.tdDocHeader } : {}),
    ...(typeof data.isDesign === 'boolean' ? { isDesign: data.isDesign } : {}),
  };
}
