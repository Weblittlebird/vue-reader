<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'

export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  },
  methods: {
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  name: 'ebook',
  mounted () {
    this.startLoopReadTime()
//  this.$store.dispatch('setTest', 9).then(() => {
//   console.log(this.test)
//  })
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';

</style>
