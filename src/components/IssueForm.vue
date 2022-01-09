<template>
  <n-card class="card">
    <n-form
      ref="formRef"
      :model="form"
      label-width="auto"
      :rules="rules"
      label-position="top"
      size="large"
      class="form"
    >
      <n-grid cols="2" :x-gap="16">
        <!-- 选择要提交的库 -->
        <n-form-item-gi :label="contentText.repoSelectHint" path="repo">
          <n-select v-model:value="form.repo" :options="repoOptions" />
        </n-form-item-gi>

        <!-- Issue 类别 -->

        <n-form-item-gi :label="contentText.issueTypesHint" path="type">
          <n-radio-group
            v-model:value="form.type"
            style="width: 100%; text-align: center"
          >
            <n-radio-button
              style="width: calc(50% - 1px)"
              :value="issueTypeOptions[0].value"
              >{{ issueTypeOptions[0].label }}</n-radio-button
            >
            <n-radio-button
              style="width: 50%"
              :value="issueTypeOptions[1].value"
              >{{ issueTypeOptions[1].label }}</n-radio-button
            >
          </n-radio-group>
        </n-form-item-gi>
      </n-grid>

      <!-- Issue 标题 -->
      <n-form-item :label="contentText.issueTitleHint" path="title">
        <n-input v-model:value="form.title" />
      </n-form-item>

      <template v-if="isBug">
        <!-- 项目版本 -->
        <n-form-item
          :label="contentText.versionRepositoryHint"
          path="versionRepository"
        >
          <n-select
            v-model:value="form.versionRepository"
            :options="version.repo"
          />
        </n-form-item>
        <n-alert
          type="default"
          class="m-b-24"
          show-icon
          :title="contentText.firstTipTitle"
        >
          <template #icon>
            <n-icon>
              <info-24-regular />
            </n-icon>
          </template>
          <span class="alert-font">{{ contentText.firstTip }}</span>
        </n-alert>

        <n-grid cols="2" :x-gap="16">
          <!-- Vue版本 -->
          <n-form-item-gi :label="contentText.versionVueHint" path="versionVue">
            <n-select v-model:value="form.versionVue" :options="version.vue" />
          </n-form-item-gi>

          <!-- 浏览器及其版本 -->
          <n-form-item-gi
            :label="contentText.versionBrowserHint"
            path="versionBrowser"
          >
            <n-input
              v-model:value="form.versionBrowser"
              placeholder="Chrome(89.0.4389.128)"
            />
          </n-form-item-gi>
        </n-grid>

        <n-grid cols="2" :x-gap="16">
          <!-- 系统及其版本 -->
          <n-form-item-gi
            :label="contentText.versionSystemHint"
            path="versionSystem"
          >
            <n-input
              v-model:value="form.versionSystem"
              placeholder="MacOS(11.2.3)"
            />
          </n-form-item-gi>

          <!-- Node版本 -->
          <n-form-item-gi
            :label="contentText.versionNodeHint"
            path="versionNode"
          >
            <n-input v-model:value="form.versionNode" />
          </n-form-item-gi>
        </n-grid>

        <!-- 重现链接 -->
        <n-form-item :label="contentText.reproduceHint" path="reproduce">
          <n-input v-model:value="form.reproduce" />
        </n-form-item>
        <n-alert
          type="default"
          class="m-b-24"
          show-icon
          :title="contentText.secondTipTitle"
        >
          <template #icon>
            <n-icon>
              <info-24-regular />
            </n-icon>
          </template>
          <span class="alert-font">{{ contentText.secondTip }}</span></n-alert
        >
        <n-button
          text
          type="primary"
          @click="tipVisible = true"
          class="m-b-24"
          >{{ contentText.reproduceHintSamll }}</n-button
        >
        <n-modal v-model:show="tipVisible">
          <n-card
            class="modal-card"
            :title="contentText.reproduceTitle"
            closable
            @close="tipVisible = false"
          >
            <n-p>{{ contentText.reproduceExplain }}</n-p>
            <n-h3>{{ contentText.reproduceExplainTitleOne }}</n-h3>
            <n-p>{{ contentText.reproduceExplainParagraphOne }}</n-p>
            <n-h3>{{ contentText.reproduceExplainTitleTwo }}</n-h3>
            <n-p>
              <n-text strong>{{ contentText.keyWords }}</n-text
              ><n-text>{{ contentText.reproduceExplainParagraphTwo }}</n-text>
            </n-p>
            <n-h3>{{ contentText.reproduceExplainTitleThree }}</n-h3>
            <n-p>
              {{ contentText.reproduceExplainParagraphThree1 }}
            </n-p>
            <n-ol>
              <li>{{ contentText.reproduceExplainParagraphThree2 }}</li>
              <li>{{ contentText.reproduceExplainParagraphThree3 }}</li>
            </n-ol>
            <n-p>{{ contentText.reproduceExplainParagraphThree4 }}</n-p>
            <n-h3>{{ contentText.reproduceExplainTitleFour }}</n-h3>
            <n-p>{{ contentText.reproduceExplainParagraphFour }}</n-p>
          </n-card>
        </n-modal>

        <!-- 重现步骤 -->
        <n-form-item
          :label="contentText.stepsHint"
          path="steps"
          ingore-path-change
        >
          <n-input
            v-model:value="form.steps"
            type="textarea"
            :autosize="autosizeConfig"
          />
        </n-form-item>
        <n-alert
          type="default"
          class="m-b-24"
          show-icon
          :title="contentText.thirdTipTitle"
        >
          <template #icon>
            <n-icon>
              <info-24-regular />
            </n-icon>
          </template>
          <span class="alert-font">{{ contentText.thirdTip }}</span></n-alert
        >

        <!-- 期望的结果是什么 -->
        <n-form-item :label="contentText.expectHint" path="expected">
          <n-input
            v-model:value="form.expected"
            type="textarea"
            :autosize="autosizeConfig"
          ></n-input>
        </n-form-item>

        <!-- 实际的结果是什么 -->
        <n-form-item :label="contentText.actualHint" path="actual">
          <n-input
            v-model:value="form.actual"
            type="textarea"
            :autosize="autosizeConfig"
          ></n-input>
        </n-form-item>

        <!-- 补充说明（可选） -->
        <n-form-item :label="contentText.remarks">
          <n-input
            v-model:value="form.remarks"
            type="textarea"
            :autosize="autosizeConfig"
          ></n-input>
        </n-form-item>
        <n-alert
          type="default"
          class="m-b-24"
          show-icon
          :title="contentText.fourthTipTitle"
        >
          <template #icon>
            <n-icon>
              <info-24-regular />
            </n-icon>
          </template>
          <span class="alert-font">{{ contentText.fourthTip }}</span></n-alert
        >
      </template>

      <template v-else>
        <!-- 这个功能解决了什么问题 -->
        <n-form-item
          :label="contentText.functionContent"
          path="functionContent"
        >
          <n-input
            type="textarea"
            :autosize="autosizeConfig"
            v-model:value="form.functionContent"
          />
        </n-form-item>
        <n-alert
          type="default"
          class="m-b-24"
          :title="contentText.functionContentTipTitle"
          show-icon
        >
          <template #icon>
            <n-icon>
              <info-24-regular />
            </n-icon>
          </template>
          <span class="alert-font">{{
            contentText.functionContentTip
          }}</span></n-alert
        >

        <!-- 你期望的 API 是怎样的 -->
        <n-form-item
          :label="contentText.functionalExpectations"
          path="functionalExpectations"
        >
          <n-input
            v-model:value="form.functionalExpectations"
            type="textarea"
            :autosize="autosizeConfig"
          />
        </n-form-item>
        <n-alert
          type="default"
          class="m-b-24"
          :title="contentText.functionalExpectationsTipTitle"
          show-icon
        >
          <template #icon>
            <n-icon>
              <info-24-regular />
            </n-icon>
          </template>
          <span class="alert-font">{{
            contentText.functionalExpectationsTip
          }}</span></n-alert
        >
      </template>

      <n-form-item class="preview">
        <n-button type="primary" @click="handlePreview()">{{
          contentText.preview
        }}</n-button>
      </n-form-item>
    </n-form>
  </n-card>

  <n-modal v-model:show="previewVisible">
    <n-card
      :title="contentText.dialog.title"
      closable
      @close="previewVisible = false"
      class="modal-card"
    >
      <div class="preview-content">
        <v-node :render="issueVNode" />
      </div>
      <div class="preview-footer">
        <n-button type="primary" size="large" @click="create()">{{
          contentText.dialog.button
        }}</n-button>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  Ref,
  reactive,
  toRefs,
  computed,
  watch,
  onMounted,
  PropType,
  toRef,
  h,
  VNodeChild,
} from 'vue';
import {
  NForm,
  NFormItem,
  NFormItemGi,
  NGrid,
  NSelect,
  NInput,
  NAlert,
  NButton,
  NIcon,
  NModal,
  NCard,
  NH3,
  NText,
  NP,
  NOl,
  NRadioGroup,
  NRadioButton,
  useMessage,
} from 'naive-ui';
import { Info24Regular } from '@vicons/fluent';
import axios from 'axios';
import content from '../content.js';
import { FormData } from '../data';
import { IssueTypeLabel } from '../interface';

function createComment(type) {
  const comment = '<!-- generated by issue-helper DO NOT REMOVE -->';
  return comment.replace('-->', IssueTypeLabel[type] + ' -->');
}

export default defineComponent({
  name: 'IssueForm',
  components: {
    NForm,
    NFormItem,
    NFormItemGi,
    NGrid,
    NSelect,
    NInput,
    NAlert,
    NButton,
    NIcon,
    NModal,
    NCard,
    NH3,
    NText,
    NP,
    NOl,
    NRadioGroup,
    NRadioButton,
    Info24Regular,
  },
  props: {
    lang: {
      type: String as PropType<'en-US' | 'zh-CN'>,
    },
  },
  setup: (props) => {
    const lang = toRef(props, 'lang');
    const message = useMessage();
    const contentText = computed(() => content[lang.value]);
    const repoOptions = computed(() =>
      contentText.value.repos.map((i) => {
        return { label: i.name, value: i.github };
      })
    );
    const issueTypeOptions = computed(() => contentText.value.issueTypes);
    const formRef: Ref<any> = ref(null);
    const formData: FormData = reactive({
      form: {
        repo: 'TuSimple/naive-ui',
        title: '',
        type: 'Bug',
        versionRepository: '',
        versionVue: '',
        versionBrowser: '',
        versionSystem: '',
        versionNode: '',
        reproduce: '',
        steps: '',
        expected: '',
        actual: '',
        remarks: '',
        functionContent: '',
        functionalExpectations: '',
      },
      version: {
        repo: [],
        vue: [],
      },
    });
    const issue = ref('');
    const issueRenderRef: Ref<() => VNodeChild | null> = ref(null);
    const tipVisible: Ref<boolean> = ref(false);
    const previewVisible: Ref<boolean> = ref(false);

    const isBug = computed(() => formData.form.type === 'Bug');

    const rules = computed(() => {
      const valid = contentText.value.valid;
      let rules: any = {};
      for (let prop in valid) {
        if (prop === 'remarks' || prop === 'versionNode') {
          continue;
        }
        rules[prop] = [
          {
            required: true,
            message: valid[prop],
            trigger: ['blur', 'change', 'input'],
          },
        ];
      }

      const reprodErrorMessage =
        lang.value === 'zh-CN'
          ? '请填写正确的重现链接'
          : 'Please input a valid reproduction link';

      rules['reproduce'].push({
        trigger: ['blur', 'change'],
        message: reprodErrorMessage,
        validator: (rule: any, val: string) => {
          return new Promise((resolve, reject) => {
            if (
              val &&
              !/(github|jsfiddle|codepen|jsbin|codesandbox|stackblitz|naiveui)/gi.test(
                val
              )
            ) {
              reject(Error(reprodErrorMessage));
            } else {
              resolve('');
            }
          });
        },
      });
      return rules;
    });

    const versionApi = computed(() => {
      const selectRepo = contentText.value.repos.find(
        (i) => i.github === formData.form.repo
      );
      return {
        repositoryVersion: `https://registry.npm.taobao.org/${
          selectRepo.npm && selectRepo.npm
        }`,
        vueVersion: 'https://registry.npm.taobao.org/vue',
      };
    });

    async function fetchRepositoryVersion() {
      const res = await axios.get(versionApi.value.repositoryVersion);
      formData.version.repo = Object.keys(res.data.versions).map((i) => {
        return { label: i, value: i };
      });
      formData.form.versionRepository = formData.version.repo[0].value;
      const vueRes = await axios.get(versionApi.value.vueVersion);
      formData.version.vue = Object.keys(vueRes.data.versions).map((i) => {
        return { label: i, value: i };
      });
      formData.form.versionVue = formData.version.vue[0].value;
    }
    onMounted(() => {
      fetchRepositoryVersion();
    });
    watch(
      () => formData.form.repo,
      () => {
        fetchRepositoryVersion();
      }
    );

    function createIssue() {
      // Setting issue string value
      issue.value = isBug.value
        ? `### ${formData.form.repo} version (版本)
${formData.form.versionRepository}

### Vue version (Vue 版本)
${formData.form.versionVue}

### Browser and its version (浏览器及其版本)
${formData.form.versionBrowser}

### System and its version (系统及其版本)
${formData.form.versionSystem}

### Node version (Node 版本)
${formData.form.versionNode}

### Reappearance link (重现链接)
${formData.form.reproduce}

### Reappearance steps (重现步骤)
${formData.form.steps}

### Expected results (期望的结果)
${formData.form.expected}

### Actual results (实际的结果)
${formData.form.actual}

### Remarks (补充说明)
${formData.form.remarks}
`.trim()
        : `### This function solves the problem (这个功能解决的问题)
${formData.form.functionContent}
### Expected API (期望的 API)
${formData.form.functionalExpectations}`.trim();
      // Setting issue render function value
      issueRenderRef.value = isBug.value
        ? () => [
            h(NH3, null, {
              default: () => `${formData.form.repo} version (版本)`,
            }),
            h(NP, null, { default: () => formData.form.versionRepository }),
            h(NH3, null, { default: () => `Vue version (Vue 版本)` }),
            h(NP, null, { default: () => formData.form.versionVue }),
            h(NH3, null, {
              default: () => `Browser and its version (浏览器及其版本)`,
            }),
            h(NP, null, { default: () => formData.form.versionBrowser }),
            h(NH3, null, {
              default: () => `System and its version (系统及其版本)`,
            }),
            h(NP, null, { default: () => formData.form.versionSystem }),
            h(NH3, null, {
              default: () => `Node version (Node 版本)`,
            }),
            h(NP, null, { default: () => formData.form.versionNode }),
            h(NH3, null, { default: () => `Reproduction link (重现链接)` }),
            h(NP, null, { default: () => formData.form.reproduce }),
            h(NH3, null, { default: () => `Reproduction steps (重现步骤)` }),
            h(NP, null, {
              default: () =>
                h('pre', null, { default: () => formData.form.steps }),
            }),
            h(NH3, null, { default: () => `Expected results (期望的结果)` }),
            h(NP, null, {
              default: () =>
                h('pre', null, { default: () => formData.form.expected }),
            }),
            h(NH3, null, { default: () => `Actual results (实际的结果)` }),
            h(NP, null, {
              default: () =>
                h('pre', null, { default: () => formData.form.actual }),
            }),
            h(NH3, null, { default: () => `Remarks (补充说明)` }),
            h(NP, null, {
              default: () =>
                h('pre', null, { default: () => formData.form.remarks }),
            }),
          ]
        : () => [
            h(NH3, null, {
              default: () =>
                `This function solves the problem (这个功能解决的问题)`,
            }),
            h(NP, null, {
              default: () =>
                h('pre', null, {
                  default: () => formData.form.functionContent,
                }),
            }),
            h(NH3, null, { default: () => `Expected API (期望的 API)` }),
            h(NP, null, {
              default: () =>
                h('pre', null, {
                  default: () => formData.form.functionalExpectations,
                }),
            }),
          ];

      previewVisible.value = true;
    }

    function handlePreview() {
      formRef.value.validate((errors: Array<{ message: string }[]>) => {
        if (!errors) {
          createIssue();
        } else {
          errors.forEach((item) => {
            message.error(item[0].message);
          });
          return false;
        }
      });
    }

    function create() {
      const issueString = `${createComment(formData.form.type)}\n\n${
        issue.value
      }\n\n${createComment(formData.form.type)}`;
      const issueUriComponent = encodeURIComponent(issueString).replace(
        /%2B/gi,
        '+'
      );
      window.open(
        `https://github.com/${formData.form.repo}/issues/new?title=${formData.form.title}&body=${issueUriComponent}`
      );
    }
    return {
      ...toRefs(formData),
      lang,
      contentText,
      repoOptions,
      issueTypeOptions,
      formRef,
      rules,
      tipVisible,
      isBug,
      previewVisible,
      issueVNode: issueRenderRef,
      autosizeConfig: {
        minRows: 3,
      },
      handlePreview,
      create,
    };
  },
});
</script>

<style scoped>
.card {
  margin-bottom: 24px;
}

.form {
  margin-top: 10px;
}

.m-b-24 {
  margin-bottom: 24px;
}

.preview {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.preview-content {
  word-wrap: break-word;
  word-break: normal;
  overflow: hidden;
}

.preview-footer {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
