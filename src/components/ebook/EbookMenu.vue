<template>
 <div>
  <transition name="slide-up">
     <div class="menu-wrapper" 
     :class="{'hide-box-shadow': settingVisible >= 0 || !menuVisible }"
     v-show="menuVisible">
       <div class="icon-wrapper">
         <span class="icon-menu" @click="showSetting(3)"></span>
       </div>
       <div class="icon-wrapper">
         <span class="icon-progress" @click="showSetting(2)"></span>
       </div>
       <div class="icon-wrapper">
         <span class="icon-bright" @click="showSetting(1)"></span>
       </div>
       <div class="icon-wrapper">
         <span class="icon-A" @click="showSetting(0)"></span>
       </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
 </div>
</template>

<script>
import EbookSettingFontPopup from './EbookSettingFontPopup'
import EbookSettingFont from './EbookSettingFont'
import EbookSettingTheme from './EbookSettingTheme'
import EbookSettingProgress from './EbookSettingProgress'
import EbookSlide from './EbookSlide'
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  methods: {
    showSetting (key) {
      this.setSettingVisible(key)
//      console.log(this.menuVisible, this.settingVisible)
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles/global';
.menu-wrapper {
    position: absolute;
      bottom: 0;
      left: 0;
      z-index: 101;
      display: flex;
      width: 100%;
      height: px2rem(48);
      background: white;
      font-size: px2rem(24);
      box-shadow: 0 px2rem(-8) px2rem(8) rgba(0,0,0, .15);
      &.hide-box-shadow {
          box-shadow: none;
      }
      .icon-wrapper {
          flex: 1;
          @include center;
          .icon-progress {
              font-size: px2rem(28);
          }
          .icon-menu {
            font-size: px2rem(26);
          }
      }
}
</style>
