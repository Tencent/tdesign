<template>
  <td-doc-content>
    <td-doc-header slot="doc-header" ref="tdDocHeader"></td-doc-header>

    <div name="DESIGN">
      <nav class="tdesign-toc_container" style="position: absolute; top: 328px">
        <ol class="tdesign-toc_list">
          <li class="tdesign-toc_list_item" v-for="anchor in releaseTimeList" :key="anchor.id">
            <a class="tdesign-toc_list_item_a" :href="'#' + anchor.id">{{ anchor.title }} </a>
          </li>
        </ol>
      </nav>
    </div>

    <div v-if="release.length" class="release__timeline">
      <section class="release__block" v-for="(item, index) in release" :key="item.id">
        <h2 :id="releaseTimeList[index].id">
          <code class="release__time">{{ releaseTimeList[index].title }}</code>
        </h2>
        <div name="DOC" v-html="item.body"></div>
      </section>
    </div>
    <t-loading v-else />

    <td-doc-footer slot="doc-footer"></td-doc-footer>
  </td-doc-content>
</template>

<script>
import MarkdownIt from 'markdown-it';
import mila from 'markdown-it-link-attributes';

const RELEASE_API = '/api/apigw/release/github-contributors/release';

const titleReg = /<h[23]>\s*(Vue|React|Miniprogram|Flutter|UniApp|Figma|Sketch|Axure|AdobeXD|TDesign)/g;

const mdRender = new MarkdownIt({
  linkify: true,
}).use(mila, {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
});

export default {
  data() {
    return {
      mdRender,
      release: [],
    };
  },
  mounted() {
    this.pageInit();
    this.fetchReleases();
  },

  computed: {
    releaseTimeList() {
      return this.release.map((item) => ({
        title: this.formatTime(item.published_at),
        id: this.formatTime(item.published_at).replace(/\s/g, '-'),
      }));
    },
  },
  methods: {
    formatTime(time) {
      return `${new Date(time).toDateString()}（${new Date(time).toLocaleDateString()}）`;
    },
    pageInit() {
      const { meta } = this.$route;
      this.$refs.tdDocHeader.docInfo = meta;
    },
    fetchReleases() {
      const cache = sessionStorage.getItem('__tdesign_release__');

      if (cache) {
        const data = JSON.parse(cache);
        this.release = data.map((item) => {
          item.body = this.mdRender.render(item.body).replace(titleReg, '<h2> <i name="$1"></i> $1');
          return item;
        });
      } else {
        fetch(RELEASE_API)
          .then((res) => res.json())
          .then((data) => {
            sessionStorage.setItem('__tdesign_release__', JSON.stringify(data));

            this.release = data.map((item) => {
              item.body = this.mdRender.render(item.body).replace(titleReg, '<h2> <i name="$1"></i> $1');
              return item;
            });
          })
          .catch((err) => console.error(err));
      }
    },
  },
};
</script>

<style lang="less">
.release {
  &__time {
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    padding: 6px 12px;
    border-radius: 3px;
    background: var(--bg-color-tag);
    margin-bottom: 48px;
    display: inline-block;
  }

  &__timeline {
    padding-left: 32px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 24px;
      left: 3px;
      width: 2px;
      height: 100%;
      background: var(--brand-main);
    }

    div[name='DOC'] {
      a:not(class) {
        opacity: 0.9;
        transition: all 0.2s linear;

        &:hover {
          opacity: 1;
          color: var(--brand-main);
        }
      }

      h1 {
        font-size: 28px;
        line-height: 36px;
        margin-bottom: 0;

        &:not(&:first-child) {
          margin-top: 48px;
        }
      }

      h2 {
        position: relative;
        font-size: 20px;
        line-height: 28px;
        margin-top: 48px;

        > a:not(class) {
          color: var(--text-primary);
          margin-left: 4px;
        }
      }
    }
  }

  &__block {
    position: relative;
    margin-bottom: 64px;

    &:not(:last-child) {
      h2 {
        > i {
          width: 20px;
          height: 20px;
          background-color: var(--bg-color-docpage);
          position: absolute;
          left: -38px;
          top: 5px;
          z-index: 10;
          outline: 10px solid var(--bg-color-docpage);
          background-repeat: no-repeat;
          background-size: 20px 20px;

          &[name^='Vue'] {
            background-image: url(@/assets/vue-logo.svg);
          }

          &[name^='React'] {
            background-image: url(@/assets/react-logo.svg);
          }

          &[name^='Miniprogram'] {
            background-image: url(@/assets/miniprogram-logo.svg);
          }

          &[name^='Flutter'] {
            background-image: url(@/assets/flutter-logo.svg);
          }

          &[name^='UniApp'] {
            background-image: url(@/assets/uniapp-logo.png);
          }

          &[name^='Figma'] {
            background-image: url(@/assets/figma-logo.svg);
          }

          &[name^='Sketch'] {
            background-image: url(@/assets/sketch-logo.svg);
          }

          &[name^='Axure'] {
            background-image: url(@/assets/axure-logo.svg);
          }

          &[name^='AdobeXD'] {
            background-image: url(@/assets/xd-logo.svg);
          }

          &[name^='TDesign'] {
            background-image: url(data:image/png;base64,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);
          }
        }
      }
    }

    &::before {
      content: '';
      position: absolute;
      left: -32px;
      top: 12px;
      width: 8px;
      height: 8px;
      border: 2px solid var(--brand-main);
      background: var(--bg-color-docpage);
      outline: 10px solid var(--bg-color-docpage);
      box-sizing: border-box;
      border-radius: 50%;
      z-index: 20;
    }

    &:last-of-type {
      &::after {
        content: '';
        position: absolute;
        top: 30px;
        left: -32px;
        z-index: 10;
        width: 8px;
        height: 100%;
        background: var(--bg-color-docpage);
      }
    }
  }
}
</style>
