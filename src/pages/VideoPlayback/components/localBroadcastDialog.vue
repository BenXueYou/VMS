<template>
  <el-dialog :visible.sync="dialogVisible"
             class="dialogCenter"
             title="本地播放"
             width="900px"
             :close-on-click-modal="false"
             @close="close"
             :append-to-body="true">
    <div class="body">
      <div class="videoWrap">
        <div class="videoProgressWrap">
          <el-slider v-model="progress"
                     type="number"
                     class='center'>
          </el-slider>
        </div>
      </div>
      <div class="control">
        <div class="head">
          <ul>
            <li>
              <img :src="icons.play"
                   alt="">
            </li>
            <li>
              <img :src="icons.stop"
                   alt="">
            </li>
            <li>
              <img :src="icons.zhen"
                   alt="">
            </li>
            <div class="splitline">

            </div>
            <li>
              <img :src="icons.forward"
                   alt="">
            </li>
            <li style="width:80px;">
              <el-input class='speed'
                        v-model='speed'></el-input>
            </li>
            <li>
              <img :src="icons.backward"
                   alt="">
            </li>
          </ul>
          <ul>
            <li style="width:20px;">
              <img :src="icons.voice2"
                   alt="">
            </li>
            <li style="width:80px;">
              <el-slider v-model="voice"
                         type="number"
                         class='center'>
              </el-slider>
            </li>
            <li style='width:120px;'>
              <div class='center'
                   style='cursor:pointer;width:120px;'><img :src="icons.save"
                     alt="">
                打开本地文件夹</div>
            </li>
            <li>
              <img :src="icons.fullScreen"
                   alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/icon.js";
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      dialogVisible: false,
      icons,
      speed: 30,
      voice: 30,
      progress: 30
    };
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  .videoWrap {
    height: 500px;
    position: relative;
    overflow: hidden;
    .videoProgressWrap {
      position: absolute;
      left: 0px;
      width: 100%;
      height: 30px;
      background-color: rgba(0, 0, 0, 0.5);
      box-sizing: border-box;
      padding: 0px 30px;
      bottom: -30px;
      // display: none;
      transition: bottom 0.5s;
    }
    &:hover .videoProgressWrap {
      bottom: 0px;
    }
  }
  .head {
    display: flex;
    justify-content: space-between;
    height: 40px;
    background-color: #242527;
    ul {
      list-style: none;
      display: flex;
      justify-content: flex-start;
      li {
        position: relative;
        min-width: 30px;
        padding: 0px 10px;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #26d39d;
        .speed {
          width: 60px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .center {
          width: 80px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        div {
          img {
            display: inline-block;
            vertical-align: middle;
          }
        }
        & > img {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
      }
      .splitline {
        width: 1px;
      }
    }
  }
}
</style>
