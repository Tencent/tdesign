import { computed, defineComponent, h, PropType, Ref, ref, toRef } from 'vue';
import content from '../../content';
import styles from './styles.module.less';

export default defineComponent({
  name: 'Intro',
  props: {
    lang: {
      type: String as PropType<'en-US' | 'zh-CN'>,
    },
  },
  setup(props) {
    const langRef = toRef(props, 'lang');
    const contentText = computed(() => content[langRef.value]);
    const introVisibleRef: Ref<boolean> = ref(false);
    function handleClose() {
      introVisibleRef.value = false;
    }

    function renderAlertMsg() {
      return h('span', null, {
        default: () => [
          h(
            'span',
            { class: 'intro-warning-tip' },
            contentText.value.introWarningMsg
          ),
          // h(
          //   'a',
          //   { onClick: () => (introVisibleRef.value = true) },
          //   contentText.value.introWarningBtn
          // ),
        ],
      });
    }
    return {
      lang: langRef,
      contentText,
      introVisible: introVisibleRef,
      renderAlertMsg,
      handleClose,
    };
  },
  render() {
    const { lang, contentText, introVisible } = this;
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
            render={contentText.introOne}
            class={styles.contentParagraph}
          />

          <t-alert message={this.renderAlertMsg} theme="warning" />
        </div>

        <t-dialog
          v-model:visible={introVisible}
          theme="info"
          width="735px"
          cancelBtn={null}
          confirmBtn={contentText.explainBtn}
          header={contentText.explainTitle}
          body={contentText.explain}
          on-close={this.handleClose}
          on-confirm={this.handleClose}
        />
      </>
    );
  },
});
