<template>
  <div class="BayonetSnapCard">
    <el-image :src="$common.setPictureShow(photoItem.vehiclePic,PicSourceType)">
      <div slot="error"
           class="image-slot">
        <img :src="$common.setPictureShow()"
             alt="">
      </div>
    </el-image>
    <div class="footerClass">
      <div>
        <img :src="icons.bayonetSnapAddress"
             alt />
        <span class="tipsTxt textClips"
              @mouseover="mymouseover"
              @mouseout="mymouseout"
              @mousemove="mymousemove">{{photoItem.channelName||'抓拍通道'}}</span>
      </div>
      <div>
        <img :src="icons.bayonetSnapTime"
             alt />
        <span class="tipsTxt textClips"
              style="width:50px"
              @mouseover="mymouseover"
              @mouseout="mymouseout"
              @mousemove="mymousemove">{{photoItem.createTime?photoItem.createTime.split(' ')[1]:photoItem.captureDatetime||'抓拍时间'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import icons from "@/common/js/icon.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "900px";
      }
    },
    title: {
      type: String,
      default() {
        return "功能模块权限";
      }
    },
    photoItem: {
      type: Object,
      default() {
        return {};
      }
    },
    roleUuid: {
      type: String,
      default() {
        return "0c691cd5845b4b4a918cc710e10985ea";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      PicSourceType: window.config.PicSourceType,
      TreechangeNameDialogVisible: false,
      data: [],
      props: {
        label: "nodeName",
        children: "childNodes"
      },
      allData: ["新建", "修改", "删除", "查看", "导入", "导出"],
      checkedNum: [],
      icons
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    this.name = this.value;
  },
  methods: {
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    }
  },
  watch: {
    visible(val) {}
  }
};
</script>
<style lang="scss" scoped>
.BayonetSnapCard {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .el-image {
    width: 100%;
    height: calc(100% - 38px);
    margin-bottom: 8px;
    background-color: #212325;
  }
  .footerClass {
    display: flex;
    justify-content: space-between;
    padding: 0 3px;
    margin-top: 5px;
    img {
      width: 10.5px;
      height: 10.5px;
      vertical-align: middle;
      margin-top: -5px;
    }
    div {
      font-family: "PingFangSC-Regular";
      font-size: 12px !important;
      color: #cccccc;
      letter-spacing: 0;
      .tipsTxt {
        width: 90px;
        display: inline-block;
        font-size: 12px !important;
      }
    }
  }
}
</style>
