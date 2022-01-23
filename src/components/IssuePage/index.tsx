import { defineComponent, Ref, ref } from 'vue';
import PageHead from '../PageHead';
import Intro from '../Intro';
import IssueForm from '../IssueForm';
import { getQuery, updateQuery } from '../../utils/query';
import styles from './styles.module.less';

export default defineComponent({
  name: 'IssuePage',
  setup() {
    const lang: Ref<'en-US' | 'zh-CN'> = ref('zh-CN');

    const setLang = (value: 'en-US' | 'zh-CN') => {
      lang.value = value;
      updateQuery({ lang: value });
    };

    // init
    const param = getQuery();
    if (!param?.lang) {
      updateQuery({ lang: lang.value });
    } else {
      setLang(param.lang);
    }

    // back, forward
    window.addEventListener(
      'popstate',
      () => (lang.value = getQuery()?.lang || 'en-US')
    );
    return {
      lang,
      setLang,
    };
  },
  render() {
    const { lang } = this;
    return (
      <t-layout class={styles.layout}>
        <PageHead lang={lang} onLangChange={this.setLang} />
        <Intro lang={lang} />
        <IssueForm lang={lang} />
      </t-layout>
    );
  },
});
