<template>
  <div ref="article" name="DESIGN" class="doc-icon">
    <nav class="tdesign-toc_container" style="position: absolute; top: 328px">
      <ol class="tdesign-toc_list">
        <li v-for="anchor in catalog" :key="anchor.id" class="tdesign-toc_list_item">
          <a class="tdesign-toc_list_item_a" :href="`#${anchor.id}`">{{ anchor.title }} </a>
          <ol v-if="anchor.children.length" class="tdesign-toc_list">
            <li v-for="subAnchor in anchor.children" :key="subAnchor.id" class="tdesign-toc_list_item">
              <a class="tdesign-toc_list_item_a" :href="`#${subAnchor.id}`">{{ subAnchor.title }} </a>
            </li>
          </ol>
        </li>
      </ol>
    </nav>

    <h2>{{ t('icon.summaryTitle') }}</h2>
    <p>{{ t('icon.summary') }}</p>

    <h2>{{ t('icon.principleTitle') }}</h2>
    <h3>{{ t('icon.simplicityTitle') }}</h3>
    <p>{{ t('icon.simplicity') }}</p>
    <img src="./assets/icon/simplify-1.png" alt="" />

    <h3>{{ t('icon.accuracyTitle') }}</h3>
    <p>{{ t('icon.accuracy') }}</p>
    <img src="./assets/icon/accurate-1.png" alt="" />

    <h3>{{ t('icon.moderationTitle') }}</h3>
    <p>{{ t('icon.moderation') }}</p>
    <img src="./assets/icon/moderate-1.png" alt="" />

    <h2>{{ t('icon.specificationTitle') }}</h2>
    <h3>{{ t('icon.gridTitle') }}</h3>
    <p>{{ t('icon.grid') }}</p>
    <img src="./assets/icon/grid-1.png" alt="" />
    <hr />
    <p>{{ t('icon.pixel') }}</p>
    <img src="./assets/icon/grid-2.png" alt="" />
    <hr />
    <p>{{ t('icon.symmetry') }}</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/grid-3-left.png" />
        <img class="tag" :src="goodImage" />
      </div>
      <div class="item">
        <img src="./assets/icon/grid-3-right.png" />
        <img class="tag" :src="badImage" />
      </div>
    </div>

    <h3>{{ t('icon.canvasTitle') }}</h3>
    <p>{{ t('icon.canvas') }}</p>
    <img src="./assets/icon/canvas-1.png" alt="" />
    <hr />
    <p>{{ t('icon.guidelines') }}</p>
    <img src="./assets/icon/canvas-2.png" alt="" />
    <hr />
    <p>{{ t('icon.guidelineChoice') }}</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/canvas-3-left.png" />
        <img class="tag" :src="goodImage" />
      </div>
      <div class="item">
        <img src="./assets/icon/canvas-3-right.png" />
        <img class="tag" :src="badImage" />
      </div>
    </div>
    <hr />
    <p>{{ t('icon.direction') }}</p>
    <img src="./assets/icon/canvas-4.png" alt="" />

    <h3>{{ t('icon.lineTitle') }}</h3>
    <i18n-t keypath="icon.line" tag="p">
      <template #link>
        <t-link theme="primary" :href="locale === 'en-US' ? '/icons-en' : '/icons'" target="blank">
          {{ t('icon.iconSite') }}
        </t-link>
      </template>
    </i18n-t>
    <img src="./assets/icon/line-1.png" alt="" />
    <img src="./assets/icon/line-2.png" alt="" style="margin-top: 16px" />
    <hr />
    <p>{{ t('icon.longLine') }}</p>
    <img src="./assets/icon/line-3.png" alt="" />
    <hr />
    <p>{{ t('icon.lineEnd') }}</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/line-4-left.png" />
        <img class="tag" :src="goodImage" />
      </div>
      <div class="item">
        <img src="./assets/icon/line-4-right.png" />
        <img class="tag" :src="badImage" />
      </div>
    </div>
    <hr />

    <h3>{{ t('icon.cornersTitle') }}</h3>
    <p>{{ t('icon.corners') }}</p>
    <img src="./assets/icon/round-1.png" alt="" />
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/round-2-left.png" />
        <img class="tag" :src="goodImage" />
      </div>
      <div class="item">
        <img src="./assets/icon/round-2-right.png" />
        <img class="tag" :src="badImage" />
      </div>
    </div>

    <h3>{{ t('icon.angleTitle') }}</h3>
    <p>{{ t('icon.angle') }}</p>
    <img src="./assets/icon/angle-1.png" alt="" />
    <hr />
    <p>{{ t('icon.negativeAngle') }}</p>
    <div class="legend">
      <div class="item"><img src="./assets/icon/angle-2-left.png" /></div>
      <div class="item"><img src="./assets/icon/angle-2-right.png" /></div>
    </div>

    <h3>{{ t('icon.breaksTitle') }}</h3>
    <p>{{ t('icon.breaks') }}</p>
    <div class="legend">
      <div class="item"><img src="./assets/icon/fracture-1-left.png" /></div>
      <div class="item"><img src="./assets/icon/fracture-1-right.png" /></div>
    </div>

    <h3>{{ t('icon.accessoryTitle') }}</h3>
    <p>{{ t('icon.accessory') }}</p>
    <img src="./assets/icon/variety-1.png" alt="" />
    <hr />
    <p>{{ t('icon.accessoryUse') }}</p>
    <img src="./assets/icon/variety-2.png" alt="" />

    <h3>{{ t('icon.complexityTitle') }}</h3>
    <p>{{ t('icon.complexity') }}</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/easy-1-left.png" />
        <img class="tag" :src="goodImage" />
      </div>
      <div class="item">
        <img src="./assets/icon/easy-1-right.png" />
        <img class="tag" :src="badImage" />
      </div>
    </div>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/easy-1-left-bottom.png" />
        <img class="tag" :src="goodImage" />
      </div>
      <div class="item">
        <img src="./assets/icon/easy-1-right-bottom.png" />
        <img class="tag" :src="badImage" />
      </div>
    </div>

    <h3>{{ t('icon.arcTitle') }}</h3>
    <p>{{ t('icon.arc') }}</p>
    <div class="legend">
      <div class="item">
        <img src="./assets/icon/arc-1-left.png" />
        <img class="tag" :src="goodImage" />
      </div>
      <div class="item">
        <img src="./assets/icon/arc-1-right.png" />
        <img class="tag" :src="badImage" />
      </div>
    </div>

    <t-divider>
      <div class="icons-page-btn" @click="handleClickBtn">
        <link-1-icon style="margin-right: 8px" :size="20" />{{ t('icon.visit') }}
      </div>
    </t-divider>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Link1Icon } from 'tdesign-icons-vue-next';

import messages from '../../locales/pages/design-motion-icon';

const goodImage = 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/good.png';
const badImage = 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/bad.png';

const { locale, t } = useI18n({ messages });
const article = ref();
const catalog = ref([]);

const genAnchor = () => {
  if (!article.value) return;
  const titles = [];
  Array.from(article.value.children).forEach((element, index) => {
    if (['H2', 'H3'].includes(element.nodeName)) {
      const id = `header-${index}`;
      element.id = id;
      titles.push({
        id,
        title: element.textContent,
        level: Number(element.nodeName.slice(1)),
        children: [],
      });
    }
  });

  const isEveryLevel3 = titles.every((title) => title.level === 3);
  catalog.value = titles.reduce((result, current) => {
    if (isEveryLevel3 || current.level === 2) {
      result.push(current);
    } else {
      result[result.length - 1]?.children.push(current);
    }
    return result;
  }, []);
};

const handleClickBtn = () => {
  window.open('/icons', '_blank');
};

onMounted(genAnchor);
watch(locale, async () => {
  await nextTick();
  genAnchor();
});
</script>
