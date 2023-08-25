<template>
  <div ref="article" name="DOC" class="doc-values">
    <nav class="tdesign-toc_container" style="position: absolute; top: 328px">
      <ol class="tdesign-toc_list">
        <li class="tdesign-toc_list_item" v-for="anchor in catalog" :key="anchor.id">
          <a class="tdesign-toc_list_item_a" :href="'#' + anchor.id">{{ anchor.title }} </a>
          <ol class="tdesign-toc_list" v-if="anchor.children.length">
            <li class="tdesign-toc_list_item" v-for="subAnchor in anchor.children" :key="subAnchor.id">
              <a class="tdesign-toc_list_item_a" :href="'#' + subAnchor.id">{{ subAnchor.title }} </a>
            </li>
          </ol>
        </li>
      </ol>
    </nav>

    <h2>Inclusiveness</h2>
    <video
      autoplay
      loop="loop"
      muted
      defaultMuted
      playsinline
      x5-playsinline
      webkit-playsinline
      x5-video-player
      x5-video-player-type="h5"
      preload="auto"
    >
      <source :src="gif1" type="video/mp4" />
    </video>
    <p>
      TDesign is an inclusive design system that emphasizes the pursuit of a people-centric and inclusive approach in
      providing products and services for businesses, ensuring that everyone benefits. In the process of building,
      TDesign requires that the underlying business be understood and the diversity of business scenarios be understood,
      in order to identify commonalities and characteristics in complex business scenarios, ensuring that everyone can
      coexist flexibly in the same environment. It can satisfy immediate needs and adapt to broader scenarios, while
      providing customization space for different products, ensuring that different products reflect their own
      characteristics. TDesign can also provide suitable services for a wider range of products.
    </p>

    <h2>Diversity</h2>
    <video
      autoplay
      loop="loop"
      muted
      defaultMuted
      playsinline
      x5-playsinline
      webkit-playsinline
      x5-video-player
      x5-video-player-type="h5"
      preload="auto"
    >
      <source :src="gif2" type="video/mp4" />
    </video>
    <p>
      In a professional environment, we expect TDesign to maintain diversity. We realize that it's impossible to
      standardize everything in the world, so TDesign as a design system needs to constantly incorporate new
      perspectives, adapt to future technological changes and experience innovations, and continually grow and
      diversify. Based on Tencent's business and also serving businesses, TDesign is continually enriched with diverse
      content through mutual feedback with business users. While ensuring consistent values, TDesign seeks to meet the
      needs of multiple business scenarios and empower different business types within Tencent's ecosystem, exploring
      more opportunities for diversity.
    </p>

    <h2>Evolution</h2>
    <video
      autoplay
      loop="loop"
      muted
      defaultMuted
      playsinline
      x5-playsinline
      webkit-playsinline
      x5-video-player
      x5-video-player-type="h5"
      preload="auto"
    >
      <source :src="gif3" type="video/mp4" />
    </video>
    <p>
      Evolution is the most understood and adhered to principle of creation by humans so far, and TDesign's design
      system also follows this principle. It remains sensitive to design, resonates with trends, and pushes for
      continuous evolution of the overall style. TDesign strives to maintain its core while improving its product matrix
      with a developmental perspective, while considering more possibilities in the design process, leaving room for
      technological developments, changes in experience patterns, design trends, and upgrades of enterprises and
      products. At the same time, it ensures the continuity and persistence of iterative optimization of the system.
    </p>

    <h2>Connectivity</h2>
    <video
      autoplay
      loop="loop"
      muted
      defaultMuted
      playsinline
      x5-playsinline
      webkit-playsinline
      x5-video-player
      x5-video-player-type="h5"
      preload="auto"
    >
      <source :src="gif4" type="video/mp4" />
    </video>
    <p>
      "Connecting everything" is deeply imprinted in Tencent's genes. In this process, as a basic service of Tencent's
      ecosystem, TDesign needs to play a connecting and open role, not only supporting the stable operation of massive
      internal businesses, but also providing leading industry solutions to meet the needs of building full-scenario
      ecosystem capabilities. TDesign will continue to cover Tencent's cutting-edge technologies, strategic experience,
      and material asset openness and sharing, making every effort to connect, empower users, enterprises, and the
      ecosystem, and ultimately connect to the future.
    </p>
  </div>
</template>

<script>
import anchorMixin from '../mixins/anchor';

export default {
  mixins: [anchorMixin],
  data() {
    return {
      gif1: encodeURI('https://tdesign.gtimg.com/site/images/包容.mp4'),
      gif2: encodeURI('https://tdesign.gtimg.com/site/images/多元.mp4'),
      gif3: encodeURI('https://tdesign.gtimg.com/site/images/进化.mp4'),
      gif4: encodeURI('https://tdesign.gtimg.com/site/images/连接.mp4'),

      // gif1: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/%E5%8C%85%E5%AE%B9.gif',
      // gif2: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/%E5%A4%9A%E5%85%83.gif',
      // gif3: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/%E8%BF%9B%E5%8C%96.gif',
      // gif4: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/%E8%BF%9E%E6%8E%A5.gif',
    };
  },

  mounted() {
    window.addEventListener('touchstart', this.playAllVideo);
  },

  beforeDestroy() {
    window.removeEventListener('touchstart', this.playAllVideo);
  },

  methods: {
    playAllVideo() {
      Array.from(this.$refs.article.querySelectorAll('video')).forEach((item) => {
        if (item.paused) item.play();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.doc-values {
  video {
    border-radius: 6px;
    width: 100%;
  }
}
</style>
