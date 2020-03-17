<template>
  <div class="ebook-reader">
      <!-- {{$route.params.fileName}} -->
      <!-- <div class="ebook-reader-mask"></div> -->
      <div class="read-wrapper">
          <div id="read"></div>
      </div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme, getLocation } from '../../utils/localStorage'
import Epub from 'epubjs'
global.ePub = Epub
export default {
    mixins: [ebookMixin],
    methods: {
        prevPage () {
            if (this.rendition) {
                this.rendition.prev().then(() => {
                    this.refreshLocation()
                })
                this.hideTitleAndMenu()
            }
        },
        nextPage () {
            if (this.rendition) {
                this.rendition.next().then(() => {
                    this.refreshLocation()
                })
                this.hideTitleAndMenu()
            }
        },
        toggleTitleAndMenu () {
            if (this.menuVisible) {
                this.setSettingVisible(-1)
                this.setFontFamilyVisible(false)
            }
//          this.$store.dispatch('setMenuVisible', !this.menuVisible)
            this.setMenuVisible(!this.menuVisible)
        },
        initTheme () {
            let defaultTheme = getTheme(this.fileName)
            if (!defaultTheme) {
                defaultTheme = this.themeList[0].name
                saveTheme(this.fileName, defaultTheme)
            }
            this.setDefaultTheme(defaultTheme)
            this.themeList.forEach(theme => {
                this.rendition.themes.register(theme.name, theme.style)
            })
            this.rendition.themes.select(defaultTheme)
        },
        initFontSize () {
            const fontSize = getFontSize(this.fileName)
            if (!fontSize) {
                saveFontSize(this.fileName, this.defaultFontSize)
            } else {
                this.rendition.themes.fontSize(fontSize)
                this.setDefaultFontSize(fontSize)
            }
        },
        initFontFamily () {
           const font = getFontFamily(this.fileName)
            if (!font) {
                saveFontFamily(this.fileName, this.defaultFontFamily)
            } else {
                this.rendition.themes.font(font)
                this.setDefaultFontFamily(font)
            }
        },
        initRendition () {
            this.rendition = this.book.renderTo('read', {
                width: innerWidth,
                height: innerHeight,
                method: 'default'
            })
            const location = getLocation(this.fileName)
//          自动判断location是否存在
            this.display(location, () => {
                this.initTheme()
                this.initFontSize()
                this.initFontFamily()
                this.initGlobalStyle()
            })
//          在电子书渲染，资源加载完毕后调用
//          console.log(process.env)
            this.rendition.hooks.content.register(contents => {
               Promise.all([
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
               ]).then(() => {})
            })
        },
        initGesture () {
            this.rendition.on('touchstart', event => {
                this.touchStartX = event.changedTouches[0].clientX
                this.touchStartTime = event.timeStamp
            })
//              offsetX X轴偏移量 和 time消耗的时间
            this.rendition.on('touchend', event => {
                const offsetX = event.changedTouches[0].clientX - this.touchStartX
                const time = event.timeStamp - this.touchStartTime
                if (time < 500 && offsetX > 40) {
                    this.prevPage()
                } else if (time < 500 && offsetX < -40) {
                    this.nextPage()
                } else {
                    this.toggleTitleAndMenu()
                }
//               禁用事件默认方法调用和传播
                event.preventDefault()
                event.stopPropagation()
            })
        },
        initEpub () {
            const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            this.initRendition()
            this.initGesture()
            this.book.ready.then(() => {
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
            }).then(locations => {
                this.setBookAvailable(true)
                this.refreshLocation()
            })
        }
    },
    mounted () {
//      this.$store.dispatch('setFileName', this.$route.params.fileName).then(() => {
        this.setFileName(this.$route.params.fileName).then(() => {
            this.initEpub()
        })
    }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';

.ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
