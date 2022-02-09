import { computed, defineComponent, h, PropType, Ref, ref, toRef } from 'vue';
import content from '../../content';
import styles from './styles.module.less';

export default defineComponent({
  name: 'Intro',
  props: {
    lang: {
      type: String as PropType<'en-US' | 'zh-CN'>,
    },
    repo: String,
  },
  setup(props) {
    const langRef = toRef(props, 'lang');
    const contentTextRef = computed(() => content[langRef.value]);
    const introUrlRef = computed(() => ({
      faqUrl: 'https://tdesign.tencent.com/about/faq',
      changeLogUrl: `https://github.com/${props.repo}/blob/main/CHANGELOG.md`,
      issuesUrl: `https://github.com/${props.repo}/issues?q=is%3Aissue`
    }))

    function renderAlertMsg() {
      return h('span', null, {
        default: () => [
          h(
            'span',
            { class: 'intro-warning-tip' },
            contentTextRef.value.introWarningMsg
          ),
        ],
      });
    }
    return {
      lang: langRef,
      contentText: contentTextRef,
      introUrl: introUrlRef,
      renderAlertMsg,
    };
  },
  render() {
    const { contentText } = this;
    return (
      <>
        <div class={styles.introTitleLayout}>
          <div class={styles.contentBox}>
            <div class={[styles.introTitle, styles.contentParagraph]}>
              <v-node render={contentText.introTitle} />
            </div>

            <v-node render={contentText.introCommunity} />
          </div>
        </div>

        <div class={styles.contentBox}>
          <v-node
            render={() => contentText.introOne(this.introUrl)}
            class={styles.contentParagraph}
          />

          <t-alert message={this.renderAlertMsg} theme="warning" />
        </div>
      </>
    );
  },
});
