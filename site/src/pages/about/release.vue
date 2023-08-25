<template>
  <td-doc-content>
    <td-doc-header slot="doc-header" ref="tdDocHeader"></td-doc-header>

    <div name="DESIGN">
      <nav class="tdesign-toc_container" style="position: absolute; top: 328px">
        <ol class="tdesign-toc_list">
          <li class="tdesign-toc_list_item" v-for="anchor in releaseTimeList" :key="anchor.id">
            <a class="tdesign-toc_list_item_a" :href="'#' + anchor.id">{{ anchor.title }} </a>
          </li>
        </ol>
      </nav>
    </div>

    <div v-if="release.length" class="release__timeline">
      <section class="release__block" v-for="(item, index) in release" :key="item.id">
        <h2 :id="releaseTimeList[index].id">
          <code class="release__time">{{ releaseTimeList[index].title }}</code>
        </h2>
        <div name="DOC" v-html="item.body"></div>
      </section>
    </div>
    <t-loading v-else />

    <td-doc-footer slot="doc-footer"></td-doc-footer>
  </td-doc-content>
</template>

<script>
import MarkdownIt from 'markdown-it'
import mila from 'markdown-it-link-attributes'

const RELEASE_API = 'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors/release'

const titleReg = /<h[23]>\s*(Vue|React|Miniprogram|Figma|Sketch|Axure|AdobeXD|TDesign)/g

const mdRender = new MarkdownIt({
  linkify: true
}).use(mila, {
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
})

export default {
  data () {
    return {
      mdRender,
      release: []
    }
  },
  mounted () {
    this.pageInit()
    this.fetchReleases()
  },

  computed: {
    releaseTimeList () {
      return this.release.map((item) => ({
        title: this.formatTime(item.published_at),
        id: this.formatTime(item.published_at).replace(/\s/g, '-')
      }))
    }
  },
  methods: {
    formatTime (time) {
      return `${new Date(time).toDateString()}（${new Date(time).toLocaleDateString()}）`
    },
    pageInit () {
      const { meta } = this.$route
      this.$refs.tdDocHeader.docInfo = meta
    },
    fetchReleases () {
      const cache = sessionStorage.getItem('__tdesign_release__')

      if (cache) {
        const data = JSON.parse(cache)
        this.release = data.map((item) => {
          item.body = this.mdRender.render(item.body).replace(titleReg, '<h2> <i name="$1"></i> $1')
          return item
        })
      } else {
        fetch(RELEASE_API)
          .then((res) => res.json())
          .then((data) => {
            sessionStorage.setItem('__tdesign_release__', JSON.stringify(data))

            this.release = data.map((item) => {
              item.body = this.mdRender.render(item.body).replace(titleReg, '<h2> <i name="$1"></i> $1')
              return item
            })
          })
          .catch((err) => console.error(err))
      }
    }
  }
}
</script>

<style lang="less">
.release {
  &__time {
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    padding: 6px 12px;
    border-radius: 3px;
    background: var(--bg-color-tag);
    margin-bottom: 48px;
    display: inline-block;
  }

  &__timeline {
    padding-left: 32px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 24px;
      left: 3px;
      width: 2px;
      height: 100%;
      background: var(--brand-main);
    }

    div[name='DOC'] {
      a:not(class) {
        opacity: 0.9;
        transition: all 0.2s linear;

        &:hover {
          opacity: 1;
          color: var(--brand-main);
        }
      }

      h1 {
        font-size: 28px;
        line-height: 36px;
        margin-bottom: 0;

        &:not(&:first-child) {
          margin-top: 48px;
        }
      }

      h2 {
        position: relative;
        font-size: 20px;
        line-height: 28px;
        margin-top: 48px;

        > a:not(class) {
          color: var(--text-primary);
          margin-left: 4px;
        }
      }
    }
  }

  &__block {
    position: relative;
    margin-bottom: 64px;

    &:not(:last-child) {
      h2 {
        > i {
          width: 20px;
          height: 20px;
          background-color: var(--bg-color-docpage);
          position: absolute;
          left: -38px;
          top: 5px;
          z-index: 10;
          outline: 10px solid var(--bg-color-docpage);
          background-repeat: no-repeat;
          background-size: 20px 20px;

          &[name^='Vue'] {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjEuNzYgMjI2LjY5Ij48cGF0aCBkPSJNMTYxLjA5Ni4wMDFsLTMwLjIyNSA1Mi4zNTFMMTAwLjY0Ny4wMDFILS4wMDVsMTMwLjg3NyAyMjYuNjg4TDI2MS43NDkuMDAxeiIgZmlsbD0iIzQxYjg4MyIvPjxwYXRoIGQ9Ik0xNjEuMDk2LjAwMWwtMzAuMjI1IDUyLjM1MUwxMDAuNjQ3LjAwMUg1Mi4zNDZsNzguNTI2IDEzNi4wMUwyMDkuMzk4LjAwMXoiIGZpbGw9IiMzNDQ5NWUiLz48L3N2Zz4K);
          }

          &[name^='React'] {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K);
          }

          &[name^='Miniprogram'] {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swIiBtYXNrLXR5cGU9ImFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgo8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMCkiPgo8cGF0aCBkPSJNMTEuNTkzNSA4LjI2MjYxQzEyLjQyMSA4LjAxMzgxIDE0LjI3NDQgNi44Mzg2OCAxMy45NjU1IDUuMDQ3MjdDMTMuNTc5NCAyLjgwODAyIDExLjkyNDUgMi4yMzM4NSA5Ljk5Mzg3IDIuODY1NDNDOC40NDkzNiAzLjM3MDcgOC4xMDAwNyA0LjUzMDUyIDguMDYzMyA1LjA0NzI3VjExLjI0ODNDNy44OTc4MSAxMi4yNDM1IDYuNTQwNjkgMTQuMTY1MSA0LjIwMTg2IDEzLjQzMDFDMS44NjMwMyAxMi42OTUyIDEuOTY0ODkgMTAuMzcyMiAyLjM4MTY0IDkuNDY4MzZDMi42MDIyNyA4Ljk4OTg5IDMuNTYxOTQgNy44NDkyMSA0Ljc1MzQ3IDcuODAzMjgiIHN0cm9rZT0iIzA3QzE2MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9nPgo8L3N2Zz4K);
          }

          &[name^='Figma'] {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguNTA5OTggMjIuNTAwMUMxMC40NDIgMjIuNTAwMSAxMi4wMSAyMC45MzIxIDEyLjAxIDE5LjAwMDFWMTUuNTAwMUg4LjUwOTk4QzYuNTc4IDE1LjUwMDEgNS4wMTAwMSAxNy4wNjgxIDUuMDEwMDEgMTkuMDAwMUM1LjAxMDAxIDIwLjkzMjEgNi41NzggMjIuNTAwMSA4LjUwOTk4IDIyLjUwMDFaIiBmaWxsPSIjMEFDRjgzIi8+CjxwYXRoIGQ9Ik01LjAxMDAxIDEyQzUuMDEwMDEgMTAuMDY4IDYuNTc4IDguNSA4LjUwOTk4IDguNUgxMi4wMVYxNS40OTk5SDguNTA5OThDNi41NzggMTUuNDk5OSA1LjAxMDAxIDEzLjkzMiA1LjAxMDAxIDEyWiIgZmlsbD0iI0EyNTlGRiIvPgo8cGF0aCBkPSJNNS4wMTAwMSA1QzUuMDEwMDEgMy4wNjggNi41NzggMS41IDguNTA5OTggMS41SDEyLjAxVjguNUg4LjUwOTk4QzYuNTc4IDguNSA1LjAxMDAxIDYuOTMyIDUuMDEwMDEgNVoiIGZpbGw9IiNGMjRFMUUiLz4KPHBhdGggZD0iTTEyLjAxIDEuNUgxNS41MTAxQzE3LjQ0MjEgMS41IDE5LjAxMDEgMy4wNjggMTkuMDEwMSA1QzE5LjAxMDEgNi45MzIgMTcuNDQyMSA4LjUgMTUuNTEwMSA4LjVIMTIuMDFWMS41WiIgZmlsbD0iI0ZGNzI2MiIvPgo8cGF0aCBkPSJNMTkuMDEwMSAxMkMxOS4wMTAxIDEzLjkzMiAxNy40NDIxIDE1LjQ5OTkgMTUuNTEwMSAxNS40OTk5QzEzLjU3OCAxNS40OTk5IDEyLjAxIDEzLjkzMiAxMi4wMSAxMkMxMi4wMSAxMC4wNjggMTMuNTc4IDguNSAxNS41MTAxIDguNUMxNy40NDIxIDguNSAxOS4wMTAxIDEwLjA2OCAxOS4wMTAxIDEyWiIgZmlsbD0iIzFBQkNGRSIvPgo8L3N2Zz4K);
          }

          &[name^='Sketch'] {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuMDgxODEgMy42MjU2N0wxMiAzTDE3LjkxODIgMy42MjU2N0wyMi41IDkuNzc2MzVMMTIgMjIuMDAzNUwxLjUgOS43NzYzNUw2LjA4MTgxIDMuNjI1NjdaIiBmaWxsPSIjRkRCMzAwIi8+CjxwYXRoIGQ9Ik01Ljc1MzAyIDkuNzc2MzdMMTIgMjIuMDAzNUwxLjUgOS43NzYzN0g1Ljc1MzAyWiIgZmlsbD0iI0VBNkMwMCIvPgo8cGF0aCBkPSJNMTguMjQ3IDkuNzc2MzdMMTIgMjIuMDAzNUwyMi41IDkuNzc2MzdIMTguMjQ3WiIgZmlsbD0iI0VBNkMwMCIvPgo8cGF0aCBkPSJNNS43NTI5MyA5Ljc3NjM3SDE4LjI0NjlMMTEuOTk5OSAyMi4wMDM1TDUuNzUyOTMgOS43NzYzN1oiIGZpbGw9IiNGREFEMDAiLz4KPHBhdGggZD0iTTExLjk5OTkgM0w2LjA4MTcgMy42MjU2Nkw1Ljc1MjkzIDkuNzc2MzVMMTEuOTk5OSAzWiIgZmlsbD0iI0ZERDIzMSIvPgo8cGF0aCBkPSJNMTEuOTk5OCAzTDE3LjkxODEgMy42MjU2NkwxOC4yNDY4IDkuNzc2MzVMMTEuOTk5OCAzWiIgZmlsbD0iI0ZERDIzMSIvPgo8cGF0aCBkPSJNMjIuNSA5Ljc3NjNMMTcuOTE4MiAzLjYyNTYxTDE4LjI0NyA5Ljc3NjNIMjIuNVoiIGZpbGw9IiNGREFEMDAiLz4KPHBhdGggZD0iTTEuNSA5Ljc3NjNMNi4wODE4IDMuNjI1NjFMNS43NTMwMiA5Ljc3NjNIMS41WiIgZmlsbD0iI0ZEQUQwMCIvPgo8cGF0aCBkPSJNMTEuOTk5OSAzTDUuNzUyOTMgOS43NzYzNUgxOC4yNDY5TDExLjk5OTkgM1oiIGZpbGw9IiNGRUVFQjciLz4KPC9zdmc+Cg==);
          }

          &[name^='Axure'] {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOC43MjI1IDMuODQwMzJDMTguNTg2OCAzLjU1NDA4IDE4LjMwMDYgMy4zODI5MyAxNy45NTIzIDMuMzgyOTNIMTYuNjA2OEMxNi4yMTcyIDMuMzgyOTMgMTUuOTI1MSAzLjUzOTMzIDE1Ljc2ODcgMy44MjI2MUwxMy43NzM5IDYuNzM1MTFMMTUuNTIwOCA5LjEyMjM2TDE4LjU2OTEgNC43NDkxOEMxOC45MDU1IDQuMzQ3ODcgMTguNzg3NCAzLjk3OTAxIDE4LjcyMjUgMy44NDAzMloiIGZpbGw9IiM3NEJCMTEiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjIwODU1IDMuNzkzMUM3LjkwNDYxIDMuMzgyOTQgNy41MDAzNCAzLjM4MjkzIDcuMzY0NiAzLjM4MjkzSDYuMDQ4NTJDNS43MTIxMiAzLjM4MjkzIDUuNDM0NzQgMy41MzkzMyA1LjI5MDE1IDMuODA3ODZDNS4xNDI2IDQuMDg1MjQgNS4xNzIxMSA0LjQxNTc0IDUuMzc4NjcgNC43MjI2M0wxMC4yNTM1IDExLjQ4MDFMNC42NDY4NiAxOS4yOTk5QzQuNDUyMSAxOS41OTUgNC40MjI1OSAxOS45MTk2IDQuNTcwMTQgMjAuMTk2OUM0LjcxNDczIDIwLjQ2NTUgNC45OTIxMSAyMC42MjE5IDUuMzI4NTEgMjAuNjIxOUg2LjY3NDFDNy4wMTkzNSAyMC42MjE5IDcuMzIzMjkgMjAuNDQxOSA3LjQ3NjczIDIwLjE1ODZMMTMuNzUzMiAxMS41MTI2TDguMjA4NTUgMy43OTMxWiIgZmlsbD0iIzAwOUNEOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE5LjM5MjIgMTkuMzcwOEwxNS40Nzk0IDE0LjAwMzJMMTMuNzU5IDE2LjM3NTdMMTYuODUxNSAyMC41MDM5TDE2LjkzMTIgMjAuNTM5M0MxNy4wNTUxIDIwLjU5NTQgMTcuMTg3OSAyMC42MjQ5IDE3LjMyMDcgMjAuNjI0OUgxOC42MzY4QzE4Ljk1NTUgMjAuNjI0OSAxOS4yMjQgMjAuNDgzMyAxOS4zNzc1IDIwLjIzODNDMTkuNTM2OCAxOS45ODQ2IDE5LjUzOTggMTkuNjY4OCAxOS4zOTIyIDE5LjM3MDhaIiBmaWxsPSIjRUIyMDg0Ii8+Cjwvc3ZnPgo=);
          }

          &[name^='AdobeXD'] {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjc2MTUgNS45MDg1Mkw5LjA1ODY2IDEyLjE3NDlMMTMuMDA4NCAxOC44MjFDMTMuMDMzIDE4Ljg3MTcgMTMuMDQ1NCAxOC45MjIzIDEzLjAzMyAxOC45NzI5QzEzLjAyMDcgMTkuMDIzNiAxMi45NzEzIDE4Ljk4NTYgMTIuODk3MyAxOC45OTgzSDEwLjA3MDhDOS44NzMyOCAxOC45OTgzIDkuNzM3NTEgMTguOTg1NiA5LjY1MTExIDE4Ljg1OUM5LjM5MTkxIDE4LjMyNzMgOS4xMjAzNyAxNy44MDgzIDguODYxMTcgMTcuMjc2NkM4LjYwMTk3IDE2Ljc1NzYgOC4zMTgwOSAxNi4yMjU5IDguMDIxODYgMTUuNjgxNUM3LjcyNTYzIDE1LjEzNzIgNy40Mjk0IDE0LjU5MjggNy4xMzMxNyAxNC4wMzU4SDcuMTA4NDlDNi44NDkyOSAxNC41ODAyIDYuNTY1NCAxNS4xMjQ1IDYuMjgxNTIgMTUuNjY4OUM1Ljk5NzYzIDE2LjIxMzIgNS43MTM3NSAxNi43NTc2IDUuNDQyMjEgMTcuMjg5MkM1LjE1ODMyIDE3LjgyMDkgNC44NzQ0NCAxOC4zNjUzIDQuNTkwNTUgMTguODg0M0M0LjU0MTE4IDE5LjAxMDkgNC40NDI0NCAxOS4wMjM2IDQuMzA2NjcgMTkuMDIzNkgxLjU5MTI0QzEuNTQxODcgMTkuMDIzNiAxLjUwNDg0IDE5LjA0ODkgMS41MDQ4NCAxOC45ODU2QzEuNDkyNSAxOC45MzUgMS41MDQ4NCAxOC44ODQzIDEuNTI5NTMgMTguODQ2M0w1LjM2ODE1IDEyLjM5MDFMMS42MjgyNyA1Ljg5NTg2QzEuNTkxMjQgNS44NDUyMiAxLjU3ODkgNS43OTQ1OCAxLjYwMzU4IDUuNzY5MjdDMS42MjgyNyA1LjczMTI5IDEuNjc3NjQgNS43MTg2MyAxLjcyNzAxIDUuNzE4NjNINC41Mjg4NEM0LjU5MDU1IDUuNzE4NjMgNC42NTIyNiA1LjczMTI5IDQuNzAxNjQgNS43NDM5NUM0Ljc1MTAxIDUuNzY5MjcgNC43ODgwNCA1LjgwNzI0IDQuODI1MDYgNS44NTc4OEM1LjA1OTU4IDYuNDAyMjMgNS4zMzExMiA2Ljk0NjU4IDUuNjE1MDEgNy40OTA5M0M1LjkxMTIzIDguMDM1MjggNi4xOTUxMiA4LjU2Njk3IDYuNTAzNjkgOS4wOTg2N0M2Ljc5OTkyIDkuNjMwMzYgNy4wNzE0NiAxMC4xNjIgNy4zMzA2NiAxMC43MDY0SDcuMzU1MzRDNy42MTQ1NCAxMC4xNDk0IDcuODg2MDkgOS42MDUwNCA4LjE1NzYzIDkuMDczMzVDOC40MjkxNyA4LjU0MTY2IDguNzEzMDYgOC4wMDk5NiA4Ljk5Njk0IDcuNDc4MjdDOS4yODA4MyA2Ljk0NjU4IDkuNTUyMzcgNi40MDIyMyA5LjgyMzkxIDUuODgzMkM5LjgzNjI1IDUuODMyNTYgOS44NjA5NCA1Ljc4MTkyIDkuODk3OTcgNS43NTY2MUM5Ljk0NzM0IDUuNzMxMjkgOS45OTY3MSA1LjcxODYzIDEwLjA1ODQgNS43MzEyOUgxMi42NjI4QzEyLjcyNDUgNS43MTg2MyAxMi43ODYyIDUuNzU2NjEgMTIuNzk4NSA1LjgxOTlDMTIuODEwOSA1LjgzMjU2IDEyLjc4NjIgNS44ODMyIDEyLjc2MTUgNS45MDg1MloiIGZpbGw9IiNGRjYxRjYiLz4KPHBhdGggZD0iTTE4LjQ2MzkgMTkuMjY0MkMxNy41NTA1IDE5LjI3NjggMTYuNjM3MSAxOS4wODY5IDE1LjgxMDIgMTguNjk0NUMxNS4wMzI2IDE4LjMyNzQgMTQuMzkwOCAxNy43MTk3IDEzLjk0NjQgMTYuOTcyOEMxMy40ODk3IDE2LjIwMDYgMTMuMjY3NiAxNS4yMzg1IDEzLjI2NzYgMTQuMDg2NUMxMy4yNTUyIDEzLjE0OTcgMTMuNDg5NyAxMi4yMjU2IDEzLjk0NjQgMTEuNDE1NEMxNC40MTU0IDEwLjU5MjUgMTUuMDk0MyA5LjkwODkyIDE1LjkwODkgOS40NTMxOEMxNi43NzI5IDguOTU5NDcgMTcuODA5NyA4LjcxODk0IDE5LjAzMTcgOC43MTg5NEMxOS4wOTM0IDguNzE4OTQgMTkuMTc5OCA4LjcxODk0IDE5LjI5MDkgOC43MzE2QzE5LjQwMTkgOC43NDQyNiAxOS41MjU0IDguNzQ0MjYgMTkuNjczNSA4Ljc1NjkyVjQuNzU2NThDMTkuNjczNSA0LjY2Nzk2IDE5LjcxMDUgNC42MTczMiAxOS43OTY5IDQuNjE3MzJIMjIuMzAyNUMyMi4zNjQyIDQuNjA0NjYgMjIuNDEzNiA0LjY1NTMgMjIuNDI1OSA0LjcwNTk0QzIyLjQyNTkgNC43MTg2IDIyLjQyNTkgNC43MzEyNiAyMi40MjU5IDQuNzMxMjZWMTYuNzgyOUMyMi40MjU5IDE3LjAxMDggMjIuNDM4MyAxNy4yNjQgMjIuNDUwNiAxNy41NDI1QzIyLjQ3NTMgMTcuODA4MyAyMi40ODc2IDE4LjA2MTUgMjIuNSAxOC4yNzY3QzIyLjUgMTguMzY1MyAyMi40NjMgMTguNDQxMyAyMi4zNzY2IDE4LjQ3OTNDMjEuNzM0NyAxOC43NTc4IDIxLjA1NTkgMTguOTYwMyAyMC4zNjQ3IDE5LjA4NjlDMTkuNzM1MiAxOS4yMDA5IDE5LjEwNTcgMTkuMjY0MiAxOC40NjM5IDE5LjI2NDJaTTE5LjY3MzUgMTYuNzMyM1YxMS4xNjIyQzE5LjU2MjQgMTEuMTM2OSAxOS40NTEzIDExLjExMTYgMTkuMzQwMiAxMS4wOTg5QzE5LjIwNDUgMTEuMDg2MiAxOS4wNjg3IDExLjA3MzYgMTguOTMyOSAxMS4wNzM2QzE4LjQ1MTUgMTEuMDczNiAxNy45NzAyIDExLjE3NDggMTcuNTM4MiAxMS40MDI3QzE3LjExODUgMTEuNjE3OSAxNi43NjA2IDExLjkzNDQgMTYuNDg5IDEyLjMzOTVDMTYuMjE3NSAxMi43NDQ2IDE2LjA4MTcgMTMuMjg5IDE2LjA4MTcgMTMuOTQ3MkMxNi4wNjk0IDE0LjM5MDMgMTYuMTQzNCAxNC44MzM0IDE2LjI5MTUgMTUuMjUxMUMxNi40MTUgMTUuNTkyOSAxNi42MDAxIDE1Ljg5NjggMTYuODQ3IDE2LjE1QzE3LjA4MTUgMTYuMzc3OCAxNy4zNjU0IDE2LjU1NTEgMTcuNjg2MyAxNi42NTYzQzE4LjAxOTUgMTYuNzcwMyAxOC4zNjUxIDE2LjgyMDkgMTguNzEwNyAxNi44MjA5QzE4Ljg5NTkgMTYuODIwOSAxOS4wNjg3IDE2LjgwODIgMTkuMjI5MSAxNi43OTU2QzE5LjM4OTYgMTYuODA4MiAxOS41MjU0IDE2Ljc4MjkgMTkuNjczNSAxNi43MzIzWiIgZmlsbD0iI0ZGNjFGNiIvPgo8L3N2Zz4K);
          }

          &[name^='TDesign'] {
            background-image: url(data:image/png;base64,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);
          }
        }
      }
    }

    &::before {
      content: '';
      position: absolute;
      left: -32px;
      top: 12px;
      width: 8px;
      height: 8px;
      border: 2px solid var(--brand-main);
      background: var(--bg-color-docpage);
      outline: 10px solid var(--bg-color-docpage);
      box-sizing: border-box;
      border-radius: 50%;
      z-index: 20;
    }

    &:last-of-type {
      &::after {
        content: '';
        position: absolute;
        top: 30px;
        left: -32px;
        z-index: 10;
        width: 8px;
        height: 100%;
        background: var(--bg-color-docpage);
      }
    }
  }
}
</style>
