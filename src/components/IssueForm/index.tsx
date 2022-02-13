import {
  computed,
  defineComponent,
  PropType,
  toRef,
  ref,
  onMounted,
  watch,
  Ref,
  nextTick,
} from 'vue';
import axios from 'axios';
import content from '../../content';
import { MessagePlugin } from 'tdesign-vue-next';
import { create } from '../../utils/create';
import styles from './styles.module.less';

export default defineComponent({
  name: 'Intro',
  props: {
    lang: {
      type: String as PropType<'en-US' | 'zh-CN'>,
    },
    repo: String,
    onRepoChange: {
      type: Function,
    },
  },
  setup(props) {
    const lang = toRef(props, 'lang');
    const contentTextRef = computed(() => content[lang.value]);
    const formRef: Ref<any> = ref(null);
    const formDataRef = ref({
      repo: props.repo,
      title: '',
      type: 'Bug',
      versionRepository: '',
      versionStructure: '',
      versionSystem: '',
      versionNode: '',
      reproduce: '',
      steps: '',
      expected: '',
      actual: '',
      remarks: '',
      functionContent: '',
      functionalExpectations: '',
    });

    // 当前的相关库是否有 npm
    const hasNpmRef = computed(() => {
      const selectRepo = contentTextRef.value.repos.find(
        (i) => i.github === formDataRef.value.repo
      );
      return !!selectRepo.npm;
    });

    const rulesRef = computed(() => {
      const valid = contentTextRef.value.valid;
      let rules: any = {};
      for (let prop in valid) {
        if (
          prop === 'remarks' ||
          prop === 'versionNode' ||
          prop === 'versionRepository'
        ) {
          continue;
        }
        rules[prop] = [
          {
            required: true,
            message: valid[prop],
            trigger: 'change',
          },
        ];
      }

      rules['versionRepository'] = [
        {
          required: hasNpmRef.value,
          message: valid.versionRepository,
          trigger: 'change',
        },
      ];

      const reproduceErrorMessage =
        lang.value === 'zh-CN'
          ? '请填写正确的重现链接'
          : 'Please input a valid reproduction link';

      rules['reproduce'].push({
        trigger: 'change',
        validator: (val: string) =>
          new Promise((resolve) => {
            resolve(
              val &&
                /(github|jsfiddle|codepen|jsbin|codesandbox|stackblitz|tdesign)/gi.test(
                  val
                )
            );
          }),
        message: reproduceErrorMessage,
      });
      return rules;
    });

    const isBugRef = computed(() => formDataRef.value.type === 'Bug');

    // 相关仓库的选项
    const repoOptionsRef = computed(() =>
      contentTextRef.value.repos.map((i) => {
        return { label: i.name, value: i.github };
      })
    );

    // 项目版本的选项
    const versionOptionsRef = ref([]);

    // 当前项目版本地址
    const versionUrl = computed(() => {
      const selectRepo = contentTextRef.value.repos.find(
        (i) => i.github === formDataRef.value.repo
      );
      return `https://data.jsdelivr.com/v1/package/npm/${
        selectRepo.npm && selectRepo.npm
      }`;
    });

    const fetchVersionOptions = async () => {
      formDataRef.value.versionRepository = '';
      versionOptionsRef.value = [];
      if (!hasNpmRef.value) return;
      const res = await axios.get(versionUrl.value);
      const hasAlphaReg = new RegExp(/-/);
      versionOptionsRef.value = Object.keys(res.data.versions)
        .filter((i) => !hasAlphaReg.test(i))
        .map((i) => {
          return { label: i, value: i };
        });
      formDataRef.value.versionRepository = versionOptionsRef.value[0].value;
    };

    onMounted(() => {
      fetchVersionOptions();
    });

    watch(
      () => formDataRef.value.repo,
      () => {
        fetchVersionOptions();
        formRef.value.clearValidate();
      }
    );

    watch(
      () => formDataRef.value.type,
      () => {
        formRef.value.clearValidate();
      }
    );

    const handlePreview = ({ validateResult, firstError, e }) => {
      e.preventDefault();
      if (validateResult === true) {
        create(isBugRef, formDataRef, contentTextRef);
      } else {
        MessagePlugin.warning(firstError);
      }
    };

    return {
      formRef,
      contentText: contentTextRef,
      repoOptions: repoOptionsRef,
      versionOptions: versionOptionsRef,
      formData: formDataRef,
      rules: rulesRef,
      isBug: isBugRef,
      handlePreview,
    };
  },
  render() {
    const { contentText, formData } = this;
    return (
      <t-content class={[styles.contentBox, styles.formBox]}>
        <t-form
          ref="formRef"
          data={this.formData}
          onSubmit={this.handlePreview}
          rules={this.rules}
          label-align="top"
        >
          <t-row gutter={48} class={styles.formItem}>
            <t-col span={6}>
              {/* Issue 类别 */}
              <t-form-item
                label={contentText.issueTypesLabel}
                name="type"
                key="type"
              >
                <t-radio-group
                  variant="default-filled"
                  v-model={formData.type}
                  style="width: 100%; text-align: center"
                >
                  <t-radio-button
                    value={contentText.issueTypes[0].value}
                    style="width: 50%"
                  >
                    {contentText.issueTypes[0].label}
                  </t-radio-button>
                  <t-radio-button
                    value={contentText.issueTypes[1].value}
                    style="width: 50%"
                  >
                    {contentText.issueTypes[1].label}
                  </t-radio-button>
                </t-radio-group>
              </t-form-item>
            </t-col>
            <t-col span={6}>
              {/* 相关仓库 */}
              <t-form-item
                label={contentText.repoSelectLabel}
                name="repo"
                key="repo"
              >
                <t-select
                  v-model:value={formData.repo}
                  options={this.repoOptions}
                  onChange={(value) => this.onRepoChange(value)}
                />
              </t-form-item>
            </t-col>
          </t-row>

          <t-row gutter={48} class={styles.formItem}>
            <t-col span={12}>
              {/* Issue 标题 */}
              <t-form-item
                label={contentText.issueTitleLabel}
                name="title"
                key="title"
              >
                <t-input
                  v-model={formData.title}
                  placeholder={contentText.issueTitlePlaceholder}
                />
              </t-form-item>
            </t-col>
          </t-row>
          {this.isBug ? (
            <>
              <t-row gutter={48} class={styles.formItem}>
                <t-col span={6}>
                  {/* 相关版本 */}
                  <t-form-item
                    label={contentText.versionRepositoryLabel}
                    name="versionRepository"
                    key="versionRepository"
                  >
                    <t-select
                      v-model:value={formData.versionRepository}
                      options={this.versionOptions}
                    />
                  </t-form-item>
                </t-col>

                <t-col span={6}>
                  {/* 框架版本 */}
                  <t-form-item
                    label={contentText.versionStructureLabel}
                    name="versionStructure"
                    key="versionStructure"
                  >
                    <t-input
                      v-model={formData.versionStructure}
                      placeholder={contentText.versionStructurePlaceholder}
                    />
                  </t-form-item>
                </t-col>

                <div class={[styles.tipContent, styles.contentText]}>
                  <v-node render={contentText.versionRepositoryTip} />
                </div>
              </t-row>

              <t-row gutter={48} class={styles.formItem}>
                <t-col span={6}>
                  {/* 系统、浏览器 */}
                  <t-form-item
                    label={contentText.versionSystemLabel}
                    name="versionSystem"
                    key="versionSystem"
                  >
                    <t-input
                      v-model={formData.versionSystem}
                      placeholder={contentText.versionSystemPlaceholder}
                    />
                  </t-form-item>
                </t-col>
                <t-col span={6}>
                  {/* Node版本 */}
                  <t-form-item
                    label={contentText.versionNodeLabel}
                    name="versionNode"
                    key="versionNode"
                  >
                    <t-input
                      v-model={formData.versionNode}
                      placeholder={contentText.placeholder}
                    />
                  </t-form-item>
                </t-col>
              </t-row>

              <t-row gutter={48} class={styles.formItem}>
                <t-col span={12}>
                  {/* 重现链接 */}
                  <t-form-item
                    label={contentText.reproduceLabel}
                    name="reproduce"
                    key="reproduce"
                  >
                    <t-input
                      v-model={formData.reproduce}
                      placeholder={contentText.pictureTipPlaceholder}
                    />
                  </t-form-item>
                </t-col>
                <div class={[styles.tipContent, styles.contentText]}>
                  <v-node render={contentText.reproduceTip} />
                </div>
              </t-row>

              <t-row gutter={48} class={styles.formItem}>
                <t-col span={12}>
                  {/* 重现步骤 */}
                  <t-form-item
                    label={contentText.stepsLabel}
                    name="steps"
                    key="steps"
                  >
                    <t-textarea
                      v-model={formData.steps}
                      autosize={{ minRows: 2, maxRows: 5 }}
                      placeholder={contentText.pictureTipPlaceholder}
                    />
                  </t-form-item>
                </t-col>
                <div class={[styles.tipContent, styles.contentText]}>
                  <v-node render={contentText.stepsTip} />
                </div>
              </t-row>

              <t-row gutter={48} class={styles.formItem}>
                <t-col span={12}>
                  {/* 期望结果 */}
                  <t-form-item
                    label={contentText.expectLabel}
                    name="expected"
                    key="expected"
                  >
                    <t-textarea
                      v-model={formData.expected}
                      autosize={{ minRows: 2, maxRows: 5 }}
                      placeholder={contentText.placeholder}
                    />
                  </t-form-item>
                </t-col>
              </t-row>

              <t-row gutter={48} class={styles.formItem}>
                <t-col span={12}>
                  {/* 实际结果 */}
                  <t-form-item
                    label={contentText.actualLabel}
                    name="actual"
                    key="actual"
                  >
                    <t-textarea
                      v-model={formData.actual}
                      autosize={{ minRows: 2, maxRows: 5 }}
                      placeholder={contentText.placeholder}
                    />
                  </t-form-item>
                </t-col>
              </t-row>

              <t-row gutter={48}>
                <t-col span={12}>
                  {/* 补充说明 */}
                  <t-form-item
                    label={contentText.remarksLabel}
                    name="remarks"
                    key="remarks"
                  >
                    <t-textarea
                      v-model={formData.remarks}
                      autosize={{ minRows: 2, maxRows: 5 }}
                      placeholder={contentText.placeholder}
                    />
                  </t-form-item>
                </t-col>
                <div class={[styles.tipContent, styles.contentText]}>
                  <v-node render={contentText.remarksTip} />
                </div>
              </t-row>
            </>
          ) : (
            <>
              <t-row gutter={48} class={styles.formItem}>
                <t-col span={12}>
                  {/* 这个功能解决了什么问题 */}
                  <t-form-item
                    label={contentText.functionContentLabel}
                    name="functionContent"
                    key="functionContent"
                  >
                    <t-textarea
                      v-model={formData.functionContent}
                      autosize={{ minRows: 2, maxRows: 5 }}
                      placeholder={contentText.placeholder}
                    />
                  </t-form-item>
                </t-col>
                <div class={[styles.tipContent, styles.contentText]}>
                  <v-node render={contentText.functionContentTip} />
                </div>
              </t-row>

              <t-row gutter={48}>
                <t-col span={12}>
                  {/* 你建议的方案是什么 */}
                  <t-form-item
                    label={contentText.functionalExpectationsLabel}
                    name="functionalExpectations"
                    key="functionalExpectations"
                  >
                    <t-textarea
                      v-model={formData.functionalExpectations}
                      autosize={{ minRows: 2, maxRows: 5 }}
                      placeholder={contentText.placeholder}
                    />
                  </t-form-item>
                </t-col>
              </t-row>
            </>
          )}

          <t-row gutter={48} class={styles.formPreview}>
            <t-col span={4} offset={4}>
              <t-button block theme="primary" variant="base" type="submit">
                {contentText.preview}
              </t-button>
            </t-col>
          </t-row>
        </t-form>
      </t-content>
    );
  },
});
