import { defineComponent, PropType, toRef } from 'vue';
import TdesignLogo from '../../assets/tdesign-logo.svg'
import styles from './styles.module.less';

export default defineComponent({
  name: 'Intro',
  props: {
    lang: {
      type: String as PropType<'en-US' | 'zh-CN'>,
    },
    onLangChange: {
      type: Function,
    },
  },
  setup(props) {
    const lang = toRef(props, 'lang');
    return {
      lang,
      onLangChange: props.onLangChange,
    };
  },
  render() {
    return (
      <t-header bordered class={styles.header}>
        <div class={styles.logo}>
          <img src={TdesignLogo} />
        </div>
      </t-header>
    );
  },
});
