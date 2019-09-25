<template>
  <div class='displayWrap'
       @contextmenu="contextmenu"
       @click="ClickViDeoA"
       @dragstart="dragstart"
       @drop="drop"
       @dragover="dragover"
       draggable="true"
       :class="{'VideoActive':isActive}"
       :style="{height:height+'px',width:width+'px'}">
    <!-- 视频信息展示菜单 -->
    <div class="header"
         v-if='IsShowMenu'>
      <div class="videoinfo">
        码流类型、码率、大小
      </div>
      <div class="menu"
           v-if="width>500">
        <ul>
          <li v-for="(item,index) in menuData"
              @click='clickMenu(index)'
              :key='index'>
            <img :src="icons[item.icon]"
                 alt="">
            {{item.name}}</li>
        </ul>
      </div>
      <div class="menu"
           v-else>
        <el-dropdown style='margin:13px 30px 0px 0px;'
                     trigger="click">
          <span class="el-dropdown-link">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAGxJREFUGBmlj7EJgEAQBPf8F+ENTBQMbEBsytRm7EQwF0sxMREzG/hbv4SD33h2YGTksRMywLACvDxQLSViY+ChwGfh8hhJDWtS9DaN3L6A24jYWg6Eey1cHiMTz1khnUUj0McrGAitLYfUEH75HhuBIHOOjAAAAABJRU5ErkJggg=="
                 alt="">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in menuData"
                              :key='index'
                              @click='clickMenu(index)'>{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 默认摄像头图片 -->
    <img class='camera'
         :src="icons.defaultIcon"
         alt="">

  </div>
</template>

<script>
import icons from "@/common/icon.js";
export default {
  name: "VideoWrap",
  props: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    index: {
      type: Number
    },
    isActive: {
      type: Boolean
    },
    IsShowMenu: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      icons,
      menuData: [
        {
          icon: "voice",
          name: "声音"
        },
        {
          icon: "video",
          name: "录像"
        },
        {
          icon: "screenshot",
          name: "抓图"
        },
        {
          icon: "close",
          name: "关闭"
        }
      ]
    };
  },
  methods: {
    dragstart(e) {
      this.$emit("dragstart", this.index);
    },
    drop(e) {
      this.$emit("drop", this.index);
      e.preventDefault();
    },
    dragover(e) {
      e.preventDefault();
    },
    clickMenu(index) {
      console.log(index);
      console.log(this.menuData[index].name);
    },
    contextmenu(e) {
      this.$emit("contextmenu", e, this.index);
    },
    ClickViDeoA(e) {
      this.$emit("click", this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.displayWrap {
  background: #242527;
  border: 2px solid #1b1b1b;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .header {
    position: absolute;
    top: -46px;
    left: 0px;
    width: 100%;
    height: 46px;
    background-color: rgba(0, 0, 0, 0.66);
    display: flex;
    justify-content: space-between;
    transition: top ease-out 0.3s;
    .menu {
      ul {
        list-style: none;
        display: flex;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #26d39d;
        li {
          vertical-align: middle;
          cursor: pointer;
          img {
            vertical-align: middle;
            display: inline-block;
            padding: 0px 5px;
          }
          padding-right: 15px;
        }
      }
    }
    .videoinfo {
      @include font-s;
      line-height: 46px;
      color: #fff;
      padding-left: 35px;
      &:after {
        content: "";
        width: 4px;
        height: 14px;
        background: #26d39d;
        border-radius: 1px;
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  &:hover .header {
    top: 0px;
  }
  .camera {
    position: absolute;
    top: calc(50% + 0px);
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 20%;
  }
}
.VideoActive {
  border: 2px solid rgba(38, 211, 157, 0.5);
}
</style>
