<template>
  <div class="banner-wrap">
    <div class="banner-img-wrap">
      <div v-show="showCanvas">
        <div :class="{filtered: !imageLoaded}" class="banner-bg-wrapper __light__">
          <img style="z-index: 10" :class="{ hide: imageLoaded }" src="/home/compressed-banner.png" />

          <img style="z-index: 5" :class="{ hide: !imageLoaded }" src="https://tdesign.gtimg.com/site/images/breathe-top.png" />
          <img style="z-index: 5" :class="{ hide: !imageLoaded }" class="breathe" src="https://tdesign.gtimg.com/site/images/breathe-bottom.png" />
          <canvas class="banner-canvas" ref="canvasLight"></canvas>
          <span class="banner-trigger1 light"></span>
          <!-- <span class="banner-trigger2 light"></span> -->
          <span class="banner-trigger3 light"></span>
          <span class="banner-trigger4 light"></span>
        </div>
        <div :class="{filtered: !imageLoaded}" class="banner-bg-wrapper __dark__">
          <img style="z-index: 10" :class="{ hide: imageLoaded }" src="/home/compressed-banner-dark.png" />

          <img style="z-index: 5" :class="{ hide: !imageLoaded }" src="https://tdesign.gtimg.com/site/images/breathe-top-dark.png" />
          <img style="z-index: 5" :class="{ hide: !imageLoaded }" class="breathe" src="https://tdesign.gtimg.com/site/images/breathe-bottom-dark.png" />
          <canvas class="banner-canvas" ref="canvasDark"></canvas>
          <span class="banner-trigger1 dark"></span>
          <!-- <span class="banner-trigger2 dark"></span> -->
          <span class="banner-trigger3 dark"></span>
          <span class="banner-trigger4 dark"></span>
        </div>
      </div>
      <div v-show="!showCanvas">
        <img class="banner-bg __light__" src="https://tdesign.gtimg.com/site/images/banner-thumb.jpg" />
        <img class="banner-bg __dark__" src="https://tdesign.gtimg.com/site/images/banner-thumb-dark.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
import Canvas3d from 'canvas-3d'
import modelData from './assets/banner.glb'
import hdrData from './assets/banner.hdr'
import modelDataDark from './assets/banner-dark.glb'
import hdrDataDark from './assets/banner-dark.hdr'
import * as THREE from 'three'
// import Stats from './stats.module';
// const stats = new Stats();
import { CDN_BASE } from '@consts'

const WIDTH = 1056
const HEIGHT = 640
const SCALE = 15.1

export default {
  props: {
    themeMode: {
      type: String,
      default: 'light'
    }
  },

  data () {
    return {
      showCanvas: true,
      imageLoaded: false
    }
  },

  watch: {
    themeMode () {
      this.initWebgl()
    }
  },

  mounted () {
    // document.body.appendChild(stats.dom);
    this.initWebgl()

    this.reploadImage()
  },

  beforeDestroy () {
    // 离开当前页面时，可以调用该方法取消掉requestAnimationFrame
    this.canvas3dLight && this.canvas3dLight.cancelAnimationFrame()
    this.canvas3dDark && this.canvas3dDark.cancelAnimationFrame()
  },

  methods: {
    reploadImage () {
      const preloadImages = [
        `${CDN_BASE}/site/images/breathe-top.png`,
        `${CDN_BASE}/site/images/breathe-bottom.png`,
        `${CDN_BASE}/site/images/breathe-top-dark.png`,
        `${CDN_BASE}/site/images/breathe-bottom-dark.png`
      ]
      console.time('preload')
      Promise.all(preloadImages.map(url => {
        return new Promise(resolve => {
          const image = new Image()
          image.src = url
          image.onload = resolve
        })
      })).then(() => {
        console.timeEnd('preload')
        this.imageLoaded = true
      }).catch(() => {
        this.imageLoaded = true
      })
    },
    initWebgl () {
      // 移动端不渲染 webgl
      if (/(iPhone|iPod|iOS|Android)/i.test(navigator.userAgent)) {
        this.showCanvas = false
        return
      }
      const { themeMode, renderWebgl } = this
      if (themeMode === 'dark' || document.documentElement.getAttribute('theme-mode') === 'dark') {
        this.canvas3dLight && this.canvas3dLight.cancelAnimationFrame()
        this.canvas3dDark ? this.canvas3dDark.animate() : (this.canvas3dDark = renderWebgl('dark'))
      } else {
        this.canvas3dDark && this.canvas3dDark.cancelAnimationFrame()
        this.canvas3dLight ? this.canvas3dLight.animate() : (this.canvas3dLight = renderWebgl('light'))
      }
    },
    renderWebgl (theme = 'light') {
      const { canvasLight, canvasDark } = this.$refs

      const canvas3d = new Canvas3d({
        canvasData: {
          dom: theme === 'light' ? canvasLight : canvasDark,
          width: WIDTH,
          height: HEIGHT,
          pixelRatio: Math.min(window.devicePixelRatio, 1.5)
        },
        cameraData: {
          type: 'orthographic',
          left: WIDTH / -SCALE,
          right: WIDTH / SCALE,
          top: HEIGHT / SCALE,
          bottom: -HEIGHT / SCALE,
          position: [0, 0, 40]
        },
        modelData: {
          url: theme === 'light' ? modelData : modelDataDark,
          material: {
            soft_mid: {
              roughness: 0.33,
              metalness: 1,
              color: '#8792a6',
              emissive: '#d1d1d1',
              opacity: 1,
              envMapIntensity: 0.55
            },
            soft_mid_2: {
              roughness: 0.2,
              metalness: 1,
              color: '#91a0ba',
              emissive: '#d1d1d1',
              opacity: 1,
              envMapIntensity: 0.55
            },
            soft_light: {
              roughness: 0,
              metalness: 1,
              color: '#8792a6',
              emissive: '#cececf',
              opacity: 1,
              envMapIntensity: 0.71
            },
            soft_light_2: {
              roughness: 0,
              metalness: 1,
              color: '#8792a6',
              emissive: '#cececf',
              opacity: 1,
              envMapIntensity: 0.79
            }
          }
        },
        animationData: {
          isAnimated: false
        },
        hdrData: {
          url: theme === 'light' ? hdrData : hdrDataDark,
          rotation: [0, 0, 0]
        },
        // 模型交互
        sceneInteractiveData: {
          isAble: false,
          trigger: theme === 'light' ? canvasLight : canvasDark,
          param: {
            maxVertical: (0 * Math.PI) / 2,
            minVertical: (0 * -Math.PI) / 2,
            maxHorizon: Math.PI / 5,
            minHorizon: -Math.PI / 5
          },
          enterHandle: (e) => {},
          moveHandle: (e) => {},
          outHandle: (e) => {}
        }
        // requestAnimationHandler() {
        //   stats.update();
        // },
      })

      // 可以通过 canvas3d.shouldRender 的返回值决定是否渲染 3d 模型，移动端也会判定为不渲染
      if (canvas3d.shouldRender()) {
        this.showCanvas = true
        canvas3d
          .loadAssert()
          .then(() => {
            // 在模型渲染前做一些个性化处理
            // 比如： 在渲染前对模型进行缩放、旋转、位移等操作
            canvas3d.model.rotation.x = 0.40661688
            canvas3d.model.rotation.y = 0.80113866
            canvas3d.model.rotation.z = 0
            canvas3d.model.position.x = 0.3
            canvas3d.model.position.y = -2.1
            canvas3d.model.position.z = 0
          })
          .then(() => {
            canvas3d.addMesh()
            // 动画
            const animationsOriginal = canvas3d.gltf.animations
            canvas3d.mixer = new THREE.AnimationMixer(canvas3d.scene)
            // 中间树的第一段动画
            const treeTrigger = document.querySelector(`.banner-trigger4.${theme}`)
            const treeAnimationStage1 = animationsOriginal.filter((item) => {
              return item.name.indexOf('stage1') > -1
            })
            const treeActionStage1 = []
            treeAnimationStage1.forEach((item) => {
              const stage1Action = canvas3d.mixer.clipAction(item)
              stage1Action.loop = THREE.LoopOnce
              treeActionStage1.push(stage1Action)
              stage1Action.play()
            })

            // 中间树的第二段动画
            const treeAnimationStage2 = animationsOriginal.filter((item) => {
              return item.name.indexOf('stage2') > -1
            })
            const treeActionStage2 = []
            treeAnimationStage2.forEach((item) => {
              const stage2Action = canvas3d.mixer.clipAction(item)
              treeActionStage2.push(stage2Action)
            })

            canvas3d.mixer.addEventListener('finished', (e) => {
              treeActionStage2.forEach((item) => {
                item.play()
              })
            })

            // 右上角圈圈的动画
            // let ringTrigger = document.querySelector(`.banner-trigger2.${theme}`);

            // const ringAnimation = animationsOriginal.filter((item) => {
            //   return item.name === 'ring';
            // });
            // ringTrigger.onmouseover = () => {
            //   if (canvas3d.ringAnimate) return;
            //   ringAnimation.forEach((item) => {
            //     let action = canvas3d.mixer.clipAction(item);
            //     action.play();
            //   });
            //   canvas3d.ringAnimate = true;
            // };

            // 左下角球的动画 sphere
            const sphereTrigger = document.querySelector(`.banner-trigger1.${theme}`)
            const sphereAnimation = animationsOriginal.filter((item) => {
              return item.name === 'spheric'
            })
            sphereTrigger.onmouseover = () => {
              if (canvas3d.sphereAnimate) return
              sphereAnimation.forEach((item) => {
                const action = canvas3d.mixer.clipAction(item)
                action.play()
              })
              canvas3d.sphereAnimate = true
            }
            // 右下角立方体的动画
            const cubeTrigger = document.querySelector(`.banner-trigger3.${theme}`)
            const cubeAnimation = animationsOriginal.filter((item) => {
              return item.name === 'Cube2'
            })
            cubeTrigger.onmouseover = () => {
              if (canvas3d.cubeAnimate) return
              cubeAnimation.forEach((item) => {
                const action = canvas3d.mixer.clipAction(item)
                action.play()
              })
              canvas3d.cubeAnimate = true
            }

            // 默认其他动画
            const defaultAnimation = animationsOriginal.filter((item) => {
              return item.name.indexOf('default') > -1
            })
            const defaultAction = []
            defaultAnimation.forEach((item) => {
              const action = canvas3d.mixer.clipAction(item)
              defaultAction.push(action)
              action.play()
            })

            // hover 时，中间树的动画加速
            treeTrigger.onmouseover = () => {
              treeActionStage1.forEach((item) => {
                item.timeScale = 2.2
              })
              treeActionStage2.forEach((item) => {
                item.timeScale = 2.2
              })
              defaultAction.forEach((item) => {
                item.timeScale = 1.1
              })
            }
            treeTrigger.onmouseout = () => {
              treeActionStage1.forEach((item) => {
                item.timeScale = 1
              })
              treeActionStage2.forEach((item) => {
                item.timeScale = 1
              })
              defaultAction.forEach((item) => {
                item.timeScale = 1
              })
            }
          })
      } else {
        console.log('当前环境不适宜渲染3d')
        this.showCanvas = false
      }
      return canvas3d
    }
  }
}
</script>

<style lang="less">
:root[theme-mode='dark'] {
  .banner-wrap {
    --bg-color-banner-linear: linear-gradient(180deg, rgba(36, 36, 36, 0) 0%, #242424 100%);
  }
}

@keyframes breathe {
  0% {
    opacity: 1;
  }
  100% {
    opacity: .1;
  }
}
@-webkit-keyframes breathe {
  0% {
    opacity: 1;
  }
  100% {
    opacity: .1;
  }
}

.banner-wrap {
  position: absolute;
  width: 100%;
  top: 64px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  -webkit-transform: translate3d(-50%, 0, 0);
  z-index: 1;

  --bg-color-banner-linear: linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, #f5f5f5 100%);

  &::after {
    content: '';
    width: 100%;
    height: 160px;
    position: absolute;
    bottom: -10px;
    left: 0;
    z-index: 20;
    background: var(--bg-color-banner-linear);
  }

  .banner-bg-wrapper {
    height: 640px;
    position: relative;

    &.filtered {
      filter: blur(4px);
    }

    img {
      width: auto;
      height: 640px;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate3d(-50%, 0, 0);
      -webkit-transform: translate3d(-50%, 0, 0);
      pointer-events: none;
      transition: opacity .2s linear;
      -webkit-transition: opacity .2s linear;
      will-change: opacity;

      &.hide {
        opacity: 0;
      }

      &.breathe {
        animation: breathe 2.5s 1s linear infinite alternate;
        -webkit-animation: breathe 2.5s 1s linear infinite alternate;
      }
    }
  }

  .banner-bg {
    width: auto;
    height: 640px;
    position: relative;
    left: 50%;
    top: 0;
    transform: translate3d(-50%, 0, 0);
    -webkit-transform: translate3d(-50%, 0, 0);
  }
  .banner-img-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    left: 50%;
    top: 0;
    transform: translate3d(-50%, 0, 0);
    -webkit-transform: translate3d(-50%, 0, 0);
  }
  .banner-canvas {
    position: absolute;
    left: 50%;
    top: 0;
    z-index: 10;
    transform: translate3d(-50%, 0, 0);
    -webkit-transform: translate3d(-50%, 0, 0);
    height: 100% !important;
    width: auto !important;
  }
  .banner-trigger1 {
    display: inline-block;
    width: 150px;
    height: 170px;
    position: absolute;
    right: calc(50% + 380px);
    top: 40%;
    opacity: 0;
    z-index: 100;
  }
  .banner-trigger2 {
    display: inline-block;
    width: 7.59375%;
    height: 20.375%;
    position: absolute;
    // left: calc(50% + 380px);
    top: 2.7286%;
    opacity: 0;
    z-index: 100;
    border-radius: 80px;
  }
  .banner-trigger3 {
    display: inline-block;
    width: 180px;
    height: 180px;
    position: absolute;
    left: calc(50% + 380px);
    top: 44%;
    opacity: 0;
    z-index: 100;
  }
  .banner-trigger4 {
    display: inline-block;
    width: 12.59375%;
    height: 48.375%;
    position: absolute;
    left: 43.338%;
    top: 13.8286%;
    opacity: 0;
    z-index: 100;
    border-radius: 82px;
  }

}
@media screen and (max-width: 960px) {
  .banner-wrap .banner-bg {
    height: 480px;
  }
}
</style>
