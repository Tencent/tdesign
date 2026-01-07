import matter from 'gray-matter';

export default function mdToVue(options) {
  const mdSegment = customRender(options);

  if (mdSegment.isDesign) {
    return `
      <template>
        <div name="DESIGN">${mdSegment.docMd}</div>
      </template>
    `;
  }

  const headerTemplate = mdSegment.tdDocHeader
    ? `
      <td-doc-header
        slot="doc-header"
        ref="tdDocHeader"
        spline="${mdSegment.spline}"
      >
      </td-doc-header>`
    : '';

  const sfc = `
    <template>
      <td-doc-content ref="tdDocContent" page-status="hidden">
        ${headerTemplate}
        <div name="DOC">${mdSegment.docMd}</div>
        <td-doc-footer slot="doc-footer"></td-doc-footer>
      </td-doc-content>
    </template>

    <script setup>
      import { ref, onMounted } from 'vue';
      import { useRoute, useRouter } from 'vue-router';
      import Prismjs from 'prismjs';

      const route = useRoute();
      const router = useRouter();
      const tdDocContent = ref(null);
      const tdDocHeader = ref(null);

      const tab = {
        get() {
          return route.query.tab || 'demo';
        },
        set(v) {
          if (route.query.tab !== v)
            router.push({ query: { tab: v } });
        }
      };

      onMounted(() => {
        if (tdDocHeader.value) {
          tdDocHeader.value.docInfo = {
            title: \`${mdSegment.title}\`,
            desc: \`${mdSegment.description}\`,
          };
        }

        Prismjs.highlightAll();
      });
    </script>
  `;

  return sfc;
}

// 解析 markdown 内容
function customRender({ source, md }) {
  const { content, data } = matter(source);
  // console.log('data', data);

  // md top data
  const pageData = {
    spline: '',
    toc: true,
    title: '',
    description: '',
    tdDocHeader: true,
    ...data,
  };

  const mdSegment = {
    ...pageData,
    docMd: md.render(`${pageData.toc ? '[toc]\n' : ''}${content}`).html,
  };

  return mdSegment;
}
