import { defineComponent, Ref, ref } from 'vue';
import PageHead from '../PageHead';
import Intro from '../Intro';
import IssueForm from '../IssueForm';
import { getQuery, updateQuery } from '../../utils/query';
import styles from './styles.module.less';

export default defineComponent({
  name: 'IssuePage',
  setup() {
    const langRef: Ref<'en-US' | 'zh-CN'> = ref('zh-CN');
    const repoRef: Ref<string> = ref('Tencent/tdesign');

    const setLang = (value: 'en-US' | 'zh-CN') => {
      langRef.value = value;
      updateQuery({ lang: value });
    };

    const setRepo = (value: string) => {
      repoRef.value = value;
      updateQuery({ repo: value });
    };

    // init
    const param = getQuery();
    if (!param?.lang) {
      updateQuery({ lang: langRef.value });
    } else {
      setLang(param.lang);
    }

    if (!param?.repo) {
      updateQuery({ repo: repoRef.value });
    } else {
      setRepo(param.repo);
    }

    // back, forward
    window.addEventListener(
      'popstate',
      () => {
        langRef.value = getQuery()?.lang || 'zh-CN'
        repoRef.value = getQuery()?.repo || 'Tencent/tdesign'
      }
    );
    return {
      lang: langRef,
      repo: repoRef,
      setLang,
      setRepo
    };
  },
  render() {
    const { lang, repo } = this;
    return (
      <t-layout class={styles.layout}>
        <PageHead lang={lang} onLangChange={this.setLang} />
        <Intro lang={lang} repo={repo} />
        <IssueForm lang={lang} repo={repo} onRepoChange={this.setRepo} />
      </t-layout>
    );
  },
});
