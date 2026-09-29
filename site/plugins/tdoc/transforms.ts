import mdToVue, { type MarkdownRenderer } from './md-to-vue';

interface RenderContext {
  source: string;
  file: string;
  md: MarkdownRenderer;
}

const transforms = {
  render({ source, file, md }: RenderContext): string {
    return mdToVue({ md, file, source });
  },
};

export default transforms;
