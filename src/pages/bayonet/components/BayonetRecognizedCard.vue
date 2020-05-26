<template>
  <el-card class="BRBoxCard">
    <el-row class="asidListRowHeader"
            style="position:relative;">
      <div class="rowHeaderBox"
           :style="`background-color:${recoginizeItem.taskColour?recoginizeItem.taskColour:'rgba(38,211,157,0.1)'};`">
        <el-col :span="18"
                class="asidListRowFooter textclipsClass">
          <div class="header-line"></div>
          <span class="textclipsClass"
                style="font-size:14px;opacity:1;padding-left:8px;color: #26D39D;"
                @mouseover="mymouseover"
                @mouseout="mymouseout"
                @mousemove="mymousemove">
            {{(recoginizeItem)&&
						(recoginizeItem.channelName)?recoginizeItem.channelName:'车辆抓拍通道名称'}}
          </span>
        </el-col>
        <el-col :span="6"
                class="asidListRowFooter imgTxtClass">
          <div class="cursorClass"
               @click="clickDetailAct">
            <span>详情</span>
            <img src="@/assets/images/faceModule/detail_btn_icon.png" />
          </div>
        </el-col>
      </div>
    </el-row>
    <el-row class="bodyClass">
      <el-row class="bodyItemClass">
        <el-col :span="10">
          <el-image style="width: 100%; height: calc(64% - 8px);margin-bottom:8px"
                    :src="$common.setPictureShow(recoginizeItem.vehiclePic,PicSourceType)">
            <div slot="error"
                 class="image-slot">
              <img :src="$common.setPictureShow()"
                   alt="">
            </div>
          </el-image>
          <el-image style="width: 100%; height: 36%"
                    :src="$common.setPictureShow(recoginizeItem.vehicleNoPic,PicSourceType)">
            <div slot="error"
                 class="image-slot">
              <img :src="$common.setPictureShow()"
                   alt="">
            </div>
          </el-image>
        </el-col>
        <el-col :span="7">
          <el-image style="width: 100%; height: calc(100% - 30px)"
                    :src="$common.setPictureShow(recoginizeItem.masterDriverPic,PicSourceType)">
            <div slot="error"
                 class="image-slot">
              <img :src="$common.setPictureShow()"
                   alt="">
            </div>
          </el-image>
          <span style="line-height:30px">主驾抓拍</span>
        </el-col>
        <el-col :span="7">
          <el-image style="width: 100%; height: calc(100% - 30px)"
                    :src="$common.setPictureShow(recoginizeItem.secondDriverPic,PicSourceType)">
            <div slot="error"
                 class="image-slot">
              <img :src="$common.setPictureShow()"
                   alt="">
            </div>
          </el-image>
          <span style="line-height:30px">副驾抓拍</span>
        </el-col>
      </el-row>
      <el-row class="bodyFooterClass">
        <el-col :span="7">
          <img :src="icons.bayonetCarplate"
               alt />
          <span class="textclipsClass"
                @mouseover="mymouseover"
                @mouseout="mymouseout"
                @mousemove="mymousemove">{{recoginizeItem.vehicleNo||'车牌号'}}</span>
        </el-col>
        <el-col :span="5">
          <img :src="icons.bayonetRoadway"
               alt />
          <span class="textclipsClass"
                @mouseover="mymouseover"
                @mouseout="mymouseout"
                @mousemove="mymousemove">{{recoginizeItem.laneInfo||'抓拍'}}车道</span>
        </el-col>
        <el-col :span="12">
          <img :src="icons.bayonetDatetime"
               alt />
          <span class="textclipsClass"
                @mouseover="mymouseover"
                @mouseout="mymouseout"
                @mousemove="mymousemove">{{recoginizeItem.createTime||'抓拍时间'}}</span>
        </el-col>
      </el-row>
    </el-row>
  </el-card>
</template>

<script>
import icons from "@/common/js/icon.js";
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    recoginizeItem: {
      type: Object,
      default() {
        return {};
      }
    },
    imgWidth: {
      type: String,
      default: "95"
    },
    alarmState: {
      type: undefined,
      default: false
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
    },
    selectAuthUuid: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      icons,
      imageHeader: RestApi.api.imageUrl,
      PicSourceType: window.config.PicSourceType
    };
  },
  mounted() {},
  methods: {
    // 查看详情
    clickDetailAct() {
      console.log("------");
      this.$emit("clickDetailAct");
    },
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
<style lang="scss">
.BRBoxCard .el-card__body {
  padding: 0;
  height: 100%;
}
</style>
<style lang="scss" scoped>
.BRBoxCard {
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 2px;
  .asidListRowHeader {
    height: 35px;
    box-sizing: border-box;
    padding: 1.5% 5% 1%;
    box-sizing: border-box;
    // pointer-events: none;
    .rowHeaderBox {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 34px;
      padding: 0px 20px;
      box-sizing: border-box;
      // pointer-events: none;
    }
  }
  .asidListRowFooter {
    line-height: 35px;
    font-size: 14px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    opacity: 1;
    // pointer-events: none;
  }
  .textclipsClass {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .header-line {
    border-left: 2px solid #ffffff;
    height: 10px;
    display: inline-block;
    margin-bottom: 12px;
  }
  .imgTxtClass {
    display: flex;
    justify-content: flex-end;
    .cursorClass {
      cursor: pointer;
      span {
        font-size: 12px;
        font-family: "PingFangSC-Regular";
        color: #dddddd;
        letter-spacing: 0;
      }
      img {
        vertical-align: middle;
        margin: 2px 0 0 5px;
      }
    }
  }
  .bodyClass {
    width: 100%;
    height: calc(100% - 40px);
    .bodyItemClass {
      height: calc(100% - 45px);
      padding: 14px 18px 0;
      .el-col {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        text-align: center;
        color: #dddddd;
        .el-image {
          overflow: inherit;
        }
      }
      .el-col:nth-child(1) {
        padding-right: 5px;
      }
      .el-col:nth-child(2) {
        padding-left: 10px;
      }
      .el-col:nth-child(3) {
        padding-left: 10px;
      }
    }
    .bodyFooterClass {
      color: #dddddd;
      height: 45px;
      padding: 0 18px;
      .el-col {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        img {
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
