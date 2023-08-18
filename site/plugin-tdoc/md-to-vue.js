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

  const sfc = `
    <template>
      <td-doc-content ref="tdDocContent" page-status="hidden">
        ${
          mdSegment.tdDocHeader
            ? `
          <td-doc-header
            slot="doc-header"
            ref="tdDocHeader"
            spline="${mdSegment.spline}"
          >
          </td-doc-header>`
            : ''
        }
        <div name="DOC">${mdSegment.docMd}</div>
        <td-doc-footer slot="doc-footer"></td-doc-footer>
      </td-doc-content>
    </template>

    <script>
      import Prismjs from 'prismjs';

      export default {
        computed: {
          tab: {
            get() {
              return this.$route.query.tab || 'demo';
            },
            set(v) {
              if (this.$route.query.tab !== v)
                this.$router.push({ query: { tab: v } });
            }
          },
        },

        mounted() {
          const { tdDocContent, tdDocHeader } = this.$refs;

          if (tdDocHeader) {
            tdDocHeader.docInfo = {
              title: \`${mdSegment.title}\`,
              desc: \`${mdSegment.description}\`,
            };
          }

          Prismjs.highlightAll();
    
          this.$emit('loaded', () => {
            tdDocContent.pageStatus = 'show';
          });
        },
      };
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
    docMd: md.render.call(md, `${pageData.toc ? '[toc]\n' : ''}${content}`).html,
  };

  return mdSegment;
}
