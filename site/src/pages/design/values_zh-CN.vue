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

    <h2>包容</h2>
    <video
      autoplay
      loop="loop"
      muted
      defaultMuted
      playsinline
      x5-playsinline
      webkit-playsinline
      x5-video-player
      x5-video-player-type='h5'
      preload="auto"
    >
      <source :src="gif1" type="video/mp4" />
    </video>
    <p>
      TDesign
      是具有包容性的设计体系，它强调为业务提供产品、服务等过程中，追求以人为本、人人受益的包容性，要求搭建过程中，了解业务底层，理解业务场景的多样性，并在繁杂的业务场景中寻找共性和特性，确保彼此能灵活地在同一个环境并存，既能满足当下需要，也能作用于更广泛的场景，为不同的产品保留定制空间，在保证不同产品能够体现自我特色的同时，TDesign
      还可以为更广泛的产品提供适合的服务。
    </p>

    <h2>多元</h2>
    <video
      autoplay
      loop="loop"
      muted
      defaultMuted
      playsinline
      x5-playsinline
      webkit-playsinline
      x5-video-player
      x5-video-player-type='h5'
      preload="auto"
    >
      <source :src="gif2" type="video/mp4" />
    </video>
    <p>
      在一个专业环境里，我们希望 TDesign 可以保持多元。我们意识到在世界中不可能单一化，所以作为设计体系需要不断纳入新鲜血液，适应未来的技术和体验变革，不断地进行多元化生长。
      TDesign
      基于腾讯业务，同时也服务于业务，并伴随着业务的使用后获得业务的反哺，从而不断地得到多元内容补充。在保证价值观一致的基础上，洞察多个业务场景需求，赋能腾讯及生态中的不同业务类型
      ，为 TDesign 探索更多的多元化机会点。
    </p>

    <h2>进化</h2>
    <video
      autoplay
      loop="loop"
      muted
      defaultMuted
      playsinline
      x5-playsinline
      webkit-playsinline
      x5-video-player
      x5-video-player-type='h5'
      preload="auto"
    >
      <source :src="gif3" type="video/mp4" />
    </video>
    <p>
      进化是迄今为止最为人类理解和遵从的造物者法则，TDesign
      的设计体系同样遵循进化。在设计上保持敏锐感，与趋势产生共鸣，推动整体风格不断进化。对当前对用户和产品友好基础上，保持其内核的坚定，用发展的眼光完善
      TDesign
      产品矩阵。在设计过程中考虑更多的可能性，为技术发展、体验模式变化、设计趋势、企业与产品的升级留有空间，同时保证迭代优化系统的延续性和持久性。
    </p>

    <h2>连接</h2>
    <video
      autoplay
      loop="loop"
      muted
      defaultMuted
      playsinline
      x5-playsinline
      webkit-playsinline
      x5-video-player
      x5-video-player-type='h5'
      preload="auto"
    >
      <source :src="gif4" type="video/mp4" />
    </video>
    <p>
      “连接一切”深深印刻在腾讯的基因中，在这个过程中，TDesign
      作为腾讯生态基础服务，需要起到连接和开放的作用，不仅支持内部海量业务的稳定运营，还能提供领先的各行业解决方案，满足全场景生态能力的建设。TDesign
      将会持续地涵盖腾讯的前沿技术、策略经验和物料资产开放、共享，用最大努力去连接赋能，连接用户、连接企业、连接生态，更连接未来。
    </p>
  </div>
</template>

<script>
import anchorMixin from '../mixins/anchor'

export default {
  mixins: [anchorMixin],
  data () {
    return {
      gif1: encodeURI('https://tdesign.gtimg.com/site/images/包容.mp4'),
      gif2: encodeURI('https://tdesign.gtimg.com/site/images/多元.mp4'),
      gif3: encodeURI('https://tdesign.gtimg.com/site/images/进化.mp4'),
      gif4: encodeURI('https://tdesign.gtimg.com/site/images/连接.mp4')

      // gif1: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/%E5%8C%85%E5%AE%B9.gif',
      // gif2: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/%E5%A4%9A%E5%85%83.gif',
      // gif3: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/%E8%BF%9B%E5%8C%96.gif',
      // gif4: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/%E8%BF%9E%E6%8E%A5.gif',
    }
  },

  mounted () {
    window.addEventListener('touchstart', this.playAllVideo)
  },

  beforeDestroy () {
    window.removeEventListener('touchstart', this.playAllVideo)
  },

  methods: {
    playAllVideo () {
      Array.from(this.$refs.article.querySelectorAll('video')).forEach(item => {
        if (item.paused) item.play()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.doc-values {
  video {
    border-radius: 6px;
    width: 100%;
  }
}
</style>
